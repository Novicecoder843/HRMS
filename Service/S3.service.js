const { S3Client, PutObjectCommand, Bucket$ } = require("@aws-sdk/client-s3");
const { success } = require("zod");
require("dotenv").config();

//S3 client set up
const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * File upload function
 * @param {Object} file - Multer file object
 */

exports.uploadFileToS3 = async (file) => {
  const fileKey = `hrms/doc/${Date.now()}-$`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3client.send(command);

    const url = `https://${process.env.S3_BUCKET_NAME}.s3,${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      success: true,
      url: url,
      key: fileKey,
    };
  } catch (err) {
    console.error("AWS S3 Service Error:", err);
    throw new Error("S3 Upload Failed: " + err.message);
  }
};
