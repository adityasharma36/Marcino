
import Axios from "../../Utils/axios";

import {setUser, removeUser} from "../Slice/UserSlice";

export const registerUser = (userData)=> async (dispatch)=>{

    console.log("Registering user with data:", userData);
    
    const response = await Axios.post("/auth/register", userData);

    console.log('-------------------------');

    console.log("Received response from registration API:", response.data);

    dispatch(setUser(response.data?.user || response.data));

    return response.data;
}
export const currentUser = (credentials)=> async (dispatch)=>{

    const response = await Axios.get('/auth/me',credentials);

    return response;

}
export const loginUser = (credentials) => async (dispatch) => {

    console.log("Logging in with credentials:", credentials);

    const response = await Axios.post("/auth/login", credentials);


    console.log('-------------------------');

    console.log("Received response from login API:", response.data);

    dispatch(setUser(response.data?.user || response.data));
    return response.data;
}

export const logoutUser = () => async (dispatch) => {

    const response = await Axios.get("/auth/logout");

    console.log('-------------------------');

    console.log("Received response from logout API:", response.data);

    dispatch(removeUser());

    return response.data;

};