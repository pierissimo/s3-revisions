'use strict';

import { S3Service } from '../lib/s3.service';
import { CloudfrontService } from '../lib/cloudfront.service';
import { CONSTANTS } from '../constants';
import { default as _ } from 'lodash';
import { InvalidMetaJsonError, CloufrontInvalidationError } from '../lib/errors';
import { execSync } from 'child_process';
import { default as OutputService } from '../lib/output.service';
// const child_process = require('child_process').execSync;


module.exports = function (program) {
  program
      .command('deploy')
      .version('0.1.1')
      // .description('Deploy')
      .option('-g, --git-folder <gitFolder>')
      .option('-d, --dist-folder <distFolder>')
      .option('-p, --use-package-json-version <value>')
      .option('-i, --invalidate-cloufront-distribution [cloudFrontDistribution]')
      .action(deployAction);


  function deployAction(cmd, options) {
    const distFolder = cmd.distFolder;
    const gitFolder = cmd.gitFolder;
    const usePackageJsonVersion = cmd.usePackageJsonVersion;
    let folderName;

    switch (true) {
      case !_.isUndefined(gitFolder) && !_.isUndefined(usePackageJsonVersion):
        throw new Error('-g and -p options cannot be used together');
        break;
      case !_.isUndefined(gitFolder):
        folderName = getGitVersionHash(gitFolder);
        break;
      case !_.isUndefined(usePackageJsonVersion):
        folderName = getPackageJsonVersion(usePackageJsonVersion);
        break;
    }

    const S3Srvc = new S3Service(program, { gitFolder });
    const CloudfrontSrvc = new CloudfrontService(program);

    setTimeout(() => {
      OutputService.log(CONSTANTS.LABELS.DEPLOY_START);
    }, 1);
    S3Srvc
        .uploadFolder(distFolder, folderName)
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_FOLDER_UPLOADED);
          return S3Srvc.addRevisionToJson(folderName);
        })
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_ADDED_REVISION_TO_METAJSON);
          OutputService.log(CONSTANTS.LABELS.DEPLOY_STARTING_FOLDER_ROTATION);
          return S3Srvc.rotate(folderName);
        })
        .then(() => {
          if (cmd.invalidateCloufrontDistribution) {
            OutputService.log(CONSTANTS.LABELS.DEPLOY_INVALIDATING_DISTRIBUTION);
            return CloudfrontSrvc.createInvalidation(cmd.invalidateCloufrontDistribution);
          }
        })
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.DEPLOY_FOLDERS_ROTATED_SUCCESSFULLY);
          OutputService.log(CONSTANTS.LABELS.DEPLOY_END);
        });
  }

  function getGitVersionHash(gitFolder) {
    return _.trim(execSync('cd ' + gitFolder + '; git rev-parse HEAD').toString());
  }

  function getPackageJsonVersion(packageJson) {
    let _packageJsonPath = packageJson;
    if (packageJson.charAt(0) !== '/') {
      _packageJsonPath = process.cwd() + '/' + _packageJsonPath;
    }

    const packageJsonObj = require(_packageJsonPath);
    if (!packageJsonObj.version) {
      throw new Error('Version property not set in package.json file');
    }

    return packageJsonObj.version;
  }
};
