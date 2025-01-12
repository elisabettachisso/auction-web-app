const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/:id", async (req, res) => {
    const mysql = await db.connectToDatabase();    
    try {
        const [bidDetails] = await mysql.query("SELECT * FROM bids WHERE id = ?", [parseInt(req.params.id)]);
        res.json({bidDetails});
    } catch (error) {
        console.error("Error fetching auction:", error);
        res.status(500).json({ msg: "Server error while fetching auction" });
    }
});

module.exports = router;