import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ToastAndroid,
  PixelRatio,
  Platform,
  Dimensions,
} from 'react-native';
import Button from '../Components/Button';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import CheckBox from '../Components/CheckBox';
import {
  getMenuDetails,
  updateMenuStatus,
  updateMenuOptionItemStatus,
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

const EditMenu = ({navigation, ...props}) => {
  useEffect(() => {
    const {menuItem} = props.route.params || {};
    if (menuItem && menuItem.id) {
      fetchMenuDetails(menuItem.id);
    }
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  const [menuItem, setMenuItem] = useState('');
  const [isMenuItemSoldOut, setIsMenuItemSoldOut] = useState(false);
  const [selectedMenuOptions, setSelectedMenuOptions] = useState('');
  const [{selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const fetchMenuDetails = async (menuId) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getMenuDetails(menuId);
      console.log(result.data)
      if (result.data) {
        const {menu = {}, menuOptions = []} = result.data || {};
        if (menu && menu.id) {
          setIsMenuItemSoldOut(menu.is_sold && menu.is_sold === 1);
          setMenuItem(result.data);
          if (menuOptions && menuOptions.length > 0) {
            const selectedMenuOptions = {};
            menuOptions.forEach((item, index) => {
              const menuOptionIndex = index,
                menuOptionItem =
                  item && item.option_items ? item.option_items : [];
              menuOptionItem.forEach((item, index) => {
                const optionItemIndex = index,
                  optionItem = item;
                selectedMenuOptions[`${menuOptionIndex}${optionItemIndex}`] =
                  optionItem.is_sold;
              });
            });
            setSelectedMenuOptions(selectedMenuOptions);
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

  const handleUpdateMenuOptionStatus = async (
    status,
    id,
    option_id,
    option_item_id,
  ) => {
    const data = {
      is_sold: status ? 1 : 0,
      menu_id: id,
      menu_option_id: option_id,
      menu_option_item_id: option_item_id,
    };
    console.log(data);
    const res = await updateMenuOptionItemStatus(data);
    const {menuItem} = props.route.params || {};
    console.log(menuItem.id);
    fetchMenuDetails(menuItem.id);
    if (res && res.menu) {
      setIsMenuItemSoldOut(res.menu.is_sold && res.menu.is_sold === 1);
    }
  };

  const onUpdateMenu = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      ToastAndroid.show(
        Languages[selectedLanguage].messages.menuUpdated,
        ToastAndroid.LONG,
      );
      navigation.pop();
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
    let allSelectedMenuOptions = {...selectedMenuOptions};
    if (
      allSelectedMenuOptions &&
      allSelectedMenuOptions[`${menuOptionIndex}${optionItemIndex}`]
    ) {
      if (val) {
        allSelectedMenuOptions[`${menuOptionIndex}${optionItemIndex}`] = 'true';
      } else {
        allSelectedMenuOptions[`${menuOptionIndex}${optionItemIndex}`] = 'No';
      }
    }
    setSelectedMenuOptions(allSelectedMenuOptions);
  };

  const handleUpdateMenuItemStatus = async (id, status) => {
    const data = {
      is_sold: status ? 1 : 0,
      menu_id: id,
    };
    console.log(data);
    const res = await updateMenuStatus(data);
    console.log(res);
    if (res && res.menu) {
      setIsMenuItemSoldOut(res.menu.is_sold && res.menu.is_sold === 1);
    }
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
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              shadowOffset: {width: 0, height: 4},
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
                  fontSize: normalize(20),
                  width: '70%',
                }}>
                {menu && menu.name ? menu.name : ''}
              </Text>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'right',
                  fontSize: normalize(20),
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
                  fontSize: normalize(18),
                }}>
                {menu.description}
              </Text>
            ) : null}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: '1.5%',
              }}>
              <CheckBox
                size={20}
                title={
                  isMenuItemSoldOut
                    ? Languages[selectedLanguage].editMenu.soldOut
                    : `${Languages[selectedLanguage].editMenu.soldOut}?`
                }
                isChecked={isMenuItemSoldOut}
                onChange={(val) => handleUpdateMenuItemStatus(menu.id, val)}
                checkedColor="#ed3237"
                titleStyles={{
                  textDecorationLine: isMenuItemSoldOut
                    ? 'line-through'
                    : 'none',
                  color: isMenuItemSoldOut ? '#ed3237' : '#000',
                }}
              />
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={menuOptions}
            renderItem={({item, index}) => {
              return (
                <View
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
                    marginBottom:
                      index === menuOptions.length - 1 ? '20%' : '1.5%',
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      textAlign: 'center',
                      fontSize: normalize(18),
                    }}>
                    {`${item.title} (${
                      item.is_required
                        ? Languages[selectedLanguage].editMenu.required
                        : Languages[selectedLanguage].editMenu.optional
                    })`}
                  </Text>
                  <View style={{marginHorizontal: '2%', marginTop: '2%'}}>
                    {item.option_items && item.option_items.length > 0
                      ? item.option_items.map((innerItem, index) => {
                          const isSoldOut = innerItem.is_sold === 1;
                          return (
                            <CheckBox
                              key={innerItem.id}
                              title={`${innerItem.name} (${formatCurrency(
                                innerItem.price,
                              )}) ${
                                isSoldOut
                                  ? `(${Languages[selectedLanguage].editMenu.soldOut})`
                                  : ''
                              }`}
                              size={20}
                              isChecked={isSoldOut}
                              onChange={(val) =>
                                handleUpdateMenuOptionStatus(
                                  val,
                                  menu.id,
                                  item.id,
                                  innerItem.id,
                                )
                              }
                              checkedColor="#ed3237"
                              titleStyles={{
                                textDecorationLine: isSoldOut
                                  ? 'line-through'
                                  : 'none',
                                color: isSoldOut ? '#ed3237' : '#000',
                              }}
                            />
                          );
                        })
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
          title={Languages[selectedLanguage].editMenu.update}
          loading={loading}
          onPress={onUpdateMenu}
          height={45}
        />
      </View>
    </View>
  );
};

export default EditMenu;
