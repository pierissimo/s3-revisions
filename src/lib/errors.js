'use strict';


function InvalidMetaJsonError(message) {
  this.name = 'InvalidMetaJsonError';
  this.message = message || '';
  this.stack = (new Error()).stack;
  this.status = 404;
}
InvalidMetaJsonError.prototype = Object.create(Error.prototype);
InvalidMetaJsonError.prototype.constructor = InvalidMetaJsonError;

export { InvalidMetaJsonError };
