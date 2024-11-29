const fs = require("fs");
const moment = require("moment");
const { getComboValue } = require("../model/Combo");
const folderPublic = process.env.ROOT_FOLDER + "/";
const templateFolder = "template/";

const DeleteFile = async (file) => {
  if (fs.existsSync(folderPublic + file) && file != "" && file != null) {
    fs.unlinkSync(folderPublic + file);
  }
};

const MoveFile = async (file, destDir) => {
  if (!fs.existsSync(folderPublic + destDir)) {
    fs.mkdirSync(folderPublic + destDir);
  }
  if (fs.existsSync(folderPublic + file)) {
    const destFile = file.replace("files", destDir);
    fs.copyFileSync(folderPublic + file, folderPublic + destFile);
    fs.unlinkSync(folderPublic + file);
  }
};

const CreateNewFolder = (folderName) => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
};

const DeleteFolder = (folderName) => {
  if (fs.existsSync(folderPublic + folderName)) {
    // fs.rmdirSync(folderName, {recursive: true}) // rmdir is deprecated
    fs.rmSync(folderPublic + folderName, { recursive: true }); // rmdir is deprecated
  }
};

const SaveFile = (folderName, fileName, buffer) => {
  CreateNewFolder(folderPublic + folderName);
  fs.writeFileSync(`${folderPublic}${folderName}${fileName}`, buffer);
  // console.log(`${folderPublic}${folderName}${fileName}`)
};

const SaveFile2 = (folderName, fileName, buffer) => {
  CreateNewFolder(folderName);
  fs.writeFileSync(`${folderName}/${fileName}`, buffer);
};

const GetFileBuffer = (path) => {
  if (fs.existsSync(folderPublic + path)) {
    return fs.readFileSync(folderPublic + path);
  } else {
    return null;
  }
};

const GetFileBufferByManualPath = (path) => {
  if (fs.existsSync(templateFolder + path)) {
    return fs.readFileSync(templateFolder + path);
  } else {
    return null;
  }
};

module.exports = {
  DeleteFile,
  MoveFile,
  CreateNewFolder,
  DeleteFolder,
  SaveFile,
  GetFileBuffer,
  SaveFile2,
  GetFileBufferByManualPath,
};
