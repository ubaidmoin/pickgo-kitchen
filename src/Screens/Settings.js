import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  PixelRatio,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Ripple from '../Components/Ripple';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  getNotificationCount,
  setLanguage,
  getUseAlan,
  setUseAlan,
} from '../Services/DataManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native-gesture-handler';
import Dropdown from '../Components/Dropdown';
import {actions} from '../Services/State/Reducer';
import {useStateValue} from '../Services/State/State';
import Languages from '../Localization/translations';
import {Switch} from 'react-native-switch';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const Settings = ({navigation}) => {
  useEffect(() => {
    fetchUseAlan();
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [useAlan, setAlan] = useState(false);
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

  const fetchUseAlan = async () => {
    const res = await getUseAlan();
    console.log(res);
    setAlan(res);
  };

  const handleSwitch = async (val) => {
    setAlan(val);
    await setUseAlan(val);
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
    <View style={{flex: 1, paddingTop: '3%'}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#27ae61',
            borderRadius: 80,
            padding: 5,
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            top: 20,
            left: 20,
            position: 'absolute',
          }}
          onPress={() => navigation.toggleDrawer()}>
          <FeatherIcon name="menu" size={25} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <View style={{height: 0, width: 0, opacity: 0, marginTop: 60}}>
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
            <Text
              style={{
                fontSize: normalize(14),
                color: '#757575',
                fontWeight: 'bold',
              }}>
              {item.title}
            </Text>
          </Ripple>
        )}
      />
      {/* <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{marginRight: 10}}>Use Alan</Text>
        <Switch
          value={useAlan}
          onValueChange={handleSwitch}
          activeText={'On'}
          inActiveText={'Off'}
          circleSize={30}
          barHeight={1}
          circleBorderWidth={3}
          backgroundActive={'green'}
          backgroundInactive={'gray'}
          circleActiveColor={'#30a566'}
          circleInActiveColor={'#000000'}
          // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
          changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
          innerCircleStyle={{alignItems: 'center', justifyContent: 'center'}} // style for inner animated circle for what you (may) be rendering inside the circle
          outerCircleStyle={{}} // style for outer animated circle
          renderActiveText={false}
          renderInActiveText={false}
          switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
          switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
          switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
          switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
        />
      </View> */}
    </View>
  );
};

export default Settings;
