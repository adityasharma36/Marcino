import React, { useEffect, useMemo, useState, Suspense } from 'react'
import ProductHeader from '../ProductComponent/ProductHeader'
import ProductFilter from '../ProductComponent/ProductFilter'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../store/Action/ProductAction'
import ProductCard from '../Component/ProductCard'
import Lottie from 'lottie-react'
import notFound from '../assests/notfound.json'
import Pagination from '../ProductComponent/Pagination'

const Product = () => {

  const dispatch = useDispatch();

  const products = useSelector(state=>state.product.products)

  const productList = Array.isArray(products) ? products : products?.data || [];

  

  useEffect(()=>{
    if(!productList.length){
      dispatch(getProduct());
    }
  },[productList.length,dispatch])

  const [search,setSearch]= useState('')
  const [category,setCategory]= useState('All')
  const [brand,setBrand]= useState('All')
  const [price,setPrice]= useState([0,5000])
  const [page,setPage]= useState(1);


  const updateSearch = (value)=>{
    setSearch(value);
    setPage(1);
  }
  const updateCategory= (value)=>{
    setCategory(value);
    setPage(1);
  }

  const updateBrand= (value)=>{
    setBrand(value);
    setPage(1);
  }
  const updatePrice = (value)=>{
    setPrice(value);
    setPage(1);
  }

  const pageHandler = (value)=>{
    setPage(value);
  }
  
  // console.log(productList)


  const filterProdut = useMemo(()=>{
    return productList?.filter(product=>(
      product.title.toLowerCase().includes(search.toLowerCase()) &&
      (category==='All' || category=== product.category) && 
      (brand==='All' || brand === product.brand) && 
      product.price.amount >=price[0] && product.price.amount <=price[1]
    
    ))
  },[search,brand,category,price,productList])

  const dynamicPage = Math.ceil(filterProdut?.length / 16)

  
  // console.log(filterProdut)

  return (
    <>
    
      <ProductHeader search = {search} setSearch={updateSearch}/>

      <div className='flex gap-4 p-4'>
        <ProductFilter  search = {search} setSearch={updateSearch} category = {category} setCategory = {updateCategory} brand = {brand}
          setBrand = {updateBrand} price = {price} setPrice = {updatePrice}
        />

        <div className='flex-1'>
          {filterProdut?.length>0 ? (
            
            <div className='flex flex-col items-center w-full'>
              <div className='grid grid-cols-4 gap-4 mt-10'>
                {filterProdut.slice((page-1)*16,page*16)
                .map(product=>(
                  <ProductCard key={product.id || product._id} data={product}/>
                ))
                
                }

              </div>
              <Pagination page = {page} pageHandler = {pageHandler} dynamicPage = {dynamicPage} />
            </div>
          ) : (
            <div className='flex items-center justify-center mt-10 w-full'>
              <Lottie animationData={notFound} />
            </div>
          )}
        </div>
      </div>
      
    </>
  )
}

export default Product