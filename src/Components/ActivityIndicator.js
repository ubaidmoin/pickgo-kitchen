import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import {useStateValue} from '../Services/State/State';
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

const CustomActivityIndicator = ({visible}) => {
  const [{selectedLanguage}] = useStateValue();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color="green" />
          <Text style={{fontSize: normalize(12)}}>
            {Languages[selectedLanguage].messages.pleaseWait}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  modalView: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#e7e7e7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomActivityIndicator;
