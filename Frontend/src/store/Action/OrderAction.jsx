
// import CartAxios from "../../Utils/CartAxios";
import OrderAxios from "../../Utils/OrderAxios";
import { toast } from "react-toastify";
import { setOrders } from "../Slice/OrderSlice";

const resolveOrderPayload = (payload) => payload?.data || payload?.order || payload?.orders || payload;

export const createOrder = (credential = {}) => async (dispatch) =>{

    try {

        const response = await OrderAxios.post('/', credential);
        const createdOrder = resolveOrderPayload(response?.data);

        if (createdOrder) {
            dispatch(setOrders([createdOrder]));
        }

        console.log("REsponse is ", response)
        toast.success("Order created successfully");
        return response?.data;
        
    } catch (error) {
        console.error("CreateOrder error",{
                     message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
        })

        toast.error(error.response?.data?.message || "Failed to Create Order");
        throw error;
    }
}

export const getOrder = (Credential) => async (dispatch) =>{


    try {

        const order = await OrderAxios.get('/me');
        
        console.log("Order is " , order )
        dispatch(setOrders(order?.data?.orders || order?.data?.data || order?.data));
        return order?.data;
        
    } catch (error) {
        
           console.error("CartProducts error:", {
        
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
        
                });
                toast.error(error.response?.data?.message || "Failed to fetch Order");
                throw error;
    }

}

// export default {getOrder} 