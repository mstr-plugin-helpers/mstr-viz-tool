const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

Handlebars.registerHelper('lower', (paramString) => {
  return new Handlebars.SafeString(paramString.toLowerCase())
})

function getTemplates (templateDir) {
  const baseDir = path.normalize(templateDir)
  let templates = []
  let directories = []
  let directoriesToScan = [baseDir]
  while (directoriesToScan.length >= 1) {
    const scanDir = directoriesToScan.shift()
    const dirContents = fs.readdirSync(scanDir)
    dirContents.forEach((file) => {
      const pathLike = path.resolve(scanDir, file)
      const relPath = path.relative(templateDir, pathLike)
      const stats = fs.lstatSync(pathLike)
      if (stats.isDirectory()) {
        directoriesToScan.push(pathLike)
        directories.push(
          relPath
        )
      } else {
        templates.push({
          relPath: relPath,
          file: pathLike
        })
      }
    })
  }
  return {
    templates: templates,
    directories: directories
  }
}

function templateToFile (templatePath, outFile, props) {
  const tmplFile = fs.readFileSync(templatePath)
  const tmplScript = Handlebars.compile(tmplFile.toString())
  fs.writeFileSync(outFile, tmplScript(props))
}

function createOutputDir (outputDir) {
  const normOutputDir = path.normalize(outputDir)
  if (!fs.existsSync(normOutputDir)) {
    fs.mkdirSync(normOutputDir)
  }
}

function substituteName (name, variables) {
  const nameRegex = new RegExp('{{([^{]+)}}', 'g')
  return name.replace(nameRegex, function (_unused, varName) {
    return variables[varName]
  })
}

module.exports.templateDirectory = function (templateDir, outputDir, context) {
  createOutputDir(outputDir)
  const templateData = getTemplates(templateDir)
  templateData.directories.forEach(function (dirRelName) {
    dirRelName = substituteName(dirRelName, context)
    createOutputDir(path.resolve(outputDir, dirRelName))
  })
  templateData.templates.forEach((fileEntry) => {
    let outputFileName = path.resolve(outputDir, fileEntry.relPath)
    let template = false
    if (outputFileName.slice(-4) === '.hbs') {
      outputFileName = outputFileName.slice(0, -4)
      template = true
    }
    outputFileName = substituteName(outputFileName, context)
    if (template === true) {
      templateToFile(fileEntry.file, outputFileName, context)
    } else {
      fs.copyFileSync(fileEntry.file, outputFileName)
    }
  })
}
