import React, {useEffect, useState} from 'react';
import {View, Text, Keyboard, Modal, ToastAndroid} from 'react-native';
import Button from '../Components/Button';
import Ripple from '../Components/Ripple';
import Switcher from '../Components/Switcher';
import Input from '../Components/Input';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  getTableDetails,
  splitByAmount,
  splitEqual,
  makeTransaction,
  adminSendToCustomer,
  adminPay,
} from '../Services/API/APIManager';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';

const Payment = ({navigation, ...props}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  useEffect(() => {
    const {tableId = ''} = props.route.params || {};
    if (tableId) {
      setTableId(tableId);
      fetchTableDetails(tableId);
    }
  }, []);

  const [, dispatch] = useStateValue();
  const [tableId, setTableId] = useState('');
  const [tableDetails, setTableDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [splitByAmountVal, setSplitByAmountVal] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [confirmCashAmount, setConfirmCashAmount] = useState(0);
  const [confirmCashQuantity, setConfirmCashQuantity] = useState(1);
  const [customSplitQuantity, setCustomSplitQuantity] = useState(1);
  const [dialogType, setDialogType] = useState('');

  const fetchTableDetails = async (tableID = tableId) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getTableDetails(tableID);
      if (result.data) {
        const {table} = result.data || {};
        if (table && table.id) {
          navigation.setParams({title: table.name});
          setTableDetails(result.data);
        } else {
          navigation.setParams({title: null});
          setTableDetails('');
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

  const onSplitByAmount = async () => {
    try {
      Keyboard.dismiss();
      if (!(splitByAmountVal && splitByAmountVal > 0)) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: `Please enter split amount.`,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const orderId = transactions[0].order_id;
      const result = await splitByAmount(orderId, {amount: splitByAmountVal});
      if (result) {
        const {order = {}, transactions = []} = result || {};
        if (order && order.id && transactions && transactions.length > 0) {
          setSelected(0);
          setSplitByAmountVal('');
          setTableDetails(result);
          ToastAndroid.show('Split Successfully.', ToastAndroid.LONG);
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

  const onSplitEqual = async (number) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const orderId = transactions[0].order_id;
      const result = await splitEqual(orderId, {number});
      if (result) {
        const {order = {}, transactions = []} = result || {};
        if (order && order.id && transactions && transactions.length > 0) {
          setSelected(0);
          setSplitByAmountVal('');
          setTableDetails(result);
          ToastAndroid.show('Split Successfully.', ToastAndroid.LONG);
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

  const onMakeTransaction = async (amount) => {
    try {
      Keyboard.dismiss();
      if (!(amount && amount > 0)) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: `Please enter payment amount`,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      let transaction_amount = 0;
      if (getPayableAmount() / 100 > amount) {
        transaction_amount = amount;
      } else {
        transaction_amount = getPayableAmount() / 100;
      }
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const transaction =
        transactions &&
        transactions.find((transaction) => transaction.status === 0);
      const result = await makeTransaction(transaction.id, {
        confirmed_amount: transaction_amount,
      });
      if (result) {
        const {model = {}, transactions = [], transactions_paid = false} =
          result || {};
        if (transactions_paid) {
          ToastAndroid.show('Payment success complete.', ToastAndroid.LONG);
          navigation.navigate('Tables');
        } else if (
          model &&
          model.id &&
          transactions &&
          transactions.length > 0
        ) {
          setTableDetails(result);
          ToastAndroid.show('Payment success complete.', ToastAndroid.LONG);
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

  const onPayCash = (item, index) => {
    if (index === 0) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'warn',
          title: 'Confirm Payment',
          message: `Confirm cash payment: ${formatCurrency(item, true)}`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          onConfirmPressed: () => {
            onMakeTransaction(item / 100);
          },
        },
      });
    } else {
      setPaymentAmount('');
      setConfirmCashQuantity(1);
      if (isNaN(item)) {
        setConfirmCashAmount('');
        setDialogType('PayCashCustom');
      } else {
        setConfirmCashAmount(item);
        setDialogType('PayCashFixed');
      }
    }
  };

  const onSplitPayment = async (item) => {
    if (isNaN(item)) {
      setCustomSplitQuantity(1);
      setDialogType('SplitPayment');
    } else {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'warn',
          title: 'Split Payment',
          message: `Confirm split into ${item} equal payments.`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmText: 'Ok',
          cancelText: 'Cancel',
          onConfirmPressed: () => {
            onSplitEqual(item);
          },
        },
      });
    }
  };

  const onPayNow = async (customerName, cardType) => {
    dispatch({
      type: actions.SET_ALERT_SETTINGS,
      alertSettings: {
        show: true,
        type: 'warn',
        title: 'Charging from',
        message: `Customer: ${customerName}\nPayment Type: ${cardType}\nTotal: ${formatCurrency(
          getPayableAmount(),
          true,
        )}`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmText: 'Ok',
        cancelText: 'Cancel',
        onConfirmPressed: () => {
          payNow();
        },
      },
    });
  };

  const payNow = async () => {
    try {
      Keyboard.dismiss();
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const orderId = transactions[0].order_id;
      const result = await adminPay(orderId);
      if (result) {
        const {
          status = '',
          message = '',
          transactions_paid = false,
          order = {},
        } = result || {};
        if (transactions_paid) {
          ToastAndroid.show('Paid Successfully.', ToastAndroid.LONG);
          navigation.navigate('Tables');
        } else if (order && order.id) {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'error',
              title: 'An Error Occured',
              message: 'Please try again later.',
              showConfirmButton: true,
              confirmText: 'Ok',
              onConfirmPressed: () => fetchTableDetails(tableId),
            },
          });
        } else if (status === 401) {
          if (message) {
            dispatch({
              type: actions.SET_ALERT_SETTINGS,
              alertSettings: {
                show: true,
                type: 'error',
                title: 'An Error Occured',
                message: message,
                showConfirmButton: true,
                confirmText: 'Ok',
              },
            });
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
              type: 'success',
              title: 'An Error Occured',
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

  const onSendBill = async () => {
    dispatch({
      type: actions.SET_ALERT_SETTINGS,
      alertSettings: {
        show: true,
        type: 'warn',
        title: 'Confirm',
        showConfirmButton: true,
        showCancelButton: true,
        confirmText: 'Ok',
        cancelText: 'Cancel',
        onConfirmPressed: () => {
          sendBill();
        },
      },
    });
  };

  const sendBill = async () => {
    try {
      Keyboard.dismiss();
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const orderId = transactions[0].order_id;
      const result = await adminSendToCustomer(orderId);
      if (result) {
        const {status = '', message = '', order = {}} = result || {};
        if (order && order.id) {
          ToastAndroid.show('Sent Successfully.', ToastAndroid.LONG);
          fetchTableDetails(tableId);
        } else if (status === 401) {
          if (message) {
            dispatch({
              type: actions.SET_ALERT_SETTINGS,
              alertSettings: {
                show: true,
                type: 'error',
                title: 'An Error Occured',
                message: message,
                showConfirmButton: true,
                confirmText: 'Ok',
              },
            });
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

  const getPayableAmount = () => {
    return transactions.find((transaction) => transaction.status === 0)
      .amount_cents;
  };

  const {
    summary = {},
    transactions = [],
    activeOrder = {},
    orderUserInfo = {},
    orderUserCard = {},
    orderCart = {},
  } = tableDetails || {};

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
        marginHorizontal: '3%',
      }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={dialogType && true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(52,52,52,0.5)',
          }}>
          {dialogType.includes('PayCash') ? (
            <View
              style={{
                height: 200,
                width: '80%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                borderRadius: 5,
                shadowColor: '#e7e7e7',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <Text
                style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>
                Confirm Cash
              </Text>
              {dialogType === 'PayCashFixed' ? (
                <View
                  style={{
                    marginTop: '5%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Ripple
                      style={{
                        elevation: 5,
                        shadowRadius: 2,
                        shadowOpacity: 0.3,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        backgroundColor:
                          confirmCashQuantity === 1 ? '#999' : '#2bae6a',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        marginVertical: 5,
                      }}
                      disabled={confirmCashQuantity === 1}
                      onPress={() => {
                        setConfirmCashQuantity(confirmCashQuantity - 1);
                      }}>
                      <EntypoIcon name="minus" size={25} color="#fff" />
                    </Ripple>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'center',
                        marginVertical: '1.5%',
                        marginHorizontal: '8%',
                        fontSize: 18,
                      }}>
                      {confirmCashQuantity}
                    </Text>
                    <Ripple
                      style={{
                        elevation: 5,
                        shadowRadius: 2,
                        shadowOpacity: 0.3,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        backgroundColor: '#2bae6a',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        marginVertical: 5,
                      }}
                      onPress={() =>
                        setConfirmCashQuantity(confirmCashQuantity + 1)
                      }>
                      <EntypoIcon name="plus" size={25} color="#fff" />
                    </Ripple>
                  </View>
                  <Text style={{fontSize: 18}}>
                    {formatCurrency(
                      confirmCashAmount * confirmCashQuantity,
                      true,
                    )}
                  </Text>
                </View>
              ) : (
                <Input
                  label="Payment Amount"
                  value={paymentAmount}
                  onChangeText={(val) => setPaymentAmount(val)}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '5%',
                }}>
                <Text style={{fontSize: 18}}>Change</Text>
                <Text style={{fontSize: 18}}>
                  {dialogType === 'PayCashFixed'
                    ? getPayableAmount() -
                        confirmCashAmount * confirmCashQuantity <
                      0
                      ? formatCurrency(
                          confirmCashAmount * confirmCashQuantity -
                            getPayableAmount(),
                          true,
                        )
                      : 0
                    : getPayableAmount() / 100 - parseInt(paymentAmount) < 0
                    ? formatCurrency(
                        parseInt(paymentAmount) - getPayableAmount() / 100,
                      )
                    : 0}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '10%',
                  justifyContent: 'flex-end',
                }}>
                <Ripple
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 5,
                    backgroundColor: '#ed3237',
                  }}
                  onPress={() => setDialogType('')}>
                  <Text style={{color: '#fff', fontSize: 15}}>Cancel</Text>
                </Ripple>
                <Ripple
                  style={{
                    marginLeft: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 5,
                    backgroundColor: '#27ae61',
                  }}
                  onPress={() => {
                    const paymentType = dialogType;
                    setDialogType('');
                    if (paymentType === 'PayCashFixed') {
                      onMakeTransaction(
                        (confirmCashAmount * confirmCashQuantity) / 100,
                      );
                    } else {
                      onMakeTransaction(paymentAmount);
                    }
                  }}>
                  <Text style={{color: '#fff', fontSize: 15}}>Confirm</Text>
                </Ripple>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: 150,
                width: '80%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                borderRadius: 5,
                shadowColor: '#e7e7e7',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
              <Text
                style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>
                Custom Split
              </Text>
              <View
                style={{
                  marginTop: '5%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ripple
                  style={{
                    elevation: 5,
                    shadowRadius: 2,
                    shadowOpacity: 0.3,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    backgroundColor:
                      customSplitQuantity === 1 ? '#999' : '#2bae6a',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    marginVertical: 5,
                  }}
                  disabled={customSplitQuantity === 1}
                  onPress={() => {
                    setCustomSplitQuantity(customSplitQuantity - 1);
                  }}>
                  <EntypoIcon name="minus" size={25} color="#fff" />
                </Ripple>
                <Text
                  style={{
                    color: '#000',
                    textAlign: 'center',
                    marginVertical: '1.5%',
                    marginHorizontal: '5%',
                    fontSize: 18,
                  }}>
                  {customSplitQuantity}
                </Text>
                <Ripple
                  style={{
                    elevation: 5,
                    shadowRadius: 2,
                    shadowOpacity: 0.3,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    backgroundColor: '#2bae6a',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    marginVertical: 5,
                  }}
                  onPress={() =>
                    setCustomSplitQuantity(customSplitQuantity + 1)
                  }>
                  <EntypoIcon name="plus" size={25} color="#fff" />
                </Ripple>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '4%',
                  justifyContent: 'flex-end',
                }}>
                <Ripple
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 5,
                    backgroundColor: '#ed3237',
                  }}
                  onPress={() => setDialogType('')}>
                  <Text style={{color: '#fff', fontSize: 15}}>Cancel</Text>
                </Ripple>
                <Ripple
                  style={{
                    marginLeft: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 5,
                    backgroundColor: '#27ae61',
                  }}
                  onPress={() => {
                    setDialogType('');
                    onSplitEqual(customSplitQuantity);
                  }}>
                  <Text style={{color: '#fff', fontSize: 15}}>Confirm</Text>
                </Ripple>
              </View>
            </View>
          )}
        </View>
      </Modal>
      {summary && summary.subtotal ? (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
              }}
              numberOfLines={1}>
              {formatCurrency(getPayableAmount(), true)}
            </Text>
            <Text numberOfLines={1} style={{fontSize: 16}}>
              {`Out of ${formatCurrency(
                summary.subtotal,
                true,
              )} Total. Payment ${
                transactions &&
                transactions.findIndex(
                  (transaction) => transaction.status === 0,
                ) + 1
              } of ${transactions && transactions.length}`}
            </Text>
            {transactions &&
            transactions.some(
              (transaction) => transaction.status === 1,
            ) ? null : (
              <Switcher
                options={[
                  {title: 'Pay by Card/Cash'},
                  {title: 'Split Payment'},
                ]}
                selected={selected}
                onChange={(val) => setSelected(val)}
              />
            )}
            {selected === 0 ? (
              <View style={{width: '100%'}}>
                <View style={{marginTop: '3%'}}>
                  <Text style={{fontSize: 18}}>Card</Text>
                  <Button
                    title="Terminal #Unknown"
                    loading={loading}
                    onPress={() => navigation.navigate('TerminalConnection')}
                    height={40}
                  />
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={{fontSize: 18}}>Cash</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {[
                      getPayableAmount(),
                      2000000,
                      5000000,
                      10000000,
                      'Custom',
                    ].map((item, index) => (
                      <Ripple
                        key={index}
                        style={{
                          elevation: 5,
                          shadowRadius: 2,
                          shadowOpacity: 0.3,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          backgroundColor: '#2bae6a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          marginVertical: 5,
                          marginRight: 5,
                        }}
                        onPress={() => onPayCash(item, index)}>
                        <Text style={{color: '#fff', fontSize: 18}}>
                          {isNaN(item) ? item : formatCurrency(item, true)}
                        </Text>
                      </Ripple>
                    ))}
                  </View>
                </View>
                {!(
                  (activeOrder &&
                    parseInt(activeOrder.type) === 6 &&
                    orderCart &&
                    parseInt(orderCart.status) === 1) ||
                  (orderUserCard &&
                    orderUserCard.type &&
                    orderUserCard.type.toLowerCase() === 'onepay')
                ) ? (
                  <>
                    {orderUserInfo &&
                    orderUserInfo.uid &&
                    orderUserCard &&
                    orderUserCard.id ? (
                      <View style={{marginTop: '3%'}}>
                        <Text style={{fontSize: 18}}>{`User: ${
                          orderUserInfo.first_name
                            ? orderUserInfo.first_name
                            : ''
                        } ${
                          orderUserInfo.last_name ? orderUserInfo.last_name : ''
                        }, Card: ${
                          orderUserCard.type ? orderUserCard.type : ''
                        }`}</Text>
                        {activeOrder ? (
                          parseInt(activeOrder.type) === 4 ? (
                            <Button
                              title="Pay Now"
                              onPress={() =>
                                onPayNow(
                                  `${orderUserInfo.first_name} ${orderUserInfo.last_name}`,
                                  orderUserCard.type,
                                )
                              }
                              loading={loading}
                              height={40}
                            />
                          ) : (
                            <Button
                              title="Send Bill"
                              onPress={onSendBill}
                              loading={loading}
                              height={40}
                            />
                          )
                        ) : null}
                      </View>
                    ) : null}
                  </>
                ) : null}
              </View>
            ) : (
              <View style={{width: '100%'}}>
                <View style={{marginTop: '5%'}}>
                  <Input
                    label="Split by amount"
                    value={splitByAmountVal}
                    onChangeText={(val) => setSplitByAmountVal(val)}
                  />
                  <Button
                    title="Continue"
                    loading={loading}
                    onPress={onSplitByAmount}
                    height={40}
                  />
                </View>
                <Text
                  style={{
                    marginVertical: '3%',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  OR
                </Text>
                <View>
                  <Text style={{fontSize: 16}}>
                    Split into equal payments (two or more)
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {[2, 3, 4, 5, 'Custom'].map((item, index) => (
                      <Ripple
                        key={index}
                        style={{
                          elevation: 5,
                          shadowRadius: 2,
                          shadowOpacity: 0.3,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          backgroundColor: '#2bae6a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          marginVertical: 5,
                          marginRight: 5,
                        }}
                        onPress={() => onSplitPayment(item)}>
                        <Text style={{color: '#fff', fontSize: 18}}>
                          {item}
                        </Text>
                      </Ripple>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
};

export default Payment;
