import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import authService from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="muted">Already have an account? <span onClick={() => navigate("/login")} className="link-ish">Login</span></p>
      </div>
    </div>
  );
}
