const express = require('express')
const fs = require('fs')
const app = express()
const puppeteer = require('puppeteer')
const { scrapeTwitterFunc } = require('./routes/twitter')
const { scrapeInstagramFunc } = require('./routes/instagram')

app.get('/scrapeTwitter', scrapeTwitterFunc)

app.get('/scrapeInstagram', scrapeInstagramFunc)

app.get('/scrapeFacebook', function(req, res) {
    let url = 'https://www.facebook.com/200StVincentStreet/'

    async function getFacebookPage(url) {

        let json = {
            url: url,
        }
        console.log('opening puppeteer')
        const browser = await puppeteer.launch()

        console.log('going to facebook');
        
        const page = await browser.newPage()

        await page.setRequestInterception(true)
        page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'other' || request.resourceType() === 'script' ||  request.resourceType() === 'stylesheet') {
                request.abort()       
            } else { 
                request.continue()
            }
        });

        await page.goto(url, {
            timeout: 0
        })

        const pageContent = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('._4bl9'))
            return anchors.map(anchor => anchor.textContent).slice(0, 10)
          })
        
        pageContent.map(item => {
            if(item.includes('like') || item.includes('follow')) {
                console.log(item)
                let nameAndCountArray = item.split(" ")
                console.log(nameAndCountArray);
                let count = nameAndCountArray[0]
                let name = nameAndCountArray[2]
                json[name] = count
            }
  
        })

        let captureDate = new Date()
        json.captureDate = captureDate
        
        var options = {year: 'numeric', month: 'long', day: 'numeric' }
        let todaysDate = new Date().toLocaleDateString("en-GB", options)
        
        let filePath = `output/facebook/${todaysDate}.json`
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            console.log('Facebook file successfully written! - Check your project directory for the output.json file')
        })

        console.log('closing browser');  
        await browser.close()
      }
    
    getFacebookPage(url)
    .then(res.send('Facebook Scraped! Check your console!'))
    .catch(err => {
        console.log(err);
        
    })
    
})

app.get('/scrapeLinkedin', function(req, res) {
    let url = 'https://www.linkedin.com/company/200-svs/'

    async function getLinkedinPage(url) {

        let json = {
            url: url,
        }
        console.log('opening puppeteer')
        const browser = await puppeteer.launch({
            headless: false
        })

        console.log('going to linkedin');
        
        const page = await browser.newPage()

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'image') {
                request.abort()
            } else { 
                request.continue()
            }
        });

        await page.goto(url, {
            timeout: 0
        })

        const pageContent = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('.org-top-card-module__company-descriptions'))
            return anchors.map(anchor => anchor.textContent).slice(0, 10)
          })
          
        console.log(pageContent);
        

        await page.screenshot({path: 'screenshot.png'})
        console.log('closing browser');
        
        await browser.close()
      }
    
    getLinkedinPage(url)
    .then(res.send('Linkedin Scraped! Check your console!'))
    .catch(err => {
        console.log(err);
        
    })
    
})

app.listen('8081')
console.log('Server started on port 8081')
exports = module.exports = app
