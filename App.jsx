import * as React from 'react';
import AppRouter from './AppRouter';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './android/app/Redux/store';
import { LogBox } from 'react-native';
import BootSplash from "react-native-bootsplash";
import Toast from 'react-native-toast-message';

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





  return (
    <>
     <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <AppRouter/>
        <Toast />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
