const moogoose = require('mongoose');
const logger = require('./logger/logger')
require('dotenv').config();

const DB_URL = process.env.DB_URL;


function connectToMongoDB() {
    moogoose.connect(DB_URL);

    moogoose.connection.on('connected', () => {
        logger.info('Connected to MongoDB successfully');
    });

    moogoose.connection.on('error', (err) => {
        logger.error(err);
    })
}

module.exports = {connectToMongoDB}