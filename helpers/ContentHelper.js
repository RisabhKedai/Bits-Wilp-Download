const util = require('util');
const fs = require('fs/promises');
const { createDirectory, downloadAndSaveContent, cleanAndDeleteDir } = require('../utils/FSHandler');
const { FILE_TYPE_FILE, FILE_TYPE_FOLDER, VIEW_ITEM_CODEFILE, DOWNLOAD_FOLDER_CODEFILE } = require('../constants/ParsingConstants');


const coursesContentAddress = './content'

async function downloadContent(courseId) {
    const courseString  = await fs.readFile(`./data/${courseId}.json`, 'utf-8')
    let courseDetails = JSON.parse(courseString)
    await createDirectories(courseDetails)
}

async function createDirectories(courseDetails) {
    const coursePath = `./${coursesContentAddress}/${courseDetails.name}`
    await createDirectory(coursePath)
    for(let section of courseDetails.sectionList) {
        const sectionPath = `${coursePath}/${section.sectionHeader}`
        await createDirectory(sectionPath)
        for(let content of section.contentList) {
            if(content.type === FILE_TYPE_FILE) {
                downloadAndSaveContent(content.url, sectionPath)
            } else if(content.type === FILE_TYPE_FOLDER) {
                const downloadURL = content.url.replace(VIEW_ITEM_CODEFILE, DOWNLOAD_FOLDER_CODEFILE)
                downloadAndSaveContent(downloadURL, sectionPath)
            }
        }
    }
}

async function clearCourseContent() {
    await cleanAndDeleteDir('./content')
}

module.exports = {downloadContent, clearCourseContent}