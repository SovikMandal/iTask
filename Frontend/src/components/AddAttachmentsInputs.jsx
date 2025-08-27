import React, { useState } from 'react'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';
import { LuPaperclip } from 'react-icons/lu'

const AddAttachmentsInputs = ({ attachments, setAttachments }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
      if (option.trim()) {
        setAttachments([...attachments, option.trim()]);
        setOption("");
      }
    };

    const handleDeleteOption = (index) => {
      const updateArr = attachments.filter((_, i) => i !== index);
      setAttachments(updateArr);
    };

  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item}
          className='flex justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mb-3 mt-2'
        >
            <div className='flex-1 flex items-center gap-3'>
                <LuPaperclip className='text-gray-400' />
                <p className='text-xs text-black'>{item}</p>
            </div>

            <button
              className='cursor-pointer'
              onClick={() => handleDeleteOption(index)}
            >
                <HiOutlineTrash className='text-lg text-red-500' />
            </button>
        </div>
      ))}

      <div className='flex items-center gap-5 mt-4 '>
        <div className='flex items-center gap-3 flex-1 border border-gray-200 px-3 rounded-md'>
            <LuPaperclip className='' />

            <input 
              type="text"
              value={option}
              onChange={({target}) => setOption(target.value)}
              placeholder='Add a new attachment'
              className='w-full text-[13px] text-black outline-none bg-white px-3 py-2'
            />
        </div>

        <button 
          onClick={handleAddOption}
          className='card-btn text-nowrap'
        >
            <HiPlus className='text-lg' /> Add
        </button>
      </div>
    </div>
  )
}

export default AddAttachmentsInputs