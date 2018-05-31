const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

app.get('/scrape', function(req, res) {

    // scraping from this url
    let url = 'https://twitter.com/geenzo'

    request(url, function(error, response, html) {
        console.log(`request sent to ${url}`);
        
        if(!error) {
            let $ = cheerio.load(html)

            let posts, followers, following
            let json = {
                url: url,
            }
            
            
            //this is html attribute for tweets / follows / following section
            $('.ProfileNav-stat').filter(function() {
                // storing filtered data
                var data = $(this);
                let twitterStatName = data.children().first().text() 
                let twitterStateNumber = data.children().last().text()
                let twitterStateNumberParsed = parseInt(twitterStateNumber.replace(/,/g,''), 10)
                json[twitterStatName] = twitterStateNumberParsed

                console.log(json);
                
            })

        } else {
            console.log('failed to fetch request');
            
        }
    })
})

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
