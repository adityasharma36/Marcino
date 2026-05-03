import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../store/Action/ProductAction';

const ProductFilter = ({category,setCategory, brand, setBrand , price ,setPrice , setSearch}) => {
const dispatch = useDispatch();
const products = useSelector((state) => state.product.products);


  const productList = Array.isArray(products)
    ? products
    : products?.data || [];

  

    useEffect(() => {

      if (!productList.length) {

        dispatch(getProduct());

      }
    }, [dispatch, productList.length]);


    const uniqueCateogry = useMemo(()=>{

      if(!productList?.length) return [];

      const set = new Set();

      productList.forEach(item=>{
        
        if(item?.category) set.add(item.category)

      })

    return ['All',...Array.from(set)];

    },[productList])

    const uniqueBrand = useMemo(()=>{

      if(!productList?.length) return [];

      const set = new Set();

      productList.forEach(item=>{
        
        if(item?.brand) set.add(item.brand)

      })

    return ['All',...Array.from(set)];

    },[productList])

    const handleReset = ()=>{

      setSearch('')

      setCategory('All');
      setBrand('All');
      setPrice([0,5000])
    }

  return (
    <div className='px-6 py-2 m-2 bg-gray-100 rounded-md h-max w-60'>

      <h1 className='text-2 text-center'>Filter Product </h1>

      <h1 className='mt-5 font-semibold text-xl'>Category</h1>
      <div className='flex flex-col gap-2 mt-3'>
Brand
        {
          uniqueCateogry?.map(item=>(
            <label key={item} className='flex gap-2 cursor-pointer'>
              <input type="checkbox" value={item}
               checked={category===item} 
               onChange={(e)=>setCategory(e.target.value)} />
              <span className='uppercase ml-2'>{item}</span>
            </label>
          ))
        }
      </div>

        <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
        <select value={brand} onChange={(e)=>setBrand(e.target.value)} className='w-full bg-white border-gray-200 p-2 rounded-md border-2' >
          {
            uniqueBrand?.map(item=>(
              <option key={item} value={item}>{item}</option>
            ))
          }
          
        </select>

      <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
        <div className='flex flex-col gap-2'>
          <label >${price[0]}-${price[1]}</label>
          <input type="range" min={0} max={5000} value={price[1]} onChange={(e)=>setPrice([price[0],Number(e.target.value)])} />
        </div>


      <button  onClick={handleReset}
        className="bg-red-500 text-white rounded-md px-3 py-2 mt-5 cursor-pointer w-full">
        RESET
      </button>
    </div>
  )
}

export default ProductFilter