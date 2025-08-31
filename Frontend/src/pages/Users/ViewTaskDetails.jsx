import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths.js';
import DashboardLayout from '../../layout/DashboardLayout.jsx';
import InfoBox from '../../components/InfoBox.jsx';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup.jsx';
import TodoChecklist from '../../components/TodoChecklist.jsx';
import Attachments from '../../components/Attachments.jsx';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border-violet-500/10";
    }
  }

  const getTaskDetailById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if(response.data) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    if (!task) return;
    const todoChecklist = [ ...task.todoChecklist ];
    todoChecklist[index].isCompleted = !todoChecklist[index].isCompleted;

    try {
      const token = localStorage.getItem('token');
      console.log("Authorization Token:", token);

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if(response.status === 200) {
        setTask(response.data?.task || task);
      } else {
        todoChecklist[index].isCompleted = !todoChecklist[index].isCompleted;
        setTask({ ...task, todoChecklist });
      }
    } catch (error) {
      todoChecklist[index].isCompleted = !todoChecklist[index].isCompleted;
      setTask({ ...task, todoChecklist });
      alert(error.response?.data?.message || "Error updating todo checklist");
      console.error("Error updating todo checklist:", error);
    }
  };

  const handleLinkClick = (link) => {
    if(!/^(https):\/\//.test(link)) {
      link = `https://${link}`;
    }
    window.open(link, '_blank');
  }

  useEffect(() => {
    if(id) {
      getTaskDetailById();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className='mt-5'>
        { task && (
          <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
            <div className='form-card col-span-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl md:text-xl font-medium'>
                  {task?.title}
                </h2>
                <div className={`text-[11px] md:text-[13px] font-medium ${getStatusColor(task?.status)} px-4 py-0.5 rounded`}>
                  {task?.status}
                </div>
              </div>
              <div className='mt-4'>
                <InfoBox label="Description" content={task?.description} />
              </div>
              <div className='grid grid-cols-12 gap-4 mt-4'>
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label="Priority" content={task?.priority} />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox 
                    label="Due Date" 
                    content={
                      task?.dueDate
                      ? moment(task?.dueDate).format("Do MMM YYYY")
                      : "No Due Date"
                    } 
                  />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-500'>
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={task?.assignedTo?.map(user => user.profileImageUrl) || []} 
                    maxVisible={5}
                  />
                </div>
              </div>
              <div className='mt-2'>
                <label className='text-xs font-medium text-slate-500'>
                  Todo Checklist
                </label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoChecklist
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.isCompleted}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>
              {task?.attachments?.length > 0 && (
                <div className='mt-2'>
                  <label className='text-xs font-medium text-slate-500'>
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachments
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails;