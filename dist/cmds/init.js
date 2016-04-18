'use strict';

var _s = require('../lib/s3.service');

var _constants = require('../constants');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _errors = require('../lib/errors');

var _output = require('../lib/output.service');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (program) {

  program.command('init').version('0.0.0').description('Init').action(initAction);

  function initAction(cmd, options) {
    var S3Srvc = new _s.S3Service(program);
    _output2.default.log(_constants.CONSTANTS.LABELS.CHECKING_FOR_INITIALIZED_BUCKET);
    S3Srvc.getMetaJson().then(testValidJson).then(function () {
      _output2.default.log(_constants.CONSTANTS.LABELS.BUCKET_VALID);
    }).catch(_errors.InvalidMetaJsonError, function () {
      _output2.default.log(_constants.CONSTANTS.LABELS.BUCKET_NOT_INITIALIZED);
      return createMetaJson();
    }).catch(handleError);

    function testValidJson(json) {
      if (!_lodash2.default.isArray(json.revisions)) {
        throw new _errors.InvalidMetaJsonError();
      }

      return true;
    }

    function handleError(err) {
      switch (_lodash2.default.get(err, 'cause.code')) {
        case 'NoSuchKey':
          return createMetaJson();
          break;
      }
    }

    function createMetaJson() {
      _output2.default.log(_constants.CONSTANTS.LABELS.BUCKET_INITIALIZING);
      return S3Srvc.createMetaJson().then(function () {
        _output2.default.log(_constants.CONSTANTS.LABELS.BUCKET_INITIALIZED);
      });
    }
  }
};