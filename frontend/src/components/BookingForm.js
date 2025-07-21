import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NotificationContext from '../NotificationContext';

const BookingForm = () => {
    const [technicians, setTechnicians] = useState([]);
    const [services, setServices] = useState([]);
    const [searchPincode, setSearchPincode] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState(''); // New state for selected service
    const [formData, setFormData] = useState({
        technicianId: '',
        serviceId: '',
        scheduledDateTime: '',
        customerNotes: ''
    });
    const { showNotification } = useContext(NotificationContext);

    // Fetch services once on component mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const serviceRes = await axios.get('https://local-technician-finder-backend.onrender.com/api/services');
                setServices(serviceRes.data);
            } catch (err) {
                console.error(err);
                showNotification('Error fetching services.', 'error');
            }
        };
        fetchServices();
    }, []);

    // Fetch technicians based on pincode and selected service
    useEffect(() => {
        const fetchFilteredTechnicians = async () => {
            if (!searchPincode || !selectedServiceId) {
                setTechnicians([]); // Clear technicians if pincode or service not selected
                setFormData(prev => ({ ...prev, technicianId: '' })); // Clear selected technician
                return;
            }

            try {
                const selectedService = services.find(s => s._id === selectedServiceId);
                if (!selectedService) return; // Should not happen if selectedServiceId is valid

                const url = `https://local-technician-finder-backend.onrender.com/api/technicians?pincode=${searchPincode}&serviceName=${selectedService.name}`;
                const techRes = await axios.get(url);
                setTechnicians(techRes.data);
                // If no technicians found, clear selected technician
                if (techRes.data.length === 0) {
                    setFormData(prev => ({ ...prev, technicianId: '' }));
                }
            } catch (err) {
                console.error(err);
                showNotification('Error fetching filtered technicians.', 'error');
                setTechnicians([]);
                setFormData(prev => ({ ...prev, technicianId: '' }));
            }
        };

        fetchFilteredTechnicians();
    }, [searchPincode, selectedServiceId, services]); // Re-fetch when these states change

    const handlePincodeChange = (e) => {
        setSearchPincode(e.target.value);
        // Reset service and technician selection when pincode changes
        setSelectedServiceId('');
        setFormData(prev => ({ ...prev, serviceId: '', technicianId: '' }));
    };

    const handleServiceChange = (e) => {
        setSelectedServiceId(e.target.value);
        setFormData(prev => ({ ...prev, serviceId: e.target.value, technicianId: '' })); // Reset technician when service changes
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to make a booking.', 'error');
            return;
        }

        try {
            await axios.post('https://local-technician-finder-backend.onrender.com/api/bookings', formData, {
                headers: {
                    'x-auth-token': token
                }
            });
            showNotification('Booking created successfully!', 'success');
            // Clear form and reset search states
            setFormData({
                technicianId: '',
                serviceId: '',
                scheduledDateTime: '',
                customerNotes: ''
            });
            setSearchPincode('');
            setSelectedServiceId('');
        } catch (err) {
            console.error(err.response.data);
            showNotification(err.response.data.msg || 'Booking failed.', 'error');
        }
    };

    return (
        <div>
            <h1>Create New Booking</h1>
            <div className="neomorphic-card" style={{ marginBottom: '20px' }}>
                <h2>Find Your Technician</h2>
                <div>
                    <label>Enter Pincode:</label>
                    <input
                        type="text"
                        value={searchPincode}
                        onChange={handlePincodeChange}
                        placeholder="e.g., 123456"
                        required
                    />
                </div>
                {searchPincode && (
                    <div>
                        <label>Select Service:</label>
                        <select name="serviceId" value={selectedServiceId} onChange={handleServiceChange} required>
                            <option value="">Select Service</option>
                            {services.map(service => (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {searchPincode && selectedServiceId && technicians.length > 0 && (
                <form onSubmit={onSubmit} className="neomorphic-card">
                    <h2>Book Your Service</h2>
                    <div>
                        <label>Technician:</label>
                        <select name="technicianId" value={formData.technicianId} onChange={onChange} required>
                            <option value="">Select Technician</option>
                            {technicians.map(tech => (
                                <option key={tech._id} value={tech.userId._id}>
                                    {tech.firstName} {tech.lastName} ({tech.pincode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Scheduled Date/Time:</label>
                        <input
                            type="datetime-local"
                            name="scheduledDateTime"
                            value={formData.scheduledDateTime}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Notes:</label>
                        <textarea
                            name="customerNotes"
                            value={formData.customerNotes}
                            onChange={onChange}
                            placeholder="Any specific instructions or details?"
                        ></textarea>
                    </div>
                    <input type="submit" value="Book Now" />
                </form>
            )}

            {searchPincode && selectedServiceId && technicians.length === 0 && (
                <p className="neomorphic-card" style={{ textAlign: 'center', padding: '20px' }}>
                    No technicians found for pincode {searchPincode} offering the selected service.
                </p>
            )}
        </div>
    );
};

export default BookingForm;