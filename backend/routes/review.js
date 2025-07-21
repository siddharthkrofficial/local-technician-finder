const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Updated path
const Review = require('../models/Review'); // Updated path
const TechnicianProfile = require('../models/TechnicianProfile'); // Updated path
const Booking = require('../models/Booking'); // Updated path

// @route   POST /api/reviews
// @desc    Submit a review for a technician
// @access  Private (Customer)
router.post('/', auth, async (req, res) => {
    const { technicianId, bookingId, rating, comment } = req.body;

    try {
        // Ensure the user is a customer
        if (req.user.role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can submit reviews' });
        }

        // Check if booking exists and is completed, and belongs to the customer
        const booking = await Booking.findOne({ _id: bookingId, customerId: req.user.id, status: 'completed' });
        if (!booking) {
            return res.status(400).json({ msg: 'Booking not found or not completed by you' });
        }

        // Check if a review already exists for this booking
        let existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this booking' });
        }

        const newReview = new Review({
            customerId: req.user.id,
            technicianId,
            bookingId,
            rating,
            comment
        });

        const review = await newReview.save();

        // Update technician's average rating
        const technicianProfile = await TechnicianProfile.findOne({ userId: technicianId });
        if (technicianProfile) {
            const totalRating = (technicianProfile.averageRating * technicianProfile.totalReviews) + rating;
            technicianProfile.totalReviews += 1;
            technicianProfile.averageRating = totalRating / technicianProfile.totalReviews;
            await technicianProfile.save();
        }

        res.json(review);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reviews/:technician_id
// @desc    Get all reviews for a specific technician
// @access  Public
router.get('/:technician_id', async (req, res) => {
    try {
        const reviews = await Review.find({ technicianId: req.params.technician_id })
            .populate('customerId', ['username']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;