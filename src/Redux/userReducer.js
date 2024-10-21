import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    "token": null,
    "uid": null,
    "name": null,
    "email": null,
    "provider": null,
    "type": null,
    "status": null,
    "_id": null,
    "url":null,
    "authenticated": false,
  },
  reducers: {
    handleAuth: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { handleAuth } = userSlice.actions;
export default userSlice.reducer;