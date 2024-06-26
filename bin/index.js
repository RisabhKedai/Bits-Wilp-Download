#! /usr/bin/env node

const yargs = require("yargs");
const loginHelper = require("../helpers/LoginHelper")  
const courseHelper = require("../helpers/CoursesHelper") 

yargs.command({ 
    command: 'login  <username> <password>', 
    describe: 'Login into BITS portal', 
    builder: { 
        username: { 
            describe: 'Email / User Name', 
            demandOption: true,
            type: 'string',
            positional: true
        }, 
        password: {   
            describe: 'Password', 
            demandOption: true, 
            type: 'string',
            positional: true
        } 
    }, 
    handler(argv) {
        loginHelper.login(argv.username, argv.password)
    } 
}) 

yargs.command({
    command: 'course',
    describe: 'Manage courses',
    builder: (yargs) => {
        // Define the get subcommand
        yargs.command({
            command: 'get <course_id>',
            describe: 'Download a specific course by ID',
            handler: (argv) => {
                courseHelper.downloadCourse(argv.course_id);
            }
        });

        // Define the list subcommand
        yargs.command({
            command: 'list',
            describe: 'Get a list of courses',
            handler: () => {
                courseHelper.listCourses();
            }
        });
    },
    handler: (argv) => {
        if (argv._.length === 1) {
            yargs.showHelp();
        }
    }
})

yargs.command({
    command: 'download <course_code>',
    describe: 'Download the course with the mentioed code id',
    builder: {
        course_code : {
            describe: 'Course code. Ex:- SESAPZG685',
            demandOption: true,
            type: 'string',
            positional: true
        }
    },
    handler(argv) { 
        courseHelper.courseDownload(argv.course_id)
    } 
})

yargs.parse()