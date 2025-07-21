import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const TechniciansByService = () => {
    const { serviceName } = useParams();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchPincode, setSearchPincode] = useState(''); // New state for pincode search

    const fetchTechnicians = async (pincode = '') => {
        try {
            const url = pincode 
                ? `http://localhost:5000/api/technicians?serviceName=${serviceName}&pincode=${pincode}` 
                : `http://localhost:5000/api/technicians?serviceName=${serviceName}`;
            const res = await axios.get(url);
            setTechnicians(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(`Failed to fetch technicians for ${serviceName}.`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians(searchPincode); // Fetch with current pincode on serviceName or searchPincode change
    }, [serviceName, searchPincode]);

    const handlePincodeSearch = () => {
        fetchTechnicians(searchPincode);
    };

    if (loading) return <div>Loading technicians for {serviceName}...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Technicians for {serviceName}</h1>
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
                <p>No technicians found offering {serviceName}.</p>
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

export default TechniciansByService;