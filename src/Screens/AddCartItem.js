import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ToastAndroid} from 'react-native';
import Button from '../Components/Button';
import Ripple from '../Components/Ripple';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import RadioButton from '../Components/RadioButton';
import {getMenuDetails, addToTableCart} from '../Services/API/APIManager';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

const AddCartItem = ({navigation, ...props}) => {
  const [menuItem, setMenuItem] = useState('');
  const [table, setTable] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionItems, setSelectedOptionItems] = useState('');
  const [{selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {table, menuItem} = props.route.params || {};
    if (table && table.id && menuItem && menuItem.id) {
      navigation.setParams({
        title: `${Languages[selectedLanguage].addCartItem.addTo} ${table.name}`,
      });
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
        const {menu = {}, menuOptions = []} = result.data || {};
        if (menu && menu.id) {
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

  const onAddToTableCart = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const {menu = {}, menuOptions = []} = menuItem || {};
      const optionItems = [];
      let isRequiredItemsNotSelected = false;
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
          } else if (item.is_required) {
            isRequiredItemsNotSelected = true;
            return;
          }
        });
      }
      if (isRequiredItemsNotSelected) {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: {
            show: true,
            type: 'warn',
            title: Languages[selectedLanguage].addCartItem.selectRequiredItems,
            showConfirmButton: true,
            confirmText: Languages[selectedLanguage].messages.ok,
          },
        });
        return;
      }
      const reqObj = {
        items: optionItems,
        menu_id: menu.id,
        qty: quantity,
        table_id: table.id,
      };
      const result = await addToTableCart(reqObj);
      if (result) {
        const {table = {}, cart = []} = result || {};
        if (table && table.id && cart && cart.id) {
          navigation.pop();
          ToastAndroid.show(
            Languages[selectedLanguage].addCartItem.menuItemsAdded,
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

  const isSoldOut =
    menu &&
    menu.is_sold &&
    (menu.is_sold.toLowerCase() === 'true' ||
      menu.is_sold.toLowerCase() === true);

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
              <Text
                style={{
                  color: '#000',
                  textAlign: 'left',
                  fontSize: 20,
                  width: '70%',
                }}>
                {menu && menu.name ? menu.name : ''}
              </Text>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'right',
                  fontSize: 20,
                  width: '30%',
                }}>
                {formatCurrency(menu.price)}
              </Text>
            </View>
            {menu && menu.description ? (
              <Text
                style={{
                  color: '#000',
                  textAlign: 'justify',
                  marginVertical: '1.5%',
                  fontSize: 18,
                }}>
                {menu.description}
              </Text>
            ) : null}
            {isSoldOut ? (
              <Text
                style={{
                  color: '#ed3237',
                  textAlign: 'center',
                  fontSize: 15,
                  marginVertical: '1.5%',
                }}>
                {Languages[selectedLanguage].addCartItem.soldOut}
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.5%',
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
            )}
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
                    {`${item.title} (${
                      item.is_required
                        ? Languages[selectedLanguage].addCartItem.required
                        : Languages[selectedLanguage].addCartItem.optional
                    })`}
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
                                ? selectedOptionItems[`${menuOptionIndex}`] ===
                                  index
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
      {!isSoldOut ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            marginHorizontal: '5%',
          }}>
          <Button
            title={Languages[selectedLanguage].addCartItem.add}
            loading={loading}
            onPress={onAddToTableCart}
            height={45}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AddCartItem;
