import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/Auth/SignUp.jsx";
import Login from "./pages/Auth/Login.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import ManageTask from "./pages/Admin/ManageTask.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import UserDashboard from "./pages/Users/UserDashboard.jsx";
import MyTasks from "./pages/Users/MyTasks.jsx";
import ViewTaskDetails from "./pages/Users/ViewTaskDetails.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import UserProvider, { UserContext } from "./context/UserContext.jsx";

const App = () => {
  return (
    <UserProvider>
      <>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/task" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/my-tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              />
            </Route>

            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
