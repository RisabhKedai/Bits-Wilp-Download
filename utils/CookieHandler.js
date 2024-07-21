const tough = require('tough-cookie');
const { checkDirectory } = require('./FSHandler');
const fs = require('fs').promises;

const cookieFileAddress = './data/cookies.json';
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
    const cookieList = await getCookieListFromFile()
    jar = tough.CookieJar.deserializeSync({...cookieJarSpec, cookies: cookieList})
  } catch (err) {
    jar = new tough.CookieJar()
  }
  return jar
}

async function getPuppeteerCookies() {
  try {
    const data = await getCookieListFromFile()
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
    let cookies = [...cookieJar.toJSON().cookies];
    const existingCookies = await getCookieListFromFile();
    cookies = mergeCookies(cookies, existingCookies)
    const data = JSON.stringify(cookies, null, 2);
    if(!(await checkDirectory('./data'))) {
      await fs.mkdir('./data')
    }
    await fs.writeFile(cookieFileAddress, data);
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
    const existingCookies = await getCookieListFromFile();
    data = mergeCookies(data, existingCookies)
    data = JSON.stringify(data, null, 2);
    if(!(await checkDirectory('./data'))) {
      await fs.mkdir('./data')
    }
    await fs.writeFile(cookieFileAddress, data);
  } catch (err) {
    console.error('Error saving cookies:', err);
  }
}

function puppeteerToCookieJar(puppeteerCookie) {
  return {
    key: puppeteerCookie.name,
    value: puppeteerCookie.value,
    expires: puppeteerCookie.expires !== -1 ? new Date(puppeteerCookie.expires * 1000).toISOString() : undefined,
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

function mergeCookies(newList, existingCookies) {
  for (let newCookie of newList) {
    const index = existingCookies.findIndex(
      (cookie) => newCookie.key === cookie.key && newCookie.domain === cookie.domain
    );
    if (index !== -1) {
      existingCookies[index] = newCookie;
    } else {
      existingCookies.push(newCookie);
    }
  }
  return existingCookies;
}

async function getCookieListFromFile() {
  if(await checkDirectory('./data')) {
    const data = await fs.readFile(cookieFileAddress, 'utf-8');
    if(data) 
      return JSON.parse(data)
  }
  return []
}

module.exports = { 
  saveCookiesFromJar, 
  saveCookiesFromPage, 
  getCookieJarFromFile, 
  getPuppeteerCookies, 
  puppeteerToCookieJar, 
  cookieJarToPuppeteer 
};
