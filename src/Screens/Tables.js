import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getTables, saveFcmToken} from '../Services/API/APIManager';
import {
  getNotificationCount,
  addNotification,
  isFcmTokenExists,
  getUserInfo,
} from '../Services/DataManager';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

PushNotification.configure({
  onRegister: async (info) => {
    const userInfo = await getUserInfo();
    if (
      userInfo &&
      userInfo.access_token &&
      userInfo.user &&
      userInfo.user.uid
    ) {
      if (info) {
        const {token} = info || {};
        if (token) {
          if (!(await isFcmTokenExists(token))) {
            const response = await saveFcmToken({token});
            if (!(response && response.data && response.data.id)) {
              isFcmTokenExists('');
            }
          }
        }
      }
    }
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const Tables = ({navigation}) => {
  useEffect(() => {
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.foreground && !notification.message) {
          PushNotification.localNotification({
            ...notification,
            message:
              notification.data && notification.data.body
                ? notification.data.body
                : '',
          });
        }
        addNotification({
          ...notification.data,
          time: moment().valueOf(),
          isSeen: false,
        });
        if (
          notification &&
          notification.userInteraction &&
          notification.data &&
          notification.data.type
        ) {
          switch (notification.data.type) {
            case 'pay-by-cash':
              if (notification.data.table_id) {
                navigation.navigate('Payment', {
                  tableId: notification.data.table_id,
                });
              }
              break;
            case 'reservation':
              navigation.navigate('Reservations');
              break;
          }
        }
      },
    });
    fetchTables();
    return navigation.addListener('focus', () => fetchTables());
  }, []);

  const [{tables = []}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getTables();
      if (result.data) {
        const {models = []} = result.data || {};
        if (models && models.length > 0) {
          dispatch({
            type: actions.SET_TABLES,
            tables: models,
          });
        } else {
          dispatch({
            type: actions.SET_TABLES,
            tables: [],
          });
        }
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FlatList
        style={{flex: 1, paddingTop: '3%'}}
        showsVerticalScrollIndicator={false}
        data={tables}
        renderItem={({item}) => (
          <Ripple
            onPress={() => navigation.navigate('TableCart', {tableId: item.id})}
            key={item.id}
            style={{
              ...styles.item,
              backgroundColor: item.has_order
                ? item.activeOrder &&
                  item.activeOrder.uid &&
                  item.activeOrder.uid > -1
                  ? '#fe0000' //Red
                  : '#2b78e4' //Blue
                : '#27ae61', //Green
            }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
          </Ripple>
        )}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTables} />
        }
      />
    </View>
  );
};

export default Tables;

const styles = StyleSheet.create({
  item: {
    width: Dimensions.get('screen').width * 0.44,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 5,
    padding: '9%',
    margin: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
