const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()
const puppeteer = require('puppeteer')

app.get('/scrapeTwitter', function(req, res) {

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
        
        let filePath = `output/twitter/${todaysDate}.json`
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            console.log('Twitter file successfully written! - Check your project directory for the output.json file')
        })

        res.send('Twitter Scraped! Check your console!')
    })

    
})

app.get('/scrapeInstagram', function(req, res) {
    let url = 'https://www.instagram.com/darrenhay1994/'

    async function getInstagramPage(url) {

        let json = {
            url: url,
        }
        console.log('opening puppeteer')
        const browser = await puppeteer.launch()

        console.log('going to instagram');
        
        const page = await browser.newPage()

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'media' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font' || request.resourceType() === 'websocket')
            request.abort()
            else
            request.continue()
        });

        await page.goto(url, {
            timeout: 0
        })

        const pageContent = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('.-nal3'))
            return anchors.map(anchor => anchor.textContent).slice(0, 10)
          })
          
        pageContent.map(item => {
            console.log(item)
            let nameAndCountArray = item.split(" ")
            console.log(nameAndCountArray);
            let count = nameAndCountArray[0]
            let name = nameAndCountArray[1]
            json[name] = count
            
        })

        let captureDate = new Date()
        json.captureDate = captureDate
        
        var options = {year: 'numeric', month: 'long', day: 'numeric' }
        let todaysDate = new Date().toLocaleDateString("en-GB", options)
        
        let filePath = `output/instagram/${todaysDate}.json`
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            console.log('Instagram file successfully written! - Check your project directory for the output.json file')
        })
 
        await browser.close()
      }
    
    getInstagramPage(url)
    .then(res.send('Instagram Scraped! Check your console!'))
    .catch(err => {
        console.log(err);
        
    })
    
})

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
