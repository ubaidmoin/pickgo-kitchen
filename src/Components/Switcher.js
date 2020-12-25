import React from 'react';
import {Text, View} from 'react-native';
import Ripple from './Ripple';

const Switcher = (props) => {
  const {options = [], selected = 0, onChange = () => {}} = props || {};

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 55,
        elevation: 5,
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        paddingVertical: '1%',
        marginVertical: 5,
      }}>
      {options.map((option, index) => (
        <Ripple
          key={index}
          style={{
            flexDirection: 'row',
            backgroundColor: index === selected ? '#00a9a5' : '#fff',
            borderRadius: 5,
            flex: 1,
            marginHorizontal: '1%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
          onPress={() => onChange(index)}>
          {option.icon(index === selected ? '#fff' : '#949aa2')}
          <Text
            style={{
              marginLeft: '10%',
              color: index === selected ? '#fff' : '#000',
            }}>
            {option.title}
          </Text>
        </Ripple>
      ))}
    </View>
  );
};

export default Switcher;
