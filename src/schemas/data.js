const mongoose = require('mongoose');

const main = new mongoose.Schema({
    _id: String,
});
module.exports = mongoose.model(`main`, main);