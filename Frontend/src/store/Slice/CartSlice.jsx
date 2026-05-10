
import { createSlice } from "@reduxjs/toolkit";

const normalizeCartPayload = (payload)=>{
    if(Array.isArray(payload)) return payload;
    if(Array.isArray(payload?.data)) return payload.data;
    if(Array.isArray(payload?.cart)) return payload.cart;
    if(payload && typeof payload === "object") return payload;
    return [];
}

// const 

const initialState = {
    carts:[],
    allProductCarts:[],
    allProdDetails :[]
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state,action) => {
            state.carts = normalizeCartPayload(action.payload)
        },
        allCartProd:(state,action) => {
            state.allProductCarts = normalizeCartPayload(action.payload);
            // console.log(state.allProductCarts)
        },
        allCartProdDetails:(state,action) => {
            const nextDetails = Array.isArray(action.payload)
                ? action.payload
                : action.payload
                    ? [action.payload]
                    : [];

            state.allProdDetails = [...state.allProdDetails, ...nextDetails];
        },
        resetCartProdDetails:(state) => {
            state.allProdDetails = [];
        }
    }
})

export const {addToCart,allCartProd,allCartProdDetails,resetCartProdDetails} = cartSlice.actions;
export default cartSlice.reducer