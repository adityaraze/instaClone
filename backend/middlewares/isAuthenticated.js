const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        req.id = decode.userId;
        next();
    } catch (err) {
        // Handle errors here (logging or returning a response)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Use a single export for the function
module.exports = isAuthenticated;