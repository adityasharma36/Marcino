import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate  = useNavigate();
  return (
    <div className='flex items-center justify-between p-4 z-20 fixed'>
      <div className='flex items-center justify-center gap-3 '>
        <h1 className='text-3xl font-semibold cursor-pointer text-red-500'>MARCINO</h1>
      {/* <input type="text" placeholder='Search.... ' className=' placeholder-gray-600 border border-white rounded-xl text-center h-10' /> */}
     
      </div>
          <ul className='flex items-center gap-10 '>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110 ' onClick={()=>navigate('/')}>Home</li>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110' onClick={()=>navigate('/Product')}>Product</li>
            
            <li className='cursor-pointer text-2xl font-bold hover:scale-110' onClick={()=>navigate('/About')}>About</li>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110 mr-3' onClick={()=>navigate('/Contact')} > Contact</li>

            <li className='cursor-pointer text-2xl p-2 border-none bg-linear-to-r from-red-500 to-purple-500 rounded-xl hover:scale-105  mr-3 hover:shadow-orange-400'>Logout</li>
          </ul>
    
    </div>
  )
}

export default Header