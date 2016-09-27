'use strict';

export class OutputService {
  constructor(program, options) {
  }

  log(message, force) {
    if (this.checkVerbosity(force)) {
      console.log(`---- ${message}`);
    }
  }

  error(message) {
    console.error('---- ERROR:');
    console.error(message);
  }

  debug(message) {
    if (this.checkVerbosity()) {
      console.info(`==== DEBUG: ${message} `);
    }
  }

  done() {
    if (this.checkVerbosity()) {
      console.log('- done');
      this.sep();
    }
  }

  sep() {
    if (this.checkVerbosity()) {
      console.log('------------------------');
    }
  }

  checkVerbosity(force) {
    if (force) {
      return true;
    }
    return Boolean(process.env.debug);
  }
}

export default new OutputService();

