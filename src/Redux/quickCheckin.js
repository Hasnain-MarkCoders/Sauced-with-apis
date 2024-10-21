import { createSlice } from '@reduxjs/toolkit';

const quickCheckinSlice = createSlice({
  name: 'quickcheckin',
  initialState: {
  },
  reducers: {
    handleQuickCheckin: (state, action) => {
           return action.payload
      },
  },
});

export const {handleQuickCheckin} = quickCheckinSlice.actions;
export default quickCheckinSlice.reducer;
