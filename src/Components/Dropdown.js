import React, {Component} from 'react';
import {
  View,
  Animated,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {StateContext} from '../Services/State/State';
import Languages from '../Localization/translations';

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

class Dropdown extends Component {
  static contextType = StateContext;
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this.refActionSheet = null;
    this._animatedIsFocused = new Animated.Value(this.props.selected ? 1 : 0);
  }

  componentDidUpdate(props) {
    if (props.show) {
      this.refActionSheet.show();
    }
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
    } = this.props;
    const [{selectedLanguage}] = this.context;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 5],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12],
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
          <ActionSheet
            ref={(ref) => (this.refActionSheet = ref)}
            title={label}
            options={
              options && options.length > 0
                ? [
                    ...options.map((option) => option[labelField]),
                    Languages[selectedLanguage].messages.cancel,
                  ]
                : [Languages[selectedLanguage].messages.cancel]
            }
            cancelButtonIndex={options.length}
            destructiveButtonIndex={options.length}
            onPress={(index) => {
              if (options[index]) {
                onSelect(options[index], index);
              }
            }}
            styles={{
              titleText: {
                fontSize: normalize(10),
                color: 'black',
              },
              cancelButtonBox: {
                marginBottom: 10,
                height: 55,
              },
              optionsTextStyle: {
                fontSize: normalize(5),
              },
            }}
          />
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <Text
            style={{
              paddingHorizontal: 0,
              width: '100%',
              height: 45,
              fontSize: normalize(10),
              color: '#000',
              paddingBottom: this.props.selected ? -20 : 0,
              marginBottom: -5,
              paddingTop: 12,
              marginLeft: 5,
            }}>
            {selected && selected[labelField]}
          </Text>
          <View style={{borderBottomWidth: 1, borderBottomColor: '#000'}} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Dropdown;
