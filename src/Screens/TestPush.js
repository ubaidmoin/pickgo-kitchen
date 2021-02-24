import React, {useEffect} from 'react';
import {Text, FlatList, ToastAndroid} from 'react-native';
import Ripple from '../Components/Ripple';
import {getNotificationCount} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {sendNotification} from '../Services/API/APIManager';
import Languages from '../Localization/translations';

const TestPush = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [{selectedLanguage}, dispatch] = useStateValue();

  const typeNotifications = [
    {
      name: Languages[selectedLanguage].testPush.callAServer, //Nothing
      body: {
        data: [
          {key: 'type', value: 'call-a-server'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
          {key: 'to_user_id', value: '123'},
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
    {
      name: Languages[selectedLanguage].testPush.payByCash, //Open Payment Screen for table_id
      body: {
        data: [
          {key: 'type', value: 'pay-by-cash'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
          {key: 'table_id', value: '8'},
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
    {
      name: Languages[selectedLanguage].testPush.reservation, //Open Reservation Screen
      body: {
        data: [
          {key: 'type', value: 'reservation'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
    {
      name: Languages[selectedLanguage].testPush.newOrder, //Nothing
      body: {
        data: [
          {key: 'type', value: 'new-order'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
          {key: 'table_id', value: '8'},
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
    {
      name: Languages[selectedLanguage].testPush.orderPaid, //Nothing
      body: {
        data: [
          {key: 'type', value: 'order-paid'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
    {
      name: Languages[selectedLanguage].testPush.checkIn, //Nothing
      body: {
        data: [
          {key: 'type', value: 'check-in'},
          {
            key: 'title',
            value: Languages[selectedLanguage].testPush.notificationTitle,
          },
          {
            key: 'body',
            value: Languages[selectedLanguage].testPush.notificationBody,
          },
        ],
        notification: {
          title: Languages[selectedLanguage].testPush.notificationTitle,
          body: Languages[selectedLanguage].testPush.notificationBody,
        },
      },
    },
  ];

  const onSendNotification = async (notification) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      const result = await sendNotification(notification.body);
      if (result && result.success && result.token_count > 0) {
        ToastAndroid.show(
          Languages[selectedLanguage].messages.notificationSent,
          ToastAndroid.LONG,
        );
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
    }
  };

  return (
    <FlatList
      style={{flex: 1, paddingTop: '3%', paddingHorizontal: '3%'}}
      showsVerticalScrollIndicator={false}
      data={typeNotifications}
      renderItem={({item}) => (
        <Ripple
          onPress={() => onSendNotification(item)}
          key={item.name}
          style={{
            flexDirection: 'row',
            paddingHorizontal: '2%',
            paddingVertical: '3%',
            alignItems: 'center',
          }}>
          <MaterialIcon
            style={{marginRight: 10}}
            name="notifications"
            size={25}
            color={'#757575'}
          />
          <Text>{item.name}</Text>
        </Ripple>
      )}
    />
  );
};

export default TestPush;
