const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); // Updated path
const auth = require('../middleware/authMiddleware'); // Updated path

// @route   POST /api/services
// @desc    Create a service (Admin only, or pre-populate)
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    // In a real app, you'd check if req.user.role === 'admin'
    const { name, description } = req.body;

    try {
        let service = await Service.findOne({ name });
        if (service) {
            return res.status(400).json({ msg: 'Service already exists' });
        }

        service = new Service({
            name,
            description
        });

        await service.save();
        res.json(service);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;