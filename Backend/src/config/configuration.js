const yaml   = require('js-yaml');
const fs     = require('fs');
const yargs  = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;

let configFile;
if (argv.config) {
  configFile = argv.config;
} else if (process.env.NODE_ENV === 'production') {
  configFile = 'src/config/config.prod.yaml';
} else {
  configFile = 'src/config/config.local.yaml';
}

const config = yaml.load(
  fs.readFileSync(configFile, 'utf-8')
);

module.exports = { config };
