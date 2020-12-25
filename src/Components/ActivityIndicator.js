import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Modal} from 'react-native';

const CustomActivityIndicator = ({visible}) => (
  <Modal animationType="fade" transparent={true} visible={visible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{fontSize: 15}}>Please wait...</Text>
      </View>
    </View>
  </Modal>
);

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
