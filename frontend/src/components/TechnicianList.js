import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TechnicianList = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchPincode, setSearchPincode] = useState(''); // New state for pincode search

    const fetchTechnicians = async (pincode = '') => {
        try {
            const url = pincode ? `https://local-technician-finder-backend.onrender.com/api/technicians?pincode=${pincode}` : 'https://local-technician-finder-backend.onrender.com/api/technicians';
            const res = await axios.get(url);
            setTechnicians(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch technicians.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians(); // Initial fetch of all technicians
    }, []);

    const handlePincodeSearch = () => {
        fetchTechnicians(searchPincode);
    };

    if (loading) return <div>Loading technicians...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Our Technicians</h1>
            <div>
                <label>Search by Pincode:</label>
                <input 
                    type="text" 
                    value={searchPincode} 
                    onChange={(e) => setSearchPincode(e.target.value)} 
                    placeholder="Enter Pincode"
                />
                <button onClick={handlePincodeSearch}>Search</button>
            </div>
            {technicians.length === 0 ? (
                <p>No technicians found.</p>
            ) : (
                <ul>
                    {technicians.map(tech => (
                        <li key={tech._id}>
                            <Link to={`/technicians/${tech.userId._id}`}>
                                {tech.firstName} {tech.lastName} ({tech.pincode}) - 
                                {tech.servicesOffered && tech.servicesOffered.length > 0 
                                    ? tech.servicesOffered.map(s => s.name).join(', ') 
                                    : 'No services specified'}
                            </Link>
                            <p>Rating: {tech.averageRating.toFixed(1)} ({tech.totalReviews})</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TechnicianList;