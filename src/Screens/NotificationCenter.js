import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Ripple from '../Components/Ripple';
import {
  getNotifications,
  updateNotification,
  getNotificationCount,
} from '../Services/DataManager';

const NotificationCenter = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    getNotifications().then((notifications) => {
      const sortedNotifications = notifications.sort((a, b) => a.time < b.time);
      setNotifications(sortedNotifications);
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      );
    });
  };

  const onPressNotification = async (notification) => {
    await updateNotification(notification.time, {
      ...notification,
      isSeen: !notification.isSeen,
    });
    fetchNotifications();
    if (notification && notification.type) {
      switch (notification.type) {
        case 'pay-by-cash':
          if (notification.table_id) {
            navigation.navigate('Payment', {
              tableId: notification.table_id,
            });
          }
          break;
        case 'reservation':
          navigation.navigate('Reservations');
          break;
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{paddingVertical: '2%'}}
        data={notifications}
        renderItem={({item, index}) => (
          <Ripple
            style={{
              shadowColor: '#cc0001',
              backgroundColor: '#fff',
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              shadowOffset: {width: 0, height: 4},
              elevation: 5,
              padding: '3%',
              marginHorizontal: '3.5%',
              marginVertical: '1%',
              marginBottom: index === notifications.length - 1 ? '8%' : '1%',
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => onPressNotification(item)}>
            <View style={{width: '85%', paddingHorizontal: '2%'}}>
              <Text
                style={{fontSize: 18, color: '#757575', fontWeight: 'bold'}}>
                {item.title}
              </Text>
              <Text style={{color: '#555', fontSize: 16}}>{item.body}</Text>
              <Text style={{color: '#999', fontSize: 15}}>
                {moment(item.time).format('MM/DD/YYYY hh:mm:ss a')}
              </Text>
            </View>
            <View style={{width: '20%', alignItems: 'center'}}>
              <MaterialIcon
                style={{marginRight: 10}}
                name="notifications"
                size={25}
                color={item.isSeen ? '#555' : '#fe0000'}
              />
            </View>
          </Ripple>
        )}
      />
    </View>
  );
};

export default NotificationCenter;
