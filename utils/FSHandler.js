const util = require('util');
const fs = require('fs/promises');
const { parseContentDisposition, getFileExtension, unzipBufferToFolder } = require('./CommonUtils');

async function createDirectory(path) {
    try {
        await fs.mkdir(path, {recursive : true})
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

async function saveContent(folderPath, contentName, contentBiary) {
    switch(getFileExtension(contentName)) {
        case 'zip':
            unzipBufferToFolder(Buffer.from(contentBiary), folderPath)
            break;
        default :
            const contentNamePath = `${folderPath}/${contentName}`
            await fs.writeFile(contentNamePath, Buffer.from(contentBiary), 'binary');
            break;
    }
}

async function cleanAndDeleteDir(dir) {
    if(checkDirectory(dir)) {
        fs.rm(dir, { recursive: true, force: true }, err => {
            if (err) {
              throw err;
            }
          });
    }
}

module.exports = { createDirectory, saveContent, checkDirectory, cleanAndDeleteDir }
