const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const {BITS_SP_LOGIN_URL, BITS_IDP_LOGIN_URL} = require("../constants/Urls")
const { saveCookiesFromPage, getCookiesList } = require('../utils/CookieHandler')

async function setCookiesOnPage(page) {
    console.log("Loading old cookies");
    try {
        const cookies = await getCookiesList(); 
        if (cookies) {
            for (let cookie of cookies) {
                if ((cookie.expires===-1) || (cookie.expires > Date.now())) {
                    await page.setCookie(cookie);
                } 
                // else {
                //     console.log("Skipping expired cookie:", cookie.name);
                // }
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

async function checkLoggedIn(page) {
    const $ = await cheerio.load(await page.content())
    const myCoursesLink = $('a[href="/user/courses/"]');
    return (myCoursesLink.length > 0 && myCoursesLink.text().trim() === "My Courses");
}

async function login(username, password) {
    const browser = await puppeteer.launch({headless : true});
    const page = await browser.newPage();
    try{
        await setCookiesOnPage(page);
        await page.goto(BITS_SP_LOGIN_URL);
        if(await page.url() === BITS_IDP_LOGIN_URL)
            await pageInteractionForLogin(page, username, password);
        if(!(await checkLoggedIn(page))) {
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