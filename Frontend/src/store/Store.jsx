
import {configureStore} from "@reduxjs/toolkit";

import userReducer from "./Slice/UserSlice";
import productReducer from './Slice/ProductSlice'
import addressReducer from './Slice/AddressSlice'

export const store = configureStore({

    reducer:{

        user: userReducer,
        product:productReducer,
        address:addressReducer

    }

});