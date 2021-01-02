import {
  SafeAreaView,
  StatusBar,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CreateRootNavigator from './src/index';
// import {theme} from './components/common/theme';
import {StateProvider} from './src/Services/State/State';
import {initialState} from './src/Services/State/InitialState';
import {reducer, actions} from './src/Services/State/Reducer';
import {useStateValue} from './src/Services/State/State';
import AppActivityIndicator from './src/Components/ActivityIndicator';
import AppAlert from './src/Components/AppAlert';
import VersionCheck from 'react-native-version-check';
import {getUserInfo} from './src/Services/DataManager';
import PushNotification from 'react-native-push-notification';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION123:', notification);
    PushNotification.localNotification({
      ...notification,
      notification: notification.data,
    });

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

const RootNavigator = () => {
  useEffect(() => {
    checkAuth();
    isUpdateAvailable();
  }, []);

  const [loading, setLoading] = useState(false);
  const [
    {userInfo, progressSettings, alertSettings},
    dispatch,
  ] = useStateValue();
  const {show = false} = progressSettings || {};
  const {settings} = alertSettings || {};

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      if (
        userInfo &&
        userInfo.access_token &&
        userInfo.user &&
        userInfo.user.uid
      ) {
        dispatch({
          type: actions.SET_USER_INFO,
          userInfo: userInfo,
        });
      }
    } catch (err) {
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
      setLoading(false);
    }
  };

  const isUpdateAvailable = async () => {
    let updateNeeded = await VersionCheck.needUpdate({
      // packageName: 'com.callinurgentcare',
    });
    if (updateNeeded.isNeeded) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'info',
          title: 'An Update Available',
          message:
            'A new version of Medical Services App is available. Would you like to update?',
          showConfirmButton: true,
          confirmText: 'Update',
          showCancelButton: true,
          cancelText: 'Later',
          onConfirmPressed: async () => {
            try {
              Linking.openURL(updateNeeded.storeUrl);
              // eslint-disable-next-line no-empty
            } catch (error) {}
          },
        },
      });
    }
  };

  const getAlertSettings = () => {
    const onConfirmPressed =
        settings && settings.onConfirmPressed
          ? settings.onConfirmPressed
          : () => {},
      onCancelPressed =
        settings && settings.onCancelPressed
          ? settings.onCancelPressed
          : () => {};
    return {
      ...settings,
      onConfirmPressed: () => {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: null,
        });
        onConfirmPressed();
      },
      onCancelPressed: () => {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: null,
        });
        onCancelPressed();
      },
    };
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size={30} color="#000" />
    </View>
  ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AppAlert {...getAlertSettings()} />
      <AppActivityIndicator visible={show} />
      <CreateRootNavigator
        isLoggedIn={
          userInfo &&
          userInfo.access_token &&
          userInfo.user &&
          userInfo.user.uid
        }
      />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <RootNavigator />
    </StateProvider>
  );
};

export default App;

console.disableYellowBox = true;
