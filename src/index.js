#!/usr/bin/env node
'use strict';

var program = require('commander');

require('autocmdr/lib/logger')(program);
require('autocmdr/lib/loader')(program);
require('autocmdr/lib/completion')(program);
require('autocmdr/lib/package')(program);
require('autocmdr/lib/config')(program);
require('autocmdr/lib/help')(program);

require('./lib/manage-credentials');
//commands
require('./cmds/list.js')(program);
require('./cmds/init.js')(program);
require('./cmds/deploy.js')(program);


program
    .option('-b, --bucket <bucketName>')
    .option('-r, --s3-root-folder [path]')
    .option('-v', '--verbose', increaseVerbosity, 0)
    .parse(process.argv);

if (program.args.length < 1) {
  console.log('No command specified. See \'s3-deploy-fun --help\':');
  program.outputHelp();
  process.exit(1);
}


process.env.debug = program.verbose;

function increaseVerbosity(v, total) {
  return total + 1;
}
