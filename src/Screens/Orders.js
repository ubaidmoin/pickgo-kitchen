import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getTables, saveFcmToken} from '../Services/API/APIManager';
import {
  getNotificationCount,
  addNotification,
  isFcmTokenExists,
  getUserInfo,
} from '../Services/DataManager';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Languages from '../Localization/translations';

const data = [
  {
    id: 1,
    tableId: 3,
    customerName: 'Ubaid',
    time: '5:45',
    status: 'New',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
  {
    id: 2,
    tableId: 5,
    customerName: 'Javed',
    status: 'New',
    time: '5:45',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
  {
    id: 3,
    tableId: 1,
    customerName: 'Ton',
    time: '4:45',
    status: 'Cooking',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
  {
    id: 4,
    tableId: 2,
    customerName: 'Saephan',
    time: '4:50',
    status: 'Cooking',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
  {
    id: 5,
    tableId: 3,
    customerName: 'Ubaid',
    time: '8:45',
    status: 'Delivering',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
  {
    id: 6,
    tableId: 6,
    customerName: 'Javed',
    time: '8:45',
    status: 'Delivering',
    items: [
      {
        name: 'Item 1',
        quantity: 2,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
      {
        name: 'Item 2',
        quantity: 1,
        amount: 1000,
        options: [
          {name: 'Option 1', price: 0},
          {name: 'Option 2', price: 0},
        ],
      },
    ],
  },
];

PushNotification.configure({
  onRegister: async (info) => {
    const userInfo = await getUserInfo();
    if (
      userInfo &&
      userInfo.access_token &&
      userInfo.user &&
      userInfo.user.uid
    ) {
      if (info) {
        const {token} = info || {};
        if (token) {
          if (!(await isFcmTokenExists(token))) {
            const response = await saveFcmToken({token});
            if (!(response && response && response.id)) {
              isFcmTokenExists('');
            }
          }
        }
      }
    }
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const Orders = ({navigation}) => {
  const [orders, setOrders] = useState(data);
  useEffect(() => {
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.foreground && !notification.message) {
          PushNotification.localNotification({
            ...notification,
            message:
              notification.data && notification.data.body
                ? notification.data.body
                : '',
          });
        }
        addNotification({
          ...notification.data,
          time: moment().valueOf(),
          isSeen: false,
        });
        if (
          notification &&
          notification.userInteraction &&
          notification.data &&
          notification.data.type
        ) {
          switch (notification.data.type) {
            case 'pay-by-cash':
              if (notification.data.table_id) {
                navigation.navigate('Payment', {
                  tableId: notification.data.table_id,
                });
              }
              break;
            case 'reservation':
              navigation.navigate('Reservations');
              break;
          }
        }
      },
    });
    fetchTables();
    return navigation.addListener('focus', () => fetchTables());
  }, []);

  const [{tables = [], selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {}, []);

  const fetchTables = async () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    try {
      if (!(tables && tables.length > 0)) {
        dispatch({
          type: actions.SET_PROGRESS_SETTINGS,
          show: true,
        });
        setLoading(true);
      }
      const result = await getTables();
      if (result.data) {
        const {models = []} = result.data || {};
        if (models && models.length > 0) {
          dispatch({
            type: actions.SET_TABLES,
            tables: models,
          });
        } else {
          dispatch({
            type: actions.SET_TABLES,
            tables: [],
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: Languages[selectedLanguage].messages.errorOccured,
          message: Languages[selectedLanguage].messages.tryAgainLater,
          showConfirmButton: true,
          confirmText: Languages[selectedLanguage].messages.ok,
        },
      });
    } finally {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {selectedOrder && (
        <ScrollView
          style={{flex: 1, padding: 10, paddingHorizontal: 30, width: '100%'}}>
          <View style={{padding: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>{`Order: #${selectedOrder.id}`}</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>{`Table: ${selectedOrder.id}`}</Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}>{`Customer: ${selectedOrder.customerName}`}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}>{`Status: ${selectedOrder.status}`}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}>{`Time: ${selectedOrder.time}`}</Text>
          </View>
          <View style={{...styles.lineDividerTop, paddingHorizontal: 15}}>
            {selectedOrder.items &&
              selectedOrder.items.map((item) => (
                <View key={item.id}>
                  <View style={styles.menuLineView}>
                    <View>
                      <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                        X{item.quantity} {item.name}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                        {item.amount}
                      </Text>
                    </View>
                  </View>
                  {item.options &&
                    item.options.map((option) => (
                      <Text
                        key={option.id}
                        style={{marginLeft: 30, color: '#888888'}}>
                        {option.name} - {option.price}
                      </Text>
                    ))}
                  {item.notes !== null && (
                    <Text
                      style={{
                        marginLeft: 30,
                        color: '#888888',
                      }}>
                      {item.notes}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        </ScrollView>
      )}
      <FlatList
        style={styles.flatlist}
        horizontal
        showsVerticalScrollIndicator={false}
        data={orders}
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={fetchTables} />
        // }
        renderItem={({item}) => (
          <Ripple
            onPress={() => setSelectedOrder(item)}
            key={item.id}
            style={{
              ...styles.item,
              backgroundColor:
                item.status === 'New'
                  ? '#fe0000' //Red
                  : item.status === 'Delivering'
                  ? '#2b78e4' //Blue
                  : '#27ae61', //Green
            }}>
            <Text style={styles.itemTitle}>{`#${item.id}`}</Text>
          </Ripple>
        )}
        // numColumns={2}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  flatlist: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 100,
    padding: 10,
    width: '100%',
  },
  item: {
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    padding: '10%',
    // margin: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    paddingTop: 30,
    padding: 15,
  },
  detailView: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
  },
  itemMargin: {marginBottom: 20},
  textInput: {height: 15},
  baseBgColor: {backgroundColor: '#27ae60'},
  header: {
    color: '#27ae60',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  header2: {
    color: '#27ae60',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  centerParagraph: {
    textAlign: 'center',
    marginBottom: 15,
  },
  topViewStyle: {
    flex: 1,
  },

  cameraContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },

  bottomViewStyle: {},

  buttonTouchable: {
    backgroundColor: '#27ae60',
    height: 50,
  },
  buttonViewStyle: {
    padding: 2,
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tipsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -3,
    marginRight: -3,
  },
  tipsViewItem: {
    flexGrow: 1,
    flexShrink: 3,
    flexBasis: 1,
    margin: 3,
  },
  tableRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    margin: 2,
  },
  editPaymentButton: {
    flexGrow: 1,
    flexShrink: 3,
    flexBasis: 1,
    margin: 3,
    marginBottom: 20,
  },
  lineDividerTop: {
    borderTopWidth: 1,
    borderTopColor: '#888888',
    marginTop: 10,
    paddingTop: 10,
  },
  menuLineView: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
