import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Ripple from '../Components/Ripple';
import Switcher from '../Components/Switcher';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getReservations} from '../Services/API/APIManager';
import {getNotificationCount} from '../Services/DataManager';

const Reservations = ({navigation}) => {
  useEffect(() => {
    return navigation.addListener('focus', () =>
      getNotificationCount().then((notificationCount) =>
        navigation.setParams({notificationCount}),
      ),
    );
  }, []);

  useEffect(() => {
    fetchReservations();
  }, []);

  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(0);

  const fetchReservations = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getReservations();
      if (result.data) {
        const {order = []} = result.data || {};
        if (order && order.length > 0) {
          setReservations(order);
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

  const formatCurrency = (value) => {
    return `₭ ${parseFloat(value)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{marginHorizontal: '3%', marginBottom: '1%', zIndex: 1}}>
        <Switcher
          options={[{title: 'Pending'}, {title: 'Past'}]}
          selected={selected}
          onChange={(val) => setSelected(val)}
        />
      </View>
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={
          selected === 0
            ? reservations.filter((item) => parseInt(item.type) !== 7)
            : reservations.filter((item) => parseInt(item.type) === 7)
        }
        renderItem={({item}) => (
          <Ripple
            onPress={() => navigation.navigate('OrderSummary', {order: item})}
            style={{
              ...styles.item,
              backgroundColor:
                item.type && parseInt(item.type) === 3 ? '#27ae61' : '#999',
            }}>
            <Text
              style={{
                ...styles.itemTitle,
                color: item.type && parseInt(item.type) === 3 ? '#fff' : '#000',
              }}
              numberOfLines={1}>{`Order #${item.c_oid}`}</Text>
            <Text
              style={{
                ...styles.itemTitle,
                fontWeight: 'bold',
                color: item.type && parseInt(item.type) === 3 ? '#fff' : '#000',
              }}
              numberOfLines={1}>
              {item.table_name
                ? item.table_name
                : `${
                    item.customer_first_name ? item.customer_first_name : ''
                  } ${item.customer_last_name ? item.customer_last_name : ''}`}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...styles.itemTitle,
                color: item.type && parseInt(item.type) === 3 ? '#fff' : '#000',
              }}>
              {`Total Orders ${formatCurrency(item.subtotal)}`}
            </Text>
          </Ripple>
        )}
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
    width: Dimensions.get('screen').width * 0.45,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 3,
    padding: '3%',
    margin: '1.5%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#fff',
  },
});
