
import DashBoardAxios from "../../Utils/DashBoardAxios"
import { setMetrics, setOrders , setProducts } from "../Slice/DashBoardSlice";
// import { setProduct } from "../Slice/ProductSlice";
export const getMetrix = (Credential) => async (dispatch) => {
    
    try {
        console.log('🚀 getMetrix called - Making request to /metrics');
        const response = await DashBoardAxios.get('/metrics');
        console.log('✅ getMetrix response:', response?.data);
        dispatch(setMetrics(response?.data));
        
    } catch (error) {
        console.log('❌ DashBoard Error getMetrix:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        })
    }
}

export const getProducts = (Credential) => async (dispatch) => {
    try {
        console.log('🚀 getProducts called - Making request to /products');
        const response = await DashBoardAxios.get('/products');
        dispatch(setProducts(response?.data));

        console.log("✅ setProducts response:", response?.data);
        
    } catch (error) {
        console.log('❌ DashBoard Error getProducts',{
            message:error.message,
            status:error.response?.status,
            data:error.response?.data,
            url: error.config?.url
        })
    }
}

export const getOrders = (Credential) => async (dispatch) => {
    try {
        console.log('🚀 getOrders called - Making request to /orders');
        const response = await DashBoardAxios.get('/orders');

        dispatch(setOrders(response?.data));

        console.log('✅ GetOrders response: ', response?.data);
    } catch (error) {
        console.log('❌ DashBoard Error getOrders',{
            message:error.message,
            status:error.response?.status,
            data:error.response?.data,
            url: error.config?.url
        })
    }
}