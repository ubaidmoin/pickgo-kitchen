import React from 'react';
import {Text, View, Dimensions, PixelRatio, Platform} from 'react-native';
import Ripple from './Ripple';

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
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        shadowOffset: {width: 0, height: 4},
        paddingVertical: '1%',
        marginVertical: 5,
      }}>
      {options.map((option, index) => (
        <Ripple
          key={index}
          style={{
            flexDirection: 'row',
            backgroundColor: index === selected ? '#27ae61' : '#fff',
            borderRadius: 5,
            flex: 1,
            marginHorizontal: '1%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
          onPress={() => onChange(index)}>
          {option.icon
            ? option.icon(index === selected ? '#fff' : '#27ae61')
            : null}
          <Text
            style={{
              fontSize: normalize(12),
              marginLeft: option.icon ? '10%' : 0,
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
