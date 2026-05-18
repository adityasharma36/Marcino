import CartAxios from "../../Utils/CartAxios";
import ProductAxios from "../../Utils/productAxios";
import { addToCart, allCartProd, allCartProdDetails, resetCartProdDetails } from "../Slice/CartSlice";
import { toast } from "react-toastify";


export const addProInCart = (credential, qty = 1) => async (dispatch) => {
    const productId = credential?._id || credential?.id;

    if (!productId) {
        throw new Error("addProInCart: productId is required");
    }

    try {
        const response = await CartAxios.post("/items", { productId, qty });
        dispatch(addToCart(response?.data));
        await dispatch(getAllProCart());
        toast.success("Item added to cart");

        // console.log("Product has been add in cart ",response)
        return response?.data;
        
    } catch (error) {

          console.error("addProInCart error:", {

            message: error.message,
            status: error.response?.status,
            data: error.response?.data,

        });
        toast.error(error.response?.data?.message || "Failed to add item to cart");
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

export const getAllCartProDetail = (credential) => async (dispatch) => {
    try {
        const id = credential?._id || credential?.id || credential;

        if (!id) {
            throw new Error("getAllCartProDetail: product id is required");
        }

        const response = await ProductAxios.get(`/${id}`);

        dispatch(allCartProdDetails(response?.data?.data));
        return response?.data;

    } catch (error) {
        console.log('GetAllCartProduct Details', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        throw error;
    }
}

const getCartProductId = (item) => item?.productId || item?.product?._id || item?.product || item?._id || item?.id;

export const getAllCartProDetails = (credentials = []) => async (dispatch) => {
    try {
        const productIds = credentials
            .map((credential) => getCartProductId(credential) || credential)
            .filter(Boolean);

        if (!productIds.length) {
            dispatch(resetCartProdDetails());
            return [];
        }

        dispatch(resetCartProdDetails());

        const responses = await Promise.all(
            productIds.map((productId) => ProductAxios.get(`/${productId}`))
        );

        const details = responses
            .map((response) => response?.data?.data)
            .filter(Boolean);

        dispatch(allCartProdDetails(details));
        return details;

    } catch (error) {
        console.log('GetAllCartProduct Details batch error', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        throw error;
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
        toast.success("Cart updated");
        return response?.data;
        
    } catch (error) {
        console.log('GetError during updateCartProd',{
            message:error?.message,
            status:error?.response?.status,
            data : error?.response?.data
        })
        toast.error(error.response?.data?.message || "Failed to update cart item");
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
        toast.success("Item removed from cart");
        return response?.data;
    } catch (error) {
        console.log('GetError during removeCartProd',{
            message:error?.message,
            status:error?.response?.status,
            data : error?.response?.data
        });
        toast.error(error.response?.data?.message || "Failed to remove item from cart");
        throw error;
    }
}