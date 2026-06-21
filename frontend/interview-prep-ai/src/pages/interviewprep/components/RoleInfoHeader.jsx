import React from 'react'

const RoleInfoHeader = ({ role, experience, topicsToFocus, questions, description, lastUpdated }) => {
  return (
    <div className="bg-white relative">
        <div className="container mx-auto px-10 md:px-0">
            <div className="h-[200px] flex flex-col justify-center relative z-10">
                <div className="flex items-start">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold">{role}</h2>
                                <p className="text-xl text-gray-600 mt-1">{topicsToFocus}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <div className="text-sm text-gray-500 font-medium px-2 py-1 bg-green-100 rounded-full">
                        Experience: {experience} {experience === 1 ? "year" : "years"}
                    </div>
                    <div className="text-sm text-gray-500 font-medium px-2 py-1 bg-blue-100 rounded-full">
                        {questions} Q&A
                    </div>
                    <div className="text-sm text-gray-500 font-medium px-2 py-1 bg-purple-100 rounded-full">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </div>

            <div className="w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-center bg-white overflow-hidden absolute top-0 right-0">
                <div className="w-16 h-16 bg-lime-300 blur-[65px] animate-blob1" />
                <div className="w-16 h-16 bg-teal-300 blur-[65px] animate-blob2" />
                <div className="w-16 h-16 bg-cyan-300 blur-[65px] animate-blob3" />
                <div className="w-16 h-16 bg-pink-300 blur-[65px] animate-blob4" />
            </div>
        </div>
        
            

    </div>
  )
}

export default RoleInfoHeader