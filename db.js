const mongoose = require('mongoose');
const logger = require('./logger/logger')
require('dotenv').config();

const DB_URL = process.env.DB_URL;

mongoose.set('strictQuery', false)
function connectToMongoDB() {
    mongoose.connect(DB_URL);

    mongoose.connection.on('connected', () => {
        logger.info('Connected to MongoDB successfully');
    });

    mongoose.connection.on('error', (err) => {
        logger.error(err);
    })
}

module.exports = {connectToMongoDB}