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

A classic routing for uploading would be:

```
s3-revisions --bucket shopping-cart.printstore.io --s3-root-folder development init
```
Then, upload the folder:

```
s3-revisions --bucket bucket-name --s3-root-folder development deploy --git-folder ./ --dist-folder ./dist --invalidate-cloufront-distribution E00000006
```

## Todo
Revision Rollback

## License

Copyright (c) 2016 Piero Maltese

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

