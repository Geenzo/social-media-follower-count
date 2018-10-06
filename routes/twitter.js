const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path');

exports.scrapeTwitterFunc = function(req, res) {

    // scraping from this url
    let url = 'https://twitter.com/geenzo'

    request(url, function(error, response, html) {
        console.log(`request sent to ${url}`);

        let json = {
            url: url,
        }

        if(!error) {
            let $ = cheerio.load(html)
            
            //this is html attribute for tweets / follows / following section
            $('.ProfileNav-stat').filter(function() {
                // storing filtered data
                let data = $(this);
                let twitterStatName = data.children().first().text() 
                let twitterStateNumber = data.children().last().text()
                let twitterStateNumberParsed = parseInt(twitterStateNumber.replace(/,/g,''), 10)
                json[twitterStatName] = twitterStateNumberParsed
 
                let todaysDate = new Date()
                json.captureDate = todaysDate
            })

        } else {
            console.log('failed to fetch request'); 
        }

        var options = {year: 'numeric', month: 'long', day: 'numeric' }
        let todaysDate = new Date().toLocaleDateString("en-GB", options)
        
        let filePath = path.join(__dirname, `../output/twitter/${todaysDate}.json`)
        
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            if(err) {
                throw Error('Error: error writing to filepath')
            }
            console.log('Twitter file successfully written! - Check your project directory for the output.json file')
        })

        res.send('Twitter Scraped! Check your console!')
    })

    
}