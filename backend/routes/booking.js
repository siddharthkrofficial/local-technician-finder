const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Updated path
const Booking = require('../models/Booking'); // Updated path
const TechnicianProfile = require('../models/TechnicianProfile'); // Updated path
const Service = require('../models/Service'); // Updated path

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private (Customer)
router.post('/', auth, async (req, res) => {
    const { technicianId, serviceId, scheduledDateTime, customerNotes } = req.body;

    try {
        // Ensure the user is a customer
        if (req.user.role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can create bookings' });
        }

        // Check if technician and service exist
        const technician = await TechnicianProfile.findOne({ userId: technicianId });
        const service = await Service.findById(serviceId);

        if (!technician || !service) {
            return res.status(404).json({ msg: 'Technician or Service not found' });
        }

        const newBooking = new Booking({
            customerId: req.user.id,
            technicianId,
            serviceId,
            scheduledDateTime,
            customerNotes
        });

        const booking = await newBooking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/bookings/my
// @desc    Get all bookings for current user (customer or technician)
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'customer') {
            bookings = await Booking.find({ customerId: req.user.id })
                .populate('technicianId', ['username', 'email'])
                .populate('serviceId', ['name']);
        } else if (req.user.role === 'technician') {
            bookings = await Booking.find({ technicianId: req.user.id })
                .populate('customerId', ['username', 'email', 'address'])
                .populate('serviceId', ['name']);
        } else {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Technician or Customer)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Only technician or customer involved in the booking can update status
        if (booking.technicianId.toString() !== req.user.id && booking.customerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this booking' });
        }

        // Technicians can confirm, cancel, or complete
        if (req.user.role === 'technician') {
            if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
                return res.status(400).json({ msg: 'Technicians can only confirm, cancel, or complete bookings' });
            }
        } else if (req.user.role === 'customer') {
            // Customers can only cancel
            if (status !== 'cancelled') {
                return res.status(400).json({ msg: 'Customers can only cancel bookings' });
            }
        }

        booking.status = status;
        await booking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;