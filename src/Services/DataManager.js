import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  userInfo: 'USER_INFO',
  userStatus: 'USER_STATUS'
};

export const setUserInfo = async (userDetails) => {
  try {
    console.log(userDetails)
    await AsyncStorage.setItem(KEYS.userInfo, userDetails);
  } catch (err) {
    return null;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.userInfo);
    console.log(response)
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setStatus = async (status) => {
  try {
    await AsyncStorage.setItem(KEYS.userStatus, status);
  } catch (err) {
    return null;
  }
};

export const getStatus = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.userStatus);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};