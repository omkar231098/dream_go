import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload;
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload;
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload;
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload;
    },
    deleteProperty: (state, action) => {
      // Assuming user.propertyList is an array of properties
      state.user.propertyList = state.user.propertyList.filter(property => property._id !== action.payload);
    },
    deleteTrip: (state, action) => {
      state.user.tripList = state.user.tripList.filter(property => property._id !== action.payload);
    
      console.log(action.payload); // Logging the payload for debugging purposes
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    }
    ,
    addReview: (state, action) => {
      state.reviews.push(action.payload); // Add new review to reviews array
    },
  },
});

export const {
  setLogin,
  setLogout,
  setListings,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList,
  deleteProperty, // Include the new deleteProperty action
  deleteTrip,
  setReviews,
  addReview,
} = userSlice.actions;

export default userSlice.reducer;
