const mongoose = require('mongoose')
const Schema = mongoose.Schema

const instagramSchema = new Schema ({
    'url': String,
    'posts': Number,
    'followers': Number,
    'following': Number,
    'captureDate': { type: Date, default: Date.now },
})

exports.instagramSchema = instagramSchema