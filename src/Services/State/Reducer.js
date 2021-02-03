export const actions = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ALERT_SETTINGS: 'SET_ALERT_SETTINGS',
  SET_PROGRESS_SETTINGS: 'SET_PROGRESS_SETTINGS',
  SET_TABLES: 'SET_TABLES',
  SET_NOTIFICATION_COUNT: 'SET_NOTIFICATION_COUNT',
  SET_IS_WIDE_SCREEN: 'SET_IS_WIDE_SCREEN',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case actions.SET_PROGRESS_SETTINGS: {
      return {
        ...state,
        progressSettings: {show: action.show, promise: null},
      };
    }
    case actions.SET_ALERT_SETTINGS:
      return {
        ...state,
        alertSettings: {settings: action.alertSettings, promise: null},
      };
    case actions.SET_TABLES:
      return {
        ...state,
        tables: action.tables,
      };
    case actions.SET_IS_WIDE_SCREEN:
      return {
        ...state,
        isWideScreen: action.isWideScreen,
      };
    default:
      return state;
  }
};
