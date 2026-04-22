import Register from "../Pages/Register";
import Login from "../Pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function MainRoutes(){
    return ( 
        
            <Routes>
                <Route path= "/signup" element = {<Register/>}></Route>
                <Route path = "/signin" element= {<Login/>}></Route>
            </Routes>
        
    )
}

export default MainRoutes