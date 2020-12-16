import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';

const BottomButton = (props) => {
  const {title = '', onPress = () => {}, loading = false} = props || {};
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        height: 45,
      }}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text style={{color: 'red', fontSize: 15}}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default BottomButton;
