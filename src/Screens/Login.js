import React, {useState} from 'react';
import {View, Keyboard, Image, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Input from '../Components/Input';
import Button from '../Components/Button';
import {authService} from '../Services/API/CoreAPICalls';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {validateEmail} from '../Services/Common';
import {setUserInfo, setLanguage} from '../Services/DataManager';
import Languages from '../Localization/translations';
import Dropdown from '../Components/Dropdown';
import Ripple from '../Components/Ripple';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('sam1@pickgo.la');
  // const [password, setPassword] = useState('sam123');
  // const [email, setEmail] = useState('pickgrocery@gmail.com');
  // const [password, setPassword] = useState('123456');

  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [{selectedLanguage}, dispatch] = useStateValue();

  const languages = [
    {label: 'English', value: 'en'},
    {label: 'ພາສາລາວ', value: 'lo'},
    {label: 'ไทย', value: 'th'},
    {label: '中文', value: 'ch'},
  ];

  const login = async () => {
    try {
      Keyboard.dismiss();
      if (!email.trim()) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].messages.emailRequired,
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
            title: Languages[selectedLanguage].messages.passwordRequired,
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
            title: Languages[selectedLanguage].messages.invalidEmail,
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
      const responseLogin = await authService({
        username: email,
        password: password,
      });
      if (responseLogin.data) {
        const {user = '', message = '', access_token = ''} =
          responseLogin.data || {};
        if (access_token && user && user.uid) {
          await setUserInfo(responseLogin.data);
          dispatch({
            type: actions.SET_USER_INFO,
            userInfo: responseLogin.data,
          });
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: Languages[selectedLanguage].messages.errorOccured,
              message: message,
              showConfirmButton: true,
              confirmText: Languages[selectedLanguage].messages.ok,
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

  const onSelectLanguage = (language) => {
    if (language && language.value) {
      setLanguage(language.value);
      dispatch({
        type: actions.SET_LANGUAGE,
        selectedLanguage: language.value,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{height: 0, width: 0, opacity: 0}}>
        <Dropdown
          label={Languages[selectedLanguage].messages.selectLanguage}
          options={languages}
          onSelect={onSelectLanguage}
          show={showMenu}
        />
      </View>
      <View style={{position: 'absolute', top: '2%', right: '2%', zIndex: 1}}>
        <Ripple
          onPress={() => {
            setShowMenu(true);
            setShowMenu(false);
          }}>
          <EntypoIcon
            style={{marginRight: 10}}
            name="language"
            size={25}
            color={'#757575'}
          />
        </Ripple>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: '5%',
        }}>
        <Image
          style={{height: 120, width: 120, borderWidth: 1}}
          source={require('../Assets/logo.png')}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: '#2bae6a',
            marginBottom: '2%',
          }}>
          {Languages[selectedLanguage].login.appName}
        </Text>
        <Input
          label={Languages[selectedLanguage].login.email}
          value={email}
          keyboardType="email-address"
          onChangeText={(val) => setEmail(val)}
        />
        <Input
          label={Languages[selectedLanguage].login.password}
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <View style={{height: '1.5%'}} />
        <Button
          title={Languages[selectedLanguage].login.login}
          loading={loading}
          onPress={login}
          height={40}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
