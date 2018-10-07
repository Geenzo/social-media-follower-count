const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path');

exports.scrapeLinkedinFunc = function(req, res) {
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
    
}