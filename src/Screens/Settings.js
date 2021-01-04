import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {getNotificationCount} from '../Services/DataManager';

const Settings = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings</Text>
    </View>
  );
};

export default Settings;
