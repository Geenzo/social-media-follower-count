const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path');

exports.scrapeFacebookFunc = function(req, res) {
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

        let filePath = path.join(__dirname,`../output/facebook/${todaysDate}.json`)
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            if(err) {
                throw Error('Error: error writing to filepath')
            }
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
    
}