const moogoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;


function connectToMongoDB() {
    moogoose.connect(DB_URL);

    moogoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully');
    });

    moogoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB', err);
    })
}

module.exports = {connectToMongoDB}