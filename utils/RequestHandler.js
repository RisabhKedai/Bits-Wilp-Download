const axios = require('axios') 
const {wrapper} = require('axios-cookiejar-support')

const { saveCookiesFromJar, getCookieJarFromFile } = require('./CookieHandler')

const HEADERS = {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
   'accept-language': 'en-GB,en;q=0.9',
   'cache-control': 'max-age=0',
}

async function getResponse(url, headers = {}) {
    try {
        const cookieJar = await getCookieJarFromFile()
        const client = wrapper(axios.create({jar : cookieJar}))
        const resp = await client.get(url, {headers : {...HEADERS, ...headers}})
        await saveCookiesFromJar(cookieJar)
        return resp
    }catch (error){
        console.log(error)
        console.log(error.stackTrace);
    }
}

async function postResponse(url, headers = {}, data= {}){
    try {
        const cookieJar = await getCookieJarFromFile()
        const client = wrapper(axios.create({jar : cookieJar}))
        const resp = await client.post(url, {headers : {...HEADERS, ...headers}, data})
        saveCookiesFromJar(cookieJar)
        return resp
    }catch (error){
        console.log(error)
        console.log(error.stackTrace);
    }
}

module.exports = {getResponse, postResponse}