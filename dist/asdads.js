#!/usr/bin/env node

'use strict';

var program = require('commander');

require('autocmdr/lib/logger')(program);
require('autocmdr/lib/loader')(program);
require('autocmdr/lib/completion')(program);
require('autocmdr/lib/package')(program);
require('autocmdr/lib/config')(program);
require('autocmdr/lib/help')(program);

//commands
require('./cmds/list.js')(program);

program.parse(process.argv);

if (program.args.length < 1) {
  console.log('No command specified. See \'s3-deploy-fun --help\':');
  program.outputHelp();
  process.exit(1);
}
