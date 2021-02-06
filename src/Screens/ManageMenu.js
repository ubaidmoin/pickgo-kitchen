import React, {useEffect, useState} from 'react';
import {Text, FlatList, ScrollView, RefreshControl, View} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getMenu} from '../Services/API/APIManager';
import Dropdown from '../Components/Dropdown';
import {formatCurrency} from '../Services/Common';

import {getNotificationCount} from '../Services/DataManager';

const ManageMenu = ({navigation}) => {
  useEffect(() => {
    refreshScreen();
    return navigation.addListener('focus', () => {
      refreshScreen();
    });
  }, []);

  const refreshScreen = () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    fetchMenu();
  };

  const fetchMenu = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getMenu();
      if (result.data) {
        const {company = {}, companyHoursToday = []} = result.data || {};
        if (
          company &&
          company.id &&
          companyHoursToday &&
          companyHoursToday.length > 0
        ) {
          setMenu(result.data);
          if (
            companyHoursToday &&
            companyHoursToday.length > 0 &&
            companyHoursToday[0]
          ) {
            const companyHours = companyHoursToday[0];
            setSelectedCompanyHours({
              label: `${companyHours.name} (from ${companyHours.time_from} to ${companyHours.time_to})`,
            });
            const {menuCourses = []} = companyHours || {};
            if (menuCourses && menuCourses.length > 0 && menuCourses[0]) {
              setMenuCourses(menuCourses);
              setSelectedMenuCourse(menuCourses[0]);
            }
          }
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
            },
          });
        }
      } else {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'error',
            title: 'An Error Occured',
            message: 'Please try again later.',
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
        },
      });
    } finally {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
      setLoading(false);
    }
  };

  const [menu, setMenu] = useState('');
  const [selectedCompanyHours, setSelectedCompanyHours] = useState('');
  const [menuCourses, setMenuCourses] = useState([]);
  const [selectedMenuCourse, setSelectedMenuCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [{isWideScreen}, dispatch] = useStateValue();
  const {companyHoursToday = []} = menu || {};

  const getCompanyHours = () => {
    if (companyHoursToday && companyHoursToday.length > 0) {
      return companyHoursToday.map((item) => ({
        label: `${item.name} (from ${item.time_from} to ${item.time_to})`,
      }));
    } else {
      return [];
    }
  };

  const onSelectCompanyHours = (val, index) => {
    setSelectedMenuCourse('');
    setSelectedCompanyHours(val);
    if (
      companyHoursToday &&
      companyHoursToday.length > 0 &&
      companyHoursToday[index] &&
      companyHoursToday[index].menuCourses &&
      companyHoursToday[index].menuCourses.length > 0
    ) {
      setMenuCourses(companyHoursToday[index].menuCourses);
    } else {
      setMenuCourses([]);
    }
  };

  return (
    <View style={{flex: 1, paddingTop: '2%', marginHorizontal: '5%'}}>
      <Dropdown
        label="Select One"
        options={getCompanyHours()}
        selected={selectedCompanyHours}
        onSelect={onSelectCompanyHours}
      />
      {isWideScreen ? (
        <View
          style={{
            flexDirection: 'row',
            marginTop: '2%',
            marginBottom: '10%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '30%'}}>
            <FlatList
              data={menuCourses}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <Ripple
                  onPress={() => setSelectedMenuCourse(item)}
                  key={item.id}
                  style={{
                    shadowColor: '#cc0001',
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    shadowOffset: {
                      height: 5,
                      width: 2,
                    },
                    elevation: 5,
                    padding: 15,
                    marginHorizontal: 5,
                    marginVertical: 10,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      selectedMenuCourse.id === item.id ? '#27ae61' : '#fff',
                  }}>
                  <Text
                    style={{
                      color:
                        selectedMenuCourse.id === item.id ? '#fff' : '#000',
                      fontSize: 18,
                    }}>
                    {item.name}
                  </Text>
                </Ripple>
              )}
            />
          </View>
          <View style={{width: '65%', marginTop: '0.5%'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={
                  selectedMenuCourse &&
                  selectedMenuCourse.menu &&
                  selectedMenuCourse.menu.length > 0
                    ? selectedMenuCourse.menu
                    : []
                }
                renderItem={({item, index}) => (
                  <Ripple
                    onPress={() =>
                      navigation.navigate('EditMenu', {
                        menuItem: item,
                      })
                    }
                    key={item.id}
                    style={{
                      shadowColor: '#cc0001',
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      shadowOffset: {
                        height: 5,
                        width: 2,
                      },
                      elevation: 5,
                      padding: 10,
                      marginHorizontal: '1%',
                      marginVertical: '1.5%',
                      borderRadius: 5,
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom:
                        index === selectedMenuCourse.menu.length - 1
                          ? '12%'
                          : '1.5%',
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontSize: 18,
                        width: '70%',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        alignSelf: 'center',
                        textAlign: 'right',
                        fontSize: 18,
                        width: '30%',
                      }}>
                      {formatCurrency(item.price)}
                    </Text>
                  </Ripple>
                )}
              />
            </ScrollView>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshScreen} />
          }>
          <FlatList
            horizontal={true}
            data={menuCourses}
            renderItem={({item}) => (
              <Ripple
                onPress={() => setSelectedMenuCourse(item)}
                key={item.id}
                style={{
                  shadowColor: '#cc0001',
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                    width: 2,
                  },
                  elevation: 5,
                  padding: 15,
                  marginHorizontal: 5,
                  marginVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    selectedMenuCourse.id === item.id ? '#27ae61' : '#fff',
                }}>
                <Text
                  style={{
                    color: selectedMenuCourse.id === item.id ? '#fff' : '#000',
                    fontSize: 18,
                  }}>
                  {item.name}
                </Text>
              </Ripple>
            )}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              selectedMenuCourse &&
              selectedMenuCourse.menu &&
              selectedMenuCourse.menu.length > 0
                ? selectedMenuCourse.menu
                : []
            }
            renderItem={({item, index}) => (
              <Ripple
                onPress={() =>
                  navigation.navigate('EditMenu', {menuItem: item})
                }
                key={item.id}
                style={{
                  shadowColor: '#cc0001',
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                    width: 2,
                  },
                  elevation: 5,
                  padding: 10,
                  marginHorizontal: '1%',
                  marginVertical: '1.5%',
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom:
                    index === selectedMenuCourse.menu.length - 1
                      ? '12%'
                      : '1.5%',
                }}>
                <Text
                  style={{
                    color: '#000',
                    textAlign: 'left',
                    fontSize: 18,
                    width: '70%',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    alignSelf: 'center',
                    textAlign: 'right',
                    fontSize: 18,
                    width: '30%',
                  }}>
                  {formatCurrency(item.price)}
                </Text>
              </Ripple>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default ManageMenu;
