import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { LuFileSpreadsheet, LuPlus, LuClipboardList } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs.jsx";
import TaskCard from "../../components/TaskCard.jsx";
import toast from "react-hot-toast";

const MyTasks = () => {
  const [allTask, setAllTask] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTask(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.allTasks ?? (response.data?.tasks?.length || 0) },
        { label: "Pending", count: statusSummary.pendingTasks ?? 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks ?? 0 },
        { label: "Completed", count: statusSummary.completedTasks ?? 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  const EmptyState = () => {
    const getEmptyStateContent = () => {
      switch (filterStatus) {
        case "Pending":
          return {
            icon: <LuClipboardList className="w-16 h-16 text-orange-400" />,
            title: "No Pending Tasks",
            description: "Great! You don't have any pending tasks at the moment.",
            actionText: "View All Tasks",
            actionColor: "bg-orange-500 hover:bg-orange-600"
          };
        case "In Progress":
          return {
            icon: <LuClipboardList className="w-16 h-16 text-blue-400" />,
            title: "No Tasks In Progress",
            description: "You don't have any tasks currently in progress.",
            actionText: "View All Tasks",
            actionColor: "bg-blue-500 hover:bg-blue-600"
          };
        case "Completed":
          return {
            icon: <LuClipboardList className="w-16 h-16 text-green-400" />,
            title: "No Completed Tasks",
            description: "Complete some tasks to see them here.",
            actionText: "View All Tasks",
            actionColor: "bg-green-500 hover:bg-green-600"
          };
        default:
          return {
            icon: <LuClipboardList className="w-16 h-16 text-gray-400" />,
            title: "No Tasks Yet",
            description: "You don't have any tasks assigned to you yet. Tasks will appear here once they're assigned.",
            actionText: "Refresh Page",
            actionColor: "bg-blue-500 hover:bg-blue-600"
          };
      }
    };

    const content = getEmptyStateContent();

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 max-w-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto animate-pulse opacity-50"></div>
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto bg-white rounded-full border-2 border-gray-200 shadow-lg">
              {content.icon}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            {content.title}
          </h3>
          
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {content.description}
          </p>

          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48"></div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {tabs.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {loading && <LoadingState />}

        {!loading && allTask.length === 0 && <EmptyState />}

        {!loading && allTask.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {allTask?.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;