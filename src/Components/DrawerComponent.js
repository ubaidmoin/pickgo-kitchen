import {Image, View, TouchableOpacity} from 'react-native';
import React from 'react';

const DrawerComponent = (props) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 0.3, backgroundColor: 'lightgreen'}}></View>
      <View style={{flex: 0.7}}></View>
    </View>
  );
};

export default DrawerComponent;
