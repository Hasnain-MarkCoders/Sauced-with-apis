import { createSlice } from '@reduxjs/toolkit';

const countSlice = createSlice({
  name: 'count',
  initialState: {count:0},
  reducers: {
    setCount: (state, action) => {
      return {...state, count :action.payload}
    },
  },
});

export const { setCount } = countSlice.actions;
export default countSlice.reducer;