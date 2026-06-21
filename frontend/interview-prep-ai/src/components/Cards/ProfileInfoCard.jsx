import React from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/');
    };

    // CRITICAL SAFETY CHECK: 
    // If the user data hasn't loaded yet (or if they just logged out), 
    // render nothing instead of crashing the app trying to read user.name.
    if (!user) return null;

  return (
    <div className="flex items-center">
        {/* Fix #1: Added "|| null" to prevent the empty src network error */}
        <img
          src={user.profileImageUrl || null}
          alt="Profile" 
          className="w-11 h-11 rounded-full bg-gray-300 mr-3 object-cover" 
        />

        <div>
            <div className="text-[15px] text-white font-bold leading-3">
               {/* Fix #2: Fallback text just in case name is empty */}
               {user.name || "User"} 
            </div>
            
            <button
              type="button" 
              className="text-amber-500 text-sm font-semibold hover:underline cursor-pointer mt-1"
              onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfoCard;