/**
 * @format
 */

import {AppRegistry} from 'react-native';
import ChatParent from './App';
import {name as appName} from './app.json';
console.reportErrorsAsExceptions = false;
AppRegistry.registerComponent(appName, () => ChatParent);
