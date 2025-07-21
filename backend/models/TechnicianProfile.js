const mongoose = require('mongoose');

const TechnicianProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    pincode: { type: String }, // Added pincode field
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    bio: { type: String, maxlength: 300 },
    hourlyRate: { type: Number, min: 0, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('TechnicianProfile', TechnicianProfileSchema);