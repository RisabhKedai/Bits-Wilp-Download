const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const {BITS_SP_LOGIN_URL, BITS_IDP_LOGIN_URL, TAXILA_LOGIN_URL} = require("../constants/Urls")
const { saveCookiesFromPage, getPuppeteerCookies } = require('../utils/CookieHandler')

async function setCookiesOnPage(page) {
    console.log("Loading old cookies");
    try {
        const cookies = await getPuppeteerCookies(); 
        if (cookies) {
            const validCookies = cookies.filter(cookie => !cookie.expires || cookie.expires < Date.now());
            for (let cookie of validCookies) {
                await page.setCookie(cookie);
            }
        }
    } catch (error) {
        console.error("Error setting cookies:", error);
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
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
}

async function saveCookies(page) {
    const cookiesFromPage = await page.cookies()
    await saveCookiesFromPage(cookiesFromPage)
}

async function checkBitsLoggedIn(page) {
    const $ = await cheerio.load(await page.content())
    const myCoursesLink = $('a[href="/user/courses/"]');
    return (myCoursesLink.length > 0 && myCoursesLink.text().trim() === "My Courses");
}

async function checkTaxilaLoggedIn(page) {
    const regex = /^Welcome back, [a-zA-Z\s]+! 👋$/;
    const $ = await cheerio.load(await page.content())
    const welcomeCard = $('h2.mb-3.mt-3');
    return (welcomeCard.length > 0 && regex.test(welcomeCard.text().trim()));
}

async function login(username, password) {
    // {headless : false, devtools: true, defaultNavigationTimeout: 600000}
    const browser = await puppeteer.launch({headless : false});
    let page = await browser.newPage();
    try{
        await setCookiesOnPage(page);
        await page.goto(TAXILA_LOGIN_URL);
        if(await page.url() === BITS_IDP_LOGIN_URL)
            await pageInteractionForLogin(page, username, password);
        if(!(await checkTaxilaLoggedIn(page))) {
            throw new Error("Unable to login into e-learn portal")
        }else {
            console.log("Login Successfull")
        }
        await saveCookies(page)
        
    }catch(e) {
        console.log(e, e.stackTrace)
    } finally {
        browser.close();
    }
}
module.exports = {login}