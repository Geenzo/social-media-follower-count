const request = require('request')
const cheerio = require('cheerio')
const { twitterSchema } = require('../model/twitter')
const mongoose = require('mongoose')

const getTwitterPage = function(url) {
    return new Promise((resolve, reject) => {
        request(url, function(error, response, html) {
            if(error) console.log('failed to fetch request');
            
            console.log(`request sent to ${url}`);
            
            let json = {
                url: url,
            }
    
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
    
            const twitterModel = mongoose.model('twitter', twitterSchema, 'twitter')
            const newTwitterCapture = new twitterModel(json)
            newTwitterCapture.save( err => {
                if (err) throw Error('Error: saving twitter capture')
                console.log('saved twitter account successfully')
                resolve('saved twitter account successfully')
            })
        })
    })
}

const scrapeTwitterFunc = function(req, res) {
    if (!req.body || !req.body.url) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload sent to route' })
    }

    const url = req.body.url
    
    getTwitterPage(url)
    .then(res.status(200).json({ success: true, error: null }))
    .catch(err => {
        console.log(err);
    })
}

const getAllTwitter = function(req, res) {
    const twitterModel = mongoose.model('twitter', twitterSchema, 'twitter')

    return twitterModel.find({}).then(twitterData => {
        if (!twitterData || twitterData.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no twitter data was found' })
        }

        return res.status(200).json({ success: true, error: null, payload: twitterData })
    })
}

const selectTwitter = function(req, res) {
    if (!req.body || !req.body.id) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload sent to route' })
    }

    const query = { _id: req.body.id}
    const twitterModel = mongoose.model('twitter', twitterSchema, 'twitter')

    return twitterModel.findOne(query).then(twitterData => {
        if (!twitterData || twitterData.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no twitter data was found' })
        }

        return res.status(200).json({ success: true, error: null, payload: twitterData })
    })
}

module.exports = {
    scrapeTwitterFunc,
    getTwitterPage,
    getAllTwitter,
    selectTwitter
}