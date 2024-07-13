const util = require('util');
const fs = require('fs');
const { createDirectory } = require('../utils/FSHandler');

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
        createDirectory(`${coursePath}/${section.sectionHeader}`)
    }
}

module.exports = {downloadContent}