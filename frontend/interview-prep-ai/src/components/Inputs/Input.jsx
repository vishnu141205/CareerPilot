import React, {useState} from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const Input = ({value, onChange, label, placeholder, type}) => {
    const [showPassword, setShowPassword] = useState(false);

     const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
  return (
    <div>
        <label className="text-[13px] text-slate-800">{label}</label>
        <div className="input-box">
            <input
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
                className="w-full bg-transparent outline-none"
            />
            {type === "password" && (
                <>
                {showPassword ? (<FaRegEye size={22}
                    className="cursor-pointer text-primary"
                    onClick={() => togglePasswordVisibility()}
                
                />) : (<FaRegEyeSlash 
                    size={22}
                    className="cursor-pointer text-slate-500"
                    onClick={() =>togglePasswordVisibility()}
                />
                )}
                </>
            )}
        </div>
    </div>
  )
}

export default Input