import React from 'react';
import {Text, ActivityIndicator} from 'react-native';
import Ripple from './Ripple';

const Button = (props) => {
  const {title = '', onPress = () => {}, loading = false} = props || {};
  return (
    <Ripple
      style={{
        elevation: 3,
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        width: '100%',
        backgroundColor: '#2bae6a',
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
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{color: '#fff', fontSize: 20}}>{title}</Text>
      )}
    </Ripple>
  );
};

export default Button;
