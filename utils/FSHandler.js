const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

async function createDirectory(path) {
    try{
        await fs.mkdirSync(path)
    } catch(e) {
        if(e.code !== 'EEXIST'){
            throw e
        }
    }
}

module.exports = {createDirectory}