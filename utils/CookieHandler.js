const tough = require('tough-cookie');
const fs = require('fs').promises;

const cookieFileName = 'cookies.json';

// Load cookies from file on initialization (optional)
async function getCookieToJar() {
  let jar;
  try {
    const data = await fs.readFile(cookieFileName, 'utf-8');
    cookies = JSON.parse(data);
    jar = tough.CookieJar.deserializeSync(cookies)

  } catch (err) {
    // Handle potential errors (e.g., file not found)
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

// Save cookies to file on process exit
async function saveCookiesFromJar(cookieJar) {
  try {
    const cookies = cookieJar.toJSON();
    const data = JSON.stringify(cookies, null, 2);
    await fs.writeFile(cookieFileName, data);
  } catch (err) {
    // Handle potential errors (e.g., disk write failure)
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

module.exports = { saveCookies: saveCookiesFromJar, saveCookiesJson: saveCookiesFromPage, getCookieJar: getCookieToJar, getCookiesJson: getCookiesList };