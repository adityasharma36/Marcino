
import axios from 'axios'

const OrderAxios = axios.create({
    baseURL: "/api/orders",
    withCredentials:true
}) 

 export default OrderAxios