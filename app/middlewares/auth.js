const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies["token"];
    console.log("Received token:", token);

    if (!token) {
        res.status(403).json({ msg: "Autenticazione fallita" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Unauthorized" });
    }
};

module.exports = verifyToken;
