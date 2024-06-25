const puppeteer = require('puppeteer')

const {BITS_SP_LOGIN_URL} = require("../constants/Urls")
const {getCookiesJson, saveCookiesJson} = require('../utils/CookieHandler')

async function setCookiesOnPage(page) {
    console .log("Loading old cookies")
    const cookies = await getCookiesJson()
    for(let cookie of cookies) {
        if(cookie.expires < Date.now) {
            page.setCookie(cookie)
        }
    }
}

async function pageInteractionForLogin (page, user, pass) {
    console.log("Set username password")
    // Set the username and password
    await page.type('#username', user);
    await page.type('#pass', pass);

    // Click the login button
    console.log("clicked login button")
    await page.click('#submitbtn');
    await page.waitForNavigation();
}

async function saveCookiesFromPage(page) {
    let cookiesFromPage = await page.cookies()
    await saveCookiesJson(cookiesFromPage)
}

async function login(username, password) {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    try{
        await setCookiesOnPage(page);
        await page.goto(BITS_SP_LOGIN_URL);
        await pageInteractionForLogin(page, username, password);
        await saveCookiesFromPage(page)
    }catch(e) {
        console.log(e, e.stackTrace)
    } finally {
        browser.close();
    }
}
module.exports = {login}