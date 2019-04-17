const puppeteer = require('puppeteer');

const extractPosts = async (post) => {
    const postReplies = await post.$eval('.ProfileTweet-action--reply', node => node.innerText).catch(err => 'N/A');
    const postRetweets = await post.$eval('.ProfileTweet-action--retweet', node => node.innerText).catch(err => 'N/A');
    const postFavourites = await post.$eval('.ProfileTweet-action--favorite', node => node.innerText).catch(err => 'N/A');
    const postCopy = await post.$eval('.tweet-text', node => node.innerText).catch(err => 'N/A');
    const postDate = await post.$eval('.time', node => node.innerText).catch(err => 'N/A');
    
    const postStats = {
      postReplies,
      postRetweets,
      postFavourites,
      postCopy,
      postDate
    }

    return Promise.resolve(postStats);
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
      // ._427x is the class for a whole post 'card'
      posts = await page.$$('.js-stream-item');

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

module.exports = scrapeTwitterPosts = async(pageURL, numberOfPosts) => {
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