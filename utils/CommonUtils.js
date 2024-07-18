
const fs = require('fs');
const unzipper = require('unzipper');

function isNumber(value) {
    return !isNaN(value) && typeof value === 'number';
}

function removeWhiteSpace(string) {
    const whitespaceRegex = /\s+/g;
    return string.replace(whitespaceRegex, ' ');
}

function getAddressToStoreCourseData(courseId) {
    return `./data/${courseId}.json`
}

function parseContentDisposition(header) {
    const result = {};

    if (!header || typeof header !== 'string') {
        return result;
    }
    const parts = header.split(';');
    result.disposition = parts[0].trim();

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim().replace(/^"|"$/g, '');

            if (trimmedKey.toLowerCase() === 'filename*') {
                const matches = /([^']*)''(.+)/.exec(trimmedValue);
                if (matches && matches.length === 3) {
                    const charset = matches[1]; // we assume UTF-8
                    const encodedFilename = matches[2];
                    result.filename = decodeURIComponent(encodedFilename);
                }
            } else {
                result[trimmedKey] = trimmedValue;
            }
        }
    }
    // console.log("parseContentDisposition", result);
    return result;
}

function getFileExtension(name) {
    return name.split('.').at(-1)
}

async function unzipBufferToFolder(buffer, outputFolderPath) {
    try {
        if (!fs.existsSync(outputFolderPath)) {
            fs.mkdirSync(outputFolderPath, { recursive: true });
        }
        const stream = unzipper.Open.buffer(buffer);
        const directory = await stream;
        await directory.extract({ path: outputFolderPath });
        console.log(`Files extracted to ${outputFolderPath}`);
    } catch (err) {
        console.error(`Error unzipping buffer: ${err.message}`);
        throw err
    }
}

module.exports = {isNumber, removeWhiteSpace, getAddressToStoreCourseData, parseContentDisposition, getFileExtension, unzipBufferToFolder}