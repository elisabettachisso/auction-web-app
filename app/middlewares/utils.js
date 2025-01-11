const multer = require('multer');
const path = require('path');
const fs = require('fs');


const imagesPath = path.join(__dirname, '../public/images');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

module.exports = { upload };
