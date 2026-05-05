import ProductAxios from "../../Utils/productAxios";
import { setProduct, lazyLoadingState, setSelectedProduct } from "../Slice/ProductSlice";

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

export const getProductById = (idOrProduct) => async (dispatch) => {
  try {
    const id =
      typeof idOrProduct === "string"
        ? idOrProduct
        : idOrProduct?._id || idOrProduct?.id;

    if (!id) {
      throw new Error("getProductById: product id is required");
    }

    const response = await ProductAxios.get(`/${id}`);
    const product = response?.data?.data ?? response?.data;

    dispatch(setSelectedProduct(product));
    return product;
  } catch (error) {
    console.log("Error getProductById :", error);
    throw error;
  }
};