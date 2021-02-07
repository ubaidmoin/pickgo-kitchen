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
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
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
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
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
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
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

  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const addItems = () =>
    navigation.navigate('AddToCart', {table: tableDetails.table});

  const onDeleteCartItem = async (cartItem) => {
    dispatch({
      type: actions.SET_ALERT_SETTINGS,
      alertSettings: {
        show: true,
        type: 'warn',
        title: 'Remove Cart Item',
        message: `Do you really want to remove ${cartItem.menu_name} from cart?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmText: 'Ok',
        cancelText: 'Cancel',
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
            'Menu item deleted successfully.',
            ToastAndroid.LONG,
          );
          refreshScreen();
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
            },
          });
        }
      } else {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'error',
            title: 'An Error Occured',
            message: 'Please try again later.',
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
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
            'Order sent to kitchen successfully.',
            ToastAndroid.LONG,
          );
          refreshScreen();
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
            },
          });
        }
      } else {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'error',
            title: 'An Error Occured',
            message: 'Please try again later.',
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
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
            title: `Field Required`,
            message: 'Please enter amount',
            showConfirmButton: true,
            confirmText: 'Ok',
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
            message ? message : 'Custom Amount is added to order successfully.',
            ToastAndroid.LONG,
          );
          refreshScreen(tableId);
        } else {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
            },
          });
        }
      } else {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'error',
            title: 'An Error Occured',
            message: 'Please try again later.',
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
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

  const {summary = {}, cartItems = []} = tableDetails || {};

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
            label="Enter Amount"
            keyboardType="phone-pad"
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={{width: '18%', marginLeft: '2%'}}>
          <Button title="Add" onPress={onAddAmount} height={40} />
        </View>
        <View style={{width: '15%'}}>
          <Text style={{textAlign: 'center'}}>OR</Text>
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
                <View
                  key={item.id}
                  style={{
                    shadowColor: '#cc0001',
                    backgroundColor: '#fff',
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    shadowOffset: {
                      height: 5,
                      width: 2,
                    },
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
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: '13%',
                      alignItems: 'center',
                      color: '#767676',
                    }}>
                    <Text style={{fontSize: 18}}>{`x ${item.qty}`}</Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      paddingLeft: '3%',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#767676',
                      }}>
                      {item.menu_name}
                    </Text>
                    {item.options && item.options.length > 0
                      ? item.options.map((item) => (
                          <View key={item.id} style={{flexDirection: 'row'}}>
                            <FontAwesomeIcon
                              size={8}
                              name="circle-o"
                              color="#979797"
                              style={{marginTop: '4%'}}
                            />
                            <Text
                              style={{
                                marginLeft: '3%',
                                fontSize: 15,
                                color: '#979797',
                              }}>
                              {`${
                                item.menu_option_item_name
                              }  (+ ${formatCurrency(
                                item.price,
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
                      style={{color: '#767676', fontSize: 18}}
                      numberOfLines={1}>
                      {formatCurrency(item.total_amount)}
                    </Text>
                  </View>
                  <Ripple
                    style={{width: '10%', alignItems: 'center'}}
                    onPress={() => onDeleteCartItem(item)}>
                    <MaterialIcon
                      name="delete-forever"
                      size={25}
                      color="#000"
                    />
                  </Ripple>
                </View>
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
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                    width: 2,
                  },
                  elevation: 5,
                  padding: '3%',
                  borderRadius: 5,
                }}>
                <Text style={styles.header}>Summary</Text>
                <View style={styles.row}>
                  <Text style={styles.rowText}>Subtotal</Text>
                  <Text style={styles.rowText}>
                    {formatCurrency(summary.subtotal, true)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{...styles.rowText, color: '#f00'}}>
                    Credits Discounted
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
                  <Text style={styles.rowText}>New Subtotal</Text>
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
                  <Text style={{...styles.rowText, color: '#27ae61'}}>Tax</Text>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {`+ ${formatCurrency(summary.tax, true)}`}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    Tips
                  </Text>
                  <Text style={{...styles.rowText, color: '#27ae61'}}>
                    {`+ ${formatCurrency(summary.tips, true)}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={{...styles.row}}>
                  <Text style={styles.rowText}>Order Total</Text>
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
                title="Send"
                loading={loading}
                onPress={onSendToKitchen}
                height={45}
              />
            </View>
            <View style={{width: '49%'}}>
              <Button
                title="Make Payment"
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
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 16,
    color: '#000',
  },
  divider: {
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#767676',
  },
});
