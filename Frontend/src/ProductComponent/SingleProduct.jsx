import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../store/Action/ProductAction";
import Loading from "../assests/Loading4.webm"
import Breadcrums from "../Component/Breadcrums"
import { IoCartOutline } from "react-icons/io5"
import Footer from "../Component/Footer";



const SingleProduct = () => {

  const dispatch = useDispatch();
  const { id } = useParams();

  const product = useSelector((state) => state.product.selectedProduct);

  useEffect(() => {
    if (!id) return;
    dispatch(getProductById(id));
  }, [dispatch, id]);

  

//    const originalPrice = product
//     ? Math.round(
//         product.price +
//           (product.price * product.discountPercentage) / 100
//       )
//     : 0

  // ✅ loader
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <video muted autoPlay loop>
          <source src={Loading} type="video/webm" />
        </video>
      </div>
    )
  }

  return (
    <>
    <div className="px-4 pb-6 md:px-0">
      {/* Breadcrumb */}
      <Breadcrums title={product.title} />

      {/* Product Section */}
      <div className="max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <div className="w-full">
          <img
            className="rounded-2xl w-full object-cover bg-gray-100"
            src={product.images?.[0].url || product.thumbnail}
            alt={product.title}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {product.title}
          </h1>

          <p className="text-sm text-gray-600">
            {product.brand?.toUpperCase()} /{" "}
            {product.category?.toUpperCase()}
          </p>

          <div className="text-xl font-bold text-red-500">
            ${product.price.amount}
            {/* <span className="line-through text-gray-600 ml-2">
              ${originalPrice}
            </span> */}
            {/* <span className="ml-3 px-2 py-1 bg-red-500 text-white rounded-md text-sm">
              {product.discountPercentage}% OFF
            </span> */}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              min={1}
            //   value={qty}
            //   onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 hover:bg-red-600 flex gap-2 transition text-white px-6 py-3 rounded-lg font-semibold" onClick={() => addToCart(product, qty)}>
             <IoCartOutline className="w-6 h-6"/>Add to Cart
            </button>

    
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default SingleProduct