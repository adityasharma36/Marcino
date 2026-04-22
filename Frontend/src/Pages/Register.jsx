

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../Utils/axios";
import { toast } from "react-toastify";

function Register(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
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

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (!firstName || !lastName || !username || !email || !password) {
                throw new Error("Please fill in all fields");
            }

            if (!agreed) {
                throw new Error("Please accept Terms and Conditions");
            }

            setLoading(true);

            await Axios.post("/auth/register", {
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password,
                fullName: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                },
            });
            toast.success("Account created successfully! Please sign in.");
            navigate("/signin");
        } catch (err) {
            setError(getApiErrorMessage(err));
            toast.error("Failed to create account.");

        } finally {
            setLoading(false);
            
        }
    };



    return (
        
        <div className="h-screen relative flex flex-col  items-center justify-center bg-gray-200">

            <form onSubmit={submit} className="bg-white w-full max-w-md shadow-lg rounded-xl p-8 space-y-4">

                <h1 className="text-4xl font-extrabold text-center">Sign Up</h1>

                <p className="text-center text-gray-600">Create an account to get started.</p>
                {error ? <p className="text-red-600 text-sm text-center">{error}</p> : null}

                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
               
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" className=" w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
               
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
               
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className=" px-4 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
               
               <input checked={agreed} onChange={(e) => setAgreed(e.target.checked)} type="checkbox" className="form-checkbox h-5 w-5 text-blue-500  rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
               
                <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a></span>    
               
                <button disabled={loading} type="submit" className=" bg-blue-500 w-full text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">{loading ? "Creating account..." : "Sign Up"}</button>
                <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign in</Link></p>
            
            </form>
        </div>
    )
}

export default Register