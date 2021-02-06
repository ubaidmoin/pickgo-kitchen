import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Login from './Screens/Login';
import Tables from './Screens/Tables';
import TableCart from './Screens/TableCart';
import AddToCart from './Screens/AddToCart';
import AddCartItem from './Screens/AddCartItem';
import Payment from './Screens/Payment';
import TerminalConnection from './Screens/TerminalConnection';
import Reservations from './Screens/Reservations';
import OrderSummary from './Screens/OrderSummary';
import MenuOrders from './Screens/MenuOrders';
import SearchUsers from './Screens/SearchUsers';
import NotificationCenter from './Screens/NotificationCenter';
import Settings from './Screens/Settings';
import TestPush from './Screens/TestPush';
import ManageMenu from './Screens/ManageMenu';
import EditMenu from './Screens/EditMenu';
import DrawerComponent from './Components/DrawerComponent';
import Ripple from './Components/Ripple';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Header = (
  {
    title = null,
    showBackButton = false,
    showTitle = false,
    showMenuButton = false,
    isTransparent = false,
    showRightButtons = true,
    notificationCount = null,
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
          <Ripple
            style={{marginLeft: 10}}
            onPress={() =>
              showBackButton ? navigation.pop() : navigation.toggleDrawer()
            }>
            <FeatherIcon
              name={showBackButton ? 'chevron-left' : 'menu'}
              size={25}
              color={'#fff'}
            />
          </Ripple>
        )
      : null,
  headerRight: showRightButtons
    ? () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Ripple
            style={{paddingHorizontal: 10}}
            onPress={() => navigation.navigate('Tables')}>
            <Entypo name="home" size={25} color={'#fff'} />
          </Ripple>
          <Ripple onPress={() => navigation.navigate('NotificationCenter')}>
            <MaterialIcon name="notifications-on" size={25} color={'#fff'} />
            {notificationCount ? (
              <View
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-15%',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#cc0001',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#fff',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    textAlign: 'center',
                  }}>
                  {notificationCount}
                </Text>
              </View>
            ) : null}
          </Ripple>
        </View>
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
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Tables',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="TableCart"
      component={TableCart}
      options={({navigation, route}) => {
        const title =
          route.params && route.params.title
            ? route.params.title
            : 'Table Cart';
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title,
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="AddToCart"
      component={AddToCart}
      options={({navigation, route}) => {
        const title =
          route.params && route.params.title
            ? route.params.title
            : 'Add To Cart';
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title,
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="AddCartItem"
      component={AddCartItem}
      options={({navigation, route}) => {
        const title =
          route.params && route.params.title
            ? route.params.title
            : 'Add Cart Item';
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title,
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="Payment"
      component={Payment}
      options={({navigation, route}) => {
        const title =
          route.params && route.params.title
            ? `Payment - ${route.params.title}`
            : 'Payment';
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title,
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="TerminalConnection"
      component={TerminalConnection}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Terminal Connection',
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="Reservations"
      component={Reservations}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Reservations',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="OrderSummary"
      component={OrderSummary}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Order Summary',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="MenuOrders"
      component={MenuOrders}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Menu Orders',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="SearchUsers"
      component={SearchUsers}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Search Users',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="NotificationCenter"
      component={NotificationCenter}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Notification Center',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="Settings"
      component={Settings}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Settings',
            showTitle: true,
            showMenuButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="TestPush"
      component={TestPush}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Test Push',
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="ManageMenu"
      component={ManageMenu}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Manage Menu',
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="EditMenu"
      component={EditMenu}
      options={({navigation, route}) => {
        const notificationCount =
          route.params && route.params.notificationCount
            ? route.params.notificationCount
            : null;
        return Header(
          {
            title: 'Edit Menu',
            showTitle: true,
            showBackButton: true,
            notificationCount,
          },
          navigation,
        );
      }}
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
