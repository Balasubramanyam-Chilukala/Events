const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    registrationLink: String,
    image: String,
    email: { type: String, required: true }, // New field to store the user's email
    status: { type: String, default: 'Pending' }, // Possible values: 'Pending', 'Approved', 'Rejected'
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
