import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
const data = ['1', '2', '3', '4'];
const Tables = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemTitle}>{item}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
      />
    </View>
  );
};

export default Tables;

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
    padding: 20,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
