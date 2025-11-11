import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import authService from "../services/authService";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        const userObj = { email: data.user?.email || payload.email, name: data.user?.name || "" };
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
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="muted">No account? <span onClick={() => navigate("/register")} className="link-ish">Sign up</span></p>
      </div>
    </div>
  );
}
