import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setCredentials({...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(credentials);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold">Sign in to Lifespan</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input name="email" type="email" required placeholder="Email address"
              className="appearance-none rounded relative block w-full px-3 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={credentials.email} onChange={handleChange} />
          </div>
          <div>
            <input name="password" type="password" required placeholder="Password"
              className="appearance-none rounded relative block w-full px-3 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={credentials.password} onChange={handleChange} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm">
          Not a member? <Link to="/register" className="text-indigo-600">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
