const path = require("path");
const fs = require("fs/promises");
const {
  parseContentDisposition,
  getFileExtension,
  unzipBufferToFolder,
  sanitizePath,
} = require("./CommonUtils");

async function createDirectory(path) {
  try {
    await fs.mkdir(sanitizePath(path), { recursive: true });
  } catch (e) {
    if (e.code !== "EEXIST") {
      // throw e
      console.log("Error creating directory", e.code);
    }
  }
}

async function checkDirectory(path) {
  try {
    const stats = await fs.stat(path);
    if (stats.isDirectory()) {
      return true;
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    } else {
      console.error("Error checking directory:", err);
      // throw err
    }
  }
}

async function saveContent(folderPath, contentName, contentBiary) {
  switch (getFileExtension(contentName)) {
    case "zip":
      unzipBufferToFolder(Buffer.from(contentBiary), folderPath);
      break;
    default:
      const contentNamePath = path.join(folderPath, contentName);
      await createDirectory(folderPath);
      contentNamePath = sanitizePath(contentNamePath);
      await fs.writeFile(contentNamePath, Buffer.from(contentBiary), "binary");
      break;
  }
}

async function cleanAndDeleteDir(dir) {
  if (checkDirectory(dir)) {
    fs.rm(dir, { recursive: true, force: true }, (err) => {
      if (err) {
        // throw err;
        console.log("Error cleaning login and dowloaded data");
      }
    });
  }
}

async function listFolders(directoryPath) {
  try {
    const items =
      (await fs.readdir(directoryPath, { withFileTypes: true })) || [];

    const folders = items
      .filter((item) => item.isDirectory())
      .map((folder) => folder.name);
    return folders;
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}
async function findFilesWithExtensions(folderPath, extensions) {
  let filesWithExtensions = [];

  async function findFiles(folder) {
    const files = await fs.readdir(folder);
    for (const file of files) {
      const fullPath = path.join(folder, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await findFiles(fullPath); // Recursively search in subfolders
      } else {
        if (extensions.includes(path.extname(file).toLowerCase())) {
          filesWithExtensions.push(fullPath);
        }
      }
    }
  }

  await findFiles(folderPath);
  return filesWithExtensions;
}

module.exports = {
  createDirectory,
  saveContent,
  checkDirectory,
  cleanAndDeleteDir,
  listFolders,
  findFilesWithExtensions,
};
