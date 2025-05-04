const yaml = require('js-yaml');
const fs   = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


let configFile = 'src/config/config.local.yaml';

const argv = yargs(hideBin(process.argv)).argv;
if (argv.config) {
  
  configFile = argv.config;
}

const config = yaml.load(
  fs.readFileSync(configFile, 'utf-8')
);

module.exports = { config };
