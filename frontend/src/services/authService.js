// src/services/authService.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export default {
  register: (data) => API.post("/auth/signup", data),
  login: (credentials) => API.post("/auth/login", credentials),
};
