import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Product from "../Pages/Product";
// import LandingPage from "../Pages/LandingPage";


function MainRoutes(){
    return ( 
        
            <Routes>
                <Route path= "/signup" element = {<Register/>}></Route>
                <Route path = "/Login" element= {<Login/>}></Route>
                {/* <Route path = "/home" element = {<Home/>}></Route> */}
                <Route path="/" element = {<Home/>} ></Route>
                <Route path="/Product" element = {<Product/>}></Route>
            </Routes>
        
    )
}

export default MainRoutes