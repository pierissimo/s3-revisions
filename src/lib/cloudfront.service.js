'use strict';

import { default as AWS } from 'aws-sdk';
import Promise from 'bluebird';
import { CONSTANTS } from '../constants';
import path from 'path';
import { CloufrontInvalidationError } from '../lib/errors';
import { default as OutputService } from '../lib/output.service';


export class CloudfrontService {
  constructor(program, options) {
    this.options = options || {};
    this.program = program;
    this.cloudfront = Promise.promisifyAll(new AWS.CloudFront());

    this.rootFolder = this.program.s3RootFolder || '';
    this.revisionFolderName = CONSTANTS.REVISION_FOLDERNAME;
    this.lastRevisionFolderPath = path.join(this.rootFolder, this.revisionFolderName, CONSTANTS.LAST_REVISION_FOLDERNAME);
  }

  createInvalidation(distributionId) {
    return new Promise((resolve, reject) => {
      var params = {
        DistributionId: distributionId, /* required */
        InvalidationBatch: {
          /* required */
          CallerReference: new Date().toString(), /* required */
          Paths: {
            /* required */
            Quantity: 0, /* required */
            Items: [
              path.join(this.lastRevisionFolderPath, '*')
            ]
          }
        }
      };

      return this.cloudfront
          .createInvalidationAsync(params)
          .then(resolve)
          .catch((err) => {
            OutputService.error(CONSTANTS.LABELS.DEPLOY_CLOUDFRONT_INVALIDATION_ERROR);
            resolve();
          });
    });
  }
}




