const db = require('../config/db.js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const imagesPath = path.join(__dirname, '../public/static/images');


const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {       
        console.log('Token missing or not provided'); 
        return res.status(403).json({ msg: 'Failed Authentication' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

const updateAuctionStatuses = async (req, res, next) => {
  const mysql = await db.connectToDatabase();
  const currentDate = new Date();
  console.log('Local current date:', currentDate);

  try {
      await mysql.query(
          "UPDATE auctions SET status = 'closed' WHERE end_date < ? AND status != 'closed' AND is_deleted = 0", [currentDate]
      );

      await mysql.query("UPDATE auctions SET status = 'open' WHERE end_date > ? AND status != 'open' AND is_deleted = 0", [currentDate]
      );

      next();
  } catch (error) {
      console.error('Error updating auction statuses:', error.message);
      res.status(500).json({ msg: 'Failed to update auction statuses' });
  }
};

module.exports = { verifyToken, upload, updateAuctionStatuses };