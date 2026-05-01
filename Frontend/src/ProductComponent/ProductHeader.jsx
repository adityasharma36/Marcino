import React from 'react'
import useUserLocation from '../Utils/useUserLocation'
import { useSelector } from 'react-redux';

const ProductHeader = () => {
  
    const {setOpenBox,openBox}= useUserLocation();

    const address = useSelector((state)=>state?.address?.addresses) || [];

    

    
  return (
    <div className='flex gap-10 max-w-full p-5 items-center '>

    

        <h1 className='text-2xl  hover:border-2'>Marcino</h1>
        <div>Delivery Location</div>
        <input type="text" placeholder='search products' className='w-1/2' />
        <h1 className='text-2xl hover:border'>Order</h1>
        <h1 className='text-2xl hover:border-2'>Cart</h1>

    </div>
  )
}

export default ProductHeader