import * as React from 'react';
import {
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

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

class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(1),
    };
  }

  spring = () => {
    const {springValue} = this.state;
    springValue.setValue(0.7);
    Animated.spring(springValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    if (this.props.onChange) {
      this.props.onChange(!this.props.isChecked);
    }
  };

  render() {
    const {
      title = '',
      size = 20,
      isChecked = false,
      titleStyles = {},
      checkedColor = '#2bae6a',
    } = this.props || {};
    const {springValue} = this.state;

    return (
      <TouchableOpacity
        style={{
          marginVertical: 5,
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onPress={this.spring.bind(this, Easing.bounce)}>
        <Animated.View
          style={{
            width: size,
            height: size,
            borderWidth: 1,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{scale: springValue}],
            borderColor: isChecked
              ? checkedColor
                ? checkedColor
                : '#2bae6a'
              : '#949aa2',
            backgroundColor: isChecked
              ? checkedColor
                ? checkedColor
                : '#2bae6a'
              : 'transparent',
          }}>
          {isChecked ? (
            <EntypoIcon name="check" color="#fff" size={size - 5} />
          ) : null}
        </Animated.View>
        <Text
          style={{
            marginLeft: 5,
            paddingRight: 10,
            fontSize: normalize(14),
            textAlign: 'left',
            marginTop: -2,
            ...titleStyles,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default CheckBox;
