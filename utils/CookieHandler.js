const tough = require('tough-cookie');
const fs = require('fs').promises;

const cookieFileName = 'cookies.json';
const cookieJarSpec = {
    "version": "tough-cookie@4.1.4",
    "storeType": "MemoryCookieStore",
    "rejectPublicSuffixes": true,
    "enableLooseMode": false,
    "allowSpecialUseDomain": true,
    "prefixSecurity": "silent"
}

async function getCookieJarFromFile() {
  let jar;
  try {
    const data = await fs.readFile(cookieFileName, 'utf-8');
    const cookieList = JSON.parse(data);
    jar = tough.CookieJar.deserializeSync({...cookieJarSpec, cookies: cookieList})
  } catch (err) {
    jar = new tough.CookieJar()
  }
  return jar
}

async function getPuppeteerCookies() {
  try {
    const data = JSON.parse(await fs.readFile(cookieFileName, 'utf-8'))
    let cookieList = []
    for(cookie of data) {
      cookieList.push(cookieJarToPuppeteer(cookie))
    }
    return cookieList
  } catch (err) {
    return []
  }
}

async function saveCookiesFromJar(cookieJar) {
  try {
    const cookies = [...cookieJar.toJSON().cookies];
    const data = JSON.stringify(cookies, null, 2);
    await fs.writeFile(cookieFileName, data);
  } catch (err) {
    console.error('Error saving cookies:', err);
  }
}

async function saveCookiesFromPage(cookiesJson) {
  try {
    let data  = []
    for(cookie of cookiesJson) {
      data.push(puppeteerToCookieJar(cookie))
    }
    data = JSON.stringify(data, null, 2);
    await fs.writeFile(cookieFileName, data);
  } catch (err) {
    console.error('Error saving cookies:', err);
  }
}

function puppeteerToCookieJar(puppeteerCookie) {
  return {
    key: puppeteerCookie.name,
    value: puppeteerCookie.value,
    expires: puppeteerCookie.expires !== -1 ? new Date(puppeteerCookie.expires * 1000).toISOString() : null,
    domain: puppeteerCookie.domain,
    path: puppeteerCookie.path,
    hostOnly: !puppeteerCookie.domain.startsWith('.'),
    creation: new Date().toISOString(),
    lastAccessed: new Date().toISOString()
  };
}

function cookieJarToPuppeteer(cookieJarCookie) {
  return {
    name: cookieJarCookie.key,
    value: cookieJarCookie.value,
    domain: cookieJarCookie.domain,
    path: cookieJarCookie.path,
    expires: cookieJarCookie.expires ? new Date(cookieJarCookie.expires).getTime() / 1000 : -1,
    size: (cookieJarCookie.key + cookieJarCookie.value).length,
  };
}


module.exports = { 
  saveCookiesFromJar, 
  saveCookiesFromPage, 
  getCookieJarFromFile, 
  getPuppeteerCookies, 
  puppeteerToCookieJar, 
  cookieJarToPuppeteer 
};
