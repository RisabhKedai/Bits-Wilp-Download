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

async function getCookiesList() {
  try {
    const data = await fs.readFile(cookieFileName, 'utf-8');
    cookies = JSON.parse(data);
    return cookies
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
    const data = JSON.stringify(cookiesJson, null, 2);
    await fs.writeFile(cookieFileName, data);
  } catch (err) {
    console.error('Error saving cookies:', err);
  }
}

module.exports = { saveCookiesFromJar, saveCookiesFromPage, getCookieJarFromFile, getCookiesList };