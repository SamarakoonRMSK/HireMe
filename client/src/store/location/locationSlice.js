import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userLocation:null,
}

const locationSlice = createSlice({
    name:"location",
    initialState,
    reducers:{
        addUserLocation:(state,action)=>{
            state.userLocation = action.payload;
        }
    }
});

export const {addUserLocation} = locationSlice.actions;

export default locationSlice.reducer;