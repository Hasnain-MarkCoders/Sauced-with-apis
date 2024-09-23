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
import interestedEventsSlice from './InterestedEvents';
import usersSlice from './users';
import followersSlice from './followers';
import followingsSlice from './followings';
import userStatsSlice from './userStats';
import searchedUsersSlice from './searchedUsers';
import allEventsExceptInterestedSlice from './allEventsExceptInterested';
import notificationsSlice from './notifications'
import wishListSlice from './wishlist'
import quickCheckinSlice from './quickCheckin'
import reviewedSaucesSlice from './reviewedSauces'




// Root reducer with LOGOUT action handler to reset state
const appReducer = combineReducers({
    auth: userReducer,
    favoriteSauces: favoriteSaucesSlice,
    saucesListOne: saucesListOneSlice,
    saucesListTwo: saucesListTwoSlice,
    saucesListThree: saucesListThreeSlice,
    topRatedSauces: topRatedSaucesSlice,
    featuredSauces: featuredSaucesSlice,
    checkedInSauces: checkedInSaucesSlice,
    interestedEvents: interestedEventsSlice,
    users: usersSlice,
    followers: followersSlice,
    followings: followingsSlice,
    userStats: userStatsSlice,
    searchedUsers: searchedUsersSlice,
    allEventsExceptInterested: allEventsExceptInterestedSlice,
    notifications:notificationsSlice,
    wishlist:wishListSlice,
    quickcheckin:quickCheckinSlice,
    reviewedsauces:reviewedSaucesSlice
});

// Handling the LOGOUT action to reset all state
const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    // Clear state by setting it to undefined
    state = undefined;
  }
  return appReducer(state, action);
};

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth', 
    'topRatedSauces', 
    'featuredSauces',
    'favoriteSauces',
    'checkedInSauces',
    'saucesListOne', 
    'saucesListTwo', 
    'saucesListThree', 
    'interestedEvents', 
    'users', 
    'followers', 
    'followings', 
    'userStats', 
    'searchedUsers',
    'notifications',
    'wishlist',
    'quickcheckin',
    'reviewedsauces'

  ]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

// Persistor for persisting the store
const persistor = persistStore(store);

export { store, persistor };
