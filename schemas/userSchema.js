const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    events: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'event',
        },
    ],
});

module.exports = userSchema;
