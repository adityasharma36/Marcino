import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../Pages/Main";
import About from "../Pages/AboutUs";
import Contact from "../Pages/ContactUs";
import Product from "../Pages/Product";
import SingleProduct from "../ProductComponent/SingleProduct";
import Cart from "../Pages/Cart";
// import LandingPage from "../Pages/LandingPage";
import AuthRoutes from "./AuthRoutes";


function MainRoutes(){
    return ( 
        
            <Routes>
                <Route path= "/signup" element = {<Register/>}></Route>
                <Route path = "/Login" element= {<Login/>}></Route>
                {/* <Route path = "/home" element = {<Home/>}></Route> */}
                <Route path="/" element = {<Home/>} ></Route>

                


                <Route path="/Main" element = {<AuthRoutes><Main/></AuthRoutes>}></Route>
                <Route path="/About" element ={<AuthRoutes><About/></AuthRoutes>}></Route>
                <Route path="/Product" element = {<AuthRoutes><Product/></AuthRoutes>}/>
                <Route path="/Contact" element = {<AuthRoutes><Contact/></AuthRoutes>}/>
                <Route path="/Product/:id" element={<AuthRoutes><SingleProduct/></AuthRoutes>}></Route>
                <Route path="/Cart" element = {<AuthRoutes><Cart/></AuthRoutes>}></Route>
                
                
            </Routes>
        
    )
}

export default MainRoutes