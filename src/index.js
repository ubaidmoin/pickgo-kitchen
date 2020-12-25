import React from 'react';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Login from './Screens/Login';
import Tables from './Screens/Tables';
import Reservations from './Screens/Reservations';
import MenuOrders from './Screens/MenuOrders';
import SearchUsers from './Screens/SearchUsers';
import NotificationCenter from './Screens/NotificationCenter';
import Settings from './Screens/Settings';
import DrawerComponent from './Components/DrawerComponent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Header = (
  {
    title = null,
    showBackButton = false,
    showTitle = false,
    showMenuButton = false,
    isTransparent = false,
  },
  navigation,
) => ({
  title: showTitle ? title : null,
  headerTitleStyle: {
    color: '#fff',
  },
  headerTransparent: isTransparent,
  headerStyle: {
    backgroundColor: '#27ae61',
  },
  headerLeft:
    showBackButton || showMenuButton
      ? () => (
          <TouchableOpacity
            onPress={() =>
              showBackButton ? navigation.pop() : navigation.toggleDrawer()
            }>
            <FeatherIcon
              style={{marginLeft: 10}}
              name={showBackButton ? 'chevron-left' : 'menu'}
              size={25}
              color={'#fff'}
            />
          </TouchableOpacity>
        )
      : null,
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

const SignedInStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tables"
      component={Tables}
      options={({navigation}) =>
        Header(
          {
            title: 'Tables',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="Reservations"
      component={Reservations}
      options={({navigation}) =>
        Header(
          {
            title: 'Reservations',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="MenuOrders"
      component={MenuOrders}
      options={({navigation}) =>
        Header(
          {
            title: 'Menu Orders',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="SearchUsers"
      component={SearchUsers}
      options={({navigation}) =>
        Header(
          {
            title: 'Search Users',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="NotificationCenter"
      component={NotificationCenter}
      options={({navigation}) =>
        Header(
          {
            title: 'Notification Center',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="Settings"
      component={Settings}
      options={({navigation}) =>
        Header(
          {
            title: 'Settings',
            showTitle: true,
            showMenuButton: true,
          },
          navigation,
        )
      }
    />
  </Stack.Navigator>
);

const LoggedInDrawer = () => (
  <Drawer.Navigator
    drawerPosition="left"
    drawerContent={(props) => <DrawerComponent {...props} />}
    drawerStyle={{width: '85%'}}
    drawerType="slide">
    <Drawer.Screen name="Main" component={SignedInStack} />
  </Drawer.Navigator>
);

const CreateRootNavigator = (props) => {
  return (
    <NavigationContainer>
      {props.isLoggedIn ? <LoggedInDrawer /> : <LoggedOutStack />}
    </NavigationContainer>
  );
};

export default CreateRootNavigator;
