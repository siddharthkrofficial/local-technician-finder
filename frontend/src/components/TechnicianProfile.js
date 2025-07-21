import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TechnicianProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/technicians/${id}`);
                setProfile(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch technician profile.');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>No profile found.</div>;

    return (
        <div>
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p><strong>Email:</strong> {profile.userId.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Services Offered:</strong> {profile.servicesOffered.map(s => s.name).join(', ')}</p> {/* Display service names */}
            <p><strong>Hourly Rate:</strong> ${profile.hourlyRate}</p>
            <p><strong>Average Rating:</strong> {profile.averageRating.toFixed(1)} ({profile.totalReviews} reviews)</p>
        </div>
    );
};

export default TechnicianProfile;