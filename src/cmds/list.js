'use strict';

import { S3Service } from '../lib/s3.service';
import { CONSTANTS } from '../constants';
import { default as _ } from 'lodash';
import { default as OutputService } from '../lib/output.service';

module.exports = function (program) {

  program
      .command('list')
      .version('0.0.0')
      .description('A commander command')
      .action(listAction);


  function listAction(cmd, options) {
    let S3Srvc = new S3Service(program);

    S3Srvc
        .getRevisions()
        .then((revisions) => {
          OutputService.log('Revision list:');
          _.orderBy(revisions, ['date'], ['asc']).forEach(function (revision) {
            OutputService.log('ID: ' + revision.id);
            OutputService.log('Date: ' + revision.date);
            OutputService.sep();
          });
        });
  }


  function handleError(err) {
    switch (err.cause.code) {
      case 'NoSuchKey':
        console.log(CONSTANTS.LABELS.NO_META_JSON_FILE);
        break;
    }
  }

};
