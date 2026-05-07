import CartAxios from "../../Utils/CartAxios";
import { addToCart, allCartProd } from "../Slice/CartSlice";


export const addProInCart = (credential, qty = 1) => async (dispatch) => {
    const productId = credential?._id || credential?.id;

    if (!productId) {
        throw new Error("addProInCart: productId is required");
    }

    try {
        const response = await CartAxios.post("/items", { productId, qty });
        dispatch(addToCart(response?.data));
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

        dispatch(allCartProd(response?.data));

        console.log(response?.data);
        
    } catch (error) {

        console.error('getAllProCart error ',{
            message:error.message,
            status:error.response?.status,
            data:error.response?.data,
        });
        throw error;
        
    }
}