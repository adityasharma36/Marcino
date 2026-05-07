
import axios from 'axios'

const CartAxios = axios.create({
    baseURL: "/api/cart",
    withCredentials:true
}) 

 export default CartAxios