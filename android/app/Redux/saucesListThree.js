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
      state.forEach(item => {
        if (!stateMap.has(item._id)) {
          stateMap.delete(item._id);
        }
      });
      // Replace the state with the updated map values
      return Array.from(stateMap.values());
    },

    handleToggleSauceListThree:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    },
    handleRemoveSauceFromListThree: (state, action) => {
      return state.filter(x => x._id !== action.payload);
    },

    handleIncreaseReviewCountOfListThreeSauce:(state, action)=>{
      return state.filter(x => x._id !== action.payload);
    },
    handleIncreaseReviewCountOfListOneSauce:(state, action)=>{
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
    }
  },
});

export const { handleSaucesListThree, handleToggleSauceListThree, handleRemoveSauceFromListThree , handleIncreaseReviewCountOfListThreeSauce} = saucesListThreeSlice.actions;
export default saucesListThreeSlice.reducer;
