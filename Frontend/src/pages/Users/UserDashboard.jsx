import React, { useContext } from 'react'
import useUserAuth from '../../hooks/useUserAuth.jsx'
import { UserContext } from '../../context/UserContext.jsx';

const UserDashboard = () => {
  useUserAuth();

  const {user} = useContext(UserContext);
  return (
    <div>
      UserDashboard Page
    </div>
  )
}

export default UserDashboard
