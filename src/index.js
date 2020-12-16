import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypeIcon from 'react-native-vector-icons/Entypo';
import {getUserInfo} from './Services/DataManager';

import Login from './Screens/Login';
import Tables from './Screens/Tables';
import Reservations from './Screens/Reservations';
import MenuOrders from './Screens/MenuOrders';
import SearchUsers from './Screens/SearchUsers';
import NotificationCenter from './Screens/NotificationCenter';
import Settings from './Screens/Settings';
import DrawerComponent from './Components/DrawerComponent';
import {useStateValue} from './Services/State/State';
import {actions} from './Services/State/Reducer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// eslint-disable-next-line no-unused-vars
const header = ({title = ''}, navigation) => ({
  title: title,
  // eslint-disable-next-line react/display-name
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.pop();
      }}>
      <FeatherIcon
        style={{marginLeft: 10}}
        name={'chevron-left'}
        size={25}
        color={'#000'}
      />
    </TouchableOpacity>
  ),
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <TouchableOpacity
      onPress={() => {
        // navigation.toggleDrawer();
      }}>
      <EntypeIcon
        style={{marginRight: 10}}
        name={'dots-three-horizontal'}
        size={25}
        color={'#000'}
      />
    </TouchableOpacity>
  ),
});

const headerWithNoBackButton = ({title = ''}, navigation) => ({
  title: title,
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <TouchableOpacity
      onPress={() => {
        // navigation.toggleDrawer();
      }}>
      <EntypeIcon
        style={{marginRight: 10}}
        name={'dots-three-horizontal'}
        size={25}
        color={'#000'}
      />
    </TouchableOpacity>
  ),
  gestureEnabled: false,
});

const LoggedOutStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const LoggedInStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={({navigation}) =>
        headerWithNoBackButton({title: ''}, navigation)
      }
    />
  </Stack.Navigator>
);

const LoggedInDrawer = () => (
  <Drawer.Navigator
    drawerPosition="left"
    drawerContent={(props) => <DrawerComponent {...props} />}>
    <Drawer.Screen name="Tables" component={Tables} />
    <Drawer.Screen name="Reservations" component={Reservations} />
    <Drawer.Screen name="MenuOrders" component={MenuOrders} />
    <Drawer.Screen name="SearchUsers" component={SearchUsers} />
    <Drawer.Screen name="NotificationCenter" component={NotificationCenter} />
    <Drawer.Screen name="Settings" component={Settings} />
    <Drawer.Screen name="Logout" component={Settings} />
  </Drawer.Navigator>
);

const Index = () => {
  const [state, dispatch] = useStateValue();
  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      const response = await getUserInfo();
      console.log('test', response);
      if (response && response.access_token) {
        dispatch({type: actions.SET_USER, payload: response});
        setInitialRouteName('LoggedInStack');
      } else {
        setInitialRouteName('LoggedOutStack');
      }
      setLoading(false);
    };
    checkStatus();
  }, []);

  const [loading, setLoading] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('LoggedOutStack');

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator />
    </View>
  ) : (
    <NavigationContainer>
      <Drawer.Navigator edgeWidth={-1} initialRouteName={initialRouteName}>
        <Drawer.Screen name="LoggedOutStack" component={LoggedOutStack} />
        <Drawer.Screen name="LoggedInDrawer" component={LoggedInDrawer} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Index;
