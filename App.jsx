import * as React from 'react';
import AppRouter from './AppRouter';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/Redux/store';
import {  Alert, BackHandler, Linking, LogBox, Text, View } from 'react-native';
import BootSplash from "react-native-bootsplash";
import Toast, { BaseToast }  from 'react-native-toast-message';
import { scale } from 'react-native-size-matters';
import { Platform } from 'react-native';
import SpInAppUpdates, {
  AndroidInstallStatus,
  IAUUpdateKind,
} from 'sp-react-native-in-app-updates';
const APP_STORE_URL = 'https://apps.apple.com/us/app/sauced-app/id6737129890';
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

const inAppUpdates = new SpInAppUpdates(
  false // isDebug
);

// inAppUpdates.checkNeedsUpdate().then(result => {
//   if (result.shouldUpdate) {
//     const updateOptions = Platform.select({
//       ios: {
//         title: 'Update available',
//         message: "There is a new version of the app available on the App Store, do you want to update it?",
//         buttonUpgradeText: 'Update',
//         buttonCancelText: 'Cancel',
//         forceUpgrade :true
//       },
//       android: {
//         updateType: IAUUpdateKind.IMMEDIATE,
//       },
//     });
//     inAppUpdates.startUpdate(updateOptions);
//   }
// });


inAppUpdates.checkNeedsUpdate().then((result) => {
  if (result.shouldUpdate) {
    const showUpdatePrompt = () => {
      const updateOptions = Platform.select({
        ios: {
          title: 'Update available',
          message: "There is a new version of the app available on the App Store, do you want to update it?",
          buttonUpgradeText: 'Update',
          buttonCancelText: 'Cancel',
          forceUpgrade: true, // Ensures user cannot dismiss the update
          onUpgrade: () => Linking.openURL(APP_STORE_URL),
        },
        android: {
          updateType: IAUUpdateKind.IMMEDIATE,
        },
      });

      inAppUpdates.startUpdate(updateOptions).then(() => {
        // Android-specific listeners
        if (Platform.OS === 'android') {
          // Listen for status changes (e.g., cancellation)
          inAppUpdates.addStatusUpdateListener((status) => {
            if (status.status === AndroidInstallStatus.CANCELED || status.status === AndroidInstallStatus.FAILED) {
              BackHandler.exitApp(); // Close app on cancellation/failure
            }
          });
        }
      });
    };

    showUpdatePrompt();
  }
});


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
