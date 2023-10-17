#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target, ignoreRoot) {
  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, ignoreRoot ? '' : path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

const BASE_PATH = './dist/c/';

const REQUIRED_COMPONENTS = ['stylesShared'];

const COMPONENT_LIST = fs.readdirSync(BASE_PATH);

// arguments:
const source = yargs.argv.component || yargs.argv.c;
const target = yargs.argv.target || yargs.argv.t;
const copyAll = yargs.argv.all || yargs.argv.a;
const help = yargs.argv.help || yargs.argv.h;
const ignore = yargs.argv.ignore || yargs.argv.i;


function showHelp() {
  console.log(`
  Usage: lwc-library [options]

  Options:
    -c, --component <component>  Component to copy (use --all to copy all components)
    -t, --target <target>        Target path
    -a, --all                    Copy all components
    -h, --help                   output usage information
    -i, --ignore                 Ignore required components
  `);
}

// show help
if (help) {
  showHelp();
  process.exit(0);
}

let sourcePath = '';

if (copyAll) {
  sourcePath = BASE_PATH;
} else if (COMPONENT_LIST.includes(source)) {
  sourcePath = BASE_PATH + source;
} else {
  console.error(`Component "${source}" not found (or use --all option to copy all components)`);
  showHelp();
  process.exit(1);
}

// validate target
if (!target) {
  console.error('Missing target path');
  showHelp();
  process.exit(1);
}

// create target if not exists
if (!fs.existsSync(target)) {
  console.log(`Creating target directory "${target}" ...`);
  fs.mkdirSync(target);
}

// Actually copy here
if (!ignore) {
  REQUIRED_COMPONENTS.forEach(component => {
    const sourcePath = BASE_PATH + component;
    copyFolderRecursiveSync(sourcePath, target);
  });
}
copyFolderRecursiveSync(sourcePath, target, copyAll);

// finished message
const sourceMsg = copyAll ? 'all components' : source;
console.log(`Copied "${sourceMsg}"`);