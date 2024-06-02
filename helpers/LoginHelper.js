const cookieHandler = require("../utils/CookieHandler").CookieHandlerObj
const { getResponse } = require("../utils/RequestHandler");

const loginURL = require("../constants/Urls").BITS_PORTAL_LOGIN_URL

const jsessionRegex = require("../constants/RegexConstants").JSESSIONID

function login(username, password) {
    fetchJSession();
    console.log(username, password);
}

async function fetchJSession() {
    let jsessionData = await getResponse(loginURL)
    jsessionData = jsessionData.headers.getSetCookie()[0]
    let jsessionCookie = jsessionRegex.exec(jsessionData)[0]
    cookieHandler.jsessionCookie = jsessionCookie
}

module.exports = {login}