import ProductAxios from "../../Utils/productAxios";
import { setProduct, lazyLoadingState } from "../Slice/ProductSlice";

export const getProduct = () => async (dispatch) => {
  try {
    const response = await ProductAxios.get("/");
    console.log("Product API response:", response.data);
    dispatch(setProduct(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const lazyLoadProducts = (productData) => async (dispatch) => {
  try {
    dispatch(lazyLoadingState(productData));
  } catch (error) {
    console.error("Error lazy loading products:", error);
    throw error;
  }
};