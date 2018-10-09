#s3-revisions

## Description

Deploy static UI into Amazon S3 Bucket.
Support versioning via git hash.

## Usage

To install s3-revisions from npm, run:

```
$ npm install -g s3-revisions
```

```s3-revisions --help```

## Example

A classic routine for uploading would be:

```
s3-revisions --bucket bucket-name --s3-root-folder development init
```
Then, upload the folder:

```
s3-revisions --bucket bucket-name --s3-root-folder development deploy --git-folder ./ --dist-folder ./dist --invalidate-cloufront-distribution E00000006
```

if you want to use the package.json version, as the name of the uploader folder, use the -p or --use-package-json-version 

```
s3-revisions --bucket bucket-name --s3-root-folder development deploy --use-package-json-version package.json --dist-folder ./dist --invalidate-cloufront-distribution E00000006
```
## Todo
Revision Rollback

## License

Copyright (c) 2016 Piero Maltese

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

