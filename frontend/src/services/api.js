import axios from 'axios';
// This client will handle all communication between the React frontend and the Express backend.

// 1. Define the base URL for your Express backend
// Use the development port (e.g., 5000) where your backend server.js is running.
const BASE_URL = 'http://localhost:5000/api';
const AI_BASE_URL = "http://localhost:9000"; 

// 2. Create a custom Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // Set default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Add an Interceptor for Request Headers (e.g., attaching the JWT token)
// This runs before every request is sent.
api.interceptors.request.use(
  (config) => {
    // In a real application, retrieve the token (e.g., from localStorage)
    const token = localStorage.getItem('userToken'); 
    
    // Attach the Authorization header if a token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 4. Add an Interceptor for Response Errors (e.g., handling 401 Unauthorized)
// This runs for every response received.
api.interceptors.response.use(
  (response) => {
    // If the response is successful (2xx), just return it
    return response;
  },
  (error) => {
    // Check for specific error statuses (e.g., 401 Unauthorized/Expired Token)
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized - Token Expired or Missing.");
      
      // In a real app, you would:
      // 1. Clear the invalid token from local storage.
      // 2. Redirect the user to the login page.
      // localStorage.removeItem('userToken');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// AI Speech to text & ai Service
export async function sendTextToAI(text) {
  const res = await fetch(`${AI_BASE_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function sendAudioToAI(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${AI_BASE_URL}/speech`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
//_____________________________________________________

// 5. Export the configured instance
export default api;

// Example of how a service file (e.g., healthService.js) might use it:
/*
import api from './api';

const healthService = {
  getVitals: () => api.get('/health/vitals'),
  addRecord: (data) => api.post('/health/records', data),
};

export default healthService;
*/