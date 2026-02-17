const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
     fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Define Storage
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadDir);
     },
     filename: (req, file, cb) => {
          // Clean filename: profile-123456789.jpg
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, file.fieldname + '-' + uniqueSuffix + ext);
     }
});

// 3. File Filter for JPG/PNG
const fileFilter = (req, file, cb) => {
     const allowedExtensions = /jpeg|jpg|png/;
     const mimetype = allowedExtensions.test(file.mimetype);
     const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

     if (mimetype && extname) {
          return cb(null, true);
     }
     // Reject file with a clear error message
     cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
};

const upload = multer({
     storage: storage,
     limits: { fileSize: 2 * 1024 * 1024 }, // Strictly 2MB
     fileFilter: fileFilter
});

module.exports = upload;