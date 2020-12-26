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
  TABLES: {
    LIST: `${BASE_URLS.APP_BASEURL}/api/company-table/index?access_token=$[acces_token]`,
  },
  RESERVATIONS: {
    LIST: `${BASE_URLS.AUTH_BASEURL}/order/order_summary?access_token=$[acces_token]`,
    ACCEPT_ORDER: `${BASE_URLS.APP_BASEURL}/api/order/accept?access_token=$[acces_token]`,
    ORDER_SUMMARY: `${BASE_URLS.APP_BASEURL}/api/order/summary?access_token=$[acces_token]`,
    MAKE_REQUEST: `${BASE_URLS.APP_BASEURL}/api/order/admin-send-to-customer/$[order_id]?access_token=$[acces_token]`,
  },
  driver: {
    getOnlineDrivers: '/api/user/online-drivers',
    updateDriverStatus: '/api/user/update-driver-status?access_token=[token]',
    updateLatLng: '/api/user/update-user-lat-long?access_token=[token]',
    getHistory: '/api/order/get-driver-orders?access_token=[token]',
    updateDeliveryStatus: '/api/order/update-delivery-order',
    getNearbyOrders: '/api/order/get-nearby-orders?access_token=[token]',
    updatePlayerID:
      '/api/user/onesignal-notifications-token?access_token=[token]',
  },
};
