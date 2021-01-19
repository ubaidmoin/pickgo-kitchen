import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Ripple from '../Components/Ripple';
import {getNotificationCount} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Settings = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  return (
    <View style={{flex: 1, paddingTop: '3%'}}>
      <Ripple
        style={{
          paddingVertical: 15,
          paddingHorizontal: '5%',
          flexDirection: 'row',
        }}
        onPress={() => navigation.navigate('TestPush')}>
        <MaterialIcon
          style={{marginRight: 10}}
          name="notifications"
          size={25}
          color={'#757575'}
        />
        <Text style={{fontSize: 18, color: '#757575', fontWeight: 'bold'}}>
          Test Push
        </Text>
      </Ripple>
    </View>
  );
};

export default Settings;
