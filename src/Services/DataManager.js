import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_INFO: 'USER_INFO',
  NOTIFICATIONS: 'NOTIFICATIONS',
};

export const setUserInfo = async (userDetails) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_INFO, JSON.stringify(userDetails));
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

export const addNotification = async (notification) => {
  try {
    const allNotifications = await getNotifications();
    if (allNotifications && allNotifications.length > 0) {
      allNotifications.push(notification);
      await AsyncStorage.setItem(
        KEYS.NOTIFICATIONS,
        JSON.stringify(allNotifications),
      );
    } else {
      await AsyncStorage.setItem(
        KEYS.NOTIFICATIONS,
        JSON.stringify([notification]),
      );
    }
  } catch (err) {
    return null;
  }
};

export const getNotifications = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const updateNotification = async (time, notification) => {
  try {
    const allNotifications = await getNotifications();
    if (allNotifications && allNotifications.length > 0) {
      const index = allNotifications.findIndex(
        (notification) => notification.time === time,
      );
      allNotifications[index] = notification;
      await AsyncStorage.setItem(
        KEYS.NOTIFICATIONS,
        JSON.stringify(allNotifications),
      );
    }
  } catch (err) {
    return null;
  }
};

export const clearNotifications = async () => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS, '');
  } catch (err) {
    return null;
  }
};

export const getNotificationCount = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
    if (response) {
      return JSON.parse(response).filter((notification) => !notification.isSeen)
        .length;
    }
    return 0;
  } catch (err) {
    return 0;
  }
};
