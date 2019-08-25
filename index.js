const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const env = dotenv.parsed;

const TEST_DIR = path.resolve(__dirname, 'tests/' + (new Date()).toISOString());
const TEST_DURATION = env.DURATION || 10;
const TEST_PAGES = env.PAGES || 1;
const TEST_HEADLESS = !!env.HEADLESS;

fs.mkdirSync(TEST_DIR);

(async () => {

  const browser = await puppeteer.launch({ headless: TEST_HEADLESS });
  var pages = [];

  for(var i=0;i<TEST_PAGES;i++) {
    fs.mkdirSync(path.resolve(TEST_DIR, `test-${i}`));
    var page = await browser.newPage();
    pages.push(page);
    await preparePage(page);
    await testPage(page, i);
  }

  await browser.close();

})();

async function preparePage(page) {
  await page.setViewport({
    width: 1280,
    height: 768,
    deviceScaleFactor: 1
  });
  await page.goto(env.APP_URL);
}

async function testPage(page, i) {
  await page.click('#viewer');
  await page.waitFor(TEST_DURATION * 1000);
  await page.waitForFunction('webRtcPeer.remoteVideo.srcObject instanceof MediaStream');
  await getRtcStatsFromPage(page, path.resolve(TEST_DIR, `test-${i}`, `rtcstats.json`));
  await page.screenshot({path: path.resolve(TEST_DIR, `test-${i}`, `screenshot.jpg`)});
}

async function getRtcStatsFromPage(page, path) {
  var rtcstats = await page.evaluate(async () => {
    if(!webRtcPeer || !webRtcPeer) {
      return {};
    }
    return Array.from(await webRtcPeer.peerConnection.getStats(null));
  });
  fs.writeFileSync(path, JSON.stringify(rtcstats, null, 2));
}