const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const { username,  password, name, surname } = req.body;
        if (!username || !password || !name || !surname) {
            return res.status(400).json({ msg: 'All fields are required' });
        }
        const mysql = await db.connectToDatabase();
        const [user] = await mysql.query("SELECT * FROM users WHERE username = ?", [username])
        if (user.length > 0) {
            return res.status(409).json({ msg: 'User already existing' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await mysql.query('INSERT INTO users (username, password, name, surname) VALUES (?, ?, ?, ?)', [username, hashedPassword, name, surname]);
        res.status(201).json({
            id: result.insertId,
            username,
            name,
            surname,
            msg: 'User created successfully' 
        });
        
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});      

router.post('/signin', async (req, res) => {
    try {
        const { username,  password } = req.body;
        const mysql = await db.connectToDatabase();
        const [users] = await mysql.query("SELECT * FROM users WHERE username = ?", [username]) 
        console.log(users);
        if (users.length === 0) {
            return res.status(401).json({ msg: 'Invalid username or password' });
        }
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Invalid username or password' });
        } else {
            const data = { id: user.id };
            const token = jwt.sign(data, process.env.JWT_SECRET, {
                expiresIn: 86400,
            });
            res.cookie('token', token, {httpOnly: true});
            await mysql.query("INSERT INTO logs (user_id, action) VALUES (?, ?)", [user.id, 'User signed in']);
            res.status(200).json({ 
                msg: 'Login successful!',
                redirectUrl: '/home.html',
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});

module.exports = router;

