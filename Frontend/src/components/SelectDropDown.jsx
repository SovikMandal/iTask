import React from 'react';
import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropDown = ({options, value, onChange, placeholder}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

  return (
    <div className='relative w-full'>
      <button
        className='w-full text-sm text-black outline-none bg-white border border-slate-200 px-2.5 py-3 mt-2 flex justify-between rounded-md items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <span className='ml-2'>{isOpen ? <LuChevronDown className='rotate-180'/> : <LuChevronDown/>}</span>
      </button>

      {isOpen && (
        <div className='absolute w-full bg-white border border-slate-200 mt-1 rounded-md shadow-md z-10'>
            {options.map((option) => (
                <div key={option.value} className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100' onClick={() => handleSelect(option.value)}>
                    {option.label}
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default SelectDropDown
