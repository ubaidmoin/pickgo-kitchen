import * as React from 'react';
import {Text, Animated, TouchableOpacity, Easing} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

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
    const {title = '', size = 20, isChecked = false} = this.props || {};
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
            borderColor: isChecked ? '#ed3237' : '#949aa2',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isChecked ? '#ed3237' : 'transparent',
            transform: [{scale: springValue}],
          }}>
          {isChecked ? (
            <EntypoIcon name="check" color="#fff" size={size - 5} />
          ) : null}
        </Animated.View>
        <Text
          style={{
            textDecorationLine: isChecked ? 'line-through' : 'none',
            color: isChecked ? '#ed3237' : '#000',
            marginLeft: 5,
            paddingRight: 10,
            fontSize: 16,
            textAlign: 'left',
            marginTop: -2,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default CheckBox;
