'use strict';

import { S3Service } from '../lib/s3.service';
import { CONSTANTS } from '../constants';
import { default as _ } from 'lodash';
import { InvalidMetaJsonError } from '../lib/errors';
import { execSync } from 'child_process';
import { default as OutputService } from '../lib/output.service';
//const child_process = require('child_process').execSync;


module.exports = function (program) {

  program
      .command('deploy')
      .version('0.0.0')
      //.description('Deploy')
      .option('-g, --git-folder <gitFolder>')
      .option('-d, --dist-folder <distFolder>')
      .action(deployAction);


  function deployAction(cmd, options) {
    let S3Srvc = new S3Service(program);
    const distFolder = cmd.distFolder;
    const gitFolder = cmd.gitFolder || '.';
    const versionHash = getVersionHash(gitFolder);

    OutputService.log(CONSTANTS.LABELS.DEPLOY_START);
    S3Srvc
        .uploadFolder(distFolder, versionHash)
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_FOLDER_UPLOADED);
          return S3Srvc.addRevisionToJson(versionHash);
        })
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_ADDED_REVISION_TO_METAJSON);
          OutputService.log(CONSTANTS.LABELS.DEPLOY_STARTING_FOLDER_ROTATION);
          return S3Srvc.rotate(versionHash)
        })
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_FOLDERS_ROTATED_SUCCESSFULLY);
          OutputService.log(CONSTANTS.LABELS.DEPLOY_END);
        })
  }


  function getVersionHash(gitFolder) {
    return _.trim(execSync('cd ' + gitFolder + '; git rev-parse HEAD').toString());
  }

};
