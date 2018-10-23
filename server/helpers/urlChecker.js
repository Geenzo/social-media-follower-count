
exports.urlCheck = function(url) {
    console.log('checking url', url)
    const facebookRegex = /((.+?\.)?facebook\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gim
    const instagramRegex = /((.+?\.)?instagram\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gim
    const twitterRegex = /((.+?\.)?twitter\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gim
    
    if(facebookRegex.test(url)) {
        return 'facebook'
    }

    if(instagramRegex.test(url)) {
        return 'instagram'
    }

    if(twitterRegex.test(url)) {
        return 'twitter'
    }

    return 'invalid url'
}