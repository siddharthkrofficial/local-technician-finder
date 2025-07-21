import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext'; // Import NotificationContext

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'customer'
    });
    const { register } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use showNotification
    const navigate = useNavigate();

    const { username, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const success = await register(username, email, password, role);
            if (success) {
                showNotification('Registration Successful!', 'success');
                navigate('/'); // Redirect to home page or dashboard
            } else {
                // Notification for failed registration is handled in AuthContext.js
            }
        } catch (err) {
            console.error(err);
            showNotification('An error occurred during registration.', 'error');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
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
                        minLength="6"
                        required
                    />
                </div>
                <div>
                    <select name="role" value={role} onChange={onChange}>
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                    </select>
                </div>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};

export default Register;