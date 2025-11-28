// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.register(form);
      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
        dark:from-gray-900 dark:via-gray-800 dark:to-black
        px-4 py-10
      "
    >
      {/* Glass Form Card */}
      <div
        className="
          w-full max-w-md 
          bg-white/20 dark:bg-gray-800/40 
          backdrop-blur-xl 
          rounded-3xl shadow-2xl 
          p-10 border border-white/20
        "
      >
        <h2
          className="
            text-4xl font-extrabold text-center 
            text-white dark:text-gray-100 drop-shadow-lg
            mb-8
          "
        >
          Create Your Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/70 dark:bg-gray-700/70
              text-gray-800 dark:text-gray-200
              focus:ring-4 focus:ring-indigo-300 
              outline-none shadow-lg
            "
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={onChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/70 dark:bg-gray-700/70
              text-gray-800 dark:text-gray-200
              focus:ring-4 focus:ring-indigo-300 
              outline-none shadow-lg
            "
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={onChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/70 dark:bg-gray-700/70
              text-gray-800 dark:text-gray-200
              focus:ring-4 focus:ring-indigo-300 
              outline-none shadow-lg
            "
          />

          {/* Register Button */}
          <button
            className="
              w-full py-4 rounded-xl text-lg font-semibold
              bg-indigo-600 hover:bg-indigo-700 
              text-white shadow-lg
              transition-all 
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-white/90 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-300 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
