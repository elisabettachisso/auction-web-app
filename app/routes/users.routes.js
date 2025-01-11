const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const verifyToken = require('../middlewares/auth.js');
const { upload } = require('../middlewares/utils');

router.get("/users/", async (req, res) => {
    const mysql = await db.connectToDatabase();
    const query = req.query.q ? `%${req.query.q}%` : '%';
    try {
        const [users] = await mysql.query("SELECT * FROM users WHERE username LIKE ?", [query]);
        res.json({users});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Server error while fetching users" });
    }
});

router.get("/users/:id", async (req, res) => {
    const mysql = await db.connectToDatabase();
    try {
        const [user] = await mysql.query("SELECT id, username, name, surname, image FROM users WHERE id = ?", [parseInt(req.params.id)]);
        res.json(user[0]);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Server error while fetching users" });
    }
});

router.get("/whoami", verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    try {
        const [user] = await mysql.query("SELECT id, username, name, surname, image FROM users WHERE id = ?", [req.userId]);
        if (!user || user.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }
        console.log(user[0]);
        res.json(user[0]);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Server error while fetching user" });
    }
    });



module.exports = router;
