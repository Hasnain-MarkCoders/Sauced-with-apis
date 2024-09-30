import { createSlice } from '@reduxjs/toolkit';

const followingsSlice = createSlice({
  name: 'followings',
  initialState: [],
  reducers: {
    handleFollowingSearch: (state, action) => {
      return action.payload;
    },

    handleFollowings: (state, action) => {
      // Replace the state when fetching new data (e.g., on first page or search)
      if (action.meta?.isFirstPage) {
        return action.payload;
      } else {
        const stateMap = new Map(state.map(item => [item._id, item]));
        action.payload.forEach(item => {
          stateMap.set(item._id, item);
        });
        return Array.from(stateMap.values());
      }
    },

    handleRemoveUserFromFollowings: (state, action) => {
      return state.filter(x => x._id !== action.payload);
    },

    clearFollowingsState: () => {
      // Clear the state entirely (useful for resetting on new searches or fetches)
      return [];
    },
  },
});

export const { handleFollowings, handleRemoveUserFromFollowings, handleFollowingSearch, clearFollowingsState } = followingsSlice.actions;
export default followingsSlice.reducer;
