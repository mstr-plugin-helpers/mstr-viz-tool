#!/usr/bin/env node
const program = require('commander')
const templator = require('./src/templator.js')
const path = require('path')

program
 .command('init <name> [path]')
 .action(function(name, pathName) {
   if (!pathName) {
    pathName = process.cwd()
   }
   const templateDir = path.resolve(__dirname, 'templates')
   templator.templateDirectory(templateDir, pathName, { 'name': name })
 })

 program.parse(process.argv)