export const settings = {
  baseUrl: 'https://restaurant-api.pickgo.la',
  login: '/api/user/login',
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
