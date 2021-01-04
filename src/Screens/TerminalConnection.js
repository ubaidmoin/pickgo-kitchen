import React, {useEffect} from 'react';
import {View} from 'react-native';
import Button from '../Components/Button';
import {getNotificationCount} from '../Services/DataManager';

const TerminalConnection = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
        marginHorizontal: '3%',
      }}>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Button title="Scan" height={45} />
      </View>
    </View>
  );
};

export default TerminalConnection;
