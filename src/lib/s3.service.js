'use strict';

import { default as AWS } from 'aws-sdk';
import { default as s3 } from 's3';
import Promise from 'bluebird';
import { CONSTANTS } from '../constants';
import { default as _ } from 'lodash';
import path from 'path';
import { InvalidMetaJsonError } from '../lib/errors';
import { exec } from 'child_process';
const execAsync = Promise.promisify(exec);

export class S3Service {
  constructor(program, options) {
    this.options = options || {};
    this.program = program;
    this.s3AWS = Promise.promisifyAll(new AWS.S3());
    const _options = {
      s3Client: this.s3
      // more options available. See API docs below.
    };
    this.s3 = Promise.promisifyAll(s3.createClient(_options));
    this.bucket = this.program.bucket;
    this.rootFolder = this.program.s3RootFolder || '';
    this.revisionFolderName = CONSTANTS.REVISION_FOLDERNAME;
    this.revisionFolderPath = path.join(this.rootFolder, this.revisionFolderName);
    this.metaJsonPath = path.join(this.revisionFolderPath, CONSTANTS.META_JSON_FILENAME);
  }

  getMetaJson() {
    return this.s3AWS
        .getObjectAsync({
          Bucket: this.bucket,
          Key: this.metaJsonPath
        })
        .then(data => {
          try {
            return JSON.parse(data.Body.toString());
          }
          catch (err) {
            throw new InvalidMetaJsonError();
          }
        });
  }

  getRevisions() {
    const _this = this;
    let revisions = [];
    let revisionsList = [];

    return this
        .getMetaJson()
        .then(json => {
          revisions = json.revisions;
          revisionsList = _.map(revisions, 'id');
          return revisions;
        });
    /*
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

  createMetaJson(content) {
    content = content || { revisions: [] };
    return this.s3AWS
        .putObjectAsync({
          Bucket: this.bucket,
          Key: this.metaJsonPath,
          Body: JSON.stringify(content, null, 2)
        });
  }


  uploadFolder(src, _dest) {
    const dest = path.join(this.revisionFolderPath, _dest);
    return new Promise((resolve, reject) => {
      return exec(`aws s3 cp --recursive ${src} s3://${this.bucket}/${dest}`, (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        resolve(stdout);
      });
    });
  }

  addRevisionToJson(revisionHash) {
    let pkgVersion;
    try {
      pkgVersion = require(path.join(path.resolve(this.options.gitFolder), 'package.json')).version;
    }
    catch (err) {
      pkgVersion = '';
    }


    return this
        .getMetaJson()
        .then(json => {
          json.revisions.unshift({
            id: revisionHash,
            date: new Date(),
            version: pkgVersion
          });

          return this.createMetaJson(json);
        });
  }

  rotate(revisionHash) {
    const lastPath = path.join(this.revisionFolderPath, CONSTANTS.LAST_REVISION_FOLDERNAME);
    const secondToLastPath = path.join(this.revisionFolderPath, CONSTANTS.SECOND_TO_LAST_REVISION_FOLDERNAME);
    const revisionPath = path.join(this.revisionFolderPath, revisionHash);

    // remove secondToLastFolder
    return this.delete(secondToLastPath)
        // move lastPath to secondToLastPath
        .then(() => {
          return this.move(lastPath, secondToLastPath);
        })
        .then(() => {
          return this.copy(revisionPath, lastPath);
        })
        .then(() => {
        })
        .catch(err => {
          console.log(err);
        });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      this.s3
          .deleteDir({
            Bucket: this.bucket,
            Prefix: path
          })
          .on('end', resolve)
          .on('error', resolve);
    });
  }

  move(src, dest) {
    return new Promise((resolve, reject) => {
      execAsync(`aws s3 mv --recursive s3://${this.bucket}/${src} s3://${this.bucket}/${dest}`)
          .then(() => {
            resolve();
          })
          .catch(err => {
            resolve();
          });
    });
  }

  copy(src, dest) {
    return new Promise((resolve, reject) => {
      execAsync(`aws s3 cp --recursive s3://${this.bucket}/${src} s3://${this.bucket}/${dest}`)
          .then(() => {
            resolve();
          })
          .catch(err => {
            resolve();
          });
    });
  }
}

