

import {createSlice} from '@reduxjs/toolkit'

const normalizeProductsPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.products)) return payload.products;
    return [];
};
const initialState = ({
    orders:[]
})

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        setOrders:(state,action)=>{
            state.orders= normalizeProductsPayload(action.payload)
        }
    }
})

export const {setOrders} = orderSlice.actions

export default orderSlice.reducer;