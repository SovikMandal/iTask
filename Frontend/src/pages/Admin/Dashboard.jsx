import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useUserAuth from '../../hooks/useUserAuth.jsx'
import DashboardLayout from '../../layout/DashboardLayout.jsx';
import { UserContext } from '../../context/UserContext.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

const Dashboard = () => {
  useUserAuth();

  const { user } = useUserAuth(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if(response.data) {
        setDashboardData(response.data); 
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getDashboardData();

    return () => {}
  }, []);
  return (
    <DashboardLayout activeMenu="Dashboard">
      
    </DashboardLayout>
  )
}

export default Dashboard
