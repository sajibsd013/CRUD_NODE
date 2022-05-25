const express = require('express');
const mongoose = require('mongoose');
const eventHandler = require('./routeHandler/eventsHandler');

// express app initilization
const app = express();
const port = 3000;
app.use(express.json());

// database connection
mongoose
    .connect('mongodb://localhost:27017/crud_db')
    .then(console.log('Connection Successful'))
    .catch((err) => console.log(err));

app.use('/api/events', eventHandler);

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
