import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext'; // Import NotificationContext

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use showNotification

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to view your bookings.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/bookings/my', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.msg || 'Failed to fetch bookings.');
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const updateBookingStatus = async (bookingId, newStatus) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to update booking status.', 'error');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus }, {
                headers: {
                    'x-auth-token': token
                }
            });
            showNotification(`Booking status updated to ${newStatus}!`, 'success');
            // Refresh bookings list
            const res = await axios.get('http://localhost:5000/api/bookings/my', {
                headers: {
                    'x-auth-token': token
                }
            });
            setBookings(res.data);
        } catch (err) {
            console.error(err.response.data);
            showNotification(err.response.data.msg || 'Failed to update booking status.', 'error');
        }
    };

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking._id}>
                            <p><strong>Service:</strong> {booking.serviceId.name}</p>
                            {user && user.role === 'customer' ? (
                                <p><strong>Technician:</strong> {booking.technicianId.username}</p>
                            ) : (
                                // Display customer details for technicians
                                <>
                                    <p><strong>Customer:</strong> {booking.customerId.username}</p>
                                    <p><strong>Customer Email:</strong> {booking.customerId.email}</p>
                                    {booking.customerId.address && <p><strong>Customer Address:</strong> {booking.customerId.address}</p>}
                                </>
                            )}
                            <p><strong>Scheduled:</strong> {new Date(booking.scheduledDateTime).toLocaleString()}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Notes:</strong> {booking.customerNotes}</p>
                            {/* Technician actions */}
                            {user && user.role === 'technician' && booking.status === 'pending' && (
                                <div>
                                    <button onClick={() => updateBookingStatus(booking._id, 'confirmed')}>Confirm</button>
                                    <button onClick={() => updateBookingStatus(booking._id, 'cancelled')}>Cancel</button>
                                </div>
                            )}
                            {user && user.role === 'technician' && booking.status === 'confirmed' && (
                                <div>
                                    <button onClick={() => updateBookingStatus(booking._id, 'completed')}>Mark as Completed</button>
                                    <button onClick={() => updateBookingStatus(booking._id, 'cancelled')}>Cancel</button>
                                </div>
                            )}
                            {/* Customer actions */}
                            {user && user.role === 'customer' && booking.status === 'pending' && (
                                <div>
                                    <button onClick={() => updateBookingStatus(booking._id, 'cancelled')}>Cancel</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;