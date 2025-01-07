
// GET
// /api/auctions/:id/bids
// POST
// /api/auctions/:id/bids

// GET
// /api/bids/:id

const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const verifyToken = require('../middlewares/auth.js');

router.get("/", async (req, res) => {
    const mysql = await db.connectToDatabase();
    const query = req.query.q ? `%${req.query.q}%` : '%';
    try {
        const [auctions] = await mysql.query("SELECT * FROM auctions WHERE is_deleted = 0 AND title LIKE ?", [query]);
        res.json({auctions});
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({ msg: "Server error while fetching auctions" });
    }
});

router.post("/", verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const { title, description, start_price, current_price, end_date, user_id, status, icon, image } = req.body;

    try {
        const [result] = await mysql.query("INSERT INTO auctions (title, description, start_price, current_price, end_date, user_id, icon, image ) VALUES (?, ?, ?, ?, ?, ?, ?, ? )", [title, description, start_price, current_price, end_date, user_id, status, icon, image]);
        res.status(201).json({
            id: result.insertId,
            title,
            msg: "Auction created successfully" 
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Error" });
    }
});

router.get("/:id", async (req, res) => {
    const mysql = await db.connectToDatabase();    
    try {
        const [auctions] = await mysql.query("SELECT * FROM auctions WHERE id = ?", [parseInt(req.params.id)]);
        res.json({auctions});
    } catch (error) {
        console.error("Error fetching auction:", error);
        res.status(500).json({ msg: "Server error while fetching auction" });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const { title, description, start_price, current_price, end_date, icon, image } = req.body;
    const auctionId = req.params.id;
    const userId = req.userId;
    console.log(userId);
    try {
        const [auction] = await mysql.query("SELECT user_id FROM auctions WHERE id = ?", [auctionId]);

        if (!auction || auction.length === 0) {
            return res.status(404).json({ msg: "Auction not found" });
        }

        if (auction[0].user_id !== userId) {
            return res.status(403).json({ msg: "You are not authorized to update this auction" });
        }

        const query = `UPDATE auctions SET title = ?, description = ?, start_price = ?, current_price = ?, end_date = ?, icon = ?, image = ? WHERE id = ?`;
        
        [result] = await mysql.query(query, [title, description, start_price, current_price, end_date, icon, image, auctionId]);
        
        res.status(200).json({
            msg: "Auction updated successfully",
            updatedFields: { title, description, start_price, current_price, end_date, icon, image }
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Error" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const auctionId = req.params.id;
    const userId = req.userId;
    console.log(userId);
    try {
        const [auction] = await mysql.query("SELECT user_id FROM auctions WHERE id = ?", [auctionId]);

        if (!auction || auction.length === 0) {
            return res.status(404).json({ msg: "Auction not found" });
        }

        if (auction[0].user_id !== userId) {
            return res.status(403).json({ msg: "You are not authorized to delete this auction" });
        }

        const query = `UPDATE auctions SET is_deleted = 1 WHERE id = ?`;
        
        [result] = await mysql.query(query, [auctionId]);
        
        res.status(200).json({
            msg: "Auction deleted successfully"
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Error" });
    }
});

router.get("/:id", (req, res) => {
    res.send("Auction routes working!");
});

module.exports = router;