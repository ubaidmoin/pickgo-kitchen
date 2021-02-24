import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ToastAndroid} from 'react-native';
import Button from '../Components/Button';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import CheckBox from '../Components/CheckBox';
import {getMenuDetails} from '../Services/API/APIManager';
import {formatCurrency} from '../Services/Common';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';

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
      if (result.data) {
        const {menu = {}, menuOptions = []} = result.data || {};
        if (menu && menu.id) {
          setIsMenuItemSoldOut(
            menu.is_sold &&
              (menu.is_sold.toLowerCase() === 'true' ||
                menu.is_sold.toLowerCase() === true),
          );
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
                onChange={(val) => setIsMenuItemSoldOut(val)}
              />
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
                    {`${item.title} (${
                      item.is_required
                        ? Languages[selectedLanguage].editMenu.required
                        : Languages[selectedLanguage].editMenu.optional
                    })`}
                  </Text>
                  <View style={{marginHorizontal: '2%', marginTop: '2%'}}>
                    {item.option_items && item.option_items.length > 0
                      ? item.option_items.map((item, index) => {
                          const optionItemIndex = index;
                          const isSoldOut =
                            selectedMenuOptions &&
                            (selectedMenuOptions[
                              `${menuOptionIndex}${optionItemIndex}`
                            ].toLowerCase() === 'true' ||
                              selectedMenuOptions[
                                `${menuOptionIndex}${optionItemIndex}`
                              ] === true);
                          return (
                            <CheckBox
                              key={item.id}
                              title={`${item.name} (${formatCurrency(
                                item.price,
                              )}) ${
                                isSoldOut
                                  ? `(${Languages[selectedLanguage].editMenu.soldOut})`
                                  : ''
                              }`}
                              size={20}
                              isChecked={isSoldOut}
                              onChange={(val) =>
                                onSelectOptionItem(val, menuOptionIndex, index)
                              }
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
