import React from 'react'

const InfoBox = ({ label, content }) => {
  return (
    <>
      <label className='text-xs font-medium text-slate-500'>{label}</label>
      <p className='text-[12px] text-slate-700 mt-0.5 font-medium md:text-[13px]'>{content}</p>
    </>
  )
}

export default InfoBox
