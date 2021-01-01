import React from 'react';
import {View} from 'react-native';
import Button from '../Components/Button';

const TerminalConnection = () => {
  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
        marginHorizontal: '3%',
      }}>
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Button title="Sacn" height={45} />
      </View>
    </View>
  );
};

export default TerminalConnection;
