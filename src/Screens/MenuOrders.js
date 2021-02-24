import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';
import {useStateValue} from '../Services/State/State';

const MenuOrders = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [{selectedLanguage}] = useStateValue();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{Languages[selectedLanguage].menuOrders.title}</Text>
    </View>
  );
};

export default MenuOrders;
