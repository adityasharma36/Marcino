

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProCart } from '../store/Action/CartAction';

const Cart = () => {
    const dispatch = useDispatch();

  const cartProduct = useSelector((state) => state?.cart?.allProductCarts);
  const cartList = Array.isArray(cartProduct) ? cartProduct : cartProduct?.data || [];



    useEffect(()=>{
        if(!cartList.length){
      dispatch(getAllProCart());
        }
    },[dispatch,cartList.length])


    
  return (
    <div>Cart</div>
  )
}

export default Cart