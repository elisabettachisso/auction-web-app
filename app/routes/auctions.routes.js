// GET
// /api/auctions?q=query
// POST
// /api/auctions
// GET
// /api/auctions/:id
// PUT
// /api/auctions/:id
// DELETE
// /api/auctions/:id
// GET
// /api/auctions/:id/bids
// POST
// /api/auctions/:id/bids

// GET
// /api/bids/:id

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auction routes working!");
});

module.exports = router;