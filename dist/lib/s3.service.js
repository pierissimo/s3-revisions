'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.S3Service = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _s = require('s3');

var _s2 = _interopRequireDefault(_s);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _constants = require('../constants');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('../lib/errors');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var execAsync = _bluebird2.default.promisify(_child_process.exec);

var S3Service = exports.S3Service = function () {
  function S3Service(program, options) {
    _classCallCheck(this, S3Service);

    this.options = options || {};
    this.program = program;
    this.s3AWS = _bluebird2.default.promisifyAll(new _awsSdk2.default.S3());
    var options = {
      s3Client: this.s3
      // more options available. See API docs below.
    };
    this.s3 = _bluebird2.default.promisifyAll(_s2.default.createClient(options));
    this.bucket = this.program.bucket;
    this.rootFolder = this.program.s3RootFolder || '';
    this.revisionFolderName = _constants.CONSTANTS.REVISION_FOLDERNAME;
    this.revisionFolderPath = _path2.default.join(this.rootFolder, this.revisionFolderName);
    this.metaJsonPath = _path2.default.join(this.revisionFolderPath, _constants.CONSTANTS.META_JSON_FILENAME);
  }

  _createClass(S3Service, [{
    key: 'getMetaJson',
    value: function getMetaJson() {
      return this.s3AWS.getObjectAsync({
        Bucket: this.bucket,
        Key: this.metaJsonPath
      }).then(function (data) {
        try {
          return JSON.parse(data.Body.toString());
        } catch (err) {
          throw new _errors.InvalidMetaJsonError();
        }
      });
    }
  }, {
    key: 'getRevisions',
    value: function getRevisions() {
      var _this = this;
      var revisions = [];
      var revisionsList = [];

      return this.getMetaJson().then(function (json) {
        revisions = json.revisions;
        revisionsList = _lodash2.default.map(revisions, 'id');
        return revisions;
      }); /*
          .then((data) => {
          let folders = data.Contents;
          return _.chain(folders)
              .orderBy('LastModified', 'desc')
              .map((obj) => {
                return {
                  id: _.trimEnd(obj.Key.replace(this.revisionFolderPath, ''), '/'),
                  date: obj.LastModified
                }
              })
              .filter((folder) => {
                console.log(folder);
                return revisionsList.indexOf(folder.id) > -1;
              })
              .value();
          })*/
    }
  }, {
    key: 'createMetaJson',
    value: function createMetaJson(content) {
      content = content || { revisions: [] };
      return this.s3AWS.putObjectAsync({
        Bucket: this.bucket,
        Key: this.metaJsonPath,
        Body: JSON.stringify(content, null, 2)
      });
    }
  }, {
    key: 'uploadFolder',
    value: function uploadFolder(src, dest) {
      var _this2 = this;

      return new _bluebird2.default(function (resolve, reject) {
        var params = {
          localDir: src,
          deleteRemoved: true,
          s3Params: {
            Bucket: _this2.bucket,
            Prefix: _path2.default.join(_this2.revisionFolderPath, dest)
          }
        };

        var uploader = _this2.s3.uploadDir(params);
        uploader.on('progress', function () {});
        uploader.on('end', function () {
          resolve();
        });
      });
    }
  }, {
    key: 'addRevisionToJson',
    value: function addRevisionToJson(revisionHash) {
      var _this3 = this;

      return this.getMetaJson().then(function (json) {
        json.revisions.unshift({
          id: revisionHash,
          date: new Date()
        });

        return _this3.createMetaJson(json);
      });
    }
  }, {
    key: 'rotate',
    value: function rotate(revisionHash) {
      var _this4 = this;

      var lastPath = _path2.default.join(this.revisionFolderPath, _constants.CONSTANTS.LAST_REVISION_FOLDERNAME);
      var secondToLastPath = _path2.default.join(this.revisionFolderPath, _constants.CONSTANTS.SECOND_TO_LAST_REVISION_FOLDERNAME);
      var revisionPath = _path2.default.join(this.revisionFolderPath, revisionHash);

      //remove secondToLastFolder
      return this.delete(secondToLastPath)
      //move lastPath to secondToLastPath
      .then(function () {
        return _this4.move(lastPath, secondToLastPath);
      }).then(function () {
        return _this4.copy(revisionPath, lastPath);
      }).then(function () {}).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(path) {
      var _this5 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this5.s3.deleteDir({
          Bucket: _this5.bucket,
          Prefix: path
        }).on('end', resolve).on('error', resolve);
      });
    }
  }, {
    key: 'move',
    value: function move(src, dest) {
      var _this6 = this;

      return new _bluebird2.default(function (resolve, reject) {
        execAsync('aws s3 mv --recursive s3://' + _this6.bucket + '/' + src + ' s3://' + _this6.bucket + '/' + dest).then(function () {
          resolve();
        }).catch(function (err) {
          resolve();
        });
      });
    }
  }, {
    key: 'copy',
    value: function copy(src, dest) {
      var _this7 = this;

      return new _bluebird2.default(function (resolve, reject) {
        execAsync('aws s3 cp --recursive s3://' + _this7.bucket + '/' + src + ' s3://' + _this7.bucket + '/' + dest).then(function () {
          resolve();
        }).catch(function (err) {
          resolve();
        });
      });
    }
  }]);

  return S3Service;
}();