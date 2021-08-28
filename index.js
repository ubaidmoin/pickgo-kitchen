/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {android_name, ios_name} from './app.json';

AppRegistry.registerComponent(
  Platform.OS === 'ios' ? ios_name : android_name,
  () => App,
);
