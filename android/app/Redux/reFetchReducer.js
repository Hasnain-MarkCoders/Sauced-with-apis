import { createSlice } from '@reduxjs/toolkit';

const reFetchSlice = createSlice({
  name: 'refetch',
  initialState: false,
  reducers: {
    handleRefetch: (state, action) => {
      return action.payload 
    },
  },
});

export const { handleRefetch } = reFetchSlice.actions;
export default reFetchSlice.reducer;