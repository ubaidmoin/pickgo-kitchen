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
} from '../Services/API/APIManager';
import Dropdown from '../Components/Dropdown';
import {formatCurrency} from '../Services/Common';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getNotificationCount} from '../Services/DataManager';

const AddToCart = ({navigation, ...props}) => {
  useEffect(() => {
    refreshScreen();
    return navigation.addListener('focus', () => {
      refreshScreen();
    });
  }, []);

  const refreshScreen = () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    fetchMenu();
    const {table = null} = props.route.params || {};
    if (table && table.id) {
      navigation.setParams({title: `Add to ${table.name}`});
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
        const {table = {}} = result.data || {};
        if (table && table.id) {
          setTableDetails(result.data);
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
            'This Operation Could Not Be Completed. Please Try Again Later.1',
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
              label: `${companyHours.name} (from ${companyHours.time_from} to ${companyHours.time_to})`,
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
          refreshScreen();
          setAmount('');
          ToastAndroid.show(
            message ? message : 'Custom Amount is added to order successfully.',
            ToastAndroid.LONG,
          );
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
            'This Operation Could Not Be Completed. Please Try Again Later.1',
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
      const result = await sendToKitchen(table.id);
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
          refreshScreen();
          ToastAndroid.show(
            'Menu item deleted successfully.',
            ToastAndroid.LONG,
          );
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

  const [menu, setMenu] = useState('');
  const [selectedCompanyHours, setSelectedCompanyHours] = useState('');
  const [menuCourses, setMenuCourses] = useState([]);
  const [selectedMenuCourse, setSelectedMenuCourse] = useState('');
  const [amount, setAmount] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [tableDetails, setTableDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [{isWideScreen}, dispatch] = useStateValue();

  const {companyHoursToday = []} = menu || {};

  const getCompanyHours = () => {
    if (companyHoursToday && companyHoursToday.length > 0) {
      return companyHoursToday.map((item) => ({
        label: `${item.name} (from ${item.time_from} to ${item.time_to})`,
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
              label="Select One"
              options={getCompanyHours()}
              selected={selectedCompanyHours}
              onSelect={onSelectCompanyHours}
              show={showMenu}
            />
          </View>
          <AntIcon name="clockcircleo" size={20} color="#000" />
          <Text style={{color: '#000', fontSize: 12}}>Menu</Text>
        </Ripple>
        <View style={{width: '65%', maxWidth: 190}}>
          <Input
            type="number"
            value={amount}
            label="Enter Amount"
            keyboardType="phone-pad"
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={{marginLeft: '2%', width: '20%', maxWidth: 60}}>
          <Button title="Add" onPress={onAddAmount} height={40} />
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
                    shadowColor: '#cc0001',
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    shadowOffset: {
                      height: 5,
                      width: 2,
                    },
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
                      shadowColor: '#cc0001',
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      shadowOffset: {
                        height: 5,
                        width: 2,
                      },
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
                      Order Details: {table && table.name ? table.name : ''}
                    </Text>
                  </View>
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
                          marginHorizontal: '1%',
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
                    )}
                  />
                  {summary && summary.subtotal ? (
                    <View
                      style={{
                        marginHorizontal: '1%',
                        marginVertical: '2%',
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
                          {`- ${formatCurrency(summary.discount, true)}`}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={{...styles.row}}>
                        <Text style={styles.rowText}>New Subtotal</Text>
                        <Text style={styles.rowText}>
                          {formatCurrency(
                            parseFloat(summary.subtotal) -
                              parseFloat(summary.discount),
                            true,
                          )}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={{...styles.rowText, color: '#27ae61'}}>
                          Tax
                        </Text>
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
                              parseFloat(summary.discount) +
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
                  shadowColor: '#cc0001',
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                    width: 2,
                  },
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
                  shadowColor: '#cc0001',
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                    width: 2,
                  },
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
                  Order Details: {table && table.name ? table.name : ''}
                </Text>
              </View>
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
                      marginHorizontal: '1%',
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
                    marginHorizontal: '1%',
                    marginVertical: '2%',
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
                      {`- ${formatCurrency(summary.discount, true)}`}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{...styles.row}}>
                    <Text style={styles.rowText}>New Subtotal</Text>
                    <Text style={styles.rowText}>
                      {formatCurrency(
                        parseFloat(summary.subtotal) -
                          parseFloat(summary.discount),
                        true,
                      )}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={{...styles.rowText, color: '#27ae61'}}>
                      Tax
                    </Text>
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
                          parseFloat(summary.discount) +
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
