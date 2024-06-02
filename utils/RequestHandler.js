const HEADERS = {
     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-GB,en;q=0.9',
    'cache-control': 'max-age=0'
}

function post(url, ) {

}

// fetch("https://idp.bits-pilani.ac.in/idp/Authn/UserPassword", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//     "cache-control": "max-age=0",
//     "content-type": "application/x-www-form-urlencoded",
//     "priority": "u=0, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "_idp_session=MTkyLjE2OC4xLjIyMw%3D%3D%7CLQ%3D%3D%7CY2I0NThlNzMyMzEzNzY0MTUzOTM3YmUzZTNiOWE1MjRkZWYwZTM0MmVkOTFjOGNkMTk4NWUwMDc2MmNiNmQxZA%3D%3D%7CCTDT8Kr4LblpuPiSXH6iQikxw7E%3D; JSESSIONID=2FE065CB43A5FCF72B5DDDE51AE46298; _idp_authn_lc_key=c4676851ba90d8718fe8a6ee0ec5b22edbfb3be48c9069b24a6869538dd71cf2; _ga=GA1.3.1247711998.1717018508; _ga_X31XHHFT1B=GS1.3.1717018571.1.1.1717022207.0.0.0; _gid=GA1.3.1619487091.1717264323; _gat=1; _ga_LCZ1NF6NPT=GS1.3.1717264323.3.1.1717264338.0.0.0; _ga_DJL6T881JW=GS1.3.1717264348.3.0.1717264348.0.0.0",
//     "Referer": "https://idp.bits-pilani.ac.in/idp/Authn/UserPassword",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "j_username=2023sl93047%40wilp.bits-pilani.ac.in&j_password=08092001",
//   "method": "POST"
// });

async function getResponse(url, headers = {}) {
    try {
        options = {
            headers : {...HEADERS, ...headers},
            method : 'GET',
        }
        const response = await fetch(url, options);
        if(!response || response.status!=200) {
            throw new Error('Unable to fetch the request')
        }
        return response;
      } catch (error) {
        console.error(error);
      }
}


module.exports = {getResponse}