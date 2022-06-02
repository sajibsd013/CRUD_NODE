/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/userSchema');

const User = new mongoose.model('user', userSchema);

const router = express.Router();

// get all events
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Store hash in your password DB.
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const hashpass = hash;
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: hashpass,
            });
            newUser.save((err1) => {
                if (err1) {
                    res.status(500).json({ error: err1.message });
                } else {
                    res.status(200).json({ message: 'Signup was  successful!' });
                }
            });
        }
    });
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });
        if (user && user.length > 0) {
            const isValidPass = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPass) {
                // Genarate Token
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        userId: user[0]._id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' },
                );

                res.status(200).json({
                    accces_token: token,
                    message: 'Login Successful',
                });
            } else {
                res.status(401).json({
                    error: 'Authetication Failed',
                });
            }
        } else {
            res.status(401).json({
                error: 'Authetication Failed',
            });
        }
    } catch {
        res.status(401).json({
            error: 'Authetication Failed',
        });
    }
});
module.exports = router;
