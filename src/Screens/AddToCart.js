import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getMenu} from '../Services/API/APIManager';
import Dropdown from '../Components/Dropdown';
import {formatCurrency} from '../Services/Common';

const AddToCart = ({navigation, ...props}) => {
  useEffect(() => {
    const {table = null} = props.route.params || {};
    if (table && table.id) {
      setTable(table);
      navigation.setParams({title: `Add to ${table.name}`});
      fetchMenu();
    }
  }, []);

  const fetchMenu = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
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
    }
  };

  const [table, setTable] = useState('');
  const [menu, setMenu] = useState('');
  const [selectedCompanyHours, setSelectedCompanyHours] = useState('');
  const [menuCourses, setMenuCourses] = useState([]);
  const [selectedMenuCourse, setSelectedMenuCourse] = useState('');
  const [, dispatch] = useStateValue();

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
    <View style={{flex: 1}}>
      <View style={{marginVertical: '2%', marginHorizontal: '5%'}}>
        <Dropdown
          label="Select One"
          options={getCompanyHours()}
          selected={selectedCompanyHours}
          onSelect={onSelectCompanyHours}
        />
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
              <Text style={{color: '#000'}}>{item.name}</Text>
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
                navigation.navigate('AddCartItem', {table, menuItem: item})
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
                  index === selectedMenuCourse.menu.length - 1 ? '40%' : '1.5%',
              }}>
              <Text style={{color: '#000', textAlign: 'center'}}>
                {item.name}
              </Text>
              <Text style={{color: '#000', textAlign: 'center'}}>
                {formatCurrency(item.price)}
              </Text>
            </Ripple>
          )}
        />
      </View>
    </View>
  );
};

export default AddToCart;
