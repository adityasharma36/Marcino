
import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    user:null

}

const userSlice = createSlice({

    name:"user",

    initialState,

    reducers:{

        setUser:(state,action)=>{
            console.log("Setting user in Redux store:", action.payload);
            state.user = action.payload;

            console.log("Updated user state:", state.user);

        }
        ,

        removeUser:(state)=>{
            console.log("Removing user from Redux store");
            console.log('state', state);
            state.user = null;
            
        }
    }
})

export const {setUser,removeUser} = userSlice.actions;

export default userSlice.reducer;