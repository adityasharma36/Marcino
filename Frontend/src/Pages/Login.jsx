
import { useState } from "react";
import {useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/Action/UserAction";


function Login(){
   
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    const {handleSubmit,register,formState:{errors}}= useForm({

        defaultValues:{

            identifier:"",

            password:""

        }

     });

    const navigate = useNavigate();
    
    const dispatch = useDispatch();

        const getApiErrorMessage = (err) => {
            if (err?.response?.data?.message) {
                return err.response.data.message;
            }

            if (Array.isArray(err?.response?.data?.errors) && err.response.data.errors.length > 0) {
                return err.response.data.errors[ 0 ]?.msg || "Request failed";
            }

            return err?.message || "Something went wrong";
        };

        const registerSubmit = async  (data)=>{
          
            setError("");

            try {
                if(!data.identifier || !data.password){
                    throw new Error("Please fill in all fields");
                }

                const trimmedIdentifier = data.identifier.trim();
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier);
                const payload = isEmail
                    ? { email: trimmedIdentifier.toLowerCase(), password: data.password }
                    : { username: trimmedIdentifier, password: data.password };

                setLoading(true);

                await dispatch(loginUser(payload));

                toast.success("Logged in successfully!");
                
                navigate("/Home");
                
            } catch (err) {
                setError(getApiErrorMessage(err));
                toast.error("Failed to log in.");
            } finally {
                setLoading(false);

            }
        }



    return (

        <div className="relative flex items-center flex-col justify-center h-screen bg-gray-500 ">

             <form onSubmit= {handleSubmit(registerSubmit)} className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-2">
            
                <h1 className="text-4xl font-extrabold text-center py-4 ">Sign In</h1>
                <p className="text-center text-xl line-clamp-2 px-2">Please enter your credentials to access the dashboard .</p>
            
           
                {error ? <p className="text-red-600 text-sm text-center">{error}</p> : null}
                <input {...register("identifier")} type="text" placeholder="Email or Username"  className="w-full px-2 py-4 rounded-lg my-2 border "/>
                <input {...register("password")} type="password" placeholder="Password" className="w-full px-2 py-4 rounded-lg border my-2"/>
                <button disabled={loading} type="submit" className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">{loading ? "Signing in..." : "Sign In"}</button>
                <p className="text-center text-sm text-gray-500">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
            
            </form>
            
        </div>
    )
}

export default Login