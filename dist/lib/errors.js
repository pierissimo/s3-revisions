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

exports.InvalidMetaJsonError = InvalidMetaJsonError;