import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  count: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.count += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.count = 0;
    },
    increaseCount: (state) => {
      state.count += 1;
    },
    clearCount: (state) => {
      state.count = 0;
    },
    deleteNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
    },
  },
});

export const {
  addNotification,
  clearNotifications,
  increaseCount,
  clearCount,
  deleteNotification
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
