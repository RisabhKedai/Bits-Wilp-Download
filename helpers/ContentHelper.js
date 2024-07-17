const util = require('util');
const fs = require('fs/promises');
const { createDirectory, downloadAndSaveContent } = require('../utils/FSHandler');
const { FILE_TYPE_FILE } = require('../constants/ParsingConstants');


const coursesContentAddress = './content'

async function downloadContent(courseId) {
    const courseString  = await fs.readFile(`./data/${courseId}.json`, 'utf-8')
    let courseDetails = JSON.parse(courseString)
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