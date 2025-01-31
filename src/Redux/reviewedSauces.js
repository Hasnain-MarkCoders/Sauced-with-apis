import { createSlice } from '@reduxjs/toolkit';

const reviewedSaucesSlice = createSlice({
  name: 'reviewedsauces',
  initialState: [],
  reducers: {
    handleReviewedSauces: (state, action) => {
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
      return Array.from(stateMap?.values())||[];
    },

    handleToggleReviewedSauce:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    },
    handleIncreaseReviewCountOfReviewedSauce:(state, action)=>{
      const _id = action.payload?._id;
      const cb = action.payload?.setReviewCount || function() {};
    
      const sauceIndex = state.findIndex(x => x._id === _id);
      if (sauceIndex !== -1) {
        // Make a shallow copy of the state and the target sauce to ensure immutability
        const newState = [...state];
        const newSauce = { ...newState[sauceIndex] };
    
        // Update the review count
        newSauce.reviewCount = newSauce.reviewCount + 1;
        newState[sauceIndex] = newSauce;
    
        // Execute callback with the new review count
        // cb(newSauce.reviewCount);
    
        return newState;
      }
      
      return state;
    },
    clearReviewedSauces: (state, action) => {
      return [];
    },
  },
});

export const { handleReviewedSauces, handleToggleReviewedSauce,handleIncreaseReviewCountOfReviewedSauce, clearReviewedSauces } = reviewedSaucesSlice.actions;
export default reviewedSaucesSlice.reducer;
