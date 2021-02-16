const AWS = require('aws-sdk');

const ID = 'AKIAIRPNR4IP65IFSBYQ';
const SECRET = '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';

const BUCKET_NAME = 'sanimap1';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "us-east-2"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});