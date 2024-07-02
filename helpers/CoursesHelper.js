const cheerio = require("cheerio")
const fs = require('fs')
const rs = require('readline-sync') 

const { getResponse } = require("../utils/RequestHandler");
const { isNumber } = require("../utils/CommonUtils");

const coursesUrl = require("../constants/Urls").BITS_COURSES_URL
const courseFileAddress = './data/courses.json'
  
async function downloadSingleCourse(courseCode) {
    let courseList = await fetchCoursesList();
    if (!courseList || !courseList.length) {
        console.log("Unable to load courses linked to your account");
        return;
    }
    console.log("Choose a course from the following:");
    courseList.forEach((course, index) => {
        console.log(`${index + 1} - ${course.name}`);
    });
    let courseNumber = rs.questionInt("Enter the number against the course to download: ");
    if (isNumber(courseNumber) && courseNumber >= 1 && courseNumber <= courseList.length) {
        downloadCourse(courseList[courseNumber-1])
    } else {
        console.log("Invalid input. Please try again.");
    }
}

async function downloadAllCourses() {
    let courseList = await fetchCoursesList();
    if (!courseList || !courseList.length) {
        console.log("Unable to load courses linked to your account");
        return;
    }
    console.log(courseList)
}

async function listCourses() {
    let courseData = await fetchCoursesList()
    await fs.writeFile(courseFileAddress, JSON.stringify(courseData, null, 2), (err)=>{
        if(err){
            console.log("List Courses save failed")
        }
    });
    if(courseData && courseData.length>=1) {
        console.log("Course List : ")
        for(let i=0; i<courseData.length; i++) {
            console.log((i+1), "-", courseData.at(i).name)
        }
    }else{ 
        console.log("No Course found")
    }
}

async function fetchCoursesList () {
    let courseData = []
    try {
        const myCourses = await getResponse(coursesUrl)
        if(myCourses.status === 200) {
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
        }else {
            throw new Error ("Unable to fetch course data from portal")
        }
    } catch (e) {
        console.log(e)
    } finally {
        return courseData
    }
}

async function downloadCourse(course) {
    let courseDetails
    try {
       let resp = await getResponse(course.url)
       console.log(resp)
       if(!resp || resp.status !== 200) {
        throw new Error("Unable to fetch course details, please try again")
       } else {
        courseDetails = resp.body
        console.log(courseDetails)
       }
    } catch (e) {
        console.log(e)
    } finally {
        return courseDetails
    }
}

module.exports = {downloadSingleCourse, downloadAllCourses, listCourses}