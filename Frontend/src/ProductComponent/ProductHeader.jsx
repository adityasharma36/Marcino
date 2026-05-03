import React from 'react'
import useUserLocation from '../Utils/useUserLocation'
import { useSelector } from 'react-redux';
import { MapPin } from 'lucide-react'

import { CgClose } from 'react-icons/cg';
import { FaCaretDown } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
const ProductHeader = ({search , setSearch}) => {
  
    const {setOpenBox,openBox,getLocation}= useUserLocation();

    const address = useSelector((state)=>state?.address?.addresses) || [];
  const currentAddress = address[0];

    const toggleDownOpen = ()=>{
      setOpenBox(!openBox);
    }

    
  return (
    <div className='flex gap-15 max-w-full p-5 items-center '>

        <p className='text-2xl hover:border-2 px-4 py-2 cursor-pointer'><span className='font-extrabold text-3xl text-red-500'>M</span>arcino</p>
      
        <div className='flex gap-1 cursor-pointer py-2 px-4 hover:border-2 text-gray-700 items-center'>
            
            <MapPin className='text-red-500'/>
           
            <span className='font-semibold -space-y-2'>{currentAddress ? <div>
             
              <p>
             
                {currentAddress?.country}
             
              </p>
             
              <p>{currentAddress?.city}</p>
            
            </div> : "Add location"}</span>
            
            <FaCaretDown onClick={toggleDownOpen}/>
          
          </div>
          
          {openBox ? <div className='w-62.5 h-max shadow-2xl z-50 bg-white fixed top-16 left-60
          
          border-2 p-5 border-gray-100 rounded-md
          
          '>
          
            <h1 className='font-semibold mb-4 text-xl flex justify-between'>Change Location<span onClick={toggleDownOpen}><CgClose/></span></h1>
          
            <button onClick={getLocation} className='bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400 '>Detect My Location</button>
          
          </div>:null}

        <input type="search" value={search}
          onChange={(e)=>setSearch(e.target.value)}
        placeholder='search products' className='w-1/2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110'  />
        
        <h1 className='text-2xl hover:border px-4 py-2 cursor-pointer '>Order</h1>
        
        <h1 className='text-2xl hover:border-2 px-4 py-2 cursor-pointer hover:scale-105'>Cart</h1>

    </div>
  )
}

export default ProductHeader