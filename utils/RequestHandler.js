const axios = require('axios') 
const {wrapper} = require('axios-cookiejar-support')

const {cookieJar} = require('./CookieHandler')
const client = wrapper(axios.create({jar : cookieJar}))

const HEADERS = {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
   'accept-language': 'en-GB,en;q=0.9',
   'cache-control': 'max-age=0',
}

async function getResponse(url, headers = {}) {
    try {
        return await client.get(url, {headers : {...HEADERS, ...headers}})
    }catch (error){
        console.log(error)
        console.log(error.stackTrace);
    }
}

async function postResponse(url, headers = {}, data= {}){
    try {
        return await client.post(url, {headers : {...HEADERS, ...headers}, data})
    }catch (error){
        console.log(error)
        console.log(error.stackTrace);
    }
}

module.exports = {getResponse, postResponse}