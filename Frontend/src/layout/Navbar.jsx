import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import SideMenu from './SideMenu.jsx'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogoClick = () => {
    const userRole = user?.role;
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'user') {
      navigate('/user/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className='flex items-center bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>

      <h2 onClick={handleLogoClick} className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer'>
        iTask
      </h2>

      <button
        className='block lg:hidden text-black ml-auto'
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {openSideMenu && (
        <div className='fixed top-[61px] right-0 bg-white shadow-lg'>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar;
