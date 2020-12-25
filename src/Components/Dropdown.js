import React, {Component} from 'react';
import {
  View,
  Animated,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';

class Dropdown extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this.refActionSheet = null;
    this._animatedIsFocused = new Animated.Value(
      this.props.selected && this.props.selected.value ? 1 : 0,
    );
  }

  handleFocus = () => this.setState({isFocused: true});

  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const {
      label = '',
      icon = null,
      options = [],
      selected = {},
      onSelect = () => {},
      ...props
    } = this.props;
    const labelStyle = {
      position: 'absolute',
      width: '100%',
      left: '6%',
      bottom: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['25%', '5%'],
      }),
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['25%', '8%'],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 10],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#36373a', '#c0c8d3'],
      }),
    };
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          this.refActionSheet.show();
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 5,
            height: 55,
            borderWidth: this.state.isFocused ? 2 : 0,
            borderColor: this.state.isFocused ? '#0faeaa' : null,
            elevation: 5,
            shadowRadius: 2,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            marginVertical: 5,
          }}>
          <ActionSheet
            ref={(ref) => (this.refActionSheet = ref)}
            title={label}
            options={
              options &&
              options.length > 0 && [
                ...options.map((option) => option.label),
                'Cancel',
              ]
            }
            cancelButtonIndex={options.length}
            destructiveButtonIndex={options.length}
            onPress={(index) => {
              if (options[index]) {
                onSelect(options[index]);
              }
            }}
            styles={{
              titleText: {
                fontSize: 14,
                color: 'black',
              },
              cancelButtonBox: {
                marginBottom: 10,
                height: 55,
              },
              optionsTextStyle: {
                fontSize: 5,
              },
            }}
          />
          <View
            style={{
              width: icon ? '85%' : '100%',
              paddingHorizontal: '5%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Animated.Text style={labelStyle}>{label}</Animated.Text>
            <TextInput
              {...props}
              value={selected && selected.label}
              style={{
                marginTop:
                  this.state.isFocused || (selected && selected.value)
                    ? '3%'
                    : 0,
                width: '100%',
                color: '#000',
              }}
              editable={false}
            />
          </View>
          {icon ? <View style={{width: '15%'}}>{icon}</View> : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Dropdown;
