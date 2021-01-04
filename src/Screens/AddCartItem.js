import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import Button from '../Components/Button';
import Ripple from '../Components/Ripple';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import RadioButton from '../Components/RadioButton';
import {getMenuDetails, addToTableCart} from '../Services/API/APIManager';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';

const AddCartItem = ({navigation, ...props}) => {
  useEffect(() => {
    const {table, menuItem} = props.route.params || {};
    if (table && table.id && menuItem && menuItem.id) {
      navigation.setParams({title: `Add to ${table.name}`});
      setTable(table);
      fetchMenuDetails(menuItem.id);
    }
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const fetchMenuDetails = async (menuId) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getMenuDetails(menuId);
      if (result.data) {
        const {isTimeForOrder = false, menu = {}, menuOptions = []} =
          result.data || {};
        if (isTimeForOrder && menu && menu.id) {
          setMenuItem(result.data);
          if (menuOptions && menuOptions.length > 0) {
            const allSelectedOptionItems = {};
            menuOptions.forEach(
              (item, index) => (allSelectedOptionItems[`${index}`] = ''),
            );
            setSelectedOptionItems(allSelectedOptionItems);
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

  const onAddToTableCart = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const {menu = {}, menuOptions = []} = menuItem || {};
      const optionItems = [];
      if (menuOptions && menuOptions.length > 0 && selectedOptionItems) {
        menuOptions.forEach((item, menuOptionIndex) => {
          if (
            selectedOptionItems[menuOptionIndex] ||
            selectedOptionItems[menuOptionIndex] === 0
          ) {
            const optionItem =
              item.option_items[selectedOptionItems[menuOptionIndex]];
            optionItems.push({
              id: optionItem.id,
              name: optionItem.name,
              price: optionItem.price,
            });
          }
        });
      }
      const reqObj = {
        items: optionItems,
        menu_id: menu.id,
        qty: quantity,
        table_id: table.id,
      };
      const result = await addToTableCart(reqObj);
      if (result.data) {
        const {success = false, table = {}, cart = []} = result.data || {};
        if (success && table && table.id && cart && cart.id) {
          dispatch({
            type: actions.SET_ALERT_SETTINGS,
            alertSettings: {
              show: true,
              type: 'success',
              title: 'Added To Cart',
              message: 'Menu item(s) are successfully added to table.',
              showConfirmButton: true,
              confirmText: 'Ok',
              onConfirmPressed: () => navigation.pop(),
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

  const [menuItem, setMenuItem] = useState('');
  const [table, setTable] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionItems, setSelectedOptionItems] = useState('');
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const onSelectOptionItem = (val, menuOptionIndex, optionItemIndex) => {
    let allSelectedOptionItems = {...selectedOptionItems};
    if (val) {
      allSelectedOptionItems[`${menuOptionIndex}`] = optionItemIndex;
    } else {
      allSelectedOptionItems[`${menuOptionIndex}`] = '';
    }
    setSelectedOptionItems(allSelectedOptionItems);
  };

  const {menu = {}, menuOptions = []} = menuItem || {};

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
        marginHorizontal: '3%',
      }}>
      {menu && menu.id ? (
        <>
          <View
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
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', textAlign: 'center', fontSize: 20}}>
                {menu && menu.name ? menu.name : ''}
              </Text>
              <Text style={{color: '#000', textAlign: 'center', fontSize: 20}}>
                {formatCurrency(menu.price)}
              </Text>
            </View>
            <Text
              style={{
                color: '#000',
                textAlign: 'justify',
                marginVertical: '1.5%',
                fontSize: 18,
              }}>
              {menu && menu.description ? menu.description : ''}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                  width: '42%',
                  backgroundColor: quantity === 1 ? '#999' : '#2bae6a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  marginVertical: 5,
                }}
                disabled={quantity === 1}
                onPress={() => setQuantity(quantity - 1)}>
                <EntypoIcon name="minus" size={25} color="#fff" />
              </Ripple>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  marginVertical: '1.5%',
                  marginHorizontal: '1.5%',
                  fontSize: 18,
                }}>
                {quantity}
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
                  width: '42%',
                  backgroundColor: '#2bae6a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  marginVertical: 5,
                }}
                onPress={() => setQuantity(quantity + 1)}>
                <EntypoIcon name="plus" size={25} color="#fff" />
              </Ripple>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={menuOptions}
            renderItem={({item, index}) => {
              const menuOptionIndex = index;
              return (
                <View
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
                    marginBottom:
                      index === menuOptions.length - 1 ? '20%' : '1.5%',
                  }}>
                  <Text
                    style={{color: '#000', textAlign: 'center', fontSize: 18}}>
                    {`${item.title} (optional)`}
                  </Text>
                  <View style={{marginHorizontal: '2%', marginTop: '2%'}}>
                    {item.option_items && item.option_items.length > 0
                      ? item.option_items.map((item, index) => (
                          <RadioButton
                            key={item.id}
                            title={`${item.name} (${formatCurrency(
                              item.price,
                            )})`}
                            size={20}
                            isChecked={
                              selectedOptionItems
                                ? selectedOptionItems[menuOptionIndex] === index
                                : false
                            }
                            onChange={(val) =>
                              onSelectOptionItem(val, menuOptionIndex, index)
                            }
                          />
                        ))
                      : null}
                  </View>
                </View>
              );
            }}
          />
        </>
      ) : null}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          marginHorizontal: '5%',
        }}>
        <Button
          title="Add"
          loading={loading}
          onPress={onAddToTableCart}
          height={45}
        />
      </View>
    </View>
  );
};

export default AddCartItem;
