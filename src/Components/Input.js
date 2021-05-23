import React, {Component} from 'react';
import {
  View,
  Animated,
  TextInput,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';

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
class Input extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value || this.props.value === 0 ? 1 : 0,
    );
  }

  handleFocus = () => this.setState({isFocused: true});

  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue:
        this.state.isFocused || this.props.value || this.props.value === 0
          ? 1
          : 0,
      duration: 200,
    }).start();
  }

  render() {
    const {label, value = '', type = 'default', ...props} = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [28, 5],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#2bae6a'],
      }),
    };
    return (
      <View style={{paddingTop: 10, paddingBottom: 10, width: '100%'}}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={{
            paddingHorizontal: 0,
            height: 45,
            fontSize: normalize(10),
            color: '#000',
            borderBottomWidth: this.state.isFocused ? 2 : 1,
            borderBottomColor: '#000',
            paddingBottom: this.props.value || this.props.value === 0 ? -20 : 0,
          }}
          value={`${value}`}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => {
            if (type && type === 'number') {
              this.props.onChangeText(text.replace(/[^0-9]/g, ''));
            } else {
              this.props.onChangeText(text);
            }
          }}
        />
      </View>
    );
  }
}

export default Input;
