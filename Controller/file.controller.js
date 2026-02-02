const s3Service = require("../Service/S3.service");

exports.uploadFile = async (req, res) => {
  try {
    // Check file 
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a file" });
    }

    // Service call 
    const result = await s3Service.uploadFileToS3(req.file);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};