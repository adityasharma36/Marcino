
import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    products : [],


}


const productSlicer = createSlice({
    name:"product",
    initialState,

    reducers:{

        setProduct:(state,action)=>{

            state.products = action.payload;

        },

        lazyLoadingState:(state,action)=>{

            state.products = [...state.products,...action.payload]

        }


    }
    
})

export const {setProduct,lazyLoadingState} = productSlicer.actions;

export default productSlicer.reducer;