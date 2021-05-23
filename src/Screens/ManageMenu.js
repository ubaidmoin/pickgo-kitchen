import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  View,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getMenu} from '../Services/API/APIManager';
import Dropdown from '../Components/Dropdown';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const ManageMenu = ({navigation}) => {
  useEffect(() => {
    refreshScreen();
    return navigation.addListener('focus', () => {
      refreshScreen();
    });
  }, []);

  const [menu, setMenu] = useState('');
  const [selectedCompanyHours, setSelectedCompanyHours] = useState('');
  const [menuCourses, setMenuCourses] = useState([]);
  const [selectedMenuCourse, setSelectedMenuCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [{isWideScreen, selectedLanguage}, dispatch] = useStateValue();

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
              label: `${companyHours.name} (${Languages[selectedLanguage].manageMenu.from} ${companyHours.time_from} ${Languages[selectedLanguage].manageMenu.to} ${companyHours.time_to})`,
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
              title: Languages[selectedLanguage].messages.errorOccured,
              message: Languages[selectedLanguage].messages.tryAgainLater,
              showConfirmButton: true,
              confirmText: Languages[selectedLanguage].messages.ok,
            },
          });
        }
      } else {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'error',
            title: Languages[selectedLanguage].messages.errorOccured,
            message: Languages[selectedLanguage].messages.tryAgainLater,
            showConfirmButton: true,
            confirmText: Languages[selectedLanguage].messages.ok,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: Languages[selectedLanguage].messages.errorOccured,
          message: Languages[selectedLanguage].messages.tryAgainLater,
          showConfirmButton: true,
          confirmText: Languages[selectedLanguage].messages.ok,
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

  const {companyHoursToday = []} = menu || {};

  const getCompanyHours = () => {
    if (companyHoursToday && companyHoursToday.length > 0) {
      return companyHoursToday.map((item) => ({
        label: `${item.name} (${Languages[selectedLanguage].manageMenu.from} ${item.time_from} ${Languages[selectedLanguage].manageMenu.to} ${item.time_to})`,
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
        label={Languages[selectedLanguage].messages.selectOne}
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
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    shadowOffset: {width: 0, height: 4},
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
                      fontSize: normalize(14),
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
                      shadowOpacity: 0.3,
                      shadowRadius: 4.65,
                      shadowOffset: {width: 0, height: 4},
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
                        fontSize: normalize(14),
                        width: '70%',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        alignSelf: 'center',
                        textAlign: 'right',
                        fontSize: normalize(14),
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
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  shadowOffset: {width: 0, height: 4},
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
                    fontSize: normalize(14),
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
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  shadowOffset: {width: 0, height: 4},
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
                    fontSize: normalize(14),
                    width: '70%',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    alignSelf: 'center',
                    textAlign: 'right',
                    fontSize: normalize(14),
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
