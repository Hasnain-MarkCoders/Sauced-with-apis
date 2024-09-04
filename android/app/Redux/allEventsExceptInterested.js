import { createSlice } from '@reduxjs/toolkit';

const allEventsExceptInterestedSlice = createSlice({
  name: 'allEventsExceptInterested',
  initialState: [],
  reducers: {
    handleAllEventsExceptInterested: (state, action) => {
      // Create a map of existing state items by their _id
      const stateMap = new Map(state.map(item => [item._id, item]));
      // Update the map with the new payload items
      action.payload.forEach(item => {
        stateMap.set(item._id, item);
      });

      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleRemoveAllEventsExceptInterested: (state, action) => {
        return state.filter(x => x._id !== action.payload);
      },
  },
});

export const { handleAllEventsExceptInterested, handleRemoveAllEventsExceptInterested } = allEventsExceptInterestedSlice.actions;
export default allEventsExceptInterestedSlice.reducer;
