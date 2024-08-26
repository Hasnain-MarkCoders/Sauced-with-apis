import { createSlice } from '@reduxjs/toolkit';

const topRatedSaucesSlice = createSlice({
  name: 'topRatedSauces',
  initialState: [],
  reducers: {
    handleTopRatedSauces: (state, action) => {
      return [ ...state, ...action.payload] ;
    },
  },
});

export const { handleTopRatedSauces } = topRatedSaucesSlice.actions;
export default topRatedSaucesSlice.reducer;