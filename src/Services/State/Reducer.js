export const actions = {
  SET_USER: 'SET_USER',
  SET_ALERT_SETTINGS: 'SET_ALERT_SETTINGS',
  SET_PROGRESS_SETTINGS: 'SET_PROGRESS_SETTINGS',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.user,
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
