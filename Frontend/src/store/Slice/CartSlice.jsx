
import { createSlice } from "@reduxjs/toolkit";

const normalizeCartPayload = (payload)=>{
    if(Array.isArray(payload)) return payload;
    if(Array.isArray(payload?.data)) return payload.data;
    if(Array.isArray(payload?.cart)) return payload.cart;
    return [];
}

// const 

const initialState = {
    carts:[],
    allProductCarts:[]
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state,action) => {

            state.carts = normalizeCartPayload(action.payload)

        }
        ,
        allCartProd:(state,action) => {
            state.allProductCarts = normalizeCartPayload(action.payload);
        }
    }
})

export const {addToCart,allCartProd} = cartSlice.actions;
export default cartSlice.reducer