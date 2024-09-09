import { createSlice } from '@reduxjs/toolkit';

const favoriteSaucesSlice = createSlice({
  name: 'favoriteSauces',
  initialState: [],
  reducers: {
    handleFavoriteSauces: (state, action) => {
      // Create a map of existing state items by their _id
      const stateMap = new Map(state.map(item => [item._id, item]));

      // Update the map with the new payload items
      action.payload.forEach(item => {
        stateMap.set(item._id, item);
      });

      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleToggleFavoriteSauce:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    },
    handleIncreaseReviewCountOfFavoriteSauce:(state, action)=>{
      const sauce = state.find(x => x._id == action.payload);
      if (sauce) {
        return [...state, {...sauce, reviewCount :sauce.reviewCount+1}]
      }
    }
  },
});

export const { handleFavoriteSauces, handleToggleFavoriteSauce, handleIncreaseReviewCountOfFavoriteSauce } = favoriteSaucesSlice.actions;
export default favoriteSaucesSlice.reducer;
