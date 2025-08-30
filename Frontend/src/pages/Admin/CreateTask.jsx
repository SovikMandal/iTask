import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout.jsx";
import { PRIORITY_DATA } from "../../utils/data.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropDown from "../../components/SelectDropDown.jsx";
import CustomCalendar from "../../components/CustomCalendar.jsx";
import SelectUsers from "../../components/SelectUsers.jsx";
import TodoListInput from "../../components/TodoListInput.jsx";
import AddAttachmentsInputs from "../../components/AddAttachmentsInputs.jsx";
import Modal from "../../components/Modal.jsx";
import DeleteAlert from "../../components/DeleteAlert.jsx";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
    setSelectedUsers([]);
    setTodoList([]);
    setAttachments([]);
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task created successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist.map((item) => {
        const prevTodoCheckList = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoCheckList.find((task) => task.text === item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task updated successfully");
      clearData();
    } catch (error) {
      console.error("Error updating task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
        setError(null);

    if(!taskData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if(!taskData.description.trim()) {
      setError("Task description is required");
      return;
    }

    if(!taskData.dueDate) {
      setError("Due date is required");
      return;
    }

    if(taskData.assignedTo.length === 0) {
      setError("At least one user must be assigned");
      return;
    }

    if(taskData.todoChecklist?.length === 0) {
      setError("At least one todo item is required");
      return;
    }

    if(taskData.attachments?.length === 0) {
      setError("At least one attachment is required");
      return;
    }

    if(taskId) {
      await updateTask();
      return;
    } else {
      await createTask();
    }
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

      if (response.data && response.data.task) {
        const taskInfo = response.data.task;

        setTaskData({
          title: taskInfo.title || "",
          description: taskInfo.description || "",
          priority: taskInfo.priority || "Low",
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((user) => user?._id || user) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo?.attachments || [],
        });

        setSelectedUsers(taskInfo?.assignedTo || []);
      } else {
        console.error("Task data not found in response");
      }
    } catch (error) {
      console.error("Error fetching task details:", error.response?.data || error);
    }
  };
  
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false)
      toast.success("Task deleted successfully");
      clearData();
      navigate('/admin/manage-tasks');
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    if(taskId) {
      getTaskDetailsById(taskId);
    }
    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-100 rounded px-2 py-1 border border-rose-200 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete Task
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                Task Title
              </label>
              <input
                className="form-input"
                placeholder="Enter Task Title"
                type="text"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 mb-2 block">
                Description
              </label>
              <textarea
                className="form-input h-32 resize-none"
                placeholder="Enter Task Description"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Priority
                </label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Due Date
                </label>
                <CustomCalendar
                  placeholder="Select Due Date"
                  value={taskData.dueDate}
                  onChange={(date) => handleValueChange("dueDate", date)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Assigned To
                </label>
                <SelectUsers
                  selectedUsers={selectedUsers}
                  setSelectedUsers={(value) => {
                    setSelectedUsers(value);
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 ">
                TODO Checklist
              </label>

              <TodoListInput 
                todoList={taskData?.todoChecklist}
                setTodoList={(value) => handleValueChange("todoChecklist", value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 ">
                Add Attachments
              </label>

              <AddAttachmentsInputs 
                attachments={taskData?.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn justify-center"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask(taskId)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;