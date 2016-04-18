'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudfrontService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _constants = require('../constants');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('../lib/errors');

var _output = require('../lib/output.service');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CloudfrontService = exports.CloudfrontService = function () {
  function CloudfrontService(program, options) {
    _classCallCheck(this, CloudfrontService);

    this.options = options || {};
    this.program = program;
    this.cloudfront = _bluebird2.default.promisifyAll(new _awsSdk2.default.CloudFront());

    this.rootFolder = this.program.rootFolder || '';
    this.revisionFolderName = _constants.CONSTANTS.REVISION_FOLDERNAME;
    this.lastRevisionFolderPath = _path2.default.join(this.rootFolder, this.revisionFolderName, _constants.CONSTANTS.LAST_REVISION_FOLDERNAME);
  }

  _createClass(CloudfrontService, [{
    key: 'createInvalidation',
    value: function createInvalidation(distributionId) {
      var _this = this;

      return new _bluebird2.default(function (resolve, reject) {
        var params = {
          DistributionId: distributionId, /* required */
          InvalidationBatch: {
            /* required */
            CallerReference: new Date().toString(), /* required */
            Paths: {
              /* required */
              Quantity: 0, /* required */
              Items: [_this.lastRevisionFolderPath]
            }
          }
        };

        return _this.cloudfront.createInvalidationAsync(params).then(resolve).catch(function (err) {
          _output2.default.error(_constants.CONSTANTS.LABELS.DEPLOY_CLOUDFRONT_INVALIDATION_ERROR);
          resolve();
        });
      });
    }
  }]);

  return CloudfrontService;
}();