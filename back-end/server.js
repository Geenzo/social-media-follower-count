const express = require('express')
const app = express()
const db = require('./model/db')
const bodyParser = require('body-parser')
const cors = require('cors')
// const { scrapeLinkedinFunc } = require('./routes/linkedin')

const { scrapeTwitterFunc, getAllTwitter, selectTwitter, selectTwitterByURL, getTwitterPosts } = require('./routes/twitter')
const { scrapeInstagramFunc, getAllInstagram, selectInstagram, selectInstagramByURL } = require('./routes/instagram')
const { scrapeFacebookFunc, getAllFacebook, selectFacebook, selectFacebookByURL, getFacebookPosts } = require('./routes/facebook')
const { addNewPage, getAllPages } = require('./routes/page')
const { startScrape } = require('./routes/startScrape')

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/scrapeTwitter', scrapeTwitterFunc)
app.get('/getAllTwitter', getAllTwitter)
app.post('/selectTwitter', selectTwitter)
app.post('/selectTwitterByURL', selectTwitterByURL)
app.post('/getTwitterPosts', getTwitterPosts)

app.post('/scrapeInstagram', scrapeInstagramFunc)
app.get('/getAllInstagram', getAllInstagram)
app.post('/selectInstagram', selectInstagram)
app.post('/selectInstagramByURL', selectInstagramByURL)

app.post('/scrapeFacebook', scrapeFacebookFunc)
app.get('/getAllFacebook', getAllFacebook)
app.post('/selectFacebook', selectFacebook)
app.post('/selectFacebookByURL', selectFacebookByURL)
app.post('/getFacebookPosts', getFacebookPosts)

app.post('/addNewPage', addNewPage)
app.get('/allPages', getAllPages)

app.get('/startScrape', startScrape)

// TODO: WIP - linkedin has anti-scrapping (requires log in)
// app.get('/scrapeLinkedin', scrapeLinkedinFunc)

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
