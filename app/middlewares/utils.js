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

const updateAuctionStatuses = async (req, res, next) => {
  const mysql = await require('../config/db.js').connectToDatabase();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // I mesi vanno da 0 a 11
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}`;
  
  console.log("Local current date:", formattedDate);

  try {
      const closedUpdate = await mysql.query(
          "UPDATE auctions SET status = 'closed' WHERE end_date < ? AND status != 'closed'",
          [formattedDate]
      );
      console.log("Closed auctions updated:", closedUpdate.affectedRows);

      const openUpdate = await mysql.query(
          "UPDATE auctions SET status = 'open' WHERE end_date > ? AND status != 'open'",
          [formattedDate]
      );
      console.log("Open auctions updated:", openUpdate.affectedRows);

      next();
  } catch (error) {
      console.error("Error updating auction statuses:", error.message);
      res.status(500).json({ msg: "Failed to update auction statuses" });
  }
};

module.exports = { upload, updateAuctionStatuses };