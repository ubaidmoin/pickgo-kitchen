import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Ripple from '../Components/Ripple';
import {getNotificationCount} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native-gesture-handler';
import Dropdown from '../Components/Dropdown';
import {actions} from '../Services/State/Reducer';
import {useStateValue} from '../Services/State/State';
import Languages from '../Localization/translations';

const Settings = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const [{selectedLanguage}, dispatch] = useStateValue();

  const languages = [
    {label: 'English', value: 'en'},
    {label: 'ພາສາລາວ', value: 'lo'},
    {label: 'ไทย', value: 'th'},
    {label: '中文', value: 'ch'},
  ];

  const settings = [
    {
      title: Languages[selectedLanguage].settings.testPush,
      icon: (
        <MaterialIcon
          style={{marginRight: 10}}
          name="notifications"
          size={25}
          color={'#757575'}
        />
      ),
      onPress: () => navigation.navigate('TestPush'),
    },
    {
      title: Languages[selectedLanguage].settings.manageMenu,
      icon: (
        <MaterialIcon
          style={{marginRight: 10}}
          name="restaurant-menu"
          size={25}
          color={'#757575'}
        />
      ),
      onPress: () => navigation.navigate('ManageMenu'),
    },
    {
      title: `${Languages[selectedLanguage].settings.language} (${
        selectedLanguage
          ? languages.find((l) => l.value === selectedLanguage).label
          : ''
      })`,
      icon: (
        <EntypoIcon
          style={{marginRight: 10}}
          name="language"
          size={25}
          color={'#757575'}
        />
      ),
      onPress: () => {
        setShowMenu(true);
        setShowMenu(false);
      },
    },
  ];

  const onSelectLanguage = (language) => {
    if (language && language.value) {
      dispatch({
        type: actions.SET_LANGUAGE,
        selectedLanguage: language.value,
      });
    }
  };

  return (
    <View style={{flex: 1, paddingTop: '3%'}}>
      <View style={{height: 0, width: 0, opacity: 0}}>
        <Dropdown
          label={Languages[selectedLanguage].messages.selectLanguage}
          options={languages}
          onSelect={onSelectLanguage}
          show={showMenu}
        />
      </View>
      <FlatList
        data={settings}
        renderItem={({item, index}) => (
          <Ripple
            key={index}
            style={{
              paddingVertical: 15,
              paddingHorizontal: '5%',
              flexDirection: 'row',
            }}
            onPress={item.onPress}>
            {item.icon}
            <Text style={{fontSize: 18, color: '#757575', fontWeight: 'bold'}}>
              {item.title}
            </Text>
          </Ripple>
        )}
      />
    </View>
  );
};

export default Settings;
