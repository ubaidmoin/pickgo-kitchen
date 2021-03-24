import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  View,
  ToastAndroid,
  Keyboard,
  StyleSheet,
} from 'react-native';
import Ripple from '../Components/Ripple';
import Button from '../Components/Button';
import Input from '../Components/Input';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {
  getMenu,
  getTableDetails,
  sendToKitchen,
  deleteFromTableCart,
  addCustomOrderAmount,
  getCustomerDiscount,
} from '../Services/API/APIManager';
import Dropdown from '../Components/Dropdown';
import {formatCurrency} from '../Services/Common';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

const AddToCart = ({navigation, ...props}) => {
  useEffect(() => {
    refreshScreen();
    return navigation.addListener('focus', () => {
      refreshScreen();
    });
  }, []);

  const [menu, setMenu] = useState('');
  const [selectedCompanyHours, setSelectedCompanyHours] = useState('');
  const [menuCourses, setMenuCourses] = useState([]);
  const [selectedMenuCourse, setSelectedMenuCourse] = useState('');
  const [amount, setAmount] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [tableDetails, setTableDetails] = useState('');
  const [discountAmountApplied, setDiscountAmountApplied] = useState(0);
  const [loading, setLoading] = useState(false);
  const [{isWideScreen, selectedLanguage}, dispatch] = useStateValue();

  const refreshScreen = () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    fetchMenu();
    const {table = null} = props.route.params || {};
    if (table && table.id) {
      navigation.setParams({
        title: `${Languages[selectedLanguage].addToCart.addTo} ${table.name}`,
      });
      fetchTableDetails(table.id);
    }
  };

  const fetchTableDetails = async (tableID) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getTableDetails(tableID);
      if (result.data) {
        const {table = {}, activeOrder = {}} = result.data || {};
        if (table && table.id) {
          setTableDetails(result.data);
        }
        if (activeOrder && activeOrder.uid && activeOrder.uid > -1) {
          fetchDiscount(activeOrder);
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

  const fetchMenu = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getMenu();
      if (result.data) {
        const {company = {}, companyHoursToday = []} = result.data || {};
        if (
          company &&
          company.id &&
          companyHoursToday &&
          companyHoursToday.length > 0
        ) {
          setMenu(result.data);
          if (
            companyHoursToday &&
            companyHoursToday.length > 0 &&
            companyHoursToday[0]
          ) {
            const companyHours = companyHoursToday[0];
            setSelectedCompanyHours({
              label: `${companyHours.name} (${Languages[selectedLanguage].addToCart.from} ${companyHours.time_from} ${Languages[selectedLanguage].addToCart.to} ${companyHours.time_to})`,
            });
            const {menuCourses = []} = companyHours || {};
            if (menuCourses && menuCourses.length > 0 && menuCourses[0]) {
              setMenuCourses(menuCourses);
              setSelectedMenuCourse(menuCourses[0]);
            }
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
          refreshScreen();
          setAmount('');
          ToastAndroid.show(
            message
              ? message
              : Languages[selectedLanguage].messages.customerAmountAdded,
            ToastAndroid.LONG,
          );
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
      const result = await sendToKitchen(table.id);
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
          refreshScreen();
          ToastAndroid.show(
            Languages[selectedLanguage].messages.menuItemDeleted,
            ToastAndroid.LONG,
          );
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

  const {companyHoursToday = []} = menu || {};

  const getCompanyHours = () => {
    if (companyHoursToday && companyHoursToday.length > 0) {
      return companyHoursToday.map((item) => ({
        label: `${item.name} (${Languages[selectedLanguage].addToCart.from} ${item.time_from} ${Languages[selectedLanguage].addToCart.to} ${item.time_to})`,
      }));
    } else {
      return [];
    }
  };

  const onSelectCompanyHours = (val, index) => {
    setSelectedMenuCourse('');
    setSelectedCompanyHours(val);
    if (
      companyHoursToday &&
      companyHoursToday.length > 0 &&
      companyHoursToday[index] &&
      companyHoursToday[index].menuCourses &&
      companyHoursToday[index].menuCourses.length > 0
    ) {
      setMenuCourses(companyHoursToday[index].menuCourses);
    } else {
      setMenuCourses([]);
    }
  };

  const {table = {}, summary = {}, cartItems = []} = tableDetails || {};

  return (
    <View style={{flex: 1, paddingTop: '2%', marginHorizontal: '5%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Ripple
          onPress={() => {
            setShowMenu(true);
            setShowMenu(false);
          }}
          style={{
            borderRadius: 10,
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '3%',
          }}>
          <View style={{height: 0, width: 0, opacity: 0}}>
            <Dropdown
              label={Languages[selectedLanguage].messages.selectOne}
              options={getCompanyHours()}
              selected={selectedCompanyHours}
              onSelect={onSelectCompanyHours}
              show={showMenu}
            />
          </View>
          <AntIcon name="clockcircleo" size={20} color="#000" />
          <Text style={{color: '#000', fontSize: 12}}>
            {Languages[selectedLanguage].addToCart.menu}
          </Text>
        </Ripple>
        <View style={{width: '65%', maxWidth: 190}}>
          <Input
            type="number"
            value={amount}
            label={Languages[selectedLanguage].addToCart.enterAmount}
            keyboardType="phone-pad"
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={{marginLeft: '2%', width: '20%', maxWidth: 60}}>
          <Button
            title={Languages[selectedLanguage].addToCart.add}
            onPress={onAddAmount}
            height={40}
          />
        </View>
      </View>
      {isWideScreen ? (
        <View
          style={{
            flexDirection: 'row',
            marginTop: '2%',
            marginBottom: '10%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '30%'}}>
            <FlatList
              data={menuCourses}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <Ripple
                  onPress={() => setSelectedMenuCourse(item)}
                  key={item.id}
                  style={{
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    shadowOffset: {width: 0, height: 4},
                    elevation: 5,
                    padding: 15,
                    marginHorizontal: 5,
                    marginVertical: 10,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      selectedMenuCourse.id === item.id ? '#27ae61' : '#fff',
                  }}>
                  <Text
                    style={{
                      color:
                        selectedMenuCourse.id === item.id ? '#fff' : '#000',
                      fontSize: 18,
                    }}>
                    {item.name}
                  </Text>
                </Ripple>
              )}
            />
          </View>
          <View style={{width: '65%', marginTop: '0.5%'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={
                  selectedMenuCourse &&
                  selectedMenuCourse.menu &&
                  selectedMenuCourse.menu.length > 0
                    ? selectedMenuCourse.menu
                    : []
                }
                renderItem={({item, index}) => (
                  <Ripple
                    onPress={() =>
                      navigation.navigate('AddCartItem', {
                        table,
                        menuItem: item,
                      })
                    }
                    key={item.id}
                    style={{
                      shadowOpacity: 0.3,
                      shadowRadius: 4.65,
                      shadowOffset: {width: 0, height: 4},
                      elevation: 5,
                      padding: 10,
                      marginHorizontal: '1%',
                      marginVertical: '1.5%',
                      borderRadius: 5,
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom:
                        !(cartItems && cartItems.length > 0) &&
                        index === selectedMenuCourse.menu.length - 1
                          ? '12%'
                          : '1.5%',
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontSize: 18,
                        width: '70%',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        alignSelf: 'center',
                        textAlign: 'right',
                        fontSize: 18,
                        width: '30%',
                      }}>
                      {formatCurrency(item.price)}
                    </Text>
                  </Ripple>
                )}
              />
              {cartItems && cartItems.length > 0 ? (
                <>
                  <View style={styles.divider} />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '3%',
                    }}>
                    <EntypoIcon name="chevron-right" size={18} />
                    <Text style={{fontWeight: 'bold'}}>
                      {Languages[selectedLanguage].addToCart.orderDetails}:
                      {table && table.name ? table.name : ''}
                    </Text>
                  </View>
                  <FlatList
                    data={cartItems}
                    renderItem={({item, index}) => (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: '#fff',
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          shadowOffset: {width: 0, height: 4},
                          elevation: 5,
                          padding: '3%',
                          marginHorizontal: '1%',
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
                          style={{alignItems: 'center', flexDirection: 'row'}}>
                          <View
                            style={{
                              width: '13%',
                              alignItems: 'center',
                              color: '#767676',
                            }}>
                            <Text
                              style={{fontSize: 18}}>{`x ${item.qty}`}</Text>
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
                              {item.menu_name &&
                              item.menu_name
                                .toLowerCase()
                                .includes('custom amount added')
                                ? Languages[selectedLanguage].addToCart
                                    .customAmountAdded
                                : item.menu_name}
                            </Text>
                            {item.options && item.options.length > 0
                              ? item.options.map((item) => (
                                  <View
                                    key={item.id}
                                    style={{flexDirection: 'row'}}>
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
                        {item.notes ? (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#979797',
                              marginTop: 5,
                              textAlign: 'justify',
                            }}>
                            {`${Languages[selectedLanguage].addToCart.notes}: ${item.notes}`}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />
                  {summary && summary.subtotal ? (
                    <View
                      style={{
                        marginHorizontal: '1%',
                        marginVertical: '2%',
                        backgroundColor: '#fff',
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        shadowOffset: {width: 0, height: 4},
                        elevation: 5,
                        padding: '3%',
                        borderRadius: 5,
                      }}>
                      <Text style={styles.header}>
                        {Languages[selectedLanguage].addToCart.summary}
                      </Text>
                      <View style={styles.row}>
                        <Text style={styles.rowText}>
                          {Languages[selectedLanguage].addToCart.subtotal}
                        </Text>
                        <Text style={styles.rowText}>
                          {formatCurrency(summary.subtotal, true)}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={{...styles.rowText, color: '#f00'}}>
                          {
                            Languages[selectedLanguage].addToCart
                              .creditsDiscounted
                          }
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
                          {Languages[selectedLanguage].addToCart.newSubtotal}
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
                          {Languages[selectedLanguage].addToCart.tax}
                        </Text>
                        <Text style={{...styles.rowText, color: '#27ae61'}}>
                          {`+ ${formatCurrency(summary.tax, true)}`}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={{...styles.rowText, color: '#27ae61'}}>
                          {Languages[selectedLanguage].addToCart.tips}
                        </Text>
                        <Text style={{...styles.rowText, color: '#27ae61'}}>
                          {`+ ${formatCurrency(summary.tips, true)}`}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={{...styles.row}}>
                        <Text style={styles.rowText}>
                          {Languages[selectedLanguage].addToCart.orderTotal}
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: '1%',
                      marginBottom: '2%',
                    }}>
                    <View style={{width: '49%'}}>
                      <Button
                        title={Languages[selectedLanguage].addToCart.send}
                        loading={loading}
                        onPress={onSendToKitchen}
                        height={45}
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <Button
                        title={
                          Languages[selectedLanguage].addToCart.makePayment
                        }
                        disabled={!(summary && summary.subtotal)}
                        loading={loading}
                        onPress={() =>
                          navigation.navigate('Payment', {tableId: table.id})
                        }
                        height={45}
                      />
                    </View>
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshScreen} />
          }>
          <FlatList
            horizontal={true}
            data={menuCourses}
            renderItem={({item}) => (
              <Ripple
                onPress={() => setSelectedMenuCourse(item)}
                key={item.id}
                style={{
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  shadowOffset: {width: 0, height: 4},
                  elevation: 5,
                  padding: 15,
                  marginHorizontal: 5,
                  marginVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    selectedMenuCourse.id === item.id ? '#27ae61' : '#fff',
                }}>
                <Text
                  style={{
                    color: selectedMenuCourse.id === item.id ? '#fff' : '#000',
                    fontSize: 18,
                  }}>
                  {item.name}
                </Text>
              </Ripple>
            )}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              selectedMenuCourse &&
              selectedMenuCourse.menu &&
              selectedMenuCourse.menu.length > 0
                ? selectedMenuCourse.menu
                : []
            }
            renderItem={({item, index}) => (
              <Ripple
                onPress={() =>
                  navigation.navigate('AddCartItem', {table, menuItem: item})
                }
                key={item.id}
                style={{
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  shadowOffset: {width: 0, height: 4},
                  elevation: 5,
                  padding: 10,
                  marginHorizontal: '1%',
                  marginVertical: '1.5%',
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom:
                    !(cartItems && cartItems.length > 0) &&
                    index === selectedMenuCourse.menu.length - 1
                      ? '12%'
                      : '1.5%',
                }}>
                <Text
                  style={{
                    color: '#000',
                    textAlign: 'left',
                    fontSize: 18,
                    width: '70%',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    alignSelf: 'center',
                    textAlign: 'right',
                    fontSize: 18,
                    width: '30%',
                  }}>
                  {formatCurrency(item.price)}
                </Text>
              </Ripple>
            )}
          />
          {cartItems && cartItems.length > 0 ? (
            <>
              <View style={styles.divider} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '3%',
                }}>
                <EntypoIcon name="chevron-right" size={18} />
                <Text style={{fontWeight: 'bold'}}>
                  {Languages[selectedLanguage].addToCart.orderDetails}:{' '}
                  {table && table.name ? table.name : ''}
                </Text>
              </View>
              <FlatList
                data={cartItems}
                renderItem={({item, index}) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: '#fff',
                      shadowOpacity: 0.3,
                      shadowRadius: 4.65,
                      shadowOffset: {width: 0, height: 4},
                      elevation: 5,
                      padding: '3%',
                      marginHorizontal: '1%',
                      marginVertical: '1%',
                      marginBottom:
                        index === cartItems.length - 1
                          ? !(summary && summary.subtotal)
                            ? '18%'
                            : '2%'
                          : '1%',
                      borderRadius: 5,
                    }}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
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
                          {item.menu_name &&
                          item.menu_name
                            .toLowerCase()
                            .includes('custom amount added')
                            ? Languages[selectedLanguage].addToCart
                                .customAmountAdded
                            : item.menu_name}
                        </Text>
                        {item.options && item.options.length > 0
                          ? item.options.map((item) => (
                              <View
                                key={item.id}
                                style={{flexDirection: 'row'}}>
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
                    {item.notes ? (
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#979797',
                          marginTop: 5,
                          textAlign: 'justify',
                        }}>
                        {`${Languages[selectedLanguage].addToCart.notes}: ${item.notes}`}
                      </Text>
                    ) : null}
                  </View>
                )}
              />
              {summary && summary.subtotal ? (
                <View
                  style={{
                    marginHorizontal: '1%',
                    marginVertical: '2%',
                    backgroundColor: '#fff',
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    shadowOffset: {width: 0, height: 4},
                    elevation: 5,
                    padding: '3%',
                    borderRadius: 5,
                  }}>
                  <Text style={styles.header}>
                    {Languages[selectedLanguage].addToCart.summary}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.rowText}>
                      {Languages[selectedLanguage].addToCart.subtotal}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatCurrency(summary.subtotal, true)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#f00'}}>
                      {Languages[selectedLanguage].addToCart.creditsDiscounted}
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
                      {Languages[selectedLanguage].addToCart.newSubtotal}
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
                      {Languages[selectedLanguage].addToCart.tax}
                    </Text>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {`+ ${formatCurrency(summary.tax, true)}`}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {Languages[selectedLanguage].addToCart.tips}
                    </Text>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      {`+ ${formatCurrency(summary.tips, true)}`}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{...styles.row}}>
                    <Text style={styles.rowText}>
                      {Languages[selectedLanguage].addToCart.orderTotal}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: '1%',
                  marginBottom: '2%',
                }}>
                <View style={{width: '49%'}}>
                  <Button
                    title={Languages[selectedLanguage].addToCart.send}
                    loading={loading}
                    onPress={onSendToKitchen}
                    height={45}
                  />
                </View>
                <View style={{width: '49%'}}>
                  <Button
                    title={Languages[selectedLanguage].addToCart.makePayment}
                    disabled={!(summary && summary.subtotal)}
                    loading={loading}
                    onPress={() =>
                      navigation.navigate('Payment', {tableId: table.id})
                    }
                    height={45}
                  />
                </View>
              </View>
            </>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

export default AddToCart;

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
