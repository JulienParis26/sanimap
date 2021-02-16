var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
	accessKeyId: 'AKIAIRPNR4IP65IFSBYQ',
    secretAccessKey: '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',    
    region: 'us-east-2'
});

var app = express(),
    s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sanimap1',
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.array('uploadFile',1), function (req, res, next) {
    res.send("File uploaded successfully to Amazon S3 Server!");
});

app.listen(3300, function () {
    console.log('Amazon s3 file upload app listening on port 3300');
});