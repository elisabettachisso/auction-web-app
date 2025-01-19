const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const { verifyToken, upload, updateAuctionStatuses } = require('../middlewares/middlewares.js');

router.get('/', updateAuctionStatuses, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const query = req.query.q ? `%${req.query.q}%` : '%';
    console.log('Search query:', query);
    try {
        const [auctions] = await mysql.query("SELECT * FROM v_auction_user WHERE is_deleted = 0 AND auction_title LIKE ? order by end_date", [query]);
        res.json({auctions});
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).json({ msg: 'Server error while fetching auctions' });
    }
});

router.post('/', verifyToken, upload.single('image'),  async (req, res) => {
    const mysql = await db.connectToDatabase();
    const { title, description, start_price, end_date, icon } = req.body;
    const user_id = req.userId;
    const image = req.file ? req.file.filename : null;

    try {
        const [result] = await mysql.query("INSERT INTO auctions (title, description, start_price, current_price, end_date, user_id, image ) VALUES (?, ?, ?, ?, ?, ?, ? )", [title, description, start_price, start_price, end_date, user_id, image]);
        res.status(201).json({
            id: result.insertId,
            title,
            image,
            msg: 'Auction created successfully' 
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});

router.get('/:id', updateAuctionStatuses, async (req, res) => {
    const mysql = await db.connectToDatabase();    
    try {
        const [auctions] = await mysql.query("SELECT * FROM v_auction_details WHERE auction_id = ?", [parseInt(req.params.id)]);
        res.json({auctions});
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ msg: 'Server error while fetching auction' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const { title, description } = req.body;
    const auctionId = req.params.id;
    const userId = req.userId;
    console.log(userId);
    try {
        const [auction] = await mysql.query("SELECT * FROM auctions WHERE id = ?", [auctionId]);

        if (!auction || auction.length === 0) {
            return res.status(404).json({ msg: 'Auction not found' });
        }

        if (auction[0].user_id !== userId) {
            return res.status(403).json({ msg: 'You are not authorized to update this auction' });
        }

        if (auction[0].status === 'closed') {
            return res.status(400).json({ msg: 'Cannot update a closed auction' });
        }

        [result] = await mysql.query("UPDATE auctions SET title = ?, description = ? WHERE id = ?", [title, description, auctionId]);
        
        res.status(200).json({
            msg: 'Auction updated successfully',
            updatedFields: { title, description }
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const auctionId = req.params.id;
    const userId = req.userId;
    console.log(userId);
    try {
        const [auction] = await mysql.query("SELECT user_id FROM auctions WHERE id = ?", [auctionId]);

        if (!auction || auction.length === 0) {
            return res.status(404).json({ msg: 'Auction not found' });
        }

        if (auction[0].user_id !== userId) {
            return res.status(403).json({ msg: 'You are not authorized to delete this auction' });
        }

        if (auction[0].status === 'closed') {
            return res.status(400).json({ msg: 'Cannot delete a closed auction' });
        }
        
        [result] = await mysql.query("UPDATE auctions SET is_deleted = 1, status = 'closed' WHERE id = ?", [auctionId]);
        
        res.status(200).json({
            msg: 'Auction deleted successfully'
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});

router.get('/:id/bids', async (req, res) => {
    const mysql = await db.connectToDatabase();    
    try {
        const [bids] = await mysql.query("SELECT * FROM v_bid_details WHERE auction_id = ?", [parseInt(req.params.id)]);
        res.json({bids});
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ msg: 'Server error while fetching bids' });
    }
});

router.post('/:id/bids', verifyToken, async (req, res) => {
    const mysql = await db.connectToDatabase();
    const { amount } = req.body;
    const user_id = req.userId;
    const auction_id = parseInt(req.params.id);
    const currentDate = new Date();
    const [auction] = await mysql.query("SELECT user_id, current_price, end_date FROM auctions WHERE id = ?", [auction_id]);

    if (!auction.length) {
        return res.status(404).json({ msg: 'Auction not found' });
    }
    
    const { user_id: owner_id, current_price, end_date } = auction[0];
    
    if (owner_id === user_id) {
        return res.status(400).json({ msg: 'You cannot bid on your own auction' });
    }

    if (amount <= current_price) {
        return res.status(400).json({ msg: 'Bid must be higher than the current price' });
    }

    if (new Date(end_date) < currentDate) {
        return res.status(400).json({ msg: 'Cannot bid on an expired auction' });
    }

    try {
        await mysql.query("UPDATE auctions SET current_price = ?, updated_at = ?, winner_id = ? WHERE id = ?", [amount, currentDate, user_id, auction_id]);
        const [result] = await mysql.query("INSERT INTO bids (amount, auction_id, user_id) VALUES (?, ?, ?)", [amount, auction_id, user_id]);
        
        res.status(201).json({
            id: result.insertId,
            amount,
            msg: 'Bid created successfully' 
        });    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Error' });
    }
});

module.exports = router;