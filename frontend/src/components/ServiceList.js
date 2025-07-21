import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/services');
                setServices(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch services.');
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <div>Loading services...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Available Services</h1>
            {services.length === 0 ? (
                <p>No services found.</p>
            ) : (
                <ul>
                    {services.map(service => (
                        <li key={service._id}>
                            <Link to={`/technicians/service/${service.name}`}>
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ServiceList;