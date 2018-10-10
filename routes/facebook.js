const puppeteer = require('puppeteer')
const { facebookSchema } = require('../model/facebook')
const mongoose = require('mongoose')

exports.scrapeFacebookFunc = function(req, res) {
    if (!req.body || !req.body.url) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload sent to route' })
    }

    const url = req.body.url

    async function getFacebookPage(url) {
        console.log(`request sent to ${url}`);
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
                let count = Number(nameAndCountArray[0].replace( /,/g, "" ))
                let name = nameAndCountArray[2]
                json[name] = count
            }
        })

        let captureDate = new Date()
        json.captureDate = captureDate

        const facebookModel = mongoose.model('facebook', facebookSchema, 'facebook')
        const newFacebookCapture = new facebookModel(json)
        newFacebookCapture.save( err => {
            if (err) throw Error('Error: saving facebook capture')
            console.log('saved facebook account successfully')
        })

        console.log('closing browser');  
        await browser.close()
      }
    
    getFacebookPage(url)
    .then(res.status(200).json({ success: true, error: null }))
    .catch(err => {
        console.log(err);
        
    })
    
}