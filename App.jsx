import * as React from 'react';
import AppRouter from './AppRouter';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/Redux/store';
import { LogBox } from 'react-native';
import BootSplash from "react-native-bootsplash";
import Toast, { BaseToast }  from 'react-native-toast-message';
import { scale } from 'react-native-size-matters';
import { Platform } from 'react-native';
import { NativeModules } from 'react-native';

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
