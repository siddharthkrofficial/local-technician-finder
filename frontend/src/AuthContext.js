import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to set auth token in axios headers
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    const res = await axios.get('https://local-technician-finder-backend.onrender.com/api/auth/me');
                    setUser(res.data.user);
                } catch (err) {
                    console.error('Error loading user:', err);
                    localStorage.removeItem('token');
                    setAuthToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (username, email, password, role) => {
        try {
            const res = await axios.post('https://local-technician-finder-backend.onrender.com/api/auth/register', { username, email, password, role });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            // Fetch user data after successful registration to set user state
            const userRes = await axios.get('https://local-technician-finder-backend.onrender.com/api/auth/me');
            setUser(userRes.data.user);
            return true;
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg || 'Registration failed.'); // Reverted to alert
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('https://local-technician-finder-backend.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            // Fetch user data after successful login to set user state
            const userRes = await axios.get('https://local-technician-finder-backend.onrender.com/api/auth/me');
            setUser(userRes.data.user);
            return true;
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg || 'Login failed.'); // Reverted to alert
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;