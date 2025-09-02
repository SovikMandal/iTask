import React from 'react'
import UI_IMG from '../assets/images/auth-img.png';

const AuthLayout = ({ children }) => {
  return <div className='flex md:overflow-hidden lg:overflow-hidden'>
    <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        
        <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            iTask
        </h2>
        <p className='text-sm text-gray-600 '>Manage Your Tasks Efficiently</p>
        {children}
    </div>

    <div className='hidden md:flex md:w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url("/bg-img2.png")] bg-cover bg-no-repeat bg-center overflow-hidden p-8'> 
        <img src={UI_IMG} className='w-64 lg:w-[80%]' />
    </div>
  </div>
}

export default AuthLayout
