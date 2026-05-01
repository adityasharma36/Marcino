

import { createSlice } from "@reduxjs/toolkit";
// import { set } from "react-hook-form";

const normalizeAddressPayload = (payload)=>{
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.addresses)) return payload.addresses;

    // If backend returned a single address object, wrap it in an array.
    if (typeof payload === 'object') {
        const single = payload.address ?? payload;
        if (single && typeof single === 'object') return [single];
    }

    return [];
}

const getAddressIde = (addres)=>{
    if(!addres || typeof addres !== 'object') return null;
    return addres._id || addres.id || null;
}

const dedupeAddress = (address)=>{
    const uniqueAddress = [];
    const seenIds = new Set();

    for(const addres of address){
        const identity = getAddressIde(addres);
        if(identity=== null){
            uniqueAddress.push(addres);
            continue;
        }
        if(!seenIds.has(identity)){
            seenIds.add(identity);
            uniqueAddress.push(addres)
        }
    }
    return uniqueAddress;
}
const initialState = {
    addresses:[]
}

const addressesSlice = createSlice({
    name:'address',
    initialState,
    reducers:{

        setAddress:(state,action)=>{

            state.addresses = dedupeAddress(normalizeAddressPayload(action.payload));

        }
    }

})

export const { setAddress } = addressesSlice.actions;

export default addressesSlice.reducer