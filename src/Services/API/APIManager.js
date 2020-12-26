import {getData, postData} from './CoreAPICalls';
import {settings as s} from '../Settings';
import {getAccessToken} from '../DataManager';

export const getTables = async () => {
  try {
    const url = s.TABLES.LIST.replace('$[acces_token]', await getAccessToken());
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getReservations = async () => {
  try {
    const url = s.RESERVATIONS.LIST.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const acceptOrder = async (data) => {
  try {
    const url = s.RESERVATIONS.ACCEPT_ORDER.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOrderSummary = async (data) => {
  try {
    const url = s.RESERVATIONS.ORDER_SUMMARY.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const sendOrderRequest = async (order_id) => {
  try {
    const url = s.RESERVATIONS.MAKE_REQUEST.replace(
      '$[order_id]',
      order_id,
    ).replace('$[acces_token]', await getAccessToken());
    const response = await postData(url);
    return response;
  } catch (err) {
    return null;
  }
};
