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
// import {AlanView} from './AlanSDK';
// import {NativeEventEmitter, NativeModules} from 'react-native';

// const {AlanManager, AlanEventEmitter} = NativeModules;
// const alanEventEmitter = new NativeEventEmitter(AlanEventEmitter);

const RootNavigator = () => {
  useEffect(() => {
    checkAuth();
  }, []);

  const [loading, setLoading] = useState(false);
  const [{userInfo, progressSettings, alertSettings}, dispatch] =
    useStateValue();
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
    <View style={{flex: 1}} onLayout={() => checkDevice()}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
      <SafeAreaView style={{flex: 1}}>
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
    </View>
  );
};

const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {/* <AlanView
        projectid={
          'e7c97f0d534667f4e24c8515b4cd6afc2e956eca572e1d8b807a3e2338fdd0dc/stage'
        }
        authData={{data: 'your auth data if needed'}}
      /> */}
      <RootNavigator />
    </StateProvider>
  );
};

export default App;

console.disableYellowBox = true;
