'use strict';

var _s = require('../lib/s3.service');

var _cloudfront = require('../lib/cloudfront.service');

var _constants = require('../constants');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _errors = require('../lib/errors');

var _child_process = require('child_process');

var _output = require('../lib/output.service');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const child_process = require('child_process').execSync;

module.exports = function (program) {

  program.command('deploy').version('0.0.0')
  //.description('Deploy')
  .option('-g, --git-folder <gitFolder>').option('-d, --dist-folder <distFolder>').option('-i, --invalidate-cloufront-distribution [cloudFrontDistribution]').action(deployAction);

  function deployAction(cmd, options) {
    var S3Srvc = new _s.S3Service(program);
    var CloudfrontSrvc = new _cloudfront.CloudfrontService(program);

    var distFolder = cmd.distFolder;
    var gitFolder = cmd.gitFolder || '.';
    var versionHash = getVersionHash(gitFolder);

    _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_START);
    S3Srvc.uploadFolder(distFolder, versionHash).then(function () {
      _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_FOLDER_UPLOADED);
      return S3Srvc.addRevisionToJson(versionHash);
    }).then(function () {
      _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_ADDED_REVISION_TO_METAJSON);
      _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_STARTING_FOLDER_ROTATION);
      return S3Srvc.rotate(versionHash);
    }).then(function () {
      if (cmd.invalidateCloufrontDistribution) {
        _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_INVALIDATING_DISTRIBUTION);
        return CloudfrontSrvc.createInvalidation(cmd.invalidateCloufrontDistribution);
      }
    }).then(function () {
      _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_FOLDERS_ROTATED_SUCCESSFULLY);
      _output2.default.log(_constants.CONSTANTS.LABELS.DEPLOY_END);
    });
  }

  function getVersionHash(gitFolder) {
    return _lodash2.default.trim((0, _child_process.execSync)('cd ' + gitFolder + '; git rev-parse HEAD').toString());
  }
};