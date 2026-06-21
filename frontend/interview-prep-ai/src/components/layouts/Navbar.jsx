import React from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard.jsx'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="h-16 bg-black border-b border-gray-200 backdrop-blur-[2px] py-2.5 px-4md:px-0 sticky top-0 z-30">
        <div className="container flex items-center justify-between mx-auto gap-5">
            <Link to="/dashboard">
                <h1 className="text-lg md:text-xl font-bold text-blue-500">CareerPilot</h1>
            </Link>

            <ProfileInfoCard />
        </div>
    </div>
  )
}

export default Navbar