var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

var awsConfig =  {
   "accessKeyId": process.env.AWSAccessKeyId,
   "secretAccessKey": process.env.AWSSecretKey,
   "region": "eu-west-1"
 }

aws.config = awsConfig;

var s3 = new aws.S3({});

module.exports.uploadOffer = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dino-offer-img',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + ".jpg");
    }
  })
});

module.exports.uploadRestaurant = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dino-rest-img',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString + ".jpg");
    }
  })
});
