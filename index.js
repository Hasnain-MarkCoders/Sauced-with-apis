

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
// import { addNotification, increaseCount } from './android/app/Redux/notifications';
import 'react-native-get-random-values'
import { store } from './src/Redux/store'; 
import { addNotification,increaseCount } from './src/Redux/notifications';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    store.dispatch(
      addNotification({
        type: 'success',
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        isRead:remoteMessage.data.isRead=="1"?true:false,
        data: remoteMessage.data
      })
    );
    store.dispatch(increaseCount());
  })

AppRegistry.registerComponent(appName, () => App);
