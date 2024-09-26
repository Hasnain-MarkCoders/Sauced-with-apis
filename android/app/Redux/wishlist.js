import { createSlice } from '@reduxjs/toolkit';

const wishListSlice = createSlice({
  name: 'wishlist', // Changed name to 'wishList'
  initialState: [],
  reducers: {

    handleWishList: (state, action) => {
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
      // return [...state, ...action.payload]
    },
    handleToggleWishList: (state, action) => {
      const sauceId = action?.payload?._id; // Assuming payload is the _id of the sauce
    
      // Check if the sauce already exists in the state
      const existingSauce = state.find(item => item._id === sauceId);
    
      if (existingSauce) {
        // If it exists, remove it from the state
        return state.filter(item => item._id !== sauceId);
      } else {
        // If it doesn't exist, add it to the state
        return [...state, action?.payload]; // You may want to include other sauce properties as needed
      }
    },

    handleToggleLikeWishlistSauce:(state, action)=>{
      const sauce = state.find(x=>x._id==action.payload)
      if(sauce){
        sauce.hasLiked  =!sauce.hasLiked
      }
      
    },

    handleRemoveSauceFromWishList: (state, action) => {
      return state.filter(sauce => sauce._id !== action.payload);
    },

    handleIncreaseReviewCountOfWishListSauce: (state, action) => {
   
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
  }
});

export const {
  handleWishList,
  handleToggleWishList,
  handleRemoveSauceFromWishList,
  handleIncreaseReviewCountOfWishListSauce,
  handleToggleLikeWishlistSauce
} = wishListSlice.actions;
export default wishListSlice.reducer;
