import * as React from 'react';
import {Text, Animated, TouchableOpacity, Easing} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

class RadioButton extends React.Component {
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
            borderColor: isChecked ? '#2bae6a' : '#949aa2',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isChecked ? '#2bae6a' : 'transparent',
            transform: [{scale: springValue}],
          }}>
          {isChecked ? (
            <EntypoIcon name="check" color="#fff" size={size - 5} />
          ) : null}
        </Animated.View>
        <Text
          style={{
            marginLeft: 5,
            fontSize: 16,
            textAlign: 'center',
            marginTop: -2,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default RadioButton;
