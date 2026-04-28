
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../store/Action/ProductAction";
import { useEffect } from "react";

const Product = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const handleGetProducts = () => {
    
    dispatch(getProduct());

  };

  useEffect(() => {
    console.log("Products from Redux:", products);
  }, [products]);

  return (
    <div>
      <button onClick={handleGetProducts}>Click Here</button>
      <p>Products count: {products.length}</p>
    </div>
  );
};

export default Product