const util = require('util');
const fs = require('fs');
const { HEADER_CONTENT_DISPOSITION } = require('../constants/ParsingConstants');
const { getResponse } = require('./RequestHandler');
const { parseContentDisposition } = require('./CommonUtils');
const readFile = util.promisify(fs.readFile);

async function createDirectory(path) {
    try {
        await fs.mkdirSync(path)
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e
        }
    }
}

async function downloadAndSaveContent(url, folderPath) {
    const resp = await getResponse(url)
    if (!resp || resp.status != 200 || !resp.headers.hasOwnProperty(HEADER_CONTENT_DISPOSITION)) {
        throw new Error('Unable to Download content from:', url)
    }
    const contentDisposition = parseContentDisposition(resp.headers[HEADER_CONTENT_DISPOSITION])
    if (!contentDisposition.hasOwnProperty('filename')) {
        throw new Error('Incorrect data downloaded')
    }
    const contentName = contentDisposition.filename
    const contentNamePath = `${folderPath}/${contentName}`
    await fs.writeFile(
        contentNamePath,
        resp.data,
        (err) => {
            if (err) {
                throw new Error("Unable to save file", err)
            }
        }
    )
}

module.exports = { createDirectory, downloadAndSaveContent }