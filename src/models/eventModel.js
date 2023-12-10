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
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;