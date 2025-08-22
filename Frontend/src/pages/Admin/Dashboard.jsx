import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import useUserAuth from '../../hooks/useUserAuth.jsx'
import DashboardLayout from '../../layout/DashboardLayout.jsx';
import { UserContext } from '../../context/UserContext.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import InfoCard from '../../components/InfoCard.jsx';
import { addThousandsSeparator } from '../../utils/helper.js';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable.jsx';

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

  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  useEffect(() => {
    getDashboardData();

    return () => {}
  }, []);
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>Good Morning! {user?.name}</h2>
            <p className='text-xs md:text-[13px] text-gray-500 mt-1.5'>{moment().format('dddd Do MMM YYYY')}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(dashboardData?.statistics?.totalTask || 0)}
            color="bg-blue-600"
          />
          <InfoCard
            label="Pending"
            value={addThousandsSeparator(dashboardData?.statistics?.pendingTask || 0)}
            color="bg-red-500"
          />
          <InfoCard
            label="In Progress"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.In_Progress || 0)}
            color="bg-yellow-500"
          />
          <InfoCard
            label="Completed"
            value={addThousandsSeparator(dashboardData?.statistics?.completedTask || 0)}
            color="bg-green-600"
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
        <div className='md:col-span-2'>
          <div className='card'>
            <div className='flex justify-between items-center'>
              <h5 className='text-lg font-semibold'>Recent Tasks</h5>

              <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base' /></button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
