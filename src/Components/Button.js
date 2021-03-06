import React from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';
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

const Button = (props) => {
  const {
    title = '',
    onPress = () => {},
    loading = false,
    color = '#2bae6a',
    textColor = '#fff',
    icon = null,
    height = null,
    disabled = false,
  } = props || {};

  return (
    <Ripple
      style={{
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        shadowOffset: {width: 0, height: 4},
        height: height,
        width: '100%',
        backgroundColor: disabled ? '#999' : color,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
      }}
      disabled={disabled}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 10,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {icon}
          </View>
          <Text style={{color: textColor, fontSize: normalize(10)}}>
            {title.toUpperCase()}
          </Text>
        </View>
      )}
    </Ripple>
  );
};

export default Button;
