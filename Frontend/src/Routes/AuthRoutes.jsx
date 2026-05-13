

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const AuthRoutes = ({children}) => {

    const userDetails = useSelector((state)=>(state?.user?.user));
    const isLogin = Array.isArray(userDetails)
        ? userDetails.length > 0
        : Boolean(userDetails);

    if(!isLogin){
        return <Navigate to='/Login'/>
    
    }
    return children
  
}

export default AuthRoutes