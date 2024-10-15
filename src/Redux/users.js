import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    handleUsers: (state, action) => {
      // Create a map of existing state items by their _id
      const stateMap = new Map(state.map(item => [item._id, item]));

      // Update the map with the new payload items
      action.payload.forEach(item => {
        stateMap.set(item._id, item);
      });
      state.forEach(item => {
        if (!stateMap.has(item._id)) {
          stateMap.delete(item._id);
        }
      });

      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleRemoveUserFromUsers: (state, action) => {
        return state.filter(x => x._id !== action.payload);
      },

  },
});

export const { handleUsers, handleRemoveUserFromUsers } = usersSlice.actions;
export default usersSlice.reducer;
