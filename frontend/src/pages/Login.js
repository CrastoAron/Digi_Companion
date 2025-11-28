// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      };

      const res = await authService.login(payload);
      const data = res.data;

      if (data.success) {
        if (data.token) localStorage.setItem("token", data.token);

        const userObj = {
          email: data.user?.email || payload.email,
          name: data.user?.name || "",
        };

        onLogin && onLogin(userObj);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
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
      {/* Glass Card */}
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
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              required
              className="
                w-full p-4 rounded-xl 
                bg-white/70 dark:bg-gray-700/70
                text-gray-800 dark:text-gray-200
                focus:ring-4 focus:ring-indigo-300
                outline-none shadow-md
              "
            />
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              required
              className="
                w-full p-4 rounded-xl 
                bg-white/70 dark:bg-gray-700/70
                text-gray-800 dark:text-gray-200
                focus:ring-4 focus:ring-indigo-300
                outline-none shadow-md
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-4 rounded-xl text-lg font-semibold
              bg-indigo-600 hover:bg-indigo-700 
              text-white shadow-lg 
              transition-all 
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-white/90 mt-6">
          No account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-300 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
