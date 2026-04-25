
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "../store/Action/UserAction";
import { useDispatch } from "react-redux";
function Register(){
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            role: "user",
            agreed: false,
        },
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerHandler = async (data)=>{
        setError("");

        try{
            setLoading(true);

            const payload = {
                username: data.username.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                fullName: {
                    firstName: data.firstName.trim(),
                    lastName: data.lastName.trim(),
                },
                role: data.role.trim()
            };

            await dispatch(registerUser(payload));
            toast.success("Account created successfully! Please sign in.");
            navigate("/");
        }
        catch(err){
            setError(getApiErrorMessage(err));
            toast.error("Failed to create account.");
        } finally {
            setLoading(false);
        }
    }

    const getApiErrorMessage = (err) => {
        if (err?.response?.data?.message) {
            return err.response.data.message;
        }

        if (Array.isArray(err?.response?.data?.errors) && err.response.data.errors.length > 0) {
            return err.response.data.errors[ 0 ]?.msg || "Request failed";
        }

        return err?.message || "Something went wrong";
    };

    return (
        
        <div className="h-screen relative flex flex-col  items-center justify-center bg-gray-200">

            <form onSubmit={handleSubmit(registerHandler)} className="bg-white w-full max-w-md shadow-lg rounded-xl p-8 space-y-4">

                <h1 className="text-4xl font-extrabold text-center">Sign Up</h1>

                <p className="text-center text-gray-600">Create an account to get started.</p>
                {error ? <p className="text-red-600 text-sm text-center">{error}</p> : null}

                <input
                    type="text"
                    placeholder="First Name"
                    className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName ? <p className="text-red-600 text-sm">{errors.firstName.message}</p> : null}
               
                <input
                    type="text"
                    placeholder="Last Name"
                    className=" w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName ? <p className="text-red-600 text-sm">{errors.lastName.message}</p> : null}

                <input
                    type="text"
                    placeholder="Username"
                    className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("username", { required: "Username is required" })}
                />
                {errors.username ? <p className="text-red-600 text-sm">{errors.username.message}</p> : null}
               
                <input
                    type="email"
                    placeholder="Email"
                    className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email",
                        },
                    })}
                />
                {errors.email ? <p className="text-red-600 text-sm">{errors.email.message}</p> : null}
               
                <input
                    type="password"
                    placeholder="Password"
                    className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />
                {errors.password ? <p className="text-red-600 text-sm">{errors.password.message}</p> : null}
                
                <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("role", { required: "Role is required" })}
                >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                </select>
                {errors.role ? <p className="text-red-600 text-sm">{errors.role.message}</p> : null}

               <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("agreed", { required: "You must accept Terms and Conditions" })}
                />
                {errors.agreed ? <p className="text-red-600 text-sm">{errors.agreed.message}</p> : null}
               
                <span className="text-sm text-gray-600 p-4  ">I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a></span>    
               
                
                <button disabled={loading} type="submit" className=" bg-blue-500 w-full text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">{loading ? "Creating account..." : "Sign Up"}</button>
                <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign in</Link></p>
            
            </form>
        </div>
    )
}

export default Register