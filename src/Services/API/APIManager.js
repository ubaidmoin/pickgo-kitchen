import {getData, postData, deleteData} from './CoreAPICalls';
import {settings as s} from '../Settings';
import {getAccessToken} from '../DataManager';

export const getOrders = async () => {
  try {
    const url = s.ORDERS.GET_ORDERS.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOrdersNewCooking = async () => {
  try {
    const url = s.ORDERS.GET_NEW_COOKING_ORDERS.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getTodayOrders = async () => {
  try {
    const url = s.ORDERS.GET_TODAY_ORDERS.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOtherOrders = async () => {
  try {
    const url = s.ORDERS.GET_OTHER_ORDERS.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getTodayOrdersPagination = async (page, limit) => {
  try {
    const url = s.ORDERS.GET_TODAY_ORDERS_PAGINATION.replace(
      '$[access_token]',
      await getAccessToken(),
    )
      .replace('$[page]', page)
      .replace('$[limit]', limit);
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOtherOrdersPagination = async (page, limit) => {
  try {
    const url = s.ORDERS.GET_OTHER_ORDERS_PAGINATION.replace(
      '$[access_token]',
      await getAccessToken(),
    )
      .replace('$[page]', page)
      .replace('$[limit]', limit);
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOtherOrdersByTime = async (start_time, end_time) => {
  try {
    const url = s.ORDERS.GET_OTHER_ORDERS_BY_TIME.replace(
      '$[access_token]',
      await getAccessToken(),
    )
      .replace('$[start_time]', start_time)
      .replace('$[end_time]', end_time);
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOrderDetails = async (id) => {
  try {
    const url = s.ORDERS.GET_ORDER_DETAILS.replace('$[id]', id).replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOrdersCookedDelivered = async () => {
  try {
    const url = s.ORDERS.GET_COOKED_DELIVERED_ORDERS.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOrdersCookedDeliveredPagination = async (page, limit) => {
  try {
    const url = s.ORDERS.GET_COOKED_DELIVERED_ORDERS_PAGINATION.replace(
      '$[access_token]',
      await getAccessToken(),
    )
      .replace('$[page]', page)
      .replace('$[limit]', limit);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const updatePlayerID = async (data) => {
  try {
    const url = s.ONE_SIGNAL.UPDATE_PLAYER_ID.replace(
      '$[access_token]',
      await getAccessToken(),
    );
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const updateOrderStatus = async (id, data) => {
  try {
    const url = s.ORDERS.UPDATE_ORDER_STATUS.replace('$[id]', id).replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const updateItemStatus = async (id, data) => {
  try {
    const url = s.ORDERS.UPDATE_ITEM_STATUS.replace('$[id]', id).replace(
      '$[access_token]',
      await getAccessToken(),
    );
    console.log(url, data);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const getTables = async () => {
  try {
    const url = s.TABLES.LIST.replace('$[acces_token]', await getAccessToken());
    console.log(url);
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
    console.log(url);
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
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const sendOrderRequest = async (orderId) => {
  try {
    const url = s.RESERVATIONS.MAKE_REQUEST.replace(
      '$[order_id]',
      orderId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getTableDetails = async (tableId) => {
  try {
    const url = s.TABLES.GET_DETAILS.replace('$[table_id]', tableId).replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getMenu = async () => {
  try {
    const url = s.MENU.LIST.replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getMenuDetails = async (menuId) => {
  try {
    const url = s.MENU.GET_DETAILS.replace('$[menu_id]', menuId).replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const updateMenuStatus = async (data) => {
  try {
    const url = s.MENU.UPDATE_MENU_STATUS.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const updateMenuOptionItemStatus = async (data) => {
  try {
    const url = s.MENU.UPDATE_MENU_OPTION_ITEM.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const addToTableCart = async (data) => {
  try {
    const url = s.MENU.ADD_TO_TABLE_CART.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const deleteFromTableCart = async (cartItemId) => {
  try {
    const url = s.MENU.DELETE_FROM_TABLE_CART.replace(
      '$[cart_item_id]',
      cartItemId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await deleteData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const sendToKitchen = async (tableId) => {
  try {
    const url = s.TABLES.SEND_TO_KITCHEN.replace(
      '$[table_id]',
      tableId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const splitEqual = async (orderId, data) => {
  try {
    const url = s.RESERVATIONS.SPLIT_EQUAL.replace(
      '$[order_id]',
      orderId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const splitByAmount = async (orderId, data) => {
  try {
    const url = s.RESERVATIONS.SPLIT_BY_AMOUNT.replace(
      '$[order_id]',
      orderId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const makeTransaction = async (transactionId, data) => {
  try {
    const url = s.TRANSACTIONS.MAKE_TRANSACTION.replace(
      '$[transaction_id]',
      transactionId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const saveFcmToken = async (data) => {
  try {
    const url = s.USER.SAVE_FCM_TOKEN.replace(
      '$[acces_token]',
      await getAccessToken(),
    );
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const sendNotification = async (data) => {
  try {
    const url = s.USER.NOTIFY.replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const addCustomOrderAmount = async (data) => {
  try {
    const url = s.DISCOUNT.CUSTOM_ORDER_AMOUNT;
    console.log(url);
    const response = await postData(url, data, true);
    return response;
  } catch (err) {
    return null;
  }
};

export const getCustomerDiscount = async (data) => {
  try {
    const url = s.DISCOUNT.CUSTOMER_DISCOUNT;
    console.log(url);
    const response = await postData(url, data, true);
    return response;
  } catch (err) {
    return null;
  }
};

export const adminSendToCustomer = async (orderId) => {
  try {
    const url = s.RESERVATIONS.ADMIN_SEND_TO_CUSTOMER.replace(
      '$[order_id]',
      orderId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const adminPay = async (orderId) => {
  try {
    const url = s.RESERVATIONS.ADMIN_PAY.replace(
      '$[order_id]',
      orderId,
    ).replace('$[acces_token]', await getAccessToken());
    console.log(url);
    const response = await postData(url);
    return response;
  } catch (err) {
    return null;
  }
};
