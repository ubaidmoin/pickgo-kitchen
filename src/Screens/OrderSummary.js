import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Keyboard} from 'react-native';
import Input from '../Components/Input';
import Button from '../Components/Button';
import Dropdown from '../Components/Dropdown';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {
  acceptOrder,
  getOrderSummary,
  sendOrderRequest,
} from '../Services/API/APIManager';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

const OrderSummary = ({navigation, ...props}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  useEffect(() => {
    const {order} = props.route.params || {};
    if (order && order.c_oid) {
      setOrder(order);
      const {guests_count = '', subtotal = '', tbl_id = ''} = order || {};
      setGuestsCount(guests_count ? guests_count : 0);
      const table = tables.find(
        (table) => parseInt(table.id) === parseInt(tbl_id),
      );
      setTable(table);
      setSubTotal(subtotal);
    }
  }, []);

  const [
    {tables = [], userInfo = {}, selectedLanguage},
    dispatch,
  ] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [table, setTable] = useState(null);
  const [guestsCount, setGuestsCount] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [summary, setSummary] = useState('');

  const onSubmit = async (index) => {
    try {
      Keyboard.dismiss();
      if (!(table && table.id)) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].messages.fieldRequired,
            message: Languages[selectedLanguage].messages.pleaseSelectTable,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      if (!guestsCount) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].messages.fieldRequired,
            message: Languages[selectedLanguage].messages.pleaseEnterGuests,
            showConfirmButton: true,
            confirmText: 'Ok',
          },
        });
        return;
      }
      if (index === 1 && !subTotal) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].messages.fieldRequired,
            message: Languages[selectedLanguage].messages.pleaseEnterSubtotal,
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
      const requestObj = {
        company_id: userInfo.user.company.cid,
        guests_count: guestsCount,
        order_id: order.id,
        subtotal: subTotal,
        table_id: table.id,
      };
      if (index === 0) {
        const result = await acceptOrder(requestObj);
        if (result) {
          const {order_id = '', order: orderInfo = {}} = result || {};
          if (order_id && orderInfo && orderInfo.id) {
            setOrder({...order, ...orderInfo});
            const {guests_count = '', tbl_id = ''} = orderInfo || {};
            setGuestsCount(guests_count ? guests_count : 0);
            const table = tables.find(
              (table) =>
                parseInt(table.id) === parseInt(tbl_id) &&
                !(table.activeOrder && table.activeOrder.id),
            );
            setTable(table);
          }
        }
      } else if (index === 1) {
        const result = await getOrderSummary(requestObj);
        if (result) {
          const {summary = {}} = result || {};
          if (summary && (summary.subtotal || summary.subtotal === 0)) {
            setSummary(summary);
          }
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

  const onOrderRequest = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await sendOrderRequest(order.id);
      console.log('data7: ', result);
      // if (result.data) {
      //   const {order_id = '', order: orderInfo = {}} = result.data || {};
      //   if (order_id && orderInfo && orderInfo.id) {
      //     setOrder({...order, ...orderInfo});
      //     const {guests_count = '', tbl_id = ''} = orderInfo || {};
      //     setGuestsCount(guests_count ? guests_count : 0);
      //     const table = tables.find(
      //       (table) => parseInt(table.id) === parseInt(tbl_id),
      //     );
      //     setTable(table);
      //   }
      // }
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

  const formatCurrency = (value) => {
    return `₭ ${parseFloat(value)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const {
    c_oid = '',
    tbl_id = '',
    type = '',
    guests_count = '',
    table_name = '',
    customer_first_name = '',
    customer_last_name = '',
    subtotal = '0',
    discount = '0',
    tax = '0',
    tips = '0',
  } = order || {};

  return (
    <View style={{flex: 1, marginVertical: '5%', marginHorizontal: '5%'}}>
      {type ? (
        parseInt(type) === 3 ? (
          <View style={{flex: 1}}>
            <Dropdown
              label={Languages[selectedLanguage].orderSummary.selectTable}
              options={tables.filter(
                (item) => !(item.activeOrder && item.activeOrder.id),
              )}
              labelField="name"
              selected={table}
              onSelect={(val) => setTable(val)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '47%'}}>
                <Input
                  label={`${Languages[selectedLanguage].orderSummary.order} #`}
                  value={c_oid}
                  editable={false}
                />
              </View>
              <View style={{width: '47%'}}>
                <Input
                  label={Languages[selectedLanguage].orderSummary.orderStatus}
                  value={
                    tbl_id && parseInt(tbl_id) && parseInt(tbl_id) > 0
                      ? Languages[selectedLanguage].orderSummary.accepted
                      : type && parseInt(type) === 3
                      ? Languages[selectedLanguage].orderSummary.new
                      : Languages[selectedLanguage].orderSummary.unknown
                  }
                  editable={false}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '47%'}}>
                <Input
                  type="number"
                  label={Languages[selectedLanguage].orderSummary.guests}
                  value={guestsCount}
                  keyboardType="phone-pad"
                  onChangeText={(val) => setGuestsCount(val)}
                />
              </View>
              <View style={{width: '47%'}}>
                <Input
                  label={Languages[selectedLanguage].orderSummary.username}
                  editable={
                    !(tbl_id && parseInt(tbl_id) && parseInt(tbl_id) > 0)
                  }
                  value={username}
                  onChangeText={(val) => setUsername(val)}
                />
              </View>
            </View>
            <View style={{width: '100%'}}>
              <Input
                label={Languages[selectedLanguage].orderSummary.phoneNumber}
                editable={!(tbl_id && parseInt(tbl_id) && parseInt(tbl_id) > 0)}
                value={phoneNumber}
                onChangeText={(val) => setPhoneNumber(val)}
              />
            </View>
            {tbl_id && parseInt(tbl_id) && parseInt(tbl_id) > 0 ? (
              <View style={{width: '100%'}}>
                <Input
                  label={Languages[selectedLanguage].orderSummary.subtotal}
                  value={subTotal}
                  onChangeText={(val) => setSubTotal(val)}
                />
              </View>
            ) : null}
            {tbl_id && parseInt(tbl_id) && parseInt(tbl_id) > 0 ? null : (
              // <Button
              //   title={Languages[selectedLanguage].orderSummary.getOrderSummary}
              //   loading={loading}
              //   onPress={() => onSubmit(1)}
              //   height={45}
              // />
              <Button
                title={Languages[selectedLanguage].orderSummary.acceptOrder}
                loading={loading}
                onPress={() => onSubmit(0)}
                height={45}
              />
            )}
            {summary && (summary.subtotal || summary.subtotal === 0) ? (
              <>
                <View
                  style={{
                    marginTop: '5%',
                    width: '100%',
                    backgroundColor: '#fff',
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    shadowOffset: {width: 0, height: 4},
                    elevation: 5,
                    padding: '3%',
                    borderRadius: 5,
                  }}>
                  <View style={styles.row}>
                    <Text style={styles.rowText}>
                      {Languages[selectedLanguage].orderSummary.subtotal}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatCurrency(summary.subtotal)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#f00'}}>
                      {
                        Languages[selectedLanguage].orderSummary
                          .creditsDiscounted
                      }
                    </Text>
                    <Text style={{...styles.rowText, color: '#f00'}}>
                      {`- ${formatCurrency(summary.discount)}`}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Text style={styles.rowText}>
                      {Languages[selectedLanguage].orderSummary.newSubtotal}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatCurrency(
                        parseFloat(summary.subtotal) -
                          parseFloat(summary.discount),
                      )}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {Languages[selectedLanguage].orderSummary.tax}
                    </Text>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {`+ ${formatCurrency(summary.tax)}`}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {Languages[selectedLanguage].orderSummary.tips}
                    </Text>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {`+ ${formatCurrency(summary.tips)}`}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Text style={styles.rowText}>
                      {Languages[selectedLanguage].orderSummary.orderTotal}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatCurrency(
                        parseFloat(summary.subtotal) -
                          parseFloat(summary.discount) +
                          parseFloat(summary.tax) +
                          parseFloat(summary.tips),
                      )}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: '5%'}}>
                  <Button
                    title={Languages[selectedLanguage].orderSummary.sendRequest}
                    loading={loading}
                    onPress={onOrderRequest}
                    height={45}
                  />
                </View>
              </>
            ) : null}
          </View>
        ) : [2, 5, 6, 7].includes(parseInt(type)) ? (
          <View
            style={{
              backgroundColor: '#fff',
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              shadowOffset: {width: 0, height: 4},
              elevation: 5,
              paddingVertical: '5%',
              paddingHorizontal: '4%',
              borderRadius: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <View style={{width: '33.33%'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#a6a5a5',
                  }}>{`${Languages[selectedLanguage].orderSummary.orderCapital} #`}</Text>
                <Text style={{fontSize: 16}}>{c_oid}</Text>
              </View>
              <View style={{width: '66.66%'}}>
                <Text style={{fontSize: 12, color: '#a6a5a5'}}>
                  {Languages[selectedLanguage].orderSummary.customer}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                  }}>{`${customer_first_name ? customer_first_name : ''} ${
                  customer_last_name ? customer_last_name : ''
                }`}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                width: '100%',
              }}>
              <View style={{width: '33.33%'}}>
                <Text style={{fontSize: 12, color: '#a6a5a5'}}>
                  {Languages[selectedLanguage].orderSummary.table}
                </Text>
                <Text style={{fontSize: 16}}>{table_name}</Text>
              </View>
              <View style={{width: '33.33%'}}>
                <Text style={{fontSize: 12, color: '#a6a5a5'}}>
                  {Languages[selectedLanguage].orderSummary.guestsCapital}
                </Text>
                <Text style={{fontSize: 16}}>{guests_count}</Text>
              </View>
              <View style={{width: '33.33%'}}>
                <Text style={{fontSize: 12, color: '#a6a5a5'}}>
                  {Languages[selectedLanguage].orderSummary.status}
                </Text>
                <Text style={{fontSize: 16}}>
                  {Languages[selectedLanguage].orderSummary.paid}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: '8%',
                width: '100%',
                backgroundColor: '#fff',
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                shadowOffset: {width: 0, height: 4},
                elevation: 5,
                padding: '3%',
                borderRadius: 5,
              }}>
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {Languages[selectedLanguage].orderSummary.subtotal}
                </Text>
                <Text style={styles.rowText}>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{...styles.rowText, color: '#f00'}}>
                  {Languages[selectedLanguage].orderSummary.creditsDiscounted}
                </Text>
                <Text style={{...styles.rowText, color: '#f00'}}>
                  {`- ${formatCurrency(discount)}`}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {Languages[selectedLanguage].orderSummary.newSubtotal}
                </Text>
                <Text style={styles.rowText}>
                  {formatCurrency(parseFloat(subtotal) - parseFloat(discount))}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={{...styles.rowText, color: '#27ae61'}}>
                  {Languages[selectedLanguage].orderSummary.tax}
                </Text>
                <Text style={{...styles.rowText, color: '#27ae61'}}>
                  {`+ ${formatCurrency(tax)}`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={{...styles.rowText, color: '#27ae61'}}>
                  {Languages[selectedLanguage].orderSummary.tips}
                </Text>
                <Text style={{...styles.rowText, color: '#27ae61'}}>
                  {`+ ${formatCurrency(tips)}`}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {Languages[selectedLanguage].orderSummary.orderTotal}
                </Text>
                <Text style={styles.rowText}>
                  {formatCurrency(
                    parseFloat(subtotal) -
                      parseFloat(discount) +
                      parseFloat(tax) +
                      parseFloat(tips),
                  )}
                </Text>
              </View>
            </View>
          </View>
        ) : null
      ) : null}
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
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
