import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext'; // Import NotificationContext

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use showNotification
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const success = await login(email, password);
            if (success) {
                showNotification('Login Successful!', 'success');
                navigate('/'); // Redirect to home page or dashboard
            } else {
                // Notification for failed login is handled in AuthContext.js
            }
        } catch (err) {
            console.error(err);
            showNotification('An error occurred during login.', 'error');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;