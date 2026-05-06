import React from 'react'
import { useNavigate } from 'react-router-dom'

const Breadcrums = ({title}) => {
    const navigate = useNavigate();
    return (
    <div className='max-w-6xl mx-auto my-10'>

        <h1 className='text-2xl text-gray-700 font-stretch-semi-condensed'>
            <span className='cursor-pointer hover:text-blue-600'  onClick={()=>navigate('/Main')}> Home </span>
             / <span className='cursor-pointer hover:text-blue-600' onClick={()=>navigate('/Product')}>Product</span> / <span>{title}</span></h1>
    </div>
  )
}

export default Breadcrums