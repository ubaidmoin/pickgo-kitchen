import React, {useEffect} from 'react';
import {Text, FlatList, ToastAndroid} from 'react-native';
import Ripple from '../Components/Ripple';
import {getNotificationCount} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {sendNotification} from '../Services/API/APIManager';

const TestPush = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const typeNotifications = [
    {
      name: 'CALL A SERVER', //Nothing
      body: {
        data: [
          {key: 'type', value: 'call-a-server'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
          {key: 'to_user_id', value: '123'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
    {
      name: 'PAY BY CASH', //Open Payment Screen for table_id
      body: {
        data: [
          {key: 'type', value: 'pay-by-cash'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
          {key: 'table_id', value: '8'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
    {
      name: 'RESERVATION', //Open Reservation Screen
      body: {
        data: [
          {key: 'type', value: 'reservation'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
    {
      name: 'NEW ORDER', //Nothing
      body: {
        data: [
          {key: 'type', value: 'new-order'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
          {key: 'table_id', value: '8'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
    {
      name: 'ORDER PAID', //Nothing
      body: {
        data: [
          {key: 'type', value: 'order-paid'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
    {
      name: 'CHECK IN', //Nothing
      body: {
        data: [
          {key: 'type', value: 'check-in'},
          {key: 'title', value: 'Title of notification'},
          {key: 'body', value: 'Body of notification'},
        ],
        notification: {
          title: 'Title of notification',
          body: 'Body of notification',
        },
      },
    },
  ];

  const [, dispatch] = useStateValue();

  const onSendNotification = async (notification) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      const result = await sendNotification(notification.body);
      if (result && result.success && result.token_count > 0) {
        ToastAndroid.show('Notification Sent Successfully.', ToastAndroid.LONG);
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
