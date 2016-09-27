'use strict';

var _s = require('../lib/s3.service');

var _constants = require('../constants');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _output = require('../lib/output.service');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (program) {
  program.command('list').version('0.0.0').description('A commander command').action(listAction);

  function listAction(cmd, options) {
    var S3Srvc = new _s.S3Service(program);

    S3Srvc.getRevisions().then(function (revisions) {
      _output2.default.log('Revision list:');
      _lodash2.default.orderBy(revisions, ['date'], ['asc']).forEach(function (revision) {
        _output2.default.log('ID: ' + revision.id);
        _output2.default.log('Date: ' + revision.date);
        _output2.default.sep();
      });
    });
  }

  function handleError(err) {
    switch (err.cause.code) {
      case 'NoSuchKey':
        console.log(_constants.CONSTANTS.LABELS.NO_META_JSON_FILE);
        break;
    }
  }
};