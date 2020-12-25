import {Image, StatusBar, Text, View} from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Button from './Button';
import Ripple from './Ripple';

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
      subTitle: 'Printer, Terminal, Test Push',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

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
          style={styles.image}
          source={require('../Assets/userAvator.png')}
        />
        <View
          style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{marginLeft: 5}}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              Jon Abbas Kok
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 10}}>sam1@pickgo.la</Text>
            </View>
          </View>
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
        <View style={{marginHorizontal: '10%', marginVertical: '4%'}}>
          <Button
            title="Logout"
            color="#fff"
            textColor="#000"
            icon={<MaterialIcon size={20} color="#000" name="logout" />}
          />
        </View>
      </View>
    </View>
  );
};

export default Drawer;

const styles = {
  container: {
    flex: 1,
    // backgroundColor: '#1e2023',
    // paddingTop: 20,
  },
  profileImage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 30,
    padding: 10,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  genderAndAge: {
    color: 'white',
    fontSize: 14,
    paddingRight: 10,
  },
  location: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 10,
  },
  image: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 10,
  },
};
