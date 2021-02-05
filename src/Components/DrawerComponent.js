import {Image, StatusBar, Text, View} from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Button from './Button';
import Ripple from './Ripple';
import {useStateValue} from '../Services/State/State';
import {setUserInfo} from '../Services/DataManager';
import {actions} from '../Services/State/Reducer';
import {settings as s} from '../Services/Settings';

const Drawer = ({navigation}) => {
  const drawerMenu = [
    {
      icon: <MaterialIcon name="dinner-dining" color={'#fff'} size={20} />,
      title: 'Tables',
      subTitle: 'Manage Tables',
      onPress: () => navigation.navigate('Tables'),
    },
    {
      icon: <MaterialIcon name="dinner-dining" color={'#fff'} size={20} />,
      title: 'Reservations',
      subTitle: 'See Reservations',
      onPress: () => navigation.navigate('Reservations'),
    },
    {
      icon: <MaterialIcon name="fastfood" color={'#fff'} size={20} />,
      title: 'Menu Orders',
      subTitle: 'Manage Orders',
      onPress: () => navigation.navigate('MenuOrders'),
    },
    {
      icon: <IonIcon name="search" color={'#fff'} size={20} />,
      title: 'Search',
      subTitle: 'Search Users',
      onPress: () => navigation.navigate('SearchUsers'),
    },
    {
      icon: <IonIcon name="notifications" color={'#fff'} size={20} />,
      title: 'Notification Center',
      subTitle: 'Manage Notifications',
      onPress: () => navigation.navigate('NotificationCenter'),
    },
    {
      icon: <IonIcon name="settings-sharp" color={'#fff'} size={20} />,
      title: 'Settings',
      subTitle: 'Printer, Terminal, Test Push, Manage Menu',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const [{userInfo}, dispatch] = useStateValue();

  const {first_name = '', last_name = '', email_address = '', picture = ''} =
    (userInfo && userInfo.user) || {};

  const logout = async () => {
    await setUserInfo('');
    dispatch({type: actions.SET_USER_INFO, userInfo: null});
  };

  return (
    <View style={{flex: 1, backgroundColor: '#27ae61'}}>
      <StatusBar backgroundColor="#27ae61" barStyle="light-content" />
      <View
        style={{
          flex: 0.25,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 0.5,
          borderBottomColor: '#fff',
        }}>
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: '#fff',
          }}
          source={
            picture
              ? {uri: `${s.IMAGE_BASEURL}${picture}`}
              : require('../Assets/userAvator.png')
          }
        />
        <View
          style={{
            marginTop: '2%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>
            {`${first_name} ${last_name}`}
          </Text>
          <Text style={{color: '#fff', fontSize: 12}}>{email_address}</Text>
        </View>
      </View>
      <View style={{flex: 0.7}}>
        {drawerMenu.map((menuItem, index) => (
          <Ripple
            key={index}
            style={{
              flexDirection: 'row',
              borderBottomColor: '#fff',
              borderBottomWidth: 0.5,
              paddingVertical: 10,
              paddingHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={menuItem.onPress}>
            <View
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {menuItem.icon}
            </View>
            <View style={{flex: 0.8}}>
              <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 12}}>
                {menuItem.title}
              </Text>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 2}}>
                {menuItem.subTitle}
              </Text>
            </View>
            <View style={{flex: 0.05}}>
              <IonIcon
                name="chevron-forward-outline"
                color={'#fff'}
                size={10}
              />
            </View>
          </Ripple>
        ))}
        <View style={{marginHorizontal: '10%', marginVertical: '10%'}}>
          <Button
            title="Logout"
            color="#fff"
            textColor="#000"
            icon={<MaterialIcon size={20} color="#000" name="logout" />}
            onPress={logout}
          />
        </View>
      </View>
    </View>
  );
};

export default Drawer;
