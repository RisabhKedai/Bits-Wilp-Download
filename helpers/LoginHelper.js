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
    const $ = await cheerio.load(await page.content())
    const logoutLink = $('a.dropdown-item.menu-action[role="menuitem"][data-title="logout,moodle"]');
    return logoutLink.length > 0
}

async function login(username, password) {
    // {headless : false, devtools: true, defaultNavigationTimeout: 600000}
    const browser = await puppeteer.launch({headless : true});
    let page = await browser.newPage();
    try{
        await setCookiesOnPage(page);
        await page.goto(TAXILA_LOGIN_URL);
        if(await page.url() === BITS_IDP_LOGIN_URL)
            await pageInteractionForLogin(page, username, password);
        if(!(await checkTaxilaLoggedIn(page))) {
            throw new Error("Unable to login into taxila portal")
        }else {
            console.log("Login Successfull Taxila")
        }
        await saveCookies(page)

        await page.goto(BITS_SP_LOGIN_URL)
        if(await page.url() === BITS_IDP_LOGIN_URL)
            await pageInteractionForLogin(page, username, password);
        if(!(await checkBitsLoggedIn(page))) {
            throw new Error("Unable to login into elearn portal")
        }else {
            console.log("Login Successfull Elearn")
        }
        await saveCookies(page)
        
    }catch(e) {
        console.log(e, e.stackTrace)
    } finally {
        browser.close();
    }
}
module.exports = {login}