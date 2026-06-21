import React from 'react'
import { LuTrash2 } from 'react-icons/lu';
import { getInitials } from '../../utils/helper.js';

const SummaryCard = ({ colors, role, topicsToFocus, experience, questions, description, lastUpdated, onSelect, onDelete }) => {
  return (
    <div
        className="bg-white border border-gray-200 rounded-xl p-2 overflow-hidden cursor-pointer hover:shadow-xl shadow-gray-100 relative group"
        onClick={onSelect}
        >

        <div
        className="rounded-lg p-4 cursor-pointer relative"
        style={{
        background: colors.bgcolor,
        }}
        >
        <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-md flex items-center justify-center mr-3">
                <span className="text-lg font-semibold text-gray-800">
                    {getInitials(role)}
                </span>
            </div>
        

        {/* Content Container */}
        <div className="flex-grow">
            <div className="flex items-start justify-between">
        {/* Title and Skills */}
                <div>
                    <h2 className="text-[17px] font-medium">{role}</h2>
                    <p className="text-sm text-gray-600 text-medium">{topicsToFocus}</p>
                </div>
            </div>
        </div>
        </div>

        <button
        className="hidden group-hover:flex items-center gap-2 text-sm text-red-500 font-medium bg-red-100 px-3 py-1 rounded text-nowrap border border-red-200 hover:border-red-200 cursor-pointer absolute top-0 right-0"
        onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}
        >
            <LuTrash2 />
        </button>
        </div>

        <div className="px-3 pb-3">
            <div className="flex items-center gap-3 mt-4">
                <div className="text-[10px] text-gray-500 font-medium px-2 py-1 border-[0.5px] border-gray-300 rounded-full">
                    Experience: {experience} {experience === 1 ? "year" : "years"}
                </div>

                <div className="text-[10px] text-gray-500 font-medium px-2 py-1 border-[0.5px] border-gray-300 rounded-full">
                    {questions} Q&A
                </div>

                <div className="text-[10px] text-gray-500 font-medium px-2 py-1 border-[0.5px] border-gray-300 rounded-full">
                    Last Updated: {lastUpdated}
                </div>
            </div>

            <p className="text-[12px] text-black font-medium line-clamp mt-3">{description}</p>
        </div>
    </div>


  )
}

export default SummaryCard