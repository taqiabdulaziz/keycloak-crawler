const crawl = async () => {
  const puppeteer = require('puppeteer');
  const read = require('./decode');

  const { KEYCLOAK_PASSWORD, KEYCLOAK_URL, KEYCLOAK_USERNAME } = require('./config')

  let url = KEYCLOAK_URL;
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    await page.$eval('#username', (el, KEYCLOAK_USERNAME) => el.value = KEYCLOAK_USERNAME, KEYCLOAK_USERNAME);
    await page.$eval('#password', (el, KEYCLOAK_PASSWORD) => el.value = KEYCLOAK_PASSWORD, KEYCLOAK_PASSWORD);
    
    await page.keyboard.press('Enter')
    page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
    await page.on('response', async response => {
      const status = response.status()
      if ((status >= 300) && (status <= 399)) {
        url = response.headers()['location']
        await page.goto(url)
        const imageUrl = await page.$eval('#kc-totp-secret-qr-code', el => el.src)
        page.waitForNavigation({
          waitUntil: 'networkidle0'
        })

        const token = await read(imageUrl);

        await page.screenshot({
          path: 'example.png',
          fullPage: true,
        });
        console.log(token);
      }
    })

  } catch (error) {
    console.log(error)
  }
};

crawl()