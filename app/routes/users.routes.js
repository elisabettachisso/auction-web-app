// GET /api/whoami

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db.js");

const verifyToken = (req, res, next) => {
    const token = req.cookies["token"];
    if(!token){
        res.status(403).json({msg: "Autenticazione fallita"});
        return;
    }
    try {
        const decoded = jwt.verify(token, "my cats are better");
        req.userId = decoded.id;
        next();
    } catch (error){
        res.status(401).json({msg: "Unauthorized"});
    }

};

router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
    const mysql = await db.connectToDatabase();
    const user = await mysql.query("SELECT * FROM users WHERE id = ?", [parseInt(req.params.id)]);
    const {id, username, name, surname} = user;
    res.json({id, username, name, surname});
});

module.exports = router;
