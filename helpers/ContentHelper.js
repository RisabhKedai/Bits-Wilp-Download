const cheerio = require("cheerio");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const {
  createDirectory,
  saveContent,
  cleanAndDeleteDir,
} = require("../utils/FSHandler");
const { getResponse } = require("../utils/RequestHandler");
const {
  FILE_TYPE_FILE,
  FILE_TYPE_FOLDER,
  VIEW_ITEM_CODEFILE,
  DOWNLOAD_FOLDER_CODEFILE,
  HEADER_CONTENT_DISPOSITION,
  FILE_TYPE_PAGE,
} = require("../constants/ParsingConstants");
const { parseContentDisposition } = require("../utils/CommonUtils");
const {
  STORE_FOLDER,
  CONTENT_FOLDER,
  DATA_FOLDER,
} = require("../constants/Path");

const coursesContentAddress = path.resolve(
  os.homedir(),
  STORE_FOLDER,
  CONTENT_FOLDER
);

async function downloadContent(courseId, idx) {
  console.log(DATA_FOLDER);
  const courseString = await fs.readFile(
    `${DATA_FOLDER}/${courseId}.json`,
    "utf-8"
  );
  let courseDetails = JSON.parse(courseString);
  await createDirectories(courseDetails, idx);
  fs.writeFile(
    `${DATA_FOLDER}/${courseId}.json`,
    JSON.stringify(courseDetails, null, 2)
  );
}

async function createDirectories(courseDetails, cidx) {
  const coursePath = `${coursesContentAddress}/C${cidx}-${courseDetails.name}`;
  await createDirectory(coursePath);
  courseDetails.sectionList.forEach(async (section, sidx) => {
    const sectionPath = `${coursePath}/C${cidx}S${sidx}-${section.sectionHeader}`;
    await createDirectory(sectionPath);
    section.contentList.forEach(async (content, didx) => {
      if (content.type === FILE_TYPE_FILE) {
        let { contentName, contentBinary } = await getContentBinary(
          content.url,
          content.type
        );
        if (contentName && contentBinary) {
          contentName = `C${cidx}S${sidx}D${didx}-${contentName}`;
          await saveContent(sectionPath, contentName, contentBinary);
        }
      } else if (content.type === FILE_TYPE_FOLDER) {
        const downloadURL = content.url.replace(
          VIEW_ITEM_CODEFILE,
          DOWNLOAD_FOLDER_CODEFILE
        );
        let { contentName, contentBinary } = await getContentBinary(
          downloadURL,
          content.type
        );
        if (contentName && contentBinary) {
          contentName = `C${cidx}S${sidx}D${didx}-${contentName}`;
          await saveContent(sectionPath, contentName, contentBinary);
        }
      } else if (content.type === FILE_TYPE_PAGE) {
        content.pageDetails = (await getPageDetails(content.url)) || [];
      }
    });
  });
}

async function getContentBinary(url, type) {
  //   console.log("URL", url, "Type", type);
  const resp = await getResponse(url, {}, { responseType: "arraybuffer" });
  if (!resp || resp.status != 200) {
    // throw new Error('Unable to Download content from:', url)
    // console.log(resp.status);
    console.log("Unable to download content from URL", url);
    return {};
  }
  const contentName =
    getFileName(resp.headers) || getFileNameFromURL(resp.request._header);
  return { contentName, contentBinary: resp.data };
}

async function getPageDetails(pageUrl) {
  try {
    const resp = await getResponse(pageUrl);
    if (!resp || resp.status !== 200) {
      // throw new Error("Unable to fetch Page details")
      // console.log(resp.status)
      console.log("Unable to fetch Page details", url);
      return [];
    }
    const pageContentList = await parsePageContent(resp.data);
    return pageContentList;
  } catch (e) {
    // console.log(e);
    // console.log(e.stackTrace);
  }
}

async function parsePageContent(contentStr) {
  const links = [];
  const $ = cheerio.load(contentStr);
  const mediaDivs = $("a.mediafallbacklink");
  mediaDivs.each((_, el) => {
    const videoAttr = $(el).attr("href");
    if (videoAttr) {
      links.push(videoAttr);
    }
  });
  return links;
}

// TODO : figure out a way to find the content type.
function getFileName(headers) {
  let contentName;
  if (headers.hasOwnProperty(HEADER_CONTENT_DISPOSITION)) {
    const contentDisposition = parseContentDisposition(
      headers[HEADER_CONTENT_DISPOSITION]
    );
    if (!contentDisposition.hasOwnProperty("filename")) {
      // throw new Error('Incorrect  downloaded')
      console.log("File format inappropriate");
    }
    contentName = contentDisposition.filename;
  }
  return contentName;
}

function getFileNameFromURL(headers) {
  const urlPart = headers.split(" ")[1];
  const path = urlPart.split("?")[0];
  const fileName = path.split("/").pop();
  return decodeURIComponent(fileName);
}

async function clearCourseContent() {
  await cleanAndDeleteDir(coursesContentAddress);
}

module.exports = { downloadContent, clearCourseContent };
