const puppeteer = require('puppeteer')
const { instagramSchema } = require('../model/instagram')
const mongoose = require('mongoose')

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
            let count = Number(nameAndCountArray[0].replace( /,/g, "" ))
            let name = nameAndCountArray[1]
            json[name] = count
            
        })

        let captureDate = new Date()
        json.captureDate = captureDate

        const instagramModel = mongoose.model('instagram', instagramSchema, 'instagram')
        const newInstagramCapture = new instagramModel(json)
        newInstagramCapture.save( err => {
            if (err) throw Error('Error: saving instagram capture')
            console.log('saved instagram account successfully')
        })
 
        await browser.close()
      }
    
    getInstagramPage(url)
    .then(res.send('Instagram Scraped! Check your console!'))
    .catch(err => {
        console.log(err);
        
    })
    
}