const puppeteer = require('puppeteer')
const { instagramSchema } = require('../model/instagram')
const mongoose = require('mongoose')

  //TODO: find way to make this fetch page faster
  async function getInstagramPage(url) {
    console.log(`request sent to ${url}`);

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

const scrapeInstagramFunc = function(req, res) {
    if (!req.body || !req.body.url) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload sent to route' })
    }

    const url = req.body.url

    getInstagramPage(url)
    .then(res.status(200).json({ success: true, error: null }))
    .catch(err => {
        console.log(err);
    })
}

const getAllInstagram = function(req, res) {
    const instagramModel = mongoose.model('instagram', instagramSchema, 'instagram')

    return instagramModel.find({}).then(instagramData => {
        if (!instagramData || instagramData.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no instagram data was found' })
        }

        return res.status(200).json({ success: true, error: null, payload: instagramData })
    })
}

const selectInstagram = function(req, res) {
    if (!req.body || !req.body.id) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload sent to route' })
    }

    const query = { _id: req.body.id}
    const instagramModel = mongoose.model('instagram', instagramSchema, 'instagram')

    return instagramModel.findOne(query).then(instagramData => {
        if (!instagramData || instagramData.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no instagram data was found' })
        }

        return res.status(200).json({ success: true, error: null, payload: instagramData })
    })
}

module.exports = {
    scrapeInstagramFunc,
    getInstagramPage,
    getAllInstagram,
    selectInstagram
}