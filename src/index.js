import React from 'react';
import {View, Text, Dimensions, Platform, PixelRatio} from 'react-native';
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
import Orders from './Screens/Orders';
import CompletedOrders from './Screens/CompletedOrders';
import OrderSummary from './Screens/OrderSummary';
import SalesReport from './Screens/SalesReport';
import MenuOrders from './Screens/MenuOrders';
import SearchUsers from './Screens/SearchUsers';
import NotificationCenter from './Screens/NotificationCenter';
import Settings from './Screens/Settings';
import TestPush from './Screens/TestPush';
import ManageMenu from './Screens/ManageMenu';
import EditMenu from './Screens/EditMenu';
import DrawerComponent from './Components/DrawerComponent';
import Ripple from './Components/Ripple';
import {useStateValue} from './Services/State/State';
import Languages from './Localization/translations';

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
  header: () => null,
  title: '',
  headerTitleStyle: {
    color: '#fff',
    fontSize: normalize(12),
  },
  headerTransparent: isTransparent,
  headerStyle: {
    backgroundColor: '#fff',
    shadowColor: 'transparent',
  },
  headerLeft:
    showBackButton || showMenuButton
      ? () => (
          <Ripple
            style={{
              marginLeft: 10,
              backgroundColor: '#27ae61',
              borderRadius: 80,
              padding: 5,
            }}
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
  // headerRight: showRightButtons
  //   ? () => (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           marginRight: 10,
  //         }}>
  //         <Ripple
  //           style={{paddingHorizontal: 10}}
  //           onPress={() => navigation.navigate('Tables')}>
  //           <Entypo name="home" size={25} color={'#fff'} />
  //         </Ripple>
  //         <Ripple onPress={() => navigation.navigate('NotificationCenter')}>
  //           <MaterialIcon name="notifications-on" size={25} color={'#fff'} />
  //           {notificationCount ? (
  //             <View
  //               style={{
  //                 position: 'absolute',
  //                 top: '-30%',
  //                 right: '-15%',
  //                 width: 20,
  //                 height: 20,
  //                 borderRadius: 10,
  //                 backgroundColor: '#cc0001',
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //                 borderWidth: 1,
  //                 borderColor: '#fff',
  //               }}>
  //               <Text
  //                 style={{
  //                   color: '#fff',
  //                   fontSize: normalize(10),
  //                   textAlign: 'center',
  //                 }}>
  //                 {notificationCount}
  //               </Text>
  //             </View>
  //           ) : null}
  //         </Ripple>
  //       </View>
  //     )
  //   : null,
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

const SignedInStack = () => {
  const [{selectedLanguage}] = useStateValue();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={({navigation, route}) => {
          const notificationCount =
            route.params && route.params.notificationCount
              ? route.params.notificationCount
              : null;
          return Header(
            {
              title: 'Orders',
              showTitle: true,
              showMenuButton: true,
              notificationCount,
            },
            navigation,
          );
        }}
      />
      <Stack.Screen
        name="CompletedOrders"
        component={CompletedOrders}
        options={({navigation, route}) => {
          const notificationCount =
            route.params && route.params.notificationCount
              ? route.params.notificationCount
              : null;
          return Header(
            {
              title: 'Completed Orders',
              showTitle: true,
              showMenuButton: true,
              notificationCount,
            },
            navigation,
          );
        }}
      />
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
              title: Languages[selectedLanguage].tables.title,
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
              : Languages[selectedLanguage].tableCart.title;
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
              : Languages[selectedLanguage].addToCart.title;
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
              : Languages[selectedLanguage].addCartItem.title;
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
              ? `${Languages[selectedLanguage].payment.title} - ${route.params.title}`
              : Languages[selectedLanguage].payment.title;
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
              title: Languages[selectedLanguage].terminalConnection.title,
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
              title: Languages[selectedLanguage].reservations.title,
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
              title: Languages[selectedLanguage].orderSummary.title,
              showTitle: true,
              showMenuButton: true,
              notificationCount,
            },
            navigation,
          );
        }}
      />
      <Stack.Screen
        name="SalesReport"
        component={SalesReport}
        options={({navigation, route}) => {
          const notificationCount =
            route.params && route.params.notificationCount
              ? route.params.notificationCount
              : null;
          return Header(
            {
              title: Languages[selectedLanguage].salesReport.title,
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
              title: Languages[selectedLanguage].menuOrders.title,
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
              title: Languages[selectedLanguage].search.title,
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
              title: Languages[selectedLanguage].notificationCenter.title,
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
              title: Languages[selectedLanguage].settings.title,
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
              title: Languages[selectedLanguage].testPush.title,
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
              title: Languages[selectedLanguage].manageMenu.title,
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
              title: Languages[selectedLanguage].editMenu.title,
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
};

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
