import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NotificationContext from '../NotificationContext'; // Import NotificationContext

const ReviewForm = () => {
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        bookingId: '',
        technicianId: '',
        rating: '',
        comment: ''
    });
    const { showNotification } = useContext(NotificationContext); // Use showNotification

    useEffect(() => {
        const fetchCompletedBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await axios.get('https://local-technician-finder-backend.onrender.com/api/bookings/my', {
                    headers: { 'x-auth-token': token }
                });
                // Filter for completed bookings that haven't been reviewed yet
                const completedBookings = res.data.filter(b => b.status === 'completed');
                setBookings(completedBookings);
            } catch (err) {
                console.error(err);
                showNotification('Error fetching completed bookings.', 'error');
            }
        };
        fetchCompletedBookings();
    }, []);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'bookingId') {
            const selectedBooking = bookings.find(b => b._id === e.target.value);
            if (selectedBooking) {
                setFormData(prev => ({ ...prev, technicianId: selectedBooking.technicianId._id }));
            }
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to submit a review.', 'error');
            return;
        }

        try {
            await axios.post('https://local-technician-finder-backend.onrender.com/api/reviews', formData, {
                headers: {
                    'x-auth-token': token
                }
            });
            showNotification('Review submitted successfully!', 'success');
            // Clear form or redirect
            setFormData({
                bookingId: '',
                technicianId: '',
                rating: '',
                comment: ''
            });
        } catch (err) {
            console.error(err.response.data);
            showNotification(err.response.data.msg || 'Failed to submit review.', 'error');
        }
    };

    return (
        <div>
            <h1>Submit a Review</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Select Completed Booking:</label>
                    <select name="bookingId" value={formData.bookingId} onChange={onChange} required>
                        <option value="">Select Booking</option>
                        {bookings.map(booking => (
                            <option key={booking._id} value={booking._id}>
                                {booking.serviceId.name} with {booking.technicianId.username} on {new Date(booking.scheduledDateTime).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Rating (1-5):</label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={onChange}
                        min="1"
                        max="5"
                        required
                    />
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={onChange}
                        placeholder="Your comments..."
                        maxLength="500"
                    ></textarea>
                </div>
                <input type="submit" value="Submit Review" />
            </form>
        </div>
    );
};

export default ReviewForm;