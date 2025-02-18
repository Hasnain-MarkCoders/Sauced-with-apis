import * as React from 'react';
import AppRouter from './AppRouter';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/Redux/store';
import { LogBox } from 'react-native';
import BootSplash from "react-native-bootsplash";
import Toast, { BaseToast }  from 'react-native-toast-message';
import { scale } from 'react-native-size-matters';
import { Alert, Linking, Platform } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

function App() {
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

React.useEffect(() => {
  if (__DEV__) {
    console.warn = () => {};
    console.error = () => {};
  }
  const init = async () => {
    // …do multiple sync or async tasks
  };

  init().finally(async () => {
    await BootSplash.hide({ fade: true });
  });
}, []);


React.useEffect(() => {
  const checkForUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(false);  // Disable debug mode for production
    try {
      // Check if an update is available without needing to manually specify the version
      const result = await inAppUpdates.checkNeedsUpdate();

      console.log('Update check result:', result);

      // For Android
      if (Platform.OS === 'android') {
        if (result.shouldUpdate) {
          console.log('Android update available');
          inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });  // Force update immediately
        } else {
          console.log('No update needed on Android');
        }
      }

      // For iOS
      else if (Platform.OS === 'ios') {
        if (result.shouldUpdate) {
          console.log('iOS update available. Redirecting to App Store.');
          const appStoreURL = 'itms-apps://apps.apple.com/us/app/sauced-app/id6737129890';  // Your App Store URL
          Linking.openURL(appStoreURL);  // Redirect to App Store
        } else {
          console.log('No update needed for iOS.');
        }
      }
    } catch (error) {
      console.error('Error checking update:', error);
    }
  };

  checkForUpdate();  // Trigger the check on app startup
}, []);


const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor:"#FFA100", borderColor:"#FFA100",}}
      contentContainerStyle={{  backgroundColor:"#FFA100", borderRadius:20}}
      text1Style={{
        fontSize: scale(14),
        fontWeight: '600',
        color:"#000",
        marginBottom:0

      }}
      text2Style={{
        fontSize: scale(12),
        fontWeight: '400',
        color:"#fff"

      }}
    />
  ),
  

};



  return (
    <>
     <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <AppRouter/>
        <Toast 
        config={toastConfig} 
        />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
