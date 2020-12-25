import React, {useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../Components/Input';
import Button from '../Components/Button';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState('');

  const login = async () => {
    navigation.navigate('LoggedInDrawer');
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
        <Button title="Login" loading={loading} onPress={login} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
