import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'searchedUsers',
  initialState: [],
  reducers: {
    handleSearchedUsers: (state, action) => {
       
          return action.payload
    },

    handleRemoveSearchedUsers: (state, action) => {
        return state.filter(x => x._id !== action.payload);
      },

  },
});

export const { handleSearchedUsers, handleRemoveSearchedUsers } = usersSlice.actions;
export default usersSlice.reducer;
