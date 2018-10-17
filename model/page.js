const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    'url': String,
    'type': String,
    'captureDate': { type: Date, default: Date.now },
    'active': { type: Boolean, default: true }
})

exports.pageSchema = pageSchema