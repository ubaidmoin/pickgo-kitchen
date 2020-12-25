import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const data = [
  {
    title: 'Test',
    date: new Date().toISOString(),
  },
  {
    title: 'Test',
    date: new Date().toISOString(),
  },
  {
    title: 'Test',
    date: new Date().toISOString(),
  },
  {
    title: 'Test',
    date: new Date().toISOString(),
  },
];
const NotificationCenter = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTitle}>{item.date}</Text>
            </View>
            <FontAwesome
              style={{marginRight: 10}}
              name="bell"
              size={25}
              color={'#cc0001'}
            />
          </View>
        )}
        numColumns={2}
      />
    </View>
  );
};

export default NotificationCenter;

const styles = StyleSheet.create({
  item: {
    width: Dimensions.get('screen').width * 0.95,
    shadowColor: '#cc0001',
    backgroundColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 5,
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemTitle: {
    fontSize: 15,
  },
});
