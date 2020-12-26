import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_INFO: 'USER_INFO',
};

export const setUserInfo = async (userDetails) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_INFO, userDetails);
  } catch (err) {
    return null;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.USER_INFO);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getAccessToken = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.USER_INFO);
    if (response) {
      const userInfo = JSON.parse(response);
      if (userInfo.access_token) {
        return userInfo.access_token;
      }
      return null;
    }
    return null;
  } catch (err) {
    return null;
  }
};
