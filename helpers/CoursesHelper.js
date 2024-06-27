const cheerio = require("cheerio")
const fs = require('fs')

const { getResponse } = require("../utils/RequestHandler");

const coursesUrl = require("../constants/Urls").BITS_COURSES_URL
const courseFileAddress = './data/courses.json'

async function courseDownload(courseCode) {
    console.log(courseCode)
}

async function listCourses() {
    let courseData = []
    const myCourses = await getResponse(coursesUrl)
    const $ = cheerio.load(myCourses.data)
    const courseElements = $('.panel-heading[id*="heading"]')
    courseElements.each((index, element) => {
        const courseName = $(element).find('div > div > div > h4').html().trim()
        const courseUrl = $(element).find('div > div > div > a').attr('href').trim()
        courseData.push({
            name : courseName,
            url : courseUrl
        })
    });
    await fs.writeFile(courseFileAddress, JSON.stringify(courseData, null, 2), (err)=>{
        if(!err) {
            console.log("Saved List of courses")
        }else{
            console.log("List Courses save failed")
        }
    });
}

module.exports = {courseDownload, listCourses}