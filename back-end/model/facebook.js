const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facebookSchema = new Schema ({
    'url': String,
    "like": Number,
    'follow': Number,
    'captureDate': { type: Date, default: Date.now }
})

exports.facebookSchema = facebookSchema