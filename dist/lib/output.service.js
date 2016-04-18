'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OutputService = exports.OutputService = function () {
  function OutputService(program, options) {
    _classCallCheck(this, OutputService);
  }

  _createClass(OutputService, [{
    key: 'log',
    value: function log(message, force) {
      if (this.checkVerbosity(force)) {
        console.log('---- ' + message);
      }
    }
  }, {
    key: 'debug',
    value: function debug(message) {
      if (this.checkVerbosity()) {
        console.info('==== DEBUG: ' + message + ' ');
      }
    }
  }, {
    key: 'done',
    value: function done() {
      if (this.checkVerbosity()) {
        console.log('- done');
        this.sep();
      }
    }
  }, {
    key: 'sep',
    value: function sep() {
      if (this.checkVerbosity()) {
        console.log('------------------------');
      }
    }
  }, {
    key: 'checkVerbosity',
    value: function checkVerbosity(force) {
      if (force) {
        return true;
      }
      return Boolean(process.env.debug);
    }
  }]);

  return OutputService;
}();

exports.default = new OutputService();