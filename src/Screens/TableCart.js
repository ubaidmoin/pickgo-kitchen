import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Keyboard,
  ToastAndroid,
  PixelRatio,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Button from '../Components/Button';
import Ripple from '../Components/Ripple';
import Input from '../Components/Input';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {
  getTableDetails,
  deleteFromTableCart,
  sendToKitchen,
  addCustomOrderAmount,
  getCustomerDiscount,
} from '../Services/API/APIManager';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

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

const TableCart = ({navigation, ...props}) => {
  useEffect(() => {
    const {tableId = ''} = props.route.params || {};
    if (tableId) {
      setTableId(tableId);
      fetchTableDetails(tableId, true);
    }
    return navigation.addListener('focus', () => {
      refreshScreen(tableId);
    });
  }, []);

  const [tableId, setTableId] = useState('');
  const [tableDetails, setTableDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [discountAmountApplied, setDiscountAmountApplied] = useState(0);
  const [{isWideScreen, selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const refreshScreen = (table_id = tableId) => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    if (table_id) {
      fetchTableDetails(table_id);
    }
  };

  const fetchTableDetails = async (tableID = tableId, isFirstTime = false) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getTableDetails(tableID);
      if (result.data) {
        const {table = {}, cartItems = [], activeOrder = {}} =
          result.data || {};
        if (table && table.id) {
          setTableDetails(result.data);
          navigation.setParams({title: table.name});
          if (isFirstTime && !(cartItems && cartItems.length > 0)) {
            navigation.navigate('AddToCart', {table});
          }
          if (activeOrder && activeOrder.uid && activeOrder.uid > -1) {
            fetchDiscount(activeOrder);
          }
        } else {
          setTableDetails('');
          navigation.setParams({title: null});
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

  const fetchDiscount = async (activeOrder) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      let data = new FormData();
      data.append('customer_id', activeOrder.uid);
      data.append('order_amount', parseInt(activeOrder.subtotal));
      data.append('cid', activeOrder.cid);
      const result = await getCustomerDiscount(data);
      const {success = false, discount_amount_applied = 0} = result || {};
      if (success && discount_amount_applied) {
        setDiscountAmountApplied(parseFloat(discount_amount_applied) * 100);
      } else {
        setDiscountAmountApplied(0);
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

  const addItems = () =>
    navigation.navigate('AddToCart', {table: tableDetails.table});

  const onDeleteCartItem = async (cartItem) => {
    dispatch({
      type: actions.SET_ALERT_SETTINGS,
      alertSettings: {
        show: true,
        type: 'warn',
        title: Languages[selectedLanguage].messages.removeCartItemTitle,
        message: Languages[
          selectedLanguage
        ].messages.removeCartItemMessage.replace(
          '${cartItem.menu_name}',
          cartItem.menu_name,
        ),
        showConfirmButton: true,
        showCancelButton: true,
        confirmText: Languages[selectedLanguage].messages.ok,
        cancelText: Languages[selectedLanguage].messages.cancel,
        onConfirmPressed: () => {
          deleteCartItem(cartItem);
        },
      },
    });
  };

  const deleteCartItem = async (cartItem) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await deleteFromTableCart(cartItem.id);
      if (result.data) {
        const {success = false, model = {}} = result.data || {};
        if (success && model && model.id) {
          ToastAndroid.show(
            Languages[selectedLanguage].messages.menuItemDeleted,
            ToastAndroid.LONG,
          );
          refreshScreen();
        } else {
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
        }
      } else {
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

  const onSendToKitchen = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await sendToKitchen(tableId);
      if (result) {
        const {table = {}, transactions = []} = result || {};
        if (table && table.id && transactions && transactions.length > 0) {
          ToastAndroid.show(
            Languages[selectedLanguage].messages.orderSentToKitchen,
            ToastAndroid.LONG,
          );
          refreshScreen();
        } else {
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
        }
      } else {
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

  const onAddAmount = async () => {
    try {
      Keyboard.dismiss();
      if (!amount) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].messages.fieldRequired,
            message: Languages[selectedLanguage].messages.pleaseEnterAmount,
            showConfirmButton: true,
            confirmText: Languages[selectedLanguage].messages.ok,
          },
        });
        return;
      }
      const {table, activeOrder = {}} = tableDetails || {};
      const {cid, id: table_id} = table || {};
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      let data = new FormData();
      data.append('table_id', table_id);
      data.append('cid', cid);
      data.append('amount', amount);
      data.append('uid', activeOrder && activeOrder.uid ? activeOrder.uid : -1);
      const result = await addCustomOrderAmount(data);
      if (result) {
        const {success, message} = result || {};
        if (success) {
          setAmount('');
          ToastAndroid.show(
            message
              ? message
              : Languages[selectedLanguage].messages.customerAmountAdded,
            ToastAndroid.LONG,
          );
          refreshScreen(tableId);
        } else {
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
        }
      } else {
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

  const {summary = {}, cartItems = [], transactions = []} = tableDetails || {};

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
      }}>
      <View
        style={{
          marginHorizontal: '5%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{width: '50%'}}>
          <Input
            type="number"
            value={amount}
            label={Languages[selectedLanguage].tableCart.enterAmount}
            keyboardType="phone-pad"
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={{width: '18%', marginLeft: '2%'}}>
          <Button
            title={Languages[selectedLanguage].tableCart.add}
            onPress={onAddAmount}
            height={40}
          />
        </View>
        <View style={{width: '15%'}}>
          <Text style={{textAlign: 'center'}}>
            {Languages[selectedLanguage].tableCart.or}
          </Text>
        </View>
        <Ripple
          onPress={addItems}
          style={{
            borderRadius: 25,
            padding: 5,
            backgroundColor: '#2bae6a',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <EntypoIcon name="plus" size={25} color="#fff" />
        </Ripple>
      </View>
      {cartItems && cartItems.length > 0 ? (
        <>
          <ScrollView
            style={{marginTop: '2%'}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchTableDetails}
              />
            }>
            <FlatList
              data={cartItems}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    const newDetails = {...tableDetails};
                    const items = [...cartItems];
                    if (items.length > 0) {
                      const newItem = items.find((i) => i.id === item.id);
                      const itemIndex = items.findIndex(
                        (i) => i.id === item.id,
                      );
                      if (newItem && newItem.clicked) {
                        newItem.clicked = false;
                      } else {
                        newItem.clicked = true;
                      }
                      items[itemIndex] = newItem;
                      newDetails.cartItems = items;
                      setTableDetails(newDetails);
                    }
                  }}
                  style={{
                    backgroundColor: item.clicked ? '#2bae6a' : '#fff',
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    shadowOffset: {width: 0, height: 4},
                    elevation: 5,
                    padding: '3%',
                    marginHorizontal: '5%',
                    marginVertical: '1%',
                    marginBottom:
                      index === cartItems.length - 1
                        ? !(summary && summary.subtotal)
                          ? '18%'
                          : '2%'
                        : '1%',
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: '13%',
                        alignItems: 'center',
                        color: '#000',
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(12),
                          color: item.clicked ? '#fff' : '#000',
                        }}>{`x ${item.qty}`}</Text>
                    </View>
                    <View
                      style={{
                        width: '50%',
                        paddingLeft: '3%',
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(12),
                          fontWeight: 'bold',
                          color: item.clicked ? '#fff' : '#000',
                        }}>
                        {item.menu_name &&
                        item.menu_name
                          .toLowerCase()
                          .includes('custom amount added')
                          ? Languages[selectedLanguage].tableCart
                              .customAmountAdded
                          : item.menu_name}
                      </Text>
                      {item.options && item.options.length > 0
                        ? item.options.map((childItem) => (
                            <View
                              key={childItem.id}
                              style={{flexDirection: 'row'}}>
                              <FontAwesomeIcon
                                size={8}
                                name="circle-o"
                                color={item.clicked ? '#fff' : '#000'}
                                style={{
                                  marginTop: isWideScreen ? '2.5%' : '4%',
                                }}
                              />
                              <Text
                                style={{
                                  marginLeft: '3%',
                                  fontSize: isWideScreen
                                    ? normalize(13)
                                    : normalize(13),
                                  fontWeight: '600',
                                  color: item.clicked ? '#fff' : '#000',
                                }}>
                                {`${
                                  childItem.menu_option_item_name
                                }  (+ ${formatCurrency(
                                  childItem.price,
                                  false,
                                  true,
                                )})`}
                              </Text>
                            </View>
                          ))
                        : null}
                    </View>
                    <View style={{width: '27%', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          color: item.clicked ? '#fff' : '#000',
                          fontWeight: 'bold',
                          fontSize: normalize(12),
                        }}
                        numberOfLines={1}>
                        {formatCurrency(item.total_amount)}
                      </Text>
                    </View>
                    <Ripple
                      style={{width: '13%', alignItems: 'flex-end'}}
                      onPress={() => onDeleteCartItem(item)}>
                      <MaterialIcon
                        name="delete-forever"
                        size={normalize(16)}
                        color="red"
                      />
                    </Ripple>
                  </View>
                  {item.notes ? (
                    <Text
                      style={{
                        fontSize: normalize(12),
                        marginTop: 5,
                        textAlign: 'justify',
                        fontWeight: '600',
                        color: item.clicked ? '#fff' : '#000',
                      }}>
                      {`${Languages[selectedLanguage].tableCart.notes}: ${item.notes}`}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              )}
            />
            {summary && summary.subtotal ? (
              <View
                style={{
                  marginHorizontal: '5%',
                  marginBottom: '18%',
                  marginTop: '5%',
                  backgroundColor: '#fff',
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  shadowOffset: {width: 0, height: 4},
                  elevation: 5,
                  padding: '3%',
                  borderRadius: 5,
                }}>
                <Text style={styles.header}>
                  {Languages[selectedLanguage].tableCart.summary}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.rowText}>
                    {Languages[selectedLanguage].tableCart.subtotal}
                  </Text>
                  <Text style={styles.rowText}>
                    {formatCurrency(summary.subtotal, true)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{...styles.rowText, color: '#f00'}}>
                    {Languages[selectedLanguage].tableCart.creditsDiscounted}
                  </Text>
                  <Text style={{...styles.rowText, color: '#f00'}}>
                    {`- ${formatCurrency(
                      discountAmountApplied
                        ? discountAmountApplied
                        : summary.discount,
                      true,
                    )}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={{...styles.row}}>
                  <Text style={styles.rowText}>
                    {Languages[selectedLanguage].tableCart.newSubtotal}
                  </Text>
                  <Text style={styles.rowText}>
                    {formatCurrency(
                      parseFloat(summary.subtotal) -
                        (discountAmountApplied
                          ? parseFloat(discountAmountApplied)
                          : parseFloat(summary.discount)),
                      true,
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {Languages[selectedLanguage].tableCart.tax}
                  </Text>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {`+ ${formatCurrency(summary.tax, true)}`}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {Languages[selectedLanguage].tableCart.tips}
                  </Text>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {`+ ${formatCurrency(summary.tips, true)}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                {transactions &&
                  transactions.length > 0 &&
                  transactions.length > 1 &&
                  transactions.map((transaction) => (
                    <View style={{...styles.row}} key={transaction.id}>
                      <Text style={styles.rowText}>
                        {transaction.status === 1
                          ? Languages[selectedLanguage].orderSummary.paid
                          : Languages[selectedLanguage].orderSummary.due}
                      </Text>
                      <Text style={styles.rowText}>
                        {formatCurrency(
                          parseFloat(transaction.amount_cents),
                          true,
                        )}
                      </Text>
                    </View>
                  ))}
                <View style={{...styles.row}}>
                  <Text style={styles.rowText}>
                    {Languages[selectedLanguage].tableCart.orderTotal}
                  </Text>
                  <Text style={styles.rowText}>
                    {formatCurrency(
                      parseFloat(summary.subtotal) -
                        (discountAmountApplied
                          ? parseFloat(discountAmountApplied)
                          : parseFloat(summary.discount)) +
                        parseFloat(summary.tax) +
                        parseFloat(summary.tips),
                      true,
                    )}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '5%',
            }}>
            <View style={{width: '49%'}}>
              <Button
                title={Languages[selectedLanguage].tableCart.send}
                loading={loading}
                onPress={onSendToKitchen}
                height={45}
              />
            </View>
            <View style={{width: '49%'}}>
              <Button
                title={Languages[selectedLanguage].tableCart.makePayment}
                disabled={!(summary && summary.subtotal)}
                loading={loading}
                onPress={() => navigation.navigate('Payment', {tableId})}
                height={45}
              />
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
};

export default TableCart;

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: '3%',
    fontSize: normalize(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: normalize(12),
    color: '#000',
  },
  divider: {
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#767676',
  },
});
