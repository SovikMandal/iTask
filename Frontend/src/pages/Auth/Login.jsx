import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout.jsx';
import Input from '../../components/Input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/UserContext.jsx';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("accessToken", token);
        updateUser(response.data)

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your credentials to log in.</p>

        <form onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            label="Email Address"
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            value={password}
            label="Password"
            placeholder="Password (Min 8 characters)"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button 
            type="submit" 
            className='btn-primary'
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login;