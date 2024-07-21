const util = require('util');
const fs = require('fs/promises');
const { createDirectory, saveContent, cleanAndDeleteDir } = require('../utils/FSHandler');
const { getResponse } = require('../utils/RequestHandler');
const { FILE_TYPE_FILE, FILE_TYPE_FOLDER, VIEW_ITEM_CODEFILE, DOWNLOAD_FOLDER_CODEFILE, HEADER_CONTENT_DISPOSITION } = require('../constants/ParsingConstants');
const { parseContentDisposition } = require('../utils/CommonUtils');


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
                let {contentName, contentBinary} = await getContentBinary(content.url)
                await saveContent(sectionPath, contentName, contentBinary)
            } else if(content.type === FILE_TYPE_FOLDER) {
                const downloadURL = content.url.replace(VIEW_ITEM_CODEFILE, DOWNLOAD_FOLDER_CODEFILE)
                let {contentName, contentBinary} = await getContentBinary(downloadURL)
                await saveContent(sectionPath, contentName, contentBinary)
            }
        }
    }
}

async function getContentBinary(url) {
    const resp = await getResponse(url, {}, {responseType : "arraybuffer"})
    if (!resp || resp.status != 200 || !resp.headers.hasOwnProperty(HEADER_CONTENT_DISPOSITION)) {
        throw new Error('Unable to Download content from:', url)
    }
    const contentDisposition = parseContentDisposition(resp.headers[HEADER_CONTENT_DISPOSITION])
    if (!contentDisposition.hasOwnProperty('filename')) {
        throw new Error('Incorrect data downloaded')
    }
    const contentName = contentDisposition.filename
    return {contentName, contentBinary : resp.data}
}

async function clearCourseContent() {
    await cleanAndDeleteDir('./content')
}

module.exports = {downloadContent, clearCourseContent}