const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAIRPNR4IP65IFSBYQ';
const SECRET = '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';

const BUCKET_NAME = 'sanimap1';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'sanimap.png', // File name you want to save as in S3
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile('images/sanimap.png');