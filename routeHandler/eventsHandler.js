/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const eventSchema = require('../schemas/eventSchema');
const userSchema = require('../schemas/userSchema');
const checkLogin = require('../middleware/checkLogin');

const Event = new mongoose.model('event', eventSchema);
const User = new mongoose.model('user', userSchema);

const router = express.Router();

// get all events
router.get('/', checkLogin, (req, res) => {
    Event.find({})
        .populate('user', 'name username -_id')
        .select({
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({
                    count: data.length,
                    results: data,
                });
            }
        });

    // console.log(results);
    // res.json(result);
});

// get one event by id
router.get('/:id', checkLogin, (req, res) => {
    Event.findOne({ _id: req.params.id })
        .select({
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json(data);
            }
        });
});

// post event
router.post('/', checkLogin, async (req, res) => {
    const newEvent = new Event({ ...req.body, user: req.userId });
    try {
        const event = newEvent.save();
        await User.updateOne({ _id: req.userId }, { $push: { event: event._id } }).clone();
        res.status(200).json({ message: 'Event was inserted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// post multiple event
router.post('/all', (req, res) => {
    Event.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Events were inserted successfully!' });
        }
    });
});

// update event
router.put('/:id', (req, res) => {
    const result = Event.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Event was updated successfully!' });
        }
    }).clone();
    // console.log(result);
});

// delete event
router.delete('/:id', (req, res) => {
    Event.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Event was deleted successfully!' });
        }
    }).clone();
});

module.exports = router;
