

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductAxios from './productAxios';
import { lazyLoadProducts } from '../store/Action/ProductAction';

const UseInfiniteFetch = () => {
  
    const dispatch = useDispatch();
    const productsList = useSelector((state)=>state.product.products);

    const [more ,setMore]= useState(true);

    const fetchData = async ()=>{
        try {

            const res = await ProductAxios.get(`/?_limit=6&_start=${productsList.length}`);

            if(res.data.length===0){
                setMore(false);
            }else{
                dispatch(lazyLoadProducts(res.data));
            }
            
        } catch (error) {
            console.log("API Error", error)
        }
    }

    useEffect(()=>{
        fetchData();
    },[]);

    return {pro:productsList,more,fetchData}
}

export default UseInfiniteFetch