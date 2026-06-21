import React from "react"

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 bg-gray-200 rounded-lg w-3/4"></div>

      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>

      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  )
}

export default SkeletonLoader