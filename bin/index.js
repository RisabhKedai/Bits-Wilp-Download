#! /usr/bin/env node

const yargs = require("yargs");
const loginHelper = require("../helpers/LoginHelper");
const courseHelper = require("../helpers/CoursesHelper");
const contentHelper = require("../helpers/ContentHelper");

yargs.command({
  command: "login  <username> <password>",
  describe: "Login into BITS portal",
  builder: {
    username: {
      describe: "Email / User Name",
      demandOption: true,
      type: "string",
      positional: true,
    },
    password: {
      describe: "Password",
      demandOption: true,
      type: "string",
      positional: true,
    },
  },
  handler(argv) {
    loginHelper.login(argv.username, argv.password);
  },
});

yargs.command({
  command: "course",
  describe: "Manage courses",
  builder: (yargs) => {
    // // Define the get subcommand
    // yargs.command({
    //     command: 'get <course_id>',
    //     describe: 'Download a specific course by ID',
    //     handler: (argv) => {
    //         courseHelper.downloadCourse(argv.course_id);
    //     }
    // });

    // Define the list subcommand
    yargs.command({
      command: "list",
      describe: "Get a list of courses",
      handler: () => {
        courseHelper.listCourses();
      },
    });

    // Trigger Download for a course
    yargs.command({
      command: "download",
      describe: "Select a course from list to download",
      builder: (yargs) => {
        yargs.option("--all", {
          alias: "-a",
          type: "boolean",
          description: "Download all courses",
          default: false,
        });
      },
      handler: (argv) => {
        if (argv.all) {
          courseHelper.downloadAllCourses();
        } else {
          courseHelper.downloadSingleCourse();
        }
      },
    });

    // Merge all the PPTs in a specified course
    yargs.command({
      command: "merge-ppt",
      describe: "Select a course from list to merge PPT for",
      handler: (argv) => {
        contentHelper.mergePPT();
      },
    });
  },
  handler: (argv) => {
    if (argv._.length === 1) {
      yargs.showHelp();
    }
  },
});

// yargs.command({
//     command: 'download <course_code>',
//     describe: 'Download the course with the mentioed code id',
//     builder: {
//         course_code : {
//             describe: 'Course code. Ex:- SESAPZG685',
//             demandOption: true,
//             type: 'string',
//             positional: true
//         }
//     },
//     handler(argv) {
//         courseHelper.courseDownload(argv.course_code)
//     }
// })

yargs.command({
  command: "clean",
  describe: "Clean all the data created",
  builder: {},
  handler: (argv) => {
    courseHelper.clearCourseData();
    contentHelper.clearCourseContent();
  },
});

yargs.parse();
