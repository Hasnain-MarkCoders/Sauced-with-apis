import { createSlice } from '@reduxjs/toolkit';

const followersSlice = createSlice({
  name: 'followers',
  initialState: [],
  reducers: {
    handleFollowersSearch: (state, action) => {
      return action.payload;  // Replace state with search results
    },

    handleFollowers: (state, action) => {
      // When it's the first page, replace the state entirely
      if (action.meta?.isFirstPage) {
        return action.payload;
      } else {
        // Otherwise, merge new followers with the existing ones for pagination
        const stateMap = new Map(state.map(item => [item._id, item]));
        action.payload.forEach(item => {
          stateMap.set(item._id, item);
        });
        return Array.from(stateMap.values());
      }
    },

    handleRemoveUserFromFollowers: (state, action) => {
      return state.filter(x => x._id !== action.payload);
    },

    handleFollowersCount: (state, action) => {
      return action.payload;
    },

    clearFollowersState: () => {
      // Clear followers state, useful when starting a new search or fetch
      return [];
    },
  },
});

export const { 
  handleFollowers, 
  handleRemoveUserFromFollowers, 
  handleFollowersCount, 
  handleFollowersSearch, 
  clearFollowersState 
} = followersSlice.actions;

export default followersSlice.reducer;
