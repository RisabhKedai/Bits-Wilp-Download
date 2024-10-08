const cheerio = require("cheerio");
const fs = require("fs").promises;

const { getResponse } = require("../utils/RequestHandler");
const {
  removeWhiteSpace,
  getAddressToStoreCourseData,
  questionIntInRange,
} = require("../utils/CommonUtils");
const { downloadContent } = require("./ContentHelper");
const { cleanAndDeleteDir } = require("../utils/FSHandler");
const { DATA_FOLDER } = require("../constants/Path");

const coursesUrl = require("../constants/Urls").BITS_COURSES_URL;
const courseFileAddress = `${DATA_FOLDER}/courses.json`;

async function downloadSingleCourse() {
  let courseList = await fetchCoursesList();
  if (!courseList || !courseList.length) {
    console.log("Unable to load courses linked to your account");
    return;
  }
  console.log("Choose a course from the following:");
  courseList.forEach((course, index) => {
    console.log(`${index + 1} - ${course.name}`);
  });
  let courseNumber = questionIntInRange(
    "Enter the number against the course to download: ",
    1,
    courseList.length
  );
  //   console.log("course", courseNumber);
  console.log(
    "Started downloading course --",
    courseList[courseNumber - 1].name
  );
  await downloadCourse(courseList[courseNumber - 1]);
  await downloadContent(courseList[courseNumber - 1].id, courseNumber);
  console.log(
    "Finished downloading course --",
    courseList[courseNumber - 1].name
  );
}

async function downloadAllCourses() {
  let courseList = await fetchCoursesList();
  if (!courseList || !courseList.length) {
    console.log("Unable to load courses linked to your account");
    return;
  }
  courseList.forEach(async (course, idx) => {
    console.log("Started downloading course --", course.name);
    await downloadCourse(course);
    await downloadContent(course.id, idx);
    console.log("Finished downloading course --", course.name);
  });
}

async function listCourses() {
  let courseData = await fetchCoursesList();
  await fs.writeFile(courseFileAddress, JSON.stringify(courseData, null, 2));
  if (courseData && courseData.length >= 1) {
    console.log("Course List : ");
    for (let i = 0; i < courseData.length; i++) {
      console.log(i + 1, "-", courseData.at(i).name);
    }
  } else {
    console.log("No Course found");
  }
}

async function fetchCoursesList() {
  let courseData = [];
  try {
    const myCourses = await getResponse(coursesUrl);
    if (myCourses.status === 200) {
      const $ = cheerio.load(myCourses.data);
      const courseElements = $('.panel-heading[id*="heading"]');
      courseElements.each((index, element) => {
        const courseName = $(element)
          .find("div > div > div > h4")
          .html()
          .trim();
        const courseUrl = $(element)
          .find("div > div > div > a")
          .attr("href")
          .trim();
        const url = new URL(courseUrl);
        const courseId = url.searchParams.get("id");
        courseData.push({
          name: courseName,
          url: courseUrl,
          id: courseId,
        });
      });
    } else {
      throw new Error("Unable to fetch course data from portal");
    }
  } catch (e) {
    console.log(e);
  } finally {
    return courseData;
  }
}

async function downloadCourse(course) {
  let courseDetails;
  try {
    let resp = await getResponse(course.url);
    if (!resp || resp.status != 200) {
      throw new Error("Unable to fetch course details, please try again");
    } else {
      courseDetails = await parseCoursePage(resp.data);
      courseDetails = {
        ...course,
        sectionList: courseDetails,
      };
      await fs.writeFile(
        getAddressToStoreCourseData(course.id),
        JSON.stringify(courseDetails, null, 2),
        (err) => {
          if (err) {
            throw Error(
              "Error while fetching course content. Please try agian"
            );
          }
        }
      );
    }
  } catch (e) {
    console.log(e);
    // throw e
  } finally {
    return courseDetails;
  }
}

async function clearCourseData() {
  await cleanAndDeleteDir(DATA_FOLDER);
}

async function parseCoursePage(coursePage) {
  const $ = cheerio.load(coursePage);
  const sectionList = $("ul.topics");
  const topicList = [];

  sectionList.children("li").each((index, element) => {
    let sectionData = getSectionData($, $(element));
    if (sectionData.contentList.length > 0) topicList.push(sectionData);
  });
  return topicList;
}

function getSectionData($, listItem) {
  const sectionData = {};
  sectionData.id = listItem.attr("id");

  const sectionHeader = listItem
    .find("div.course-section-header > div > h3.sectionname")
    .html();
  sectionData.sectionHeader = sectionHeader ? sectionHeader.trim() : "";

  const contentList = [];
  listItem
    .find("div.content > ul.section")
    .children("li")
    .each((index, element) => {
      contentList.push(getContentData($, $(element)));
    });

  sectionData.contentList = contentList;
  return sectionData;
}

function getContentData($, contentItem) {
  const contentData = {};
  contentData.id = contentItem.attr("data-id");
  const contentDetail = $(contentItem).find(
    "div.activity-basis > div > div.activity-instance >div.activitytitle > div.media-body > div.activityname > a"
  );
  contentData.url = contentDetail.attr("href");
  contentData.name = removeWhiteSpace(
    contentDetail.find(".instancename").contents().first().text()
  ).trim();
  contentData.type = contentDetail.find(".accesshide").text().trim();

  return contentData;
}

module.exports = {
  downloadSingleCourse,
  downloadAllCourses,
  listCourses,
  clearCourseData,
};
