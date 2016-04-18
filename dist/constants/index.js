'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CONSTANTS = exports.CONSTANTS = {
  REVISION_FOLDERNAME: 'revisions/',
  META_JSON_FILENAME: 'meta.json',
  LAST_REVISION_FOLDERNAME: 'last',
  SECOND_TO_LAST_REVISION_FOLDERNAME: 'secondToLast',

  LABELS: {
    NO_META_JSON_FILE: 'meta.json file seems not to exists. You will need to create one.',

    CHECKING_FOR_INITIALIZED_BUCKET: 'Checking if bucket has been already initialized',
    BUCKET_NOT_INITIALIZED: 'The bucket seems to be not inizialized',
    BUCKET_INITIALIZING: 'Initializing the bucket',
    BUCKET_INITIALIZED: 'Initializing the bucket',
    BUCKET_VALID: 'Valid bucket',

    DEPLOY_START: 'Start deploy',
    DEPLOY_FOLDER_UPLOADED: 'Folder uploaded',

    DEPLOY_ADDED_REVISION_TO_METAJSON: 'meta.json File updated',
    DEPLOY_STARTING_FOLDER_ROTATION: 'Handle Folders rotation...',
    DEPLOY_FOLDERS_ROTATED_SUCCESSFULLY: 'Folders rotated successfully',
    DEPLOY_END: 'Deploy finish'
  }
};