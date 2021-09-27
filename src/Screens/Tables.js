import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  Platform,
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
import Languages from '../Localization/translations';

if (Platform.OS === 'android') {
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
              if (!(response && response && response.id)) {
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
}

const Tables = ({navigation}) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
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
    }
    fetchTables();
    return navigation.addListener('focus', () => fetchTables());
  }, []);

  const [{tables = [], selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    try {
      if (!(tables && tables.length > 0)) {
        dispatch({
          type: actions.SET_PROGRESS_SETTINGS,
          show: true,
        });
        setLoading(true);
      }
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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTables} />
        }
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
      />
    </View>
  );
};

export default Tables;

const styles = StyleSheet.create({
  item: {
    width: '45.9%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    shadowOffset: {width: 0, height: 4},
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
