import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'searchedUsers',
  initialState: [],
  reducers: {
    handleSearchedUsers: (state, action) => {
       
          return action.payload
    },
    appendSearchedUsers: (state, action) => {
      // For pagination, append the new users to the existing ones
      return [...state, ...action.payload];
    },

    handleRemoveSearchedUsers: (state, action) => {
        return state.filter(x => x._id !== action.payload);
      },

  },
});

export const { handleSearchedUsers, handleRemoveSearchedUsers , appendSearchedUsers} = usersSlice.actions;
export default usersSlice.reducer;
