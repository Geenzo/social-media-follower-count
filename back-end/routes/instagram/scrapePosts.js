const puppeteer = require('puppeteer');
const got = require('got');
const crypto = require('crypto');

const generateRequestSignature = function(rhxGis, queryVariables) {
  return crypto.createHash('md5').update(`${rhxGis}:${queryVariables}`, 'utf8').digest("hex");
};

const setupInstagramHeader = (rhxGis, queryVariables) => {
  return {
    'x-instagram-gis': generateRequestSignature(rhxGis, queryVariables)
  }
}

const extractPosts = async (post) => {
    const postID = await post.$eval('a', el => {
      return el.href
    }).catch(err => 'N/A');

    const parsedPostID = postID.match(/([A-Z])\w+/)[0];
    // Make an initial request to get the rhx_gis string
    const initResponse = await got('https://www.instagram.com/');
    const rhxGis = (RegExp('"rhx_gis":"([a-f0-9]{32})"', 'g')).exec(initResponse.body)[1];

    const queryVariables = JSON.stringify({
      shortcode: parsedPostID
    })
    const requestUrl = `https://www.instagram.com/graphql/query/?query_hash=477b65a610463740ccdb83135b2014db&variables=${queryVariables}`;
    
    try {
      const response = await got(requestUrl, { headers: setupInstagramHeader(rhxGis, queryVariables) });

      const responseBody = JSON.parse(response.body);
      const data = responseBody.data.shortcode_media;
      if (data) {
        const postComments = data.edge_media_to_comment.count;
        const postLikes = data.edge_media_preview_like.count;
        const postCopy = data.edge_media_to_caption.edges[0].node.text;
        const postDate = data.taken_at_timestamp;
        
        const postStats = {
          postComments,
          postLikes,
          postCopy,
          postDate
        }

        return Promise.resolve(postStats);
      }
      return null
    } catch (err) {
      console.error('Error retrieving instagram post data: ', err);
      return Promise.reject(err);
    }

}

async function scrapeInfiniteScrollItems(
  page,
  itemTargetCount,
  scrollDelay = 500,
) {
  let items = [];
  try {
    let previousHeight;
    
    // getting the appropriate amount of posts required.
    let posts = [];
    while (posts.length < itemTargetCount) {
      // .v1Nh3.kIKUG._bz0w is the class for a whole post 'card'
      posts = await page.$$('.v1Nh3.kIKUG._bz0w');

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }

    // parsing through posts and extracting post data into items array.
    for(const post of posts){
      const postStats = await extractPosts(post);

      items.push(postStats);
    }

  } catch(e) { console.warn(e) }

  return items;
}

module.exports = scrapeInstagramPosts = async(pageURL, numberOfPosts) => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto(pageURL);
  
  // used for debuging with console logs..
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, numberOfPosts);

  // Close the browser.
  await browser.close();

  return items.length > numberOfPosts ? items.splice(0, numberOfPosts) : items;
};