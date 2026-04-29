import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../Pages/Main";
import About from "../Pages/AboutUs";
import Contact from "../Pages/ContactUs";
import Product from "../Pages/Product";
// import LandingPage from "../Pages/LandingPage";


function MainRoutes(){
    return ( 
        
            <Routes>
                <Route path= "/signup" element = {<Register/>}></Route>
                <Route path = "/Login" element= {<Login/>}></Route>
                {/* <Route path = "/home" element = {<Home/>}></Route> */}
                <Route path="/" element = {<Home/>} ></Route>
                <Route path="/Main" element = {<Main/>}></Route>
                <Route path="/About" element ={<About/>}></Route>
                <Route path="/Product" element = {<Product/>}/>
                <Route path="/Contact" element = {<Contact/>}/>
            </Routes>
        
    )
}

export default MainRoutes