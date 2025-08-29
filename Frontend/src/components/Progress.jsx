import React from 'react'

const Progress = ({ progress, status }) => {
    const getColor = () => {
        switch (status) {
            case "Completed":
                return "bg-indigo-500 text-indigo-500 border border-indigo-500/20";
            case "In Progress":
                return "bg-cyan-500 text-cyan-500 border border-cyan-500/20";
            default:
                return "bg-violet-500 text-violet-500 border border-violet-500/20";
        }
    }
  return (
    <div className='w-full rounded-full h-1.5'>
      <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`}style={{width:`${progress}%`}}></div>
    </div>
  )
}

export default Progress
