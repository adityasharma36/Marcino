
import {configureStore} from "@reduxjs/toolkit";

import userReducer from "./Slice/UserSlice";
import productReducer from './Slice/ProductSlice'
import addressReducer from './Slice/AddressSlice'
import cartReducer from './Slice/CartSlice'
import orderReducer from './Slice/OrderSlice'
export const store = configureStore({

    reducer:{

        user: userReducer,
        product:productReducer,
        address:addressReducer,
        cart:cartReducer,
        order:orderReducer

    }

});