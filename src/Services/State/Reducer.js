export const actions = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ALERT_SETTINGS: 'SET_ALERT_SETTINGS',
  SET_PROGRESS_SETTINGS: 'SET_PROGRESS_SETTINGS',
  SET_TABLES: 'SET_TABLES',
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
    default:
      return state;
  }
};
