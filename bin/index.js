#! /usr/bin/env node

const yargs = require("yargs");
const loginHelper = require("../helpers/LoginHelper")  

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

yargs.parse()