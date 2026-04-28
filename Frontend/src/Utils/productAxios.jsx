import axios from "axios";

const ProductAxios = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_API_BASE_URL || "/api/products",
  withCredentials: true,
});

export default ProductAxios;