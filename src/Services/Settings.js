export const BASE_URLS = {
  AUTH_BASEURL: 'https://pickgo.la/restaurants',
  IMAGE_BASEURL: 'https://pickgo.la/restaurants/uploads/',
  APP_BASEURL: 'https://restaurant-api.pickgo.la',
};

export const settings = {
  AUTH_BASEURL: BASE_URLS.AUTH_BASEURL,
  IMAGE_BASEURL: BASE_URLS.IMAGE_BASEURL,
  APP_BASEURL: BASE_URLS.APP_BASEURL,
  LOGIN: `${BASE_URLS.AUTH_BASEURL}/main/login_auth_mobile`,
  USER: {
    SAVE_FCM_TOKEN: `${BASE_URLS.APP_BASEURL}/api/user/notifications-token?access_token=$[acces_token]`,
    NOTIFY: `${BASE_URLS.APP_BASEURL}/api/user/notify?access_token=$[acces_token]`,
  },
  TABLES: {
    LIST: `${BASE_URLS.APP_BASEURL}/api/company-table/index?access_token=$[acces_token]`,
    GET_DETAILS: `${BASE_URLS.APP_BASEURL}/api/company-table/view/$[table_id]?access_token=$[acces_token]`,
    SEND_TO_KITCHEN: `${BASE_URLS.APP_BASEURL}/api/company-table/send-to-kitchen/$[table_id]?access_token=$[acces_token]`,
  },
  MENU: {
    LIST: `${BASE_URLS.APP_BASEURL}/api/company-info/menu?access_token=$[acces_token]`,
    GET_DETAILS: `${BASE_URLS.APP_BASEURL}/api/menu/show/$[menu_id]?access_token=$[acces_token]`,
    ADD_TO_TABLE_CART: `${BASE_URLS.APP_BASEURL}/api/order-cart/add-to-table?access_token=$[acces_token]`,
    DELETE_FROM_TABLE_CART: `${BASE_URLS.APP_BASEURL}/api/cart/delete/$[cart_item_id]?access_token=$[acces_token]`,
  },
  RESERVATIONS: {
    LIST: `${BASE_URLS.AUTH_BASEURL}/order/order_summary?access_token=$[acces_token]`,
    ACCEPT_ORDER: `${BASE_URLS.APP_BASEURL}/api/order/accept?access_token=$[acces_token]`,
    ORDER_SUMMARY: `${BASE_URLS.APP_BASEURL}/api/order/summary?access_token=$[acces_token]`,
    MAKE_REQUEST: `${BASE_URLS.APP_BASEURL}/api/order/admin-send-to-customer/$[order_id]?access_token=$[acces_token]`,
    SPLIT_EQUAL: `${BASE_URLS.APP_BASEURL}/api/order/split-equal/$[order_id]?access_token=$[acces_token]`,
    SPLIT_BY_AMOUNT: `${BASE_URLS.APP_BASEURL}/api/order/split-by-amount/$[order_id]?access_token=$[acces_token]`,
    ADMIN_SEND_TO_CUSTOMER: `${BASE_URLS.APP_BASEURL}/api/order/admin-send-to-customer/$[order_id]?access_token=$[acces_token]`,
    ADMIN_PAY: `${BASE_URLS.APP_BASEURL}/api/order/admin-pay/$[order_id]?access_token=$[acces_token]`,
  },
  TRANSACTIONS: {
    MAKE_TRANSACTION: `${BASE_URLS.APP_BASEURL}/api/transaction/confirm/$[transaction_id]?access_token=$[acces_token]`,
  },
  DISCOUNT: {
    CUSTOM_ORDER_AMOUNT: `${BASE_URLS.APP_BASEURL}/api/discount/customorderamount`,
  },
};
