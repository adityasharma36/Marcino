import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../store/Action/UserAction';

const Header = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  return (
    <div className='flex items-center justify-between p-4 z-50 fixed w-full bg-gray-900 '>
      <div className='flex items-center justify-center gap-3 '>
        <h1 className='text-3xl font-semibold cursor-pointer text-red-500'>MARCINO</h1>
      {/* <input type="text" placeholder='Search.... ' className=' placeholder-gray-600 border border-white rounded-xl text-center h-10' /> */}
     
      </div>
          <ul className='flex items-center gap-10 '>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110 ' onClick={()=>navigate('/')}>Home</li>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110' onClick={()=>navigate('/Product')}>Product</li>
            
            <li className='cursor-pointer text-2xl font-bold hover:scale-110' onClick={()=>navigate('/About')}>About</li>
            <li className='cursor-pointer text-2xl font-bold hover:scale-110 mr-3' onClick={()=>navigate('/Contact')} > Contact</li>

            <li className='cursor-pointer text-2xl p-2 border-none bg-linear-to-r from-red-500 to-purple-500 rounded-xl
             hover:scale-105  mr-3 hover:shadow-orange-400' onClick={async ()=> {
              await dispatch(logoutUser())
              navigate('/')
              }}>Logout</li>
          </ul>
    
    </div>
  )
}

export default Header