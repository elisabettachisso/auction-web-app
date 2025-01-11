const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies["token"];
    console.log("Received token:", token);

    if (!token) {       
        console.log("Token missing or not provided"); 
        return res.status(403).json({ msg: "Autenticazione fallita" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
};

module.exports = verifyToken;
