const mongoose = require('mongoose')
const { pageSchema } = require('../model/page')
const { getFacebookPage } = require('../routes/facebook')
const { getInstagramPage } = require('../routes/instagram')
const { getTwitterPage } = require('../routes/twitter')
const { urlCheck } = require('../helpers/urlChecker')

const scrapeActivePage = function(page) {
    console.log('this is the active page', page)
    if(!page.active) {
        return page
    }

    switch(urlCheck(page.url)) {
        case 'facebook':
            return getFacebookPage(page.url)
        case 'instagram':
            return getInstagramPage(page.url)
        case 'twitter':
            return getTwitterPage(page.url)
        default:
            return Promise.resolve('done')
    }
   
}

const startScrape = function(req, res) {
    console.log('this is the scrape starting')
    const pageModel = mongoose.model('pages', pageSchema, 'pages')
    const allPages = pageModel.find({}).then(pages => {
        console.log('this is all pages')
        if (!pages || pages.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no pages were found' })
        }
        let promises = []

        for(page in pages) {
            scrapeActivePage(pages[page])
        }

        return Promise.all(promises).then(completeData => {
            console.log('this is completed data', completeData)
            return res.status(200).json({ success: true, error: null, payload: pages })
        })
    })
}

module.exports = {
    startScrape
}