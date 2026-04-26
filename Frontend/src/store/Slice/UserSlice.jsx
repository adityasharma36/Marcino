
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

            state.users = action.payload;

            console.log("state is ",state.users);

            console.log("Updated user state:", state.users);

        }
        ,

        removeUser:(state)=>{

            console.log("Removing user from Redux store");

            console.log('state', state);

            state.users = null;
            
        }
    }
})

export const {setUser,removeUser} = userSlice.actions;

export default userSlice.reducer;