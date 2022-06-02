const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const eventHandler = require('./routeHandler/eventsHandler');
const userHandler = require('./routeHandler/userHandler');

// express app initilization
const app = express();
dotenv.config();
const port = 3000;
app.use(express.json());

// database connection
mongoose
    .connect('mongodb://localhost:27017/crud_db')
    .then(console.log('Connection Successful'))
    .catch((err) => console.log(err));

app.use('/api/events', eventHandler);
app.use('/api/user', userHandler);

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
