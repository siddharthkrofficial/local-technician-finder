const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const TechnicianProfile = require('../models/TechnicianProfile');
const User = require('../models/User');
const Service = require('../models/Service'); // Import Service model

console.log('technician.js: auth imported as:', typeof auth);

// @route   GET /api/technicians/me
// @desc    Get current technician's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await TechnicianProfile.findOne({ userId: req.user.id }).populate('userId', ['username', 'email']).populate('servicesOffered', ['name']); // Populate services

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this technician' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/technicians
// @desc    Create or update technician profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        address,
        pincode, // Added pincode
        servicesOffered, // This will be an array of strings (service names)
        bio,
        hourlyRate
    } = req.body;

    console.log('Received servicesOffered (from frontend):', servicesOffered); // Debug log

    // Build profile object
    const profileFields = {};
    profileFields.userId = req.user.id;
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (phone) profileFields.phone = phone;
    if (address) profileFields.address = address;
    if (pincode) profileFields.pincode = pincode; // Add pincode to profileFields
    if (bio) profileFields.bio = bio;
    if (hourlyRate) profileFields.hourlyRate = hourlyRate;

    // Process servicesOffered
    if (servicesOffered && servicesOffered.length > 0) {
        const serviceIds = [];
        for (const serviceName of servicesOffered) {
            try {
                let service = await Service.findOne({ name: serviceName.trim() });
                if (!service) {
                    // Create new service if it doesn't exist
                    service = new Service({ name: serviceName.trim() });
                    await service.save();
                    console.log('Created new service:', service.name); // Debug log
                }
                serviceIds.push(service._id);
            } catch (serviceErr) {
                console.error('Error processing service:', serviceName, serviceErr.message); // Debug log
                return res.status(500).send('Server Error during service processing');
            }
        }
        profileFields.servicesOffered = serviceIds;
    }

    try {
        let profile = await TechnicianProfile.findOne({ userId: req.user.id });

        if (profile) {
            // Update
            profile = await TechnicianProfile.findOneAndUpdate(
                { userId: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            console.log('Updated profile:', profile); // Debug log
            return res.json(profile);
        }

        // Create
        profile = new TechnicianProfile(profileFields);
        await profile.save();
        console.log('Created new profile:', profile); // Debug log
        res.json(profile);

    } catch (err) {
        console.error('Error saving/updating profile:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/technicians
// @desc    Get all technician profiles or filter by service/pincode
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { serviceName, pincode } = req.query;
        let query = {};

        console.log('Backend received serviceName query:', serviceName); // Debug log
        console.log('Backend received pincode query:', pincode); // Debug log

        if (serviceName) {
            const service = await Service.findOne({ name: serviceName });
            console.log('Service found by name:', service); // Debug log
            if (service) {
                query.servicesOffered = service._id; // Add to query
            } else {
                console.log('No service found with name:', serviceName); // Debug log
                return res.json([]); // No service found with that name, return empty array
            }
        }

        if (pincode) {
            query.pincode = pincode; // Add pincode to query
        }

        console.log('Final query for TechnicianProfile.find():', query); // Debug log

        const profiles = await TechnicianProfile.find(query)
            .populate('userId', ['username', 'email'])
            .populate('servicesOffered', ['name']); // Populate services
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/technicians/:user_id
// @desc    Get technician profile by user ID
// @access  Public
router.get('/:user_id', async (req, res) => {
    try {
        const profile = await TechnicianProfile.findOne({ userId: req.params.user_id }).populate('userId', ['username', 'email']).populate('servicesOffered', ['name']); // Populate services

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
    
});

module.exports = router;