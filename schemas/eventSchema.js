const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
});

module.exports = eventSchema;
