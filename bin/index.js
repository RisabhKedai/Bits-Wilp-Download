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