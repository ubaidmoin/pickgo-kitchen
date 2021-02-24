import React, {useEffect} from 'react';
import {View} from 'react-native';
import Button from '../Components/Button';
import {getNotificationCount} from '../Services/DataManager';
import {useStateValue} from '../Services/State/State';
import Languages from '../Localization/translations';

const TerminalConnection = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [{selectedLanguage}] = useStateValue();

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
        marginHorizontal: '3%',
      }}>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Button
          title={Languages[selectedLanguage].terminalConnection.scan}
          height={45}
        />
      </View>
    </View>
  );
};

export default TerminalConnection;
