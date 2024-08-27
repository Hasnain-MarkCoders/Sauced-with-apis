import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userReducer';
import topRatedSaucesSlice from './topRatedSauces';
import featuredSaucesSlice from './featuredSauces';
import favoriteSaucesSlice from './favoriteSauces';
import checkedInSaucesSlice from './checkedInSauces';
import saucesListOneSlice from './saucesListOne';
import saucesListTwoSlice from './saucesListTwo';
import saucesListThreeSlice from './saucesListThree';



const rootReducer = combineReducers({
    auth:userReducer,
    favoriteSauces:favoriteSaucesSlice,
    saucesListOne:saucesListOneSlice,
    saucesListTwo:saucesListTwoSlice,
    saucesListThree:saucesListThreeSlice,
    topRatedSauces:topRatedSaucesSlice,
    featuredSauces:featuredSaucesSlice,
    favoriteSauces:favoriteSaucesSlice,
    checkedInSauces:checkedInSaucesSlice,

})
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'topRatedSauces', 'featuredSauces','favoriteSauces','checkedInSauces','saucesListOne', 'saucesListTwo', 'saucesListThree']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

const persistor = persistStore(store);

export { store, persistor };
