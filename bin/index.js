#! /usr/bin/env node

const yargs = require("yargs");
const loginHelper = require("../helpers/LoginHelper")  

yargs.command({ 
    command: 'login', 
    describe: 'Login into BITS portal', 
    builder: { 
        username: { 
            describe: 'Email / User Name', 
            demandOption: true,
            type: 'string'     
        }, 
        password: {   
            describe: 'Password', 
            demandOption: true, 
            type: 'string'
        } 
    }, 
    handler(argv) { 
        loginHelper.login(argv.username, argv.password)
    } 
}) 

yargs.parse()