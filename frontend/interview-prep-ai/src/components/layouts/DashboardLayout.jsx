import React from 'react'
import Navbar from './Navbar.jsx'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext.jsx';

const DashboardLayout = ({ children }) => {
    const {user} = useContext(UserContext);
  return (
    <div>
        <Navbar />

        {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout