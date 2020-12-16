import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {setUserInfo} from '../Services/DataManager';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../Components/Input';
import Button from '../Components/Button';
import {validateEmail} from '../Services/Common';
import {settings as s} from '../Services/Settings';
import {authService} from '../Services/API/ApiCalls';
import {actions} from '../Services/State/Reducer';
import {useStateValue} from '../Services/State/State';
import Ripple from '../Components/Ripple';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState('');

  const [state, dispatch] = useStateValue();

  const login = async () => {
    navigation.navigate('LoggedInDrawer');
    return;
    setLoading(true);
    if (validateFields()) {
      const res = await authService(s.login, {
        username: email,
        password: password,
      });
      if (res.data) {
        await setUserInfo(JSON.stringify(res.data));
        dispatch({type: actions.SET_USER, payload: res.data});
        setLoading(false);
        navigation.navigate('LoggedInDrawer');
      } else {
        setTimeout(() => {
          navigation.navigate('LoggedInDrawer');
        }, 2000);
      }
    } else {
      setLoading(false);
    }
  };

  const validateFields = () => {
    if (email) {
      if (!validateEmail(email)) {
        alert('Invalid email address');
        return false;
      }
    } else {
      alert('Email is required');
      return false;
    }
    if (!password) {
      alert('Password is required');
      return false;
    }
    return true;
  };

  return (
    <View style={{flex: 1}}>
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
        <Button title="Login" loading={loading} onPress={login} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
