import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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

const HeaderWithRightButtons = (
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
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Entypo style={{marginRight: 10}} name="home" size={25} color={'#fff'} />
      <Entypo
        style={{marginRight: 10}}
        name="credit-card"
        size={25}
        color={'#fff'}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationCenter')}>
        <FontAwesome
          style={{marginRight: 10}}
          name="bell"
          size={25}
          color={'#fff'}
        />
        <View
          style={{
            position: 'absolute',
            top: -10,
            right: 1,
            // height: 20,
            // width: 20,
            backgroundColor: '#cc0001',
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
          }}>
          <Text style={{color: 'white', fontSize: 10}}>14</Text>
        </View>
      </TouchableOpacity>
    </View>
  ),
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
        HeaderWithRightButtons(
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
      name="TableCart"
      component={TableCart}
      options={({navigation, route}) => {
        const title =
          route.params && route.params.title
            ? route.params.title
            : 'Table Cart';
        return HeaderWithRightButtons(
          {
            title,
            showTitle: true,
            showBackButton: true,
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
        return HeaderWithRightButtons(
          {
            title,
            showTitle: true,
            showBackButton: true,
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
        return HeaderWithRightButtons(
          {
            title,
            showTitle: true,
            showBackButton: true,
          },
          navigation,
        );
      }}
    />
    <Stack.Screen
      name="Payment"
      component={Payment}
      options={({navigation}) =>
        HeaderWithRightButtons(
          {
            title: 'Payment',
            showTitle: true,
            showBackButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="TerminalConnection"
      component={TerminalConnection}
      options={({navigation}) =>
        HeaderWithRightButtons(
          {
            title: 'Terminal Connection',
            showTitle: true,
            showBackButton: true,
          },
          navigation,
        )
      }
    />
    <Stack.Screen
      name="Reservations"
      component={Reservations}
      options={({navigation}) =>
        HeaderWithRightButtons(
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
      name="OrderSummary"
      component={OrderSummary}
      options={({navigation}) =>
        HeaderWithRightButtons(
          {
            title: 'Order Summary',
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
