const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path');

exports.scrapeInstagramFunc = function(req, res) {
    let url = 'https://www.instagram.com/darrenhay1994/'

    //TODO: find way to make this fetch page faster
    async function getInstagramPage(url) {

        let json = {
            url: url,
        }
        console.log('opening puppeteer')
        const browser = await puppeteer.launch()

        console.log('going to instagram');
        
        const page = await browser.newPage()

        await page.setRequestInterception(true)
        page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'other' ||  request.resourceType() === 'stylesheet')
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
            console.log(nameAndCountArray)
            let count = nameAndCountArray[0]
            let name = nameAndCountArray[1]
            json[name] = count
            
        })

        let captureDate = new Date()
        json.captureDate = captureDate
        
        var options = {year: 'numeric', month: 'long', day: 'numeric' }
        let todaysDate = new Date().toLocaleDateString("en-GB", options)
        
        let filePath = path.join(__dirname, `../output/instagram/${todaysDate}.json`)
        fs.writeFile(filePath, JSON.stringify(json, null, 4), function(err) {
            if(err) {
                throw Error('Error: error writing to filepath')
            }
            console.log('Instagram file successfully written! - Check your project directory for the output.json file')
        })
 
        await browser.close()
      }
    
    getInstagramPage(url)
    .then(res.send('Instagram Scraped! Check your console!'))
    .catch(err => {
        console.log(err);
        
    })
    
}