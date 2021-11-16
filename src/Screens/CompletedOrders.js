import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ripple from '../Components/Ripple';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import CustomActivityIndicator from '../Components/ActivityIndicator';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  getOrdersCookedDelivered,
  getOrdersCookedDeliveredPagination,
  getOrdersNewCooking,
  updateOrderStatus,
} from '../Services/API/APIManager';

const {AlanManager, AlanEventEmitter} = NativeModules;
const alanEventEmitter = new NativeEventEmitter(AlanEventEmitter);

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

const Orders = (props) => {
  const {navigation} = props;
  let flatlist = useRef();
  let bottomflatlist = useRef();
  const isFocused = useIsFocused();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const indexRef = useRef(currentIndex);
  const orderRef = useRef(orders);
  const loadingRef = useRef(false);
  const [page, setPage] = useState(1);
  const [footerLoader, setFooterLoader] = useState(false);

  const fetchOrders = async (index = 0) => {
    setLoading(true);
    const res = await getOrdersCookedDeliveredPagination(0, 10);
    console.log('getOrdersCookedDelivered', res.data);
    if (res && res.data && res.data.orders) {
      setOrders(res.data.orders);
      indexRef.current = index;
      orderRef.current = res.data.orders;
    }
    setLoading(false);
  };

  const renderSearchResultsFooter = () => {
    return (
      <View style={{marginTop: 15, alignItems: 'center'}}>
        {footerLoader ? <ActivityIndicator size="large" color="#000" /> : null}
      </View>
    );
  };

  const getMoreOrders = async () => {
    console.log('hererere');
    setFooterLoader(true);
    const res = await getOrdersCookedDeliveredPagination(page + 1, 10);
    if (res && res.data) {
      setPage(page + 1);
      const itemsData = res.data.orders;
      const newData = [...orders, ...itemsData];
      setOrders(newData);
      orderRef.current = newData;
    }
    setFooterLoader(false);
  };

  const handleUpdateOrderStatus = async (status, orderId = 0) => {
    if (orderRef.current && !loadingRef.current) {
      loadingRef.current = true;
      setLoading(true);
      const data = {
        status: status,
      };
      // console.log('completed orders', currentIndex, orders[currentIndex], orders);
      await updateOrderStatus(
        orderId ? orderId : orderRef.current[indexRef.current].id,
        data,
      );
      loadingRef.current = false;
      fetchOrders(indexRef.current);
    }
  };

  useEffect(() => {
    // const subscription = alanEventEmitter.addListener(
    //   'command',
    //   ({command}) => {
    //     console.log(`got command event 123 ${command}`);
    //     if (command === 'updateStatusToCooking') {
    //       handleUpdateOrderStatus(2);
    //     } else if (command === 'updateStatusToCooked') {
    //       handleUpdateOrderStatus(3);
    //     } else if (command === 'updateStatusToDelivering') {
    //       handleUpdateOrderStatus(4);
    //     } else if (command === 'updateReopen') {
    //       handleUpdateOrderStatus(2);
    //     } else if (command === 'takeToOrders') {
    //       navigation.navigate('Orders');
    //     } else if (command === 'skipToNext') {
    //       console.log('here')
    //       if (flatlist) {
    //         if (currentIndex < orders.length - 1) {
    //           flatlist.current?.scrollToIndex({index: currentIndex + 1});
    //           bottomflatlist.current?.scrollToIndex({index: currentIndex + 1});
    //           indexRef.current = currentIndex + 1;
    //           setCurrentIndex(currentIndex + 1);
    //         }
    //       }
    //     } else if (command === 'skipToBack') {
    //       if (flatlist) {
    //         if (currentIndex > 0) {
    //           flatlist.current?.scrollToIndex({index: currentIndex - 1});
    //           bottomflatlist.current?.scrollToIndex({index: currentIndex - 1});
    //           indexRef.current = currentIndex - 1;
    //           setCurrentIndex(currentIndex - 1);
    //         }
    //       }
    //     }
    //   },
    // );
    // return alanEventEmitter.removeAllListeners(subscription);
  }, [orders, currentIndex, orderRef, indexRef]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [props, isFocused]);

  useEffect(() => {
    if (currentIndex > -1 && trigger) {
      setTrigger(false);
      flatlist.current?.scrollToIndex({index: currentIndex});
    }
  }, [currentIndex, trigger]);

  const onScrollEnd = (e) => {
    let pageNumber = Math.min(
      Math.max(
        Math.floor(
          e.nativeEvent.contentOffset.x / Dimensions.get('screen').width + 0.5,
        ) + 1,
        0,
      ),
      orders.length,
    );
    indexRef.current = pageNumber - 1;
    setCurrentIndex(pageNumber - 1);
    bottomflatlist.current?.scrollToIndex({index: pageNumber - 1});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <AlanView
        projectid={
          'e7c97f0d534667f4e24c8515b4cd6afc2e956eca572e1d8b807a3e2338fdd0dc/stage'
        }
        authData={{data: 'your auth data if needed'}}
      /> */}
      {loading && <CustomActivityIndicator visible={loading} />}
      {orders.length === 0 && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
          <Text>No orders found.</Text>
        </View>
      )}
      <FlatList
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
        horizontal
        initialNumToRender={100}
        ref={flatlist}
        onMomentumScrollEnd={onScrollEnd}
        snapToAlignment={'top'}
        viewabilityConfig={{itemVisiblePercentThreshold: 90}}
        pagingEnabled={true}
        decelerationRate={'fast'}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `${item + Math.random()}`}
        data={
          orders &&
          orders.length > 0 &&
          orders.filter((o) => o.items && o.items.length > 0)
        }
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 700));
          wait.then(() => {
            // flatlist.current?.scrollToIndex({index: info.index});
            flatlist.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        renderItem={({item: order, index}) => (
          <ScrollView
            key={`${order + Math.random()}`}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              width: Dimensions.get('screen').width,
              height: '85%',
            }}>
            <View style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        order.status === 1
                          ? '#fe0000' //Red
                          : order.status === 4
                          ? '#FF5733' //Blue
                          : order.status === 2
                          ? '#2b78e4'
                          : '#27ae61', //Green,
                      borderRadius: 80,
                      padding: 5,
                      height: 40,
                      width: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => navigation.toggleDrawer()}>
                    <FeatherIcon name="menu" size={25} color={'#fff'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: normalize(16),
                      fontWeight: 'bold',
                      marginLeft: 15,
                      color:
                        order.status === 1
                          ? '#fe0000' //Red
                          : order.status === 4
                          ? '#FF5733' //Blue
                          : order.status === 2
                          ? '#2b78e4'
                          : '#27ae61', //Green
                    }}>{`Order: #${order.id}`}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontSize: normalize(16),
                      fontWeight: 'bold',
                    }}>{`Table: ${order.table_name}`}</Text>
                  <Text
                    style={{
                      fontSize: normalize(16),
                      fontWeight: 'bold',
                    }}>{`Time: ${moment(order.date_created).format(
                    'HH:mm',
                  )}`}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.lineDividerTop,
                paddingHorizontal: 15,
                marginBottom: 10,
              }}>
              {order.items &&
                order.items.map((item) => (
                  <View key={item.id}>
                    <View style={styles.menuLineView}>
                      <View>
                        <Text
                          style={{
                            fontSize: normalize(15),
                            fontWeight: 'bold',
                            width: '75%',
                          }}>
                          X{item.qty} {item.menu_name}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                          }}>
                          {item.amount}
                        </Text>
                      </View>
                    </View>
                    {item.options &&
                      item.options.map((option) => (
                        <Text
                          key={option.id}
                          style={{
                            fontSize: normalize(16),
                            marginLeft: 30,
                            color: '#888888',
                          }}>
                          {option.menu_option_item_name} - {option.price}
                        </Text>
                      ))}
                    {item.notes !== null && (
                      <Text
                        style={{
                          marginLeft: 30,
                          color: '#888888',
                          fontSize: normalize(16),
                        }}>
                        {item.notes}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: 'bold',
                }}>{`${order.customer_name}`}</Text>
              <TouchableOpacity
                // disabled={moment(order.date_created) < moment(new Date())}
                onPress={() =>
                  order.status === 1
                    ? handleUpdateOrderStatus(2, order.id)
                    : order.status === 2
                    ? handleUpdateOrderStatus(3, order.id)
                    : order.status === 3
                    ? handleUpdateOrderStatus(4, order.id)
                    : handleUpdateOrderStatus(1, order.id)
                }>
                <Text
                  style={{
                    fontSize: normalize(15),
                    fontWeight: 'bold',
                    color:
                      order.status === 1
                        ? '#fe0000' //Red
                        : order.status === 4
                        ? '#FF5733' //Blue
                        : order.status === 2
                        ? '#2b78e4'
                        : '#27ae61', //Green
                  }}>{`Status: ${
                  // moment(order.date_created) < moment(new Date())
                  //   ? 'Closed Shift'
                  //   :
                  order.status === 1
                    ? 'New' //Red
                    : order.status === 2
                    ? 'Cooking' //Blue
                    : order.status === 3
                    ? 'Cooked'
                    : 'Delivering'
                }`}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        // numColumns={2}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // paddingHorizontal: 25,
        }}>
        <TouchableOpacity
          style={styles.bottomButton}
          disabled={currentIndex === 0}
          onPress={() => {
            flatlist.current?.scrollToIndex({index: currentIndex - 1});
            bottomflatlist.current?.scrollToIndex({index: currentIndex - 1});
            indexRef.current = currentIndex - 1;
            setCurrentIndex(currentIndex - 1);
          }}>
          <AntDesign color="#27ae61" size={30} name="leftcircle" />
          {/* <Text style={{color: '#27ae61', fontWeight: 'bold'}}>
                  Previous
                </Text> */}
        </TouchableOpacity>
        {Platform.OS !== 'windows' && (
          <FlatList
            style={styles.flatlist}
            horizontal
            ref={(ref) => (bottomflatlist = ref)}
            showsVerticalScrollIndicator={false}
            data={
              orders &&
              orders.length > 0 &&
              orders.filter((o) => o.items && o.items.length > 0)
            }
            keyExtractor={(item) => `${item.id}`}
            onEndReachedThreshold={0.1}
            onEndReached={getMoreOrders}
            ListFooterComponent={renderSearchResultsFooter}
            renderItem={({item, index}) => (
              <Ripple
                onPress={() => {
                  indexRef.current = index;
                  setCurrentIndex(index);
                  setTrigger(true);
                }}
                key={`${item.id}`}
                style={{
                  ...styles.item,
                  borderWidth: currentIndex === index ? 5 : 0,
                  borderColor:
                    item.status === 1
                      ? '#760000' //Red
                      : item.status === 4
                      ? '#701D00' //Blue
                      : item.status === 2
                      ? '#003783'
                      : '#007030', //Green,
                  backgroundColor:
                    item.status === 1
                      ? '#E43030' //Red
                      : item.status === 4
                      ? '#FF5733' //Blue
                      : item.status === 2
                      ? '#2b78e4'
                      : '#27ae61', //Green
                }}>
                <Text style={styles.itemTitle}>{`#${item.id}`}</Text>
              </Ripple>
            )}
            // numColumns={2}
          />
        )}
        <TouchableOpacity
          style={styles.bottomButton}
          disabled={!(currentIndex < orders.length - 1)}
          onPress={() => {
            flatlist.current?.scrollToIndex({index: currentIndex + 1});
            bottomflatlist.current?.scrollToIndex({index: currentIndex + 1});
            indexRef.current = currentIndex + 1;
            setCurrentIndex(currentIndex + 1);
          }}>
          <AntDesign color="#27ae61" size={30} name="rightcircle" />
          {/* <Text style={{color: '#27ae61', fontWeight: 'bold'}}>Next</Text> */}
        </TouchableOpacity>
      </View>
      {/* <AlanView
        projectid={
          'e7c97f0d534667f4e24c8515b4cd6afc2e956eca572e1d8b807a3e2338fdd0dc/stage'
        }
        authData={{data: 'your auth data if needed'}}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {Platform.OS !== 'windows' && selectedOrder && (
          <ScrollView
            style={{
              flex: 1,
              padding: 10,
              paddingHorizontal: 30,
              width: '100%',
            }}>
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
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                    color:
                      selectedOrder.status === 1
                        ? '#fe0000' //Red
                        : selectedOrder.status === 4
                        ? '#2b78e4' //Blue
                        : selectedOrder.status === 2
                        ? '#FF5733'
                        : '#27ae61', //Green
                  }}>{`Order: #${selectedOrder.id}`}</Text>
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                  }}>{`Table: ${selectedOrder.tbl_id}`}</Text>
              </View>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                }}>{`Time: ${moment(selectedOrder.date_created).format(
                'HH:mm',
              )}`}</Text>
            </View>
            <View style={{...styles.lineDividerTop, paddingHorizontal: 15}}>
              {selectedOrder.items &&
                selectedOrder.items.map((item) => (
                  <View key={item.id}>
                    <View style={styles.menuLineView}>
                      <View>
                        <Text
                          style={{fontSize: normalize(16), fontWeight: 'bold'}}>
                          X{item.qty} {item.menu_name}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{fontSize: normalize(16), fontWeight: 'bold'}}>
                          {item.amount}
                        </Text>
                      </View>
                    </View>
                    {item.options &&
                      item.options.map((option) => (
                        <Text
                          key={option.id}
                          style={{
                            fontSize: normalize(16),
                            marginLeft: 30,
                            color: '#888888',
                          }}>
                          {option.menu_option_name} - {option.price}
                        </Text>
                      ))}
                    {item.notes !== null && (
                      <Text
                        style={{
                          marginLeft: 30,
                          color: '#888888',
                          fontSize: normalize(16),
                        }}>
                        {item.notes}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: 'bold',
                }}>{`Customer: ${selectedOrder.customer_name}`}</Text>
              <Text
                style={{
                  fontSize: normalize(15),
                  fontWeight: 'bold',
                  color:
                    selectedOrder.status === 1
                      ? '#fe0000' //Red
                      : selectedOrder.status === 4
                      ? '#2b78e4' //Blue
                      : selectedOrder.status === 2
                      ? '#FF5733'
                      : '#27ae61', //Green
                }}>{`Status: ${
                selectedOrder.status === 1
                  ? 'New' //Red
                  : selectedOrder.status === 2
                  ? 'Cooking' //Blue
                  : selectedOrder.status === 3
                  ? 'Cooked'
                  : 'Delivering'
              }`}</Text>
            </View>
          </ScrollView>
        )}
        {Platform.OS !== 'windows' && (
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
                    item.status === 1
                      ? '#fe0000' //Red
                      : item.status === 4
                      ? '#2b78e4' //Blue
                      : item.status === 2
                      ? '#FF5733'
                      : '#27ae61', //Green
                }}>
                <Text style={styles.itemTitle}>{`#${item.id}`}</Text>
              </Ripple>
            )}
            // numColumns={2}
          />
        )}
        {Platform.OS === 'windows' && (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{height: '100%', width: '20%'}}>
              <FlatList
                style={styles.flatlistTablet}
                showsVerticalScrollIndicator={false}
                data={orders}
                // refreshControl={
                //   <RefreshControl refreshing={loading} onRefresh={fetchTables} />
                // }
                renderItem={({item}) => (
                  <Ripple
                    onPress={() => selectTableItem(item)}
                    key={item.id}
                    style={{
                      ...styles.itemTablet,
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
            <View
              style={{
                height: '100%',
                width: '80%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{height: '100%', width: '50%'}}>
                {selectedLeft && (
                  <ScrollView
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingHorizontal: 30,
                      width: '100%',
                    }}>
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
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            color:
                              selectedLeft.status === 'New'
                                ? '#fe0000' //Red
                                : selectedLeft.status === 'Delivering'
                                ? '#2b78e4' //Blue
                                : '#27ae61', //Green
                          }}>{`Order: #${selectedLeft.id}`}</Text>
                        <Text
                          style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                          }}>{`Table: ${selectedLeft.id}`}</Text>
                      </View>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                        }}>{`Time: ${selectedLeft.time}`}</Text>
                    </View>
                    <View
                      style={{...styles.lineDividerTop, paddingHorizontal: 15}}>
                      {selectedLeft.items &&
                        selectedLeft.items.map((item) => (
                          <View key={item.id}>
                            <View style={styles.menuLineView}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                  }}>
                                  X{item.quantity} {item.name}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                  }}>
                                  {item.amount}
                                </Text>
                              </View>
                            </View>
                            {item.options &&
                              item.options.map((option) => (
                                <Text
                                  key={option.id}
                                  style={{
                                    fontSize: normalize(16),
                                    marginLeft: 30,
                                    color: '#888888',
                                  }}>
                                  {option.name} - {option.price}
                                </Text>
                              ))}
                            {item.notes !== null && (
                              <Text
                                style={{
                                  fontSize: normalize(18),
                                  marginLeft: 30,
                                  color: '#888888',
                                }}>
                                {item.notes}
                              </Text>
                            )}
                          </View>
                        ))}
                    </View>
                    <View
                      style={{
                        borderTopWidth: 0.5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                        }}>{`Customer: ${selectedLeft.customerName}`}</Text>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                          color:
                            selectedLeft.status === 'New'
                              ? '#fe0000' //Red
                              : selectedLeft.status === 'Delivering'
                              ? '#2b78e4' //Blue
                              : '#27ae61', //Green
                        }}>{`Status: ${selectedLeft.status}`}</Text>
                    </View>
                  </ScrollView>
                )}
              </View>
              <View style={{height: '100%', width: '50%'}}>
                {selectedRight && (
                  <ScrollView
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingHorizontal: 30,
                      width: '100%',
                    }}>
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
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                          }}>{`Order: #${selectedRight.id}`}</Text>
                        <Text
                          style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                          }}>{`Table: ${selectedRight.id}`}</Text>
                      </View>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                        }}>{`Time: ${selectedRight.time}`}</Text>
                    </View>
                    <View
                      style={{...styles.lineDividerTop, paddingHorizontal: 15}}>
                      {selectedRight.items &&
                        selectedRight.items.map((item) => (
                          <View key={item.id}>
                            <View style={styles.menuLineView}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                  }}>
                                  X{item.quantity} {item.name}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                  }}>
                                  {item.amount}
                                </Text>
                              </View>
                            </View>
                            {item.options &&
                              item.options.map((option) => (
                                <Text
                                  key={option.id}
                                  style={{
                                    fontSize: normalize(16),
                                    marginLeft: 30,
                                    color: '#888888',
                                  }}>
                                  {option.name} - {option.price}
                                </Text>
                              ))}
                            {item.notes !== null && (
                              <Text
                                style={{
                                  fontSize: normalize(16),
                                  marginLeft: 30,
                                  color: '#888888',
                                }}>
                                {item.notes}
                              </Text>
                            )}
                          </View>
                        ))}
                    </View>
                    <View
                      style={{
                        borderTopWidth: 0.5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                        }}>{`Customer: ${selectedRight.customerName}`}</Text>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                        }}>{`Status: ${selectedRight.status}`}</Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        )}
      </View> */}
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  flatlist: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: 100,
    padding: 10,
    width: '100%',
  },
  flatlistTablet: {
    height: '100%',
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
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTablet: {
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    padding: '10%',
    marginVertical: 10,
    // margin: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: normalize(16),
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
    fontSize: normalize(16),
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
  bottomButton: {
    height: 40,
    width: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
