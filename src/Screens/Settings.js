import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Ripple from '../Components/Ripple';
import {getNotificationCount} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {FlatList} from 'react-native-gesture-handler';

const Settings = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const settings = [
    {
      title: 'Test Push',
      icon: (
        <MaterialIcon
          style={{marginRight: 10}}
          name="notifications"
          size={25}
          color={'#757575'}
        />
      ),
      onPress: () => navigation.navigate('TestPush'),
    },
    {
      title: 'Manage Menu',
      icon: (
        <MaterialIcon
          style={{marginRight: 10}}
          name="restaurant-menu"
          size={25}
          color={'#757575'}
        />
      ),
      onPress: () => navigation.navigate('ManageMenu'),
    },
  ];

  return (
    <View style={{flex: 1, paddingTop: '3%'}}>
      <FlatList
        data={settings}
        renderItem={({item, index}) => (
          <Ripple
            key={index}
            style={{
              paddingVertical: 15,
              paddingHorizontal: '5%',
              flexDirection: 'row',
            }}
            onPress={item.onPress}>
            {item.icon}
            <Text style={{fontSize: 18, color: '#757575', fontWeight: 'bold'}}>
              {item.title}
            </Text>
          </Ripple>
        )}
      />
    </View>
  );
};

export default Settings;
