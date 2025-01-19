const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const { verifyToken } = require('../middlewares/middlewares.js');

router.get('/users/', async (req, res) => {
    const mysql = await db.connectToDatabase();
    const query = req.query.q ? `%${req.query.q}%` : '%';
    try {
        const [users] = await mysql.query("SELECT * FROM users WHERE username LIKE ?", [query]);
        res.json({users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
});

router.get('/users/:id', async (req, res) => {
    const mysql = await db.connectToDatabase();
    try {
        const userId = parseInt(req.params.id);
        const [user] = await mysql.query("SELECT id, username, name, surname, image FROM users WHERE id = ?", [userId]);
        if (user.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const [userCreatedAuctions] = await mysql.query("SELECT DISTINCT user_id, user_username, user_name, user_surname, user_image, auction_id, auction_title, auction_description, start_price, current_price, end_date, status, is_deleted, auction_image, winner_id, winner_name, winner_surname, winner_username, winner_image FROM v_auction_details WHERE user_id = ?", [userId]);
        const [userWonAuctions] = await mysql.query("SELECT * FROM v_auction_details WHERE is_winning_bid = 1 and status = 'closed' and winner_id = ?", [userId]);
        res.json({
            user: user[0],
            created_auctions: userCreatedAuctions,
            won_auctions: userWonAuctions,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
});

router.get('/whoami', verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    try {
        const [user] = await mysql.query("SELECT id, username, name, surname, image FROM users WHERE id = ?", [req.userId]);
        if (!user || user.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        console.log(user[0]);
        res.json(user[0]);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ msg: 'Server error while fetching user' });
    }
    });



module.exports = router;
