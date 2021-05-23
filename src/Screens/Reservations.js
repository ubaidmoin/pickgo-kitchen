import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  PixelRatio,
  Platform,
  Dimensions,
} from 'react-native';
import Ripple from '../Components/Ripple';
import Switcher from '../Components/Switcher';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getReservations} from '../Services/API/APIManager';
import {getNotificationCount} from '../Services/DataManager';
import Languages from '../Localization/translations';
import {formatCurrency} from '../Services/Common';

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

const Reservations = ({navigation}) => {
  useEffect(() => {
    fetchReservations();
    return navigation.addListener('focus', () => fetchReservations());
  }, []);

  const [{reservations, selectedLanguage}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  console.log(reservations);
  const fetchReservations = async () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    try {
      if (!(reservations && reservations.length > 0)) {
        dispatch({
          type: actions.SET_PROGRESS_SETTINGS,
          show: true,
        });
        setLoading(true);
      }
      const result = await getReservations();
      if (result.data) {
        const {order = []} = result.data || {};
        if (order && order.length > 0) {
          dispatch({
            type: actions.SET_RESERVATIONS,
            reservations: order,
          });
        } else {
          dispatch({
            type: actions.SET_RESERVATIONS,
            reservations: [],
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

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{marginHorizontal: '3%', marginBottom: '1%', zIndex: 1}}>
        <Switcher
          options={[
            {title: Languages[selectedLanguage].reservations.pending},
            {title: Languages[selectedLanguage].reservations.past},
          ]}
          selected={selected}
          onChange={(val) => setSelected(val)}
        />
      </View>
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={
          selected === 0
            ? reservations.filter(
                (item) => item.type && ![2, 5, 7].includes(parseInt(item.type)),
              )
            : reservations.filter(
                (item) => item.type && [2, 5, 7].includes(parseInt(item.type)),
              )
        }
        renderItem={({item}) => {
          const isPending =
            item.type && ![2, 5, 7].includes(parseInt(item.type));
          const isNewOrder = !(
            item.tbl_id &&
            parseInt(item.tbl_id) &&
            parseInt(item.tbl_id) > 0
          );
          return (
            <Ripple
              onPress={() => {
                navigation.navigate('OrderSummary', {order: item});
              }}
              style={{
                ...styles.item,
                backgroundColor: isNewOrder
                  ? '#fe0000'
                  : isPending
                  ? '#27ae61'
                  : '#999',
              }}>
              <Text
                style={{
                  ...styles.itemTitle,
                  fontWeight: 'bold',
                  color: isPending ? '#fff' : '#000',
                }}
                numberOfLines={1}>
                {`${item.customer_first_name ? item.customer_first_name : ''} ${
                  item.customer_last_name ? item.customer_last_name : ''
                }`}
              </Text>
              <Text
                style={{
                  ...styles.itemTitle,
                  color: isPending ? '#fff' : '#000',
                }}
                numberOfLines={
                  1
                }>{`${Languages[selectedLanguage].reservations.order} #${item.c_oid}`}</Text>
              <Text
                style={{
                  ...styles.itemTitle,
                  fontWeight: 'bold',
                  fontSize: normalize(14),
                  color: isPending ? '#fff' : '#000',
                }}
                numberOfLines={1}>
                {isNewOrder
                  ? Languages[selectedLanguage].reservations.new
                  : item.table_name
                  ? item.table_name
                  : ''}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.itemTitle,
                  color: isPending ? '#fff' : '#000',
                }}>
                {`${formatCurrency(item.subtotal, false, true)}`}
              </Text>
            </Ripple>
          );
        }}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchReservations} />
        }
      />
    </View>
  );
};

export default Reservations;

const styles = StyleSheet.create({
  item: {
    width: '45.9%',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 3,
    padding: '3%',
    margin: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: normalize(14),
    color: '#fff',
  },
});
