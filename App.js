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

const RootNavigator = () => {
  useEffect(() => {
    dispatch({
      type: actions.SET_ALERT_SETTINGS,
      alertSettings: {
        show: true,
        type: 'info',
        title: 'An Update Available',
        message:
          'A new version of Pick Eat Admin is available. Would you like to update?',
        showConfirmButton: true,
        confirmText: 'Update',
        showCancelButton: true,
        cancelText: 'Later',
        onConfirmPressed: async () => {
          try {
            // eslint-disable-next-line no-empty
          } catch (error) {}
        },
      },
    });
    dispatch({
      type: actions.SET_PROGRESS_SETTINGS,
      show: true,
    });
    setTimeout(() => {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }, 1000);
    checkStatus();
    isUpdateAvailable();
  }, []);

  const [loading, setLoading] = useState(false);
  const [{user, progressSettings, alertSettings}, dispatch] = useStateValue();
  const {show = false} = progressSettings || {};
  const {settings} = alertSettings || {};

  const checkStatus = async () => {
    try {
      setLoading(true);
      dispatch({
        type: actions.SET_USER,
        user: {
          ...user,
          isLoggedIn: true,
        },
      });
      setLoading(false);
    } catch (err) {
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
      <ActivityIndicator color="#000" />
    </View>
  ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AppAlert {...getAlertSettings()} />
      <AppActivityIndicator visible={show} />
      <CreateRootNavigator
        // isLoggedIn={user && user.isLoggedIn ? true : false}
        isLoggedIn={true}
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
