const puppeteer = require('puppeteer');

const extractPosts = async (post) => {
    const postLikes = await post.$eval('._3dlh', node => node.innerText).catch(err => 'N/A');

    let postShares = await post.$eval('._3rwx', node => node.innerText).catch(err => 'N/A');
    // removing 'shares' text from result so only number is there
    postShares = postShares.split(' ')[0];

    let postComments = await post.$eval('._3hg-', node => node.innerText).catch(err => 'N/A');
    // removing 'comments' text from result so only number is there
    postComments = postComments.split(' ')[0];

    const postCopy = await post.$eval('._5pbx', node => node.innerText).catch(err => 'N/A');

    const postDate = await post.$eval('._5ptz', node => node.innerText).catch(err => 'N/A');
 
    const postStats = {
      postLikes,
      postShares,
      postComments,
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
      posts = await page.$$('._427x');

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

module.exports =  scrapeFacebookPosts = async(pageURL, numberOfPosts) => {
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
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, numberOfPosts);

  // Close the browser.
  await browser.close();

  return items.length > numberOfPosts ? items.splice(0, numberOfPosts) : items;
};