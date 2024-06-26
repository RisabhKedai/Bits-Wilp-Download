const { getResponse } = require("../utils/RequestHandler");

const coursesUrl = require("../constants/Urls").BITS_COURSES_URL


async function courseDownload(courseCode) {
    console.log(courseCode)
}

async function listCourses() {
    const myCourses = await getResponse(coursesUrl)
    console.log(myCourses.data)
    console.log(myCourses.data.indexOf('Software Product Management'))
}

module.exports = {courseDownload, listCourses}