import { createSlice } from '@reduxjs/toolkit';

const topRatedSaucesSlice = createSlice({
  name: 'topRatedSauces',
  initialState: [],
  reducers: {
    handleTopRatedSauces: (state, action) => {
      // Create a map of existing state items by their _id
      const stateMap = new Map(state.map(item => [item._id, item]));

      // Update the map with the new payload items
      action.payload.forEach(item => {
        stateMap.set(item._id, item);
      });

      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleToggleTopRatedSauce:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    }
  },
});

export const { handleTopRatedSauces, handleToggleTopRatedSauce } = topRatedSaucesSlice.actions;
export default topRatedSaucesSlice.reducer;
