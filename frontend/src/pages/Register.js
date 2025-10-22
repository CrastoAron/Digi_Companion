import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlusIcon } from '@heroicons/react/24/solid';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold">Create Your Lifespan Account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange}
            className="w-full px-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          <input name="email" required type="email" placeholder="Email address" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          <input name="password" required type="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={handleChange}
            className="w-full px-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

          <div className="flex items-center">
            <input id="terms" required type="checkbox" className="h-4 w-4" />
            <label htmlFor="terms" className="ml-2 text-sm">I agree to the <Link to="#" className="text-indigo-600">Terms</Link></label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
            <UserPlusIcon className="h-5 w-5 mr-2" /> {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
