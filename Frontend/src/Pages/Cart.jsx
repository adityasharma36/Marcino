
import { LuNotebookText } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import { FaRegTrashAlt } from "react-icons/fa";

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCartProDetails, getAllProCart, removeCartProd, updateCartProd } from '../store/Action/CartAction';
import { currentUser } from "../store/Action/UserAction";
import { resetCartProdDetails } from '../store/Slice/CartSlice';

import  notFound from '../assests/notfound.json'
import Lottie from 'lottie-react'
import useUserLocation from "../Utils/useUserLocation";
import { useNavigate } from "react-router-dom";
const Cart = () => {
    const dispatch = useDispatch();
  const { getLocation } = useUserLocation();
  const navigate = useNavigate();

  const cartProduct = useSelector((state) => state?.cart?.allProductCarts);

  const cartList = Array.isArray(cartProduct) ? cartProduct : cartProduct?.data || [];

  const allDetails = useSelector((state) =>  state?.cart?.allProdDetails);

  const getCartProductId = (item) => item?.productId || item?.product?._id || item?.product || item?._id || item?.id;

  const cartItems = cartList
    .map((item) => {
      const productId = getCartProductId(item);
      const productDetails = allDetails.find((detail) => (detail?._id || detail?.id) === productId);
      const qty = item?.qty || item?.quantity || 1;

      if (!productId) {
        return null;
      }

      return {
        ...productDetails,
        ...item,
        productId,
        qty,
        unitPrice: Number(productDetails?.price?.amount || item?.price?.amount || 0),
        currency: productDetails?.price?.currency || item?.price?.currency || "",
      };
    })
    .filter(Boolean);

  const getItemTotal = (item) => Number(item?.unitPrice || 0) * Number(item?.qty || 1);

  const getDeliveryCharge = (subtotal) => (subtotal > 100 ? 0 : 50);

  const getShippingCharge = () => 4;

  const getGrandTotal = (subtotal) => subtotal + getDeliveryCharge(subtotal) + getShippingCharge();

  const increaseQuantity = (productId) => {
    const currentItem = cartList.find((item) => getCartProductId(item) === productId);
    const nextQty = (currentItem?.qty || currentItem?.quantity || 1) + 1;
    dispatch(updateCartProd({ productId, qty: nextQty }));
  };

  const decreaseQuantity = (productId) => {
    const currentItem = cartList.find((item) => getCartProductId(item) === productId);
    const currentQty = currentItem?.qty || currentItem?.quantity || 1;

    if (currentQty <= 1) {
      dispatch(removeCartProd(productId));
      return;
    }

    dispatch(updateCartProd({ productId, qty: currentQty - 1 }));
  };

  const removeFromCart = (productId) => {
    dispatch(removeCartProd(productId));
  };

  const currAdd = useSelector((state)=> state?.address?.addresses);

  const userDetail = useSelector((state) => state?.user?.user);

  console.log("userDetail",userDetail);

  
    console.log("currAdd",currAdd);


    useEffect(()=>{
        if(!cartList.length){
            dispatch(getAllProCart());
        }
        if(!userDetail?.length){
          dispatch(currentUser());
        }


    },[dispatch,cartList.length,userDetail?.length])
   
    useEffect(() => {
        const cartProductIds = cartList.map((data) => getCartProductId(data)).filter(Boolean);

        if (!cartProductIds.length) {
          dispatch(resetCartProdDetails());
          return;
      }

        dispatch(getAllCartProDetails(cartProductIds));
      }, [cartList, dispatch])

      const totalSum = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
      const deliveryCharge = getDeliveryCharge(totalSum);
      const shippingCharge = getShippingCharge();
      const grandTotal = getGrandTotal(totalSum);

  return (

    
       <div className="mt-10 max-w-6xl mx-auto mb-5">
 
        <div>
          <h1 className="font-bold text-xl">
            My Cart ({cartItems.length})
          </h1>

          {/* ================= CART ITEMS ================= */}

          {cartItems.length>0 ? 
          <div className="mt-10">
            {cartItems.map((data) => {
              const productId = data.productId;
              const itemTotal = getItemTotal(data);

              return (
                <div
                  key={productId}
                  className="bg-gray-100 p-5 rounded-md flex items-center justify-between mt-3 w-full"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={data.images?.[0].url || data.thumbnail}
                      alt={data.thumbnail || data.title}
                      className="w-20 h-20 rounded-md"
                    />

                    <div>
                      <h1 className="w-75 line-clamp-2">
                        {data.title}
                      </h1>
                      <p className="text-red-500 font-semibold">
                        {`${data.currency} ${itemTotal}`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-500 text-white flex gap-2 rounded-md font-bold text-xl px-2">
                    <button className="cursor-pointer" onClick={() => decreaseQuantity(productId)}>-</button>
                    <span>{data.qty}</span>
                    <button className="cursor-pointer" onClick={() => increaseQuantity(productId)}>+</button>
                  </div>

                  <span className="hover:bg-white transition-all rounded-full p-3 hover:shadow-2xl">
                    <FaRegTrashAlt className="text-red-500 text-2xl cursor-pointer" onClick={() => removeFromCart(productId)} />
                  </span>
                </div>
              );
            })}
          </div>
: <div className='flex items-center justify-center mt-10 w-full'>
              <Lottie animationData={notFound} />

              {/* <h1>NO Items</h1> */}
            </div>
}

          {/* ================= DELIVERY + BILL SECTION ================= */}
          <div className="grid grid-cols-2 gap-10 mt-8">

            {/* ===== LEFT SIDE (Delivery Info) ===== */}
            <div className="bg-gray-100 rounded-md p-7 space-y-3">
              <h1 className="text-gray-800 font-bold text-xl">
                Delivery Info
              </h1>

              <div className="flex flex-col space-y-1">
                <label>Full Name</label>
                <input
                  type="text"
                  className="p-2  border rounded-md"
                  value={userDetail?.fullName?.firstName + " " + userDetail?.fullName?.lastName || ' '}
                  readOnly
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label>Address</label>
                <input
                  type="text"
                  className="p-2 border rounded-md"
                  value={currAdd[0]?.street || ""}
                  readOnly
                />
              </div>

              <div className="flex w-full gap-5">
                <div className="flex flex-col space-y-1 w-full">
                  <label>State</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={currAdd[0]?.state || ""}
                    readOnly
                  />
                </div>

                <div className="flex flex-col space-y-1 w-full">
                  <label>PostCode</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={currAdd[0]?.zipcode || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex w-full gap-5">
                <div className="flex flex-col space-y-1 w-full">
                  <label>Country</label>
                  <input
                    type="text"
                    className="p-2 border  rounded-md w-full"
                    value={currAdd[0]?.country || ""}
                    readOnly
                  />
                </div>

                <div className="flex flex-col space-y-1 w-full">
                  <label>Number</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={''}
                  />
                </div>
              </div>

              <button className="bg-red-500 text-white px-3 py-1 rounded-md mt-3 cursor-pointer">
                Submit
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-gray-300 w-full"></div>
                <span className="text-sm text-gray-500 font-semibold">
                  OR
                </span>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>

              <div className="flex justify-center">
                <button onClick={getLocation} className="bg-red-500 text-white px-5 py-2 rounded-md">
                  Detect Location
                </button>
              </div>
            </div>

            {/* ===== RIGHT SIDE (Bill Details) ===== */}
            <div className="bg-white border-gray-100 shadow-xl rounded-md p-7 mt-4 space-y-2 h-max">
              <h1 className="text-gray-800 font-bold text-xl">
                Bill Details
              </h1>

              <div className="flex justify-between items-center">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <LuNotebookText /> Items total
                </h1>
                <p>{`${cartItems[0]?.currency || ""} ${totalSum}`}</p>
              </div>

              <div className="flex justify-between items-center">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <MdDeliveryDining /> Delivery Charge
                </h1>
                { deliveryCharge === 0 ? (
                  <p className="text-red-500 font-semibold">Free</p>
                ) : (
                  <p className="text-red-500 font-semibold">
                    {deliveryCharge}
                    </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <GiShoppingBag /> Shipping Charge
                </h1>
                <p className="text-red-500 font-semibold">
                  {shippingCharge}
                  </p>
              </div>

              <hr className="text-gray-200 mt-2" />

              <div className="flex justify-between items-center">
                <h1 className="font-semibold text-lg">Grand Total</h1>
                <p className="font-semibold text-lg">
                  {grandTotal}
                </p>
              </div>

              <div>
                <h1 className="font-semibold text-gray-700 mb-3 mt-7">
                  Apply Promo Code
                </h1>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="p-2 rounded-md w-full"
                  />
                  <button className="bg-white text-black border border-gray-200 cursor-pointer py-1 px-2 rounded-md">
                    Apply
                  </button>
                </div>
              </div>

              <button
                // onClick={handleCheckout}
                onClick={() => navigate('/Payment')}
                className="bg-red-500 text-white px-3 py-2 rounded-md w-full cursor-pointer mt-3"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      
    </div>
  )
}

export default Cart