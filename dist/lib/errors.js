'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function InvalidMetaJsonError(message) {
  this.name = 'InvalidMetaJsonError';
  this.message = message || '';
  this.stack = new Error().stack;
  this.status = 404;
}
InvalidMetaJsonError.prototype = Object.create(Error.prototype);
InvalidMetaJsonError.prototype.constructor = InvalidMetaJsonError;

function CloufrontInvalidationError(message) {
  this.name = 'CloufrontInvalidationError';
  this.message = message || '';
  this.stack = new Error().stack;
  this.status = 500;
}
CloufrontInvalidationError.prototype = Object.create(Error.prototype);
CloufrontInvalidationError.prototype.constructor = CloufrontInvalidationError;

exports.InvalidMetaJsonError = InvalidMetaJsonError;
exports.CloufrontInvalidationError = CloufrontInvalidationError;