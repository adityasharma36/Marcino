
import axios from "axios"

const DashBoardAxios = axios.create({
    baseURL:'/api/seller/dashboard',
    withCredentials:true
})

export default DashBoardAxios;