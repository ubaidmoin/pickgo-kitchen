import React, {useState} from 'react';
import {View, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../Components/Input';
import Button from '../Components/Button';
import {authService} from '../Services/API/ApiCalls';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {validateEmail} from '../Services/Common';
import {setUserInfo} from '../Services/DataManager';

const Login = () => {
  const [email, setEmail] = useState('sam1@pickgo.la');
  const [password, setPassword] = useState('sam123');
  const [loading, setLoading] = useState('');
  const [, dispatch] = useStateValue();

  const login = async () => {
    try {
      Keyboard.dismiss();
      if (!email.trim()) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: `Email Required`,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      if (!password.trim()) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: `Password Required`,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      if (!validateEmail(email.trim())) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: `Invalid Email`,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const responseLogin = await authService(
        `username=${email}&password=${password}`,
      );
      if (responseLogin.data) {
        const {message = ''} = responseLogin.data || {};
        if (message && message.includes('Successfully')) {
          await setUserInfo(JSON.stringify(responseLogin.data));
          dispatch({
            type: actions.SET_USER_INFO,
            userInfo: responseLogin.data,
          });
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'success',
              title: `Logged In`,
              showConfirmButton: true,
              confirmText: 'Ok',
            },
          });
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: message,
              showConfirmButton: true,
              confirmText: 'Ok',
            },
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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: '5%',
        }}>
        <Input
          label="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Input
          label="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Button title="Login" loading={loading} onPress={login} height={40} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
