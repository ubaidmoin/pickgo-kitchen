export const actions = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ALERT_SETTINGS: 'SET_ALERT_SETTINGS',
  SET_PROGRESS_SETTINGS: 'SET_PROGRESS_SETTINGS',
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
    default:
      return state;
  }
};
