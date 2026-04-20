import axios from 'axios';
import toast from 'react-hot-toast';

// Core API service for handling all backend communications.
// This service uses axios for requests and includes built-in toast notifications for errors.
// =============================================================
// Base API instance configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('learnx_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle 401 expressly (e.g., clear auth, redirect to login via event emission or similar)
            if (error.response.status === 401) {
                console.error('Session expired or unauthorized');
                // You can clear localStorage and reload or let AuthContext handle it
            }
            
            // Generate a global toast for 500+ errors
            if (error.response.status >= 500) {
                toast.error('Server error. Please try again later.');
            }
        } else {
            // Network error
            toast.error('Network Error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

// Abstracted API instance for the frontend application
export default api;
