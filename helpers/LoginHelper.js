const { getResponse, postResponse } = require("../utils/RequestHandler");

const loginURL = require("../constants/Urls").BITS_LOGIN_URL
const userURL = require("../constants/Urls").BITS_COOKIE_COLLECTION

const {cookieJar} = require('../utils/CookieHandler')

const fs = require('fs')

async function login(username, password) {
    await getResponse(userURL)
    const home = await postResponse(loginURL,
        {
            "j_username": username,
            "j_password": password
        }
    )
    if(home.status === 200) {
        console.log("Logged in Successfully !")
    } else{
        console.log("Faield to login")
    }
}
module.exports = {login}