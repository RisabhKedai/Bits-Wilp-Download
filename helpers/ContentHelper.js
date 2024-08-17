const cheerio = require("cheerio");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
// const PDFMerger = require("pdf-merger-js"); // You may need to install this package for merging PDFs

const {
  createDirectory,
  saveContent,
  cleanAndDeleteDir,
  listFolders,
  findFilesWithExtensions,
} = require("../utils/FSHandler");
const { getResponse } = require("../utils/RequestHandler");
const {
  FILE_TYPE_FILE,
  FILE_TYPE_FOLDER,
  HEADER_CONTENT_DISPOSITION,
  FILE_TYPE_PAGE,
} = require("../constants/ParsingConstants");
const {
  parseContentDisposition,
  questionIntInRange,
} = require("../utils/CommonUtils");
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

async function mergeContent() {
  const folderList = await listFolders(coursesContentAddress);
  if (!folderList?.length) {
    console.log("No courses downloaded.");
    return;
  }
  console.log("Choose a course from the following:");
  for ([idx, folderName] of Object.entries(folderList)) {
    console.log(`${parseInt(idx) + 1} - ${folderName}`);
  }
  let courseNumber = questionIntInRange(
    "Enter the number against the course to download: ",
    1,
    folderList.length
  );
  console.log("Merging PPT for course -- ", folderList[courseNumber - 1]);
  await mergeAndSaveContent(folderList[courseNumber - 1]);
}

async function mergeAndSaveContent(folderName) {
  const folderPath = path.join(coursesContentAddress, folderName);
  const mergeFolderPath = path.join(folderPath, "merge");

  createDirectory(mergeFolderPath);

  const pptFiles = await findFilesWithExtensions(folderPath, [".pptx", ".ppt"]);
  const pdfFiles = await findFilesWithExtensions(folderPath, [".pdf"]);

  if (pptFiles.length > 0) {
    await mergePPTFiles(pptFiles, mergeFolderPath);
  }

  if (pdfFiles.length > 0) {
    await mergePDFFiles(pdfFiles, mergeFolderPath);
  }
}

async function mergePPTFiles(pptFiles, destinationFolder) {
  try {
    // Ensure the destination folder exists
    await fs.mkdir(destinationFolder, { recursive: true });

    for (const filePath of pptFiles) {
      const fileName = path.basename(filePath);
      const newFilePath = path.join(destinationFolder, fileName);
      await fs.copyFile(filePath, newFilePath);
    }
    console.log("All files moved successfully!");
  } catch (error) {
    console.error("Error moving files:", error);
  }
  // console.log(pptFiles);

  // let pptx = new PPTXGenJS();
  // pptx.load(pptFiles[0]);
  // for (let i = 0; i < pptx.slides.length; i++) {
  //   const slide = pptx.slides[i];

  //   // Convert slide to HTML (or SVG)
  //   const slideContent = slide.getHTML();
  //   console.log(slideContent);
  //   // Load slide content into Puppeteer and take a screenshot
  //   // await page.setContent(slideContent);
  //   // await page.screenshot({ path: `${outputDir}/slide-${i + 1}.png` });
  // }

  // // for (const file of pptFiles) {
  // //   // Load slides from the file (this is a simplified example, actual implementation may vary)
  // //   // let slides = await loadSlidesFromFile(file);

  // //   slides.forEach((slide) => {
  // //     pptx.addSlide(slide);
  // //   });
  // // }

  // // pptx
  // //   .writeFile("MergedPresentation.pptx")
  // //   .then(() => console.log("Presentation merged and saved"))
  // //   .catch((err) => console.error("Error merging presentation:", err));
}

async function mergePDFFiles(pdfFiles, destinationFolder) {
  try {
    // Ensure the destination folder exists
    await fs.mkdir(destinationFolder, { recursive: true });

    for (const filePath of pdfFiles) {
      const fileName = path.basename(filePath);
      const newFilePath = path.join(destinationFolder, fileName);
      await fs.copyFile(filePath, newFilePath);
    }
    console.log("All files moved successfully!");
  } catch (error) {
    console.error("Error moving files:", error);
  }
  // const pdfMerger = new PDFMerger();

  // for (const file of pdfFiles) {
  //   pdfMerger.add(file);
  // }

  // await pdfMerger.save(outputPath);
}

async function downloadContent(courseId, idx) {
  const courseString = await fs.readFile(
    `${DATA_FOLDER}/${courseId}.json`,
    "utf-8"
  );
  let courseDetails = JSON.parse(courseString);
  await createDirectories(courseDetails, idx);
  // save updated content
  await fs.writeFile(
    `${DATA_FOLDER}/${courseId}.json`,
    JSON.stringify(courseDetails, null, 2)
  );
}

async function createDirectories(courseDetails, cidx) {
  const coursePath = path.join(
    coursesContentAddress,
    `C${cidx}-${courseDetails.name}`
  );
  await createDirectory(coursePath);

  for (const [sidx, section] of courseDetails.sectionList.entries()) {
    const sectionPath = path.join(
      coursePath,
      `C${cidx}S${sidx}-${section.sectionHeader}`
    );
    await createDirectory(sectionPath);

    for (const [didx, content] of section.contentList.entries()) {
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
        const fileList = await getFileList(content.url);
        for (const file of fileList) {
          let contentName = file.name;
          let { contentBinary } = await getContentBinary(
            file.link,
            FILE_TYPE_FILE
          );
          if (contentName && contentBinary) {
            contentName = `C${cidx}S${sidx}D${didx}-${contentName}`;
            await saveContent(sectionPath, contentName, contentBinary);
          }
        }
        content.fileList = fileList;
      } else if (content.type === FILE_TYPE_PAGE) {
        content.pageDetails = (await getPageDetails(content.url)) || [];
      }
    }
    console.log("Completed Section ", section.sectionHeader);
  }
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
    return pageContentList || [];
  } catch (e) {
    // console.log(e);
    // console.log(e.stackTrace);
  }
}

async function getFileList(folderUrl) {
  try {
    const resp = await getResponse(folderUrl);
    if (!resp || resp.status !== 200) {
      // throw new Error("Unable to fetch Page details")
      // console.log(resp.status)
      console.log("Unable to fetch Folder details", url);
      return [];
    }
    const folderContentList = await parseFolderContent(resp.data);
    return folderContentList || [];
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

async function parseFolderContent(contentStr) {
  const fileList = [];
  const $ = cheerio.load(contentStr);

  $(".fp-filename-icon > a").each((_, element) => {
    const fileData = $(element);
    const href = fileData.attr("href");
    const name = fileData.find("span.fp-filename").text();
    if (href) {
      fileList.push({ link: href, name: name || "" });
    }
  });
  return fileList;
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

module.exports = {
  downloadContent,
  clearCourseContent,
  mergeContent,
};
