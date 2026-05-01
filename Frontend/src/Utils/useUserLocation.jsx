import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { userLocation } from '../store/Action/AddressAction';

const useUserLocation = () => {

    const dispatch = useDispatch();

    // const [location ,setLocation]= useState("");
    const [openBox,setOpenBox]= useState(false);

    const getLocation = async ()=>{

        
        navigator.geolocation.getCurrentPosition(async pos =>{

            const {latitude,longitude}= pos.coords;

            const url = await `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`

            try {

                const response = await axios.get(url);
                const locFromApi = response.data.address;
                const locat = {
                    ...locFromApi,
                    lat: response.data.lat,
                    lon: response.data.lon,
                };
                
                console.debug("useUserLocation: sending payload", locat);
                await dispatch(userLocation(locat));
                setOpenBox(false);
                
            } catch (error) {
                console.log(error)
            }
        })
    }

useEffect(()=>{

    getLocation();

    },[])

  return {openBox,setOpenBox,getLocation}
}


export default useUserLocation

