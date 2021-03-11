import {
  SafeAreaView,
  StatusBar,
  View,
  ActivityIndicator,
  Linking,
  Dimensions,
  PixelRatio,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CreateRootNavigator from './src/index';
import {StateProvider} from './src/Services/State/State';
import {initialState} from './src/Services/State/InitialState';
import {reducer, actions} from './src/Services/State/Reducer';
import {useStateValue} from './src/Services/State/State';
import AppActivityIndicator from './src/Components/ActivityIndicator';
import AppAlert from './src/Components/AppAlert';
import VersionCheck from 'react-native-version-check';
import {getLanguage, getUserInfo} from './src/Services/DataManager';

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
      const language = await getLanguage();
      if (language) {
        dispatch({
          type: actions.SET_LANGUAGE,
          selectedLanguage: language,
        });
      }
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
      packageName: 'com.pickgo.eat.pickeatadmin',
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
        setTimeout(() => onConfirmPressed(), 100);
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

  const checkDevice = () => {
    const isWideScreen = isScreenWide() ? true : false;
    dispatch({type: actions.SET_IS_WIDE_SCREEN, isWideScreen});
  };

  const isScreenWide = () => {
    try {
      let isTablet = false;
      const dim = Dimensions.get('window');
      let pixelDensity = PixelRatio.get();
      const adjustedWidth = dim.width * pixelDensity;
      const adjustedHeight = dim.height * pixelDensity;
      if (
        pixelDensity < 2 &&
        (adjustedWidth >= 1000 || adjustedHeight >= 1000)
      ) {
        isTablet = true;
      } else {
        isTablet =
          pixelDensity === 2 &&
          (adjustedWidth >= 1920 || adjustedHeight >= 1920);
      }
      const isLandscape = !(dim.width < dim.height);
      return isTablet || isLandscape ? true : false;
    } catch (error) {
      return false;
    }
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size={30} color="#27ae61" />
    </View>
  ) : (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff'}}
      onLayout={() => checkDevice()}>
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
