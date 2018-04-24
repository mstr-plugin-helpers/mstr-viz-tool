#!/usr/bin/env node
const program = require('commander')
const templator = require('./src/templator.js')
const path = require('path')
const { prompt } = require('inquirer')

const initQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter plugin name...'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Enter description...'
  }

]

program
  .version('0.0.1')
  .description('Helper tool for building MicroStrategy visualisations')

program
  .command('init [path]')
  .alias('i')
  .description('Creates a new visualisation from templates')
  .action((pathName) => {
    if (!pathName) {
      pathName = process.cwd()
    }
    prompt(initQuestions).then(answers => {
      const templateDir = path.resolve(__dirname, 'templates')
      templator.templateDirectory(templateDir, pathName, answers)
    })
  })

program.parse(process.argv)
