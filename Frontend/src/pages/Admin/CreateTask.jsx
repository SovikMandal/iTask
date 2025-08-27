import React, { useState } from "react";
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

  const createTask = async () => {};

  const updateTask = async () => {};

  const handleSubmit = async () => {};

  const getTaskDetailsById = async () => {};
  
  const deleteTask = async () => {};

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
    </DashboardLayout>
  );
};

export default CreateTask;