import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths.js';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import uploadImage from '../../utils/uploadImage.js';

const SignUp = ({setCurrentPage}) => {

    const [profilepic, setProfilepic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
      e.preventDefault();

      let profileImageUrl = "";

        if(!fullName) {
              setError('Full name is required');
              return;
          }

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
            // Make API call to registration endpoint
            if(profilepic){
              const imgUploadRes = await uploadImage(profilepic);
              profileImageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { name: fullName, email, password, profileImageUrl });
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
                setError('An error occurred during registration. Please try again.');
            }
        }
        
    };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-black">Create an account</h3>
      <p className="text-gray-600 mb-6 text-xs mt-[5px]">Sign up to get started</p>

      <form onSubmit={handleSignup}>

        <ProfilePhotoSelector image={profilepic} setImage={setProfilepic} />
        {/* <Input 
          type="file"
          placeholder="Profile Picture"
          value={profilepic}
          onChange={(e) => setProfilepic(e.target.files[0])}
          label="Profile Picture"
        /> */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <Input 
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          label="Full Name"
        />
        <Input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
        />
        <Input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
        />
        </div>
        {/* <Input 
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm Password"
        /> */}

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button 
          type="submit"
          className="btn-primary"
        >
          SIGN UP
        </button>

        <p className="text-sm text-gray-600 mt-4">Already have an account? {" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp