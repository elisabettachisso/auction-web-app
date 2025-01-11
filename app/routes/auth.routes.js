const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { username,  password, name, surname } = req.body;
        const mysql = await db.connectToDatabase();
        const [user] = await mysql.query("SELECT * FROM users WHERE username = ?", [username]) 
        console.log(user);
        if (user.length > 0) {
            return res.status(409).json({ msg: "User already existing" });
        } else {
            const [result] = await mysql.query('INSERT INTO users (username, password, name, surname) VALUES (?, ?, ?, ?)', [username, password, name, surname]);
            res.status(201).json({
                id: result.insertId,
                username,
                name,
                surname,
                msg: "User created successfully" 
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Error" });
    }
});
        


router.post("/signin", async (req, res) => {
    try {
        const { username,  password } = req.body;
        const mysql = await db.connectToDatabase();
        const [users] = await mysql.query("SELECT * FROM users WHERE username = ?", [username]) 
        console.log(users);
        if (users.length === 0) {
            res.status(404).json({ msg: "Invalid Username" });
        } 
        else {
            const user = users[0];
            if (user.password === password && user.username === username){
                const data = { id: user.id };
                const token = jwt.sign(data, process.env.JWT_SECRET, {
                    expiresIn: 86400,
                });
                res.cookie("token", token, {httpOnly: true});
                res.status(201).json({ 
                    msg: "Login successful!",
                    redirectUrl: "/home.html",
                });
            }
            else {
                res.status(401).json({ msg: "Wrong username or password"})
            }
            
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Error" });
    }
});

module.exports = router;

