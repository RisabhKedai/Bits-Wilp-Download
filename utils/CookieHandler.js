const tough = require('tough-cookie');
const fs = require('fs').promises; 

const cookieJarFile = 'cookies.json'; 

// Load cookies from file on initialization (optional)
async function getCookieJar() {
    let jar;
    try {
        const data = await fs.readFile(cookieJarFile, 'utf-8');
        cookies = JSON.parse(data);
        jar = tough.CookieJar.deserializeSync(cookies)
       
    } catch (err) {
        // Handle potential errors (e.g., file not found)
        jar = new tough.CookieJar()
    }
    return jar
}

// Save cookies to file on process exit
async function saveCookies(cookieJar) {
  try {
    const cookies = cookieJar.toJSON();
    const data = JSON.stringify(cookies, null, 2);
    await fs.writeFile(cookieJarFile, data);
  } catch (err) {
    // Handle potential errors (e.g., disk write failure)
    console.error('Error saving cookies:', err);
  }
}

module.exports = { saveCookies, getCookieJar};