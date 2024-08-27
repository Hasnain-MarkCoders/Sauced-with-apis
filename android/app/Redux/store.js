import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userReducer';
import topRatedSaucesSlice from './topRatedSauces';
import countSlice from './count';
import featuredSaucesSlice from './featuredSauces';
import reFetchReducer from './reFetchReducer';

const rootReducer = combineReducers({
    auth:userReducer,
    count:countSlice,
    topRatedSauces:topRatedSaucesSlice,
    featuredSauces:featuredSaucesSlice,
    refetch:reFetchReducer
})
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'topRatedSauces', 'featuredSauces']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

const persistor = persistStore(store);

export { store, persistor };
