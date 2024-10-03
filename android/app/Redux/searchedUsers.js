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
      handleToggleSearchedUserIsFollowing:(state, action)=>{
        const user = state.find(x=>x._id==action.payload)
        if(user){
          user.isFollowing  =!user.isFollowing
        }
      },

  },
});

export const { handleSearchedUsers, handleRemoveSearchedUsers , appendSearchedUsers, handleToggleSearchedUserIsFollowing} = usersSlice.actions;
export default usersSlice.reducer;
