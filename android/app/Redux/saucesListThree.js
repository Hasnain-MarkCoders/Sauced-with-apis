import { createSlice } from '@reduxjs/toolkit';

const saucesListThreeSlice = createSlice({
  name: 'saucesListThree',
  initialState: [],
  reducers: {
    handleSaucesListThree: (state, action) => {
      // Create a map of existing state items by their _id
      const stateMap = new Map(state.map(item => [item._id, item]));

      // Update the map with the new payload items
      action.payload.forEach(item => {
        stateMap.set(item._id, item);
      });

      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleToggleSauceListThree:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    }
  },
});

export const { handleSaucesListThree, handleToggleSauceListThree } = saucesListThreeSlice.actions;
export default saucesListThreeSlice.reducer;
