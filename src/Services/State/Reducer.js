export const actions = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ALERT_SETTINGS: 'SET_ALERT_SETTINGS',
  SET_PROGRESS_SETTINGS: 'SET_PROGRESS_SETTINGS',
  SET_TABLES: 'SET_TABLES',
  SET_RESERVATIONS: 'SET_RESERVATIONS',
  SET_NOTIFICATION_COUNT: 'SET_NOTIFICATION_COUNT',
  SET_IS_WIDE_SCREEN: 'SET_IS_WIDE_SCREEN',
  SET_LANGUAGE: 'SET_LANGUAGE',
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
    case actions.SET_RESERVATIONS:
      return {
        ...state,
        reservations: action.reservations,
      };
    case actions.SET_IS_WIDE_SCREEN:
      return {
        ...state,
        isWideScreen: action.isWideScreen,
      };
    case actions.SET_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.selectedLanguage,
      };
    default:
      return state;
  }
};
