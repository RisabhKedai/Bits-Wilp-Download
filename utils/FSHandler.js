const util = require('util');
const fs = require('fs/promises');
const { HEADER_CONTENT_DISPOSITION } = require('../constants/ParsingConstants');
const { getResponse } = require('./RequestHandler');
const { parseContentDisposition, getFileExtension, unzipBufferToFolder } = require('./CommonUtils');

async function createDirectory(path) {
    try {
        await fs.mkdir(path)
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e
        }
    }
}

async function checkDirectory(path) {
    try {
        const stats = await fs.stat(path);
        if (stats.isDirectory()) {
            return true;
    }
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        } else {
            console.error('Error checking directory:', err);
            throw err
        }
    }
}

async function downloadAndSaveContent(url, folderPath) {
    const resp = await getResponse(url, {}, {responseType : "arraybuffer"})
    if (!resp || resp.status != 200 || !resp.headers.hasOwnProperty(HEADER_CONTENT_DISPOSITION)) {
        throw new Error('Unable to Download content from:', url)
    }
    const contentDisposition = parseContentDisposition(resp.headers[HEADER_CONTENT_DISPOSITION])
    if (!contentDisposition.hasOwnProperty('filename')) {
        throw new Error('Incorrect data downloaded')
    }
    const contentName = contentDisposition.filename
    switch(getFileExtension(contentName)) {
        case 'zip':
            unzipBufferToFolder(Buffer.from(resp.data), folderPath)
            break;
        default :
            const contentNamePath = `${folderPath}/${contentName}`
            await fs.writeFile(contentNamePath, Buffer.from(resp.data), 'binary');
            break;
    }
}

module.exports = { createDirectory, downloadAndSaveContent, checkDirectory }