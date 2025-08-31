export const BASE_URL = "https://itask-backend-arr7.onrender.com";

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/register',
    GET_PROFILE: '/api/auth/profile',
  },

  USER: {
    GET_ALL_USERS: '/api/users',
    CREATE_USER: '/api/users',
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER: (userId) => `/api/users/${userId}`,
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: '/api/tasks/dashboard-data',
    GET_USER_DASHBOARD_DATA: '/api/tasks/user-dashboard-data',
    GET_ALL_TASKS: '/api/tasks',
    CREATE_TASK: '/api/tasks',
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,
  },

  REPORTS: {
    EXPORT_TASKS: '/api/reports/export/tasks',
    EXPORT_USERS: '/api/reports/export/users',
  },

  IMAGE: {
    UPLOAD: '/api/auth/upload-image',
  }
};
