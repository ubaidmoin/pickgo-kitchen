import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RadioForm from 'react-native-simple-radio-button';

const radio_props = [
  {label: 'Pending', value: 0},
  {label: 'Past', value: 1},
];
const data = [
  {
    orderId: 'Order #100',
    title: 'test',
    totalOrders: 'test orders: ₭100',
  },
  {
    orderId: 'Order #101',
    title: 'test',
    totalOrders: 'test orders: ₭100',
  },
  {
    orderId: 'Order #102',
    title: 'test',
    totalOrders: 'test orders: ₭100',
  },
  {
    orderId: 'Order #103',
    title: 'test',
    totalOrders: 'test orders: ₭100',
  },
];
const Reservations = () => {
  const [selectedRadio, setSelectedRadio] = useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{margin: 10, width: '100%', paddingLeft: 20}}>
        <RadioForm
          radio_props={radio_props}
          initial={selectedRadio}
          formHorizontal
          buttonColor="red"
          selectedButtonColor="red"
          buttonSize={15}
          onPress={(value) => setSelectedRadio(value)}
        />
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemTitle}>{item.orderId}</Text>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTitle}>{item.totalOrders}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
      />
    </View>
  );
};

export default Reservations;

const styles = StyleSheet.create({
  item: {
    height: 100,
    width: Dimensions.get('screen').width * 0.44,
    backgroundColor: '#27ae61',
    shadowColor: '#27ae61',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 5,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
