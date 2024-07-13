const util = require('util');
const fs = require('fs');
const { createDirectory, downloadAndSaveContent } = require('../utils/FSHandler');
const { FILE_TYPE_FILE } = require('../constants/ParsingConstants');

const readFile = util.promisify(fs.readFile);

const coursesContentAddress = './content'

async function downloadContent(courseId) {
    let courseDetails = JSON.parse(await readFile(`./data/${courseId}.json`, 'utf-8'))
    await createDirectories(courseDetails)
}

async function createDirectories(courseDetails) {
    const coursePath = `./${coursesContentAddress}/${courseDetails.name}`
    createDirectory(coursePath)
    for(let section of courseDetails.sectionList) {
        const sectionPath = `${coursePath}/${section.sectionHeader}`
        createDirectory(sectionPath)
        for(let content of section.contentList) {
            if(content.type === FILE_TYPE_FILE) {
                downloadAndSaveContent(content.url, sectionPath)
            }
        }
    }
}

module.exports = {downloadContent}