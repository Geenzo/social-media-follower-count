const mongoose = require('mongoose')
const { pageSchema } = require('../model/page')
const { urlCheck } = require('../helpers/urlChecker')

const addNewPage = function(req, res) {
    if (!req.body || !req.body.url) {
        return res.status(404).json({ success: false, error: 'Error: incorrect payload was missing a page url' })
    }

    const url = req.body.url

    if (urlCheck(url) === 'invalid url') {
        return res.status(404).json({ success: false, error: 'Error: incorrect url was sent' })
    }

    const pageObj = {
        url,
        type: urlCheck(url) 
    }

    const pageModel = mongoose.model('pages', pageSchema, 'pages')
    const newPageCapture = new pageModel(pageObj)
    newPageCapture.save( err => {
        if (err) throw Error('Error: saving new page capture')
        console.log('new page saved successfully')
    })

    return res.status(200).json({ success: true, error: null })
}

const getAllPages = function(req, res) {
    const pageModel = mongoose.model('pages', pageSchema, 'pages')
    const allPages = pageModel.find({}).then(pages => {
        console.log('this is all pages', pages)
        if (!pages || pages.length < 1) {
            return res.status(404).json({ success: false, error: 'Error: no pages were found' })
        }

        return res.status(200).json({ success: true, error: null, payload: pages })
    })

}

module.exports = {
    addNewPage,
    getAllPages
}