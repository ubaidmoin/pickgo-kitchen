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
    this._animatedIsFocused = new Animated.Value(this.props.selected ? 1 : 0);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.props.selected ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const {
      label = '',
      options = [],
      selected = {},
      onSelect = () => {},
      labelField = 'label',
      disabled = false,
      ...props
    } = this.props;

    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 10],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
    };

    return (
      <TouchableWithoutFeedback
        disabled={disabled}
        onPress={() => {
          Keyboard.dismiss();
          this.refActionSheet.show();
        }}>
        <View style={{paddingTop: 10, paddingBottom: 10}}>
          {console.log('data9: ', options)}
          <ActionSheet
            ref={(ref) => (this.refActionSheet = ref)}
            title={label}
            options={
              options && options.length > 0
                ? [...options.map((option) => option[labelField]), 'Cancel']
                : ['Cancel']
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
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            {...props}
            value={selected && selected[labelField]}
            style={{
              paddingHorizontal: 0,
              width: '100%',
              height: 40,
              fontSize: 15,
              color: '#000',
              borderBottomWidth: 1,
              borderBottomColor: '#000',
            }}
            editable={false}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Dropdown;
