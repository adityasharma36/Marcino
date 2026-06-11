

import { createSlice } from "@reduxjs/toolkit";
import reducer from "./ProductSlice";
// import { setProduct } from "./ProductSlice";


const normalizeSeller = (payload) =>{
    if(Array.isArray(payload)) return payload
    if(Array.isArray(payload?.data)) return payload.data;
    if(Array.isArray(payload?.metric)) return payload.metric;

    return [];
}
const initialState = {
    seller:[],
    orders:[],
    products:[]
}


const sellerDashboardSlice = createSlice({
    name:'seller',
    initialState,

    reducers:{
        setMetrics:(state,action) =>{
            state.seller = normalizeSeller(action.payload);
        },
        setOrders:(state,action)=>{
            state.orders = normalizeSeller(action.payload);
        },
        setProducts:(state,action) =>{
            state.products = normalizeSeller(action.payload)
        }
    }
})


export const {setMetrics, setOrders, setProducts} = sellerDashboardSlice.actions;

export default sellerDashboardSlice.reducer