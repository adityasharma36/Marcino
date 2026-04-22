
import Axios from "../Utils/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Login(){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

        const getApiErrorMessage = (err) => {
            if (err?.response?.data?.message) {
                return err.response.data.message;
            }

            if (Array.isArray(err?.response?.data?.errors) && err.response.data.errors.length > 0) {
                return err.response.data.errors[ 0 ]?.msg || "Request failed";
            }

            return err?.message || "Something went wrong";
        };

        const submit = async  (e)=>{
            e.preventDefault();
            setError("");

            try {
                if(!identifier || !password){
                    throw new Error("Please fill in all fields");
                }

                const trimmedIdentifier = identifier.trim();
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier);
                const payload = isEmail
                    ? { email: trimmedIdentifier.toLowerCase(), password }
                    : { username: trimmedIdentifier, password };

                setLoading(true);

                const res = await Axios.post("/auth/login", payload);
                console.log(res.data);

                toast.success("Logged in successfully!");
                
                navigate("/");
                
            } catch (err) {
                setError(getApiErrorMessage(err));
                toast.error("Failed to log in.");
            } finally {
                setLoading(false);

            }
        }



    return (

        <div className="relative flex items-center flex-col justify-center h-screen bg-gray-500 ">

             <form onSubmit= {submit} className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-2">
            
                <h1 className="text-4xl font-extrabold text-center py-4 ">Sign In</h1>
                <p className="text-center text-xl line-clamp-2 px-2">Please enter your credentials to access the dashboard .</p>
            
           
                {error ? <p className="text-red-600 text-sm text-center">{error}</p> : null}
                <input onChange={e=>setIdentifier(e.target.value)} value={identifier} type="text" placeholder="Email or Username"  className="w-full px-2 py-4 rounded-lg my-2 border "/>
                <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="w-full px-2 py-4 rounded-lg border my-2"/>
                <button disabled={loading} type="submit" className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">{loading ? "Signing in..." : "Sign In"}</button>
                <p className="text-center text-sm text-gray-500">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
            
            </form>
            
        </div>
    )
}

export default Login