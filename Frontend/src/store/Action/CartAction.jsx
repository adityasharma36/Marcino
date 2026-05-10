import Axios from "../../Utils/axios";
import CartAxios from "../../Utils/CartAxios";
import ProductAxios from "../../Utils/productAxios";
import { addToCart, allCartProd, allCartProdDetails, resetCartProdDetails } from "../Slice/CartSlice";


export const addProInCart = (credential, qty = 1) => async (dispatch) => {
    const productId = credential?._id || credential?.id;

    if (!productId) {
        throw new Error("addProInCart: productId is required");
    }

    try {
        const response = await CartAxios.post("/items", { productId, qty });
        dispatch(addToCart(response?.data));
        await dispatch(getAllProCart());

        // console.log("Product has been add in cart ",response)
        return response?.data;
        
    } catch (error) {

          console.error("addProInCart error:", {

            message: error.message,
            status: error.response?.status,
            data: error.response?.data,

        });
        throw error;
        
    }



}

export const getAllProCart = ()=> async (dispatch) =>{

    try {

        const response = await CartAxios.get('/');

    

        dispatch(resetCartProdDetails());
        dispatch(allCartProd(response?.data?.cart?.items));

        // console.log(response?.data);
        
    } catch (error) {

        console.error('getAllProCart error ',{
            message:error.message,
            status:error.response?.status,
            data:error.response?.data,
        });
        throw error;
        
    }
}

export const getAllCartProDetail = (credential) => async (dispatch) =>{
     try {
        const id = credential?._id || credential?.id || credential;

        if (!id) {
            throw new Error("getAllCartProDetail: product id is required");
        }

        const response = await ProductAxios.get(`/${id}`);

        // console.log(response?.data?.data);

        dispatch(allCartProdDetails(response?.data?.data));
        return response?.data;

        
     } catch (error) {
        console.log('GetAllCartProduct Details',{
            message:error.message,
            status:error.response?.status,
            data:error.response?.data,
        })
     }
}

export const updateCartProd = (credential) => async (dispatch) =>{
    try {
        const productId = credential?._id || credential?.id || credential?.productId || credential;
        const qty = credential?.qty ?? credential?.quantity;

        if (!productId) {
            throw new Error("updateCartProd: productId is required");
        }

        if (qty == null) {
            throw new Error("updateCartProd: qty is required");
        }

        console.log(productId,qty)

        const response = await CartAxios.patch(`/items/${productId}`, { qty });
        await dispatch(getAllProCart());
        return response?.data;
        
    } catch (error) {
        console.log('GetError during updateCartProd',{
            message:error?.message,
            status:error?.response?.status,
            data : error?.response?.data
        })
        throw error;
        
    }
}

export const removeCartProd = (credential) => async (dispatch) => {
    try {
        const productId = credential?._id || credential?.id || credential?.productId || credential;
        console.log("productId" , productId);
        if (!productId) {
            throw new Error("removeCartProd: productId is required");
        }

        const response = await CartAxios.delete(`/items/${productId}`);
        dispatch(resetCartProdDetails());
        await dispatch(getAllProCart());
        return response?.data;
    } catch (error) {
        console.log('GetError during removeCartProd',{
            message:error?.message,
            status:error?.response?.status,
            data : error?.response?.data
        });
        throw error;
    }
}