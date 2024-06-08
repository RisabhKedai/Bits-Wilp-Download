const { getResponse } = require("../utils/RequestHandler");

const coursesUrl = require("../constants/Urls").BITS_COURSES_URL


async function courseDownload(courseCode) {
    const myCourses = await getResponse(coursesUrl)
    console.log(myCourses.data)
    console.log(myCourses.data.indexOf('Software Product Management'))
}

module.exports = {courseDownload}