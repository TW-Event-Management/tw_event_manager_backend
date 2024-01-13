const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    organizer: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        locName: {
          type: String,
        },
        coordinates: {
          type: [Number],
        },
    },
    invitations: {
        type: [String],
    },
    participants: {
        type: [String]
    },
    category: {
        type: String,
        required: true,
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;