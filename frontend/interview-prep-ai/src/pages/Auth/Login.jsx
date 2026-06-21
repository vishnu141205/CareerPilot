import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
const Login = ({ setCurrentPage }) => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if(!password) {
            setError('Password is required');
            return;
        }

        setError("");

        try{
            // Make API call to login endpoint
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
            const { token } = response.data;

            if(token){
                localStorage.setItem('token', token);
                updateUser(response.data);
                navigate('/dashboard');
            }
        }catch(error) {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred during login. Please try again.');
            }
        }
    };
  return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-lg font-bold mb-4">Welcome back</h3>
    <p className="text-gray-600 mb-6">Login to your account</p>

    <form onSubmit={handleLogin}>
        <Input 
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        />
        <Input 
        type="password"
        placeholder="Minimum 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button 
        type="submit"
        className="btn-primary"
        >
            LOGIN
        </button>

        <p className="text-sm text-gray-600 mt-4">Don't have an account? {" "}
            <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('signup')}
            >
                Sign Up
            </button>
        </p>
    </form>
</div>
}

export default Login