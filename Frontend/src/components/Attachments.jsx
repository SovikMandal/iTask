import React from 'react'
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const Attachments = ({ link, index, onClick }) => {
  return (
    <div
        className='flex justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-3 mt-2 cursor-pointer'
        onClick={onClick}
    >
      <div className='flex-1 flex items-center gap-3'>
        <span className='text-xs text-gray-400 font-semibold mr-2'>
            {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className='text-xs text-black'>{link}</p>
      </div>
      <LuSquareArrowOutUpRight className='text-gray-400' />
    </div>
  )
}

export default Attachments
