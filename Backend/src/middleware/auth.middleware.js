const tokenBlacklistModel = require("../models/blacklist.model.js");
const jwt = require("jsonwebtoken")

async function authUser(req, res, next) {
    let token = null;

    // Check Authorization header first (for cross-domain deployments)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    // Fallback to cookies (for local development)
    if (!token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized!"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = { authUser }