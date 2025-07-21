import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext';

const TechnicianProfileForm = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        pincode: '',
        servicesOffered: '',
        bio: '',
        hourlyRate: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'technician') {
            navigate('/');
            return;
        }

        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('http://localhost:5000/api/technicians/me', {
                    headers: { 'x-auth-token': token }
                });
                const profileData = res.data;
                setFormData({
                    firstName: profileData.firstName || '',
                    lastName: profileData.lastName || '',
                    phone: profileData.phone || '',
                    address: profileData.address || '',
                    pincode: profileData.pincode || '',
                    servicesOffered: profileData.servicesOffered ? profileData.servicesOffered.map(s => s.name).join(', ') : '',
                    bio: profileData.bio || '',
                    hourlyRate: profileData.hourlyRate || ''
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching existing profile (expected if new):', err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        console.log('Form onSubmit triggered!'); // <--- ADDED THIS LINE
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to manage your profile.', 'error');
            return;
        }

        const servicesArray = formData.servicesOffered.split(',').map(service => service.trim()).filter(service => service !== '');

        try {
            await axios.post('http://localhost:5000/api/technicians', { ...formData, servicesOffered: servicesArray }, {
                headers: {
                    'x-auth-token': token
                }
            });
            showNotification('Profile updated successfully!', 'success');
            navigate('/technicians/me'); // Redirect to view profile
        } catch (err) {
            console.error(err.response.data);
            showNotification(err.response.data.msg || 'Failed to update profile.', 'error');
        }
    };

    if (loading) return <div>Loading profile form...</div>;

    return (
        <div>
            <h1>{formData.firstName ? 'Edit Your Profile' : 'Create Your Profile'}</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={onChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={onChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={onChange} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={onChange} />
                </div>
                <div>
                    <label>Pincode:</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={onChange} maxLength="6" />
                </div>
                <div>
                    <label>Services Offered (comma-separated):</label>
                    <input type="text" name="servicesOffered" value={formData.servicesOffered} onChange={onChange} placeholder="e.g., Plumbing, Electrical, HVAC" />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea name="bio" value={formData.bio} onChange={onChange} maxLength="300"></textarea>
                </div>
                <div>
                    <label>Hourly Rate:</label>
                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={onChange} min="0" />
                </div>
                <input type="submit" value="Save Profile" />
            </form>
        </div>
    );
};

export default TechnicianProfileForm;