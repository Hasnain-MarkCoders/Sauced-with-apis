import { createSlice } from '@reduxjs/toolkit';

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState: {
    followers:null,
    followings:null,
    checkins:null,
    uri:null,
    name:null,
    date:null
  },
  reducers: {
    handleStatsChange: (state, action) => {
           state.followings +=  action.payload.followings>0?action.payload.followings:0;
          state.followers += action.payload.followers>0?action.payload.followers:0; // Example for handling followers
          state.checkins += action.payload.checkins || 0
      },
      handleStats:(state, action)=>{
        state.followings = action.payload.followings||0;
        state.followers = action.payload.followers || 0; // Example for handling followers
        state.checkins = action.payload.checkins || 0
        state.uri=action.payload.uri||""
        state.name=action.payload.name||""
        state.date=action.payload.date||""

      }

  },
});

export const {handleStatsChange, handleStats} = userStatsSlice.actions;
export default userStatsSlice.reducer;
