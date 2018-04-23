#!/usr/bin/env node
const program = require('commander')
const templator = require('./src/templator.js')
const path = require('path')
const { prompt } = require('inquirer')

program
  .version('0.0.1')
  .description('Helper tool for building MicroStrategy visualisations')

program
 .command('init <name> [path]')
 .alias('i')
 .description('Creates a new visualisation from templates')
 .action(function(name, pathName) {
   if (!pathName) {
    pathName = process.cwd()
   }
   const templateDir = path.resolve(__dirname, 'templates')
   templator.templateDirectory(templateDir, pathName, { 'name': name })
 })

 program.parse(process.argv)