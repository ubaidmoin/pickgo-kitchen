import {
  Animated,
  BackAndroid,
  BackHandler,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio
} from 'react-native';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
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

const HwBackHandler = BackHandler || BackAndroid;
const HW_BACK_EVENT = 'hardwareBackPress';

const {OS} = Platform;

export default class Alert extends Component {
  constructor(props) {
    super(props);
    const {show} = this.props;
    this.springValue = new Animated.Value(0.3);

    this.state = {
      showSelf: false,
    };

    if (show) this._springShow(true);
  }

  componentDidMount() {
    HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }

  _springShow = (fromConstructor) => {
    const {useNativeDriver = false} = this.props;

    this._toggleAlert(fromConstructor);
    Animated.spring(this.springValue, {
      toValue: 1,
      bounciness: 10,
      useNativeDriver,
    }).start();
  };

  _springHide = () => {
    const {useNativeDriver = false} = this.props;

    if (this.state.showSelf === true) {
      Animated.spring(this.springValue, {
        toValue: 0,
        tension: 10,
        useNativeDriver,
      }).start();

      setTimeout(() => {
        this._toggleAlert();
        this._onDismiss();
      }, 70);
    }
  };

  _toggleAlert = (fromConstructor) => {
    // eslint-disable-next-line react/no-direct-mutation-state
    if (fromConstructor) this.state = {showSelf: true};
    else this.setState({showSelf: !this.state.showSelf});
  };

  _handleHwBackEvent = () => {
    const {closeOnHardwareBackPress} = this.props;
    if (this.state.showSelf && closeOnHardwareBackPress) {
      this._springHide();
      return true;
    } else if (!closeOnHardwareBackPress && this.state.showSelf) {
      return true;
    }

    return false;
  };

  _onTapOutside = () => {
    const {closeOnTouchOutside} = this.props;
    if (closeOnTouchOutside) this._springHide();
  };

  _onDismiss = () => {
    const {onDismiss} = this.props;
    onDismiss && onDismiss();
  };

  _renderButton = (data) => {
    const {text, onPress, backgroundColor} = data;

    return (
      <Ripple
        style={{...styles.button, backgroundColor: backgroundColor}}
        onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Ripple>
    );
  };

  _renderAlert = () => {
    const animation = {transform: [{scale: this.springValue}]};

    const {title, message, type} = this.props;

    const {
      showCancelButton,
      cancelText,
      cancelButtonStyle,
      cancelButtonTextStyle,
      onCancelPressed,
    } = this.props;
    const {
      showConfirmButton,
      confirmText,
      confirmButtonStyle,
      confirmButtonTextStyle,
      onConfirmPressed,
    } = this.props;

    const {
      overlayStyle,
      contentContainerStyle,
      actionContainerStyle,
    } = this.props;

    const cancelButtonData = {
      text: cancelText,
      backgroundColor: '#ed3237',
      buttonStyle: cancelButtonStyle,
      buttonTextStyle: cancelButtonTextStyle,
      onPress: onCancelPressed,
    };

    const confirmButtonData = {
      text: confirmText,
      backgroundColor: '#27ae61',
      buttonStyle: confirmButtonStyle,
      buttonTextStyle: confirmButtonTextStyle,
      onPress: onConfirmPressed,
    };

    return (
      <View style={styles.container}>
        <View style={[styles.overlay, overlayStyle]} />
        <Animated.View
          style={[styles.contentContainer, animation, contentContainerStyle]}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Image
              source={
                type === 'success'
                  ? require('../Assets/success.png')
                  : type === 'warning'
                  ? require('../Assets/warn.png')
                  : type === 'warn'
                  ? require('../Assets/warning.png')
                  : type === 'info'
                  ? require('../Assets/info.png')
                  : require('../Assets/error.png')
              }
              style={{
                width: 25,
                height: 25,
              }}
            />
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={[styles.action, actionContainerStyle]}>
            {showCancelButton ? this._renderButton(cancelButtonData) : null}
            {showConfirmButton ? this._renderButton(confirmButtonData) : null}
          </View>
        </Animated.View>
      </View>
    );
  };

  render() {
    const {show, showSelf} = this.state;
    const {modalProps = {}, closeOnHardwareBackPress} = this.props;

    const wrapInModal = OS === 'android' || OS === 'ios';

    return showSelf ? (
      wrapInModal ? (
        <Modal
          animationType="none"
          transparent={true}
          visible={show}
          statusBarTranslucent={true}
          onRequestClose={() => {
            if (showSelf && closeOnHardwareBackPress) {
              this._springHide();
            }
          }}
          {...modalProps}>
          {this._renderAlert()}
        </Modal>
      ) : (
        this._renderAlert()
      )
    ) : null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {show} = nextProps;
    const {showSelf} = this.state;

    if (show && !showSelf) this._springShow();
    else if (show === false && showSelf) this._springHide();
  }

  componentWillUnmount() {
    HwBackHandler.removeEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  contentContainer: {
    maxWidth: '80%',
    minWidth: '80%',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  title: {
    marginLeft: 5,
    maxWidth: '90%',
    color: '#000',
    fontSize: normalize(18),
  },
  message: {
    paddingTop: 5,
    color: '#000',
    fontSize: normalize(16),
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 7,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(15),
  },
});

Alert.propTypes = {
  show: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  showProgress: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  closeOnTouchOutside: PropTypes.bool,
  closeOnHardwareBackPress: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelButtonColor: PropTypes.string,
  confirmButtonColor: PropTypes.string,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
  customView: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  modalProps: PropTypes.object,
};

Alert.defaultProps = {
  show: false,
  useNativeDriver: false,
  showProgress: false,
  closeOnTouchOutside: true,
  closeOnHardwareBackPress: true,
  showCancelButton: false,
  showConfirmButton: false,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButtonColor: '#D0D0D0',
  confirmButtonColor: '#AEDEF4',
  customView: null,
  modalProps: {},
};
