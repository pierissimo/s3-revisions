'use strict';

import { S3Service } from '../lib/s3.service';
import { CONSTANTS } from '../constants';
import { default as _ } from 'lodash';
import { InvalidMetaJsonError } from '../lib/errors';
import { default as OutputService } from '../lib/output.service';

module.exports = function (program) {

  program
      .command('init')
      .version('0.0.0')
      .description('Init')
      .action(initAction);


  function initAction(cmd, options) {
    let S3Srvc = new S3Service(program);
    OutputService.log(CONSTANTS.LABELS.CHECKING_FOR_INITIALIZED_BUCKET);
    S3Srvc
        .getMetaJson()
        .then(testValidJson)
        .then(() => {
          OutputService.log(CONSTANTS.LABELS.BUCKET_VALID);
        })
        .catch(InvalidMetaJsonError, function () {
          OutputService.log(CONSTANTS.LABELS.BUCKET_NOT_INITIALIZED);
          return createMetaJson();
        })
        .catch(handleError);


    function testValidJson(json) {
      if (!_.isArray(json.revisions)) {
        throw new InvalidMetaJsonError();
      }

      return true;
    }


    function handleError(err) {
      switch (_.get(err, 'cause.code')) {
        case 'NoSuchKey':
          return createMetaJson();
          break;
        default:
          console.error(err);
          break;
      }
    }


    function createMetaJson() {
      OutputService.log(CONSTANTS.LABELS.BUCKET_INITIALIZING);
      return S3Srvc
          .createMetaJson()
          .then(function () {
            OutputService.log(CONSTANTS.LABELS.BUCKET_INITIALIZED);
          });
    }
  }

};
