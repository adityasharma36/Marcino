
import axios from "axios";

const Axios = axios.create({

    // Use Vite proxy in development and env override in other environments.
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    withCredentials: true,

});

export default Axios;