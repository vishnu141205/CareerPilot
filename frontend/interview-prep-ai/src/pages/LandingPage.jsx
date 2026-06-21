import React, {useState} from 'react'
import heroImage from '../assets/hero2.png';
import {useNavigate} from 'react-router-dom';
import {LuSparkles} from 'react-icons/lu';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard.jsx';
import Modal from '../components/Modal.jsx';
import Login from './Auth/Login.jsx';
import SignUp from './Auth/SignUp.jsx';
import { useContext } from 'react';
import { UserContext } from '../context/userContext.jsx';

const LandingPage = () => {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const[openAuthModal, setOpenAuthModal] = useState(false);
    const[currentPage, setCurrentPage] = useState('login');

    const handleCTA=()=>{
        if(!user){
            setOpenAuthModal(true);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <>
        <div className="w-full min-h-full bg-black">
            <div className="w-[500px] h-[500px] blur-[45px] absolute" />

            <div className="container mx-auto px-4 pt-6 pb-[150px] relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between mb-16">
                    <div className="text-3xl font-extrabold text-blue-500 tracking-tight">
                        CareerPilot
                    </div>
                    
                    {user ? (
                        <ProfileInfoCard />
                    ) : (
                        <button className="bg-blue-600 text-base font-semibold text-white py-3 px-8 rounded-full hover:bg-blue-500 transition-colors cursor-pointer hover:shadow-xl hover:shadow-blue-500/20" onClick={()=>setOpenAuthModal(true)}>
                            Login / Sign Up
                        </button>
                    )}
                </header>

                {/* Hero Section - CHANGED TO STACKED & CENTERED */}
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-8">
                    
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2 text-sm text-blue-300 font-semibold px-4 py-1.5 bg-blue-900/40 border border-blue-800/50 rounded-full">
                           <LuSparkles /> AI Powered
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl text-white font-extrabold mb-8 leading-tight tracking-tight">
                        Land Your Dream Tech Job with {" "}
                        <span className="text-amber-500 block sm:inline mt-2 sm:mt-0">Smart AI</span>{" "}
                        Learning
                    </h1>

                    {/* Added max-w-2xl and mx-auto to keep text readable and centered */}
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Stop searching forums for generic practice questions. Tell your role and key topics, and AI will generate the exact questions you need to study.
                    </p>

                    <button className="bg-blue-600 text-lg font-bold text-white py-4 px-10 rounded-full hover:bg-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-600/20" onClick={handleCTA}>
                        Get Started
                    </button>
                </div>      
            </div>
        </div>

        {/* Hero Image Section */}
        <div className="w-full min-h-full relative z-10 mb-0 bg-black pb-20">
            <div>
                <section className="flex items-center justify-center -mt-10">
                    <img src={heroImage} alt="Hero" className="w-[60vw] rounded-2xl shadow-2xl border border-gray-800" />
                </section>
            </div>
        </div>

        <div>
            {/* Footer */}
            <footer className="bg-neutral-950 border-t border-gray-900 py-8 text-center text-gray-500 text-base font-medium">
                &copy; {new Date().getFullYear()} CareerPilot. All rights reserved.
            </footer>
        </div>

        {/* Auth Modal */}
        <Modal
            isOpen={openAuthModal}
            onClose={()=>{
                setOpenAuthModal(false);
                setCurrentPage('login');
            }}
            hideHeader
        >
            <div>
                {currentPage === 'login' && (
                    <Login setCurrentPage={setCurrentPage} />
                )}
                {currentPage === 'signup' && (
                    <SignUp setCurrentPage={setCurrentPage} />
                )}
            </div>
        </Modal> 
        </>
    )
}

export default LandingPage