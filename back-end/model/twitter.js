const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const twitterSchema = new Schema({
    'url': String,
    'Tweets': Number,
    'captureDate': { type: Date, default: Date.now },
    "Following": Number,
    "Followers": Number,
    "Likes": Number,
})

exports.twitterSchema = twitterSchema