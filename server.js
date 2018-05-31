const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

app.get('/scrape', function(req, res) {

    // scraping from this url
    let url = 'https://www.instagram.com/darrenhay1994/'
    
    request(url, function(error, response, html) {
        
        if(!error) {
            let $ = cheerio.load(html)

            let posts, followers, following
            let json = { 
                posts: "",
                followers: "",
                following: ""
            }
        }
    })
})

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
