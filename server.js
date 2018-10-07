const express = require('express')
const app = express()
const { scrapeTwitterFunc } = require('./routes/twitter')
const { scrapeInstagramFunc } = require('./routes/instagram')
const { scrapeFacebookFunc } = require('./routes/facebook')
const { scrapeLinkedinFunc } = require('./routes/linkedin')

app.get('/scrapeTwitter', scrapeTwitterFunc)

app.get('/scrapeInstagram', scrapeInstagramFunc)

app.get('/scrapeFacebook', scrapeFacebookFunc)

// TODO: WIP - linkedin has anti-scrapping (requires log in)
// app.get('/scrapeLinkedin', scrapeLinkedinFunc)

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
