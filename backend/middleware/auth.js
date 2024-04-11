const jwt = require('jsonwebtoken');

// Verify if user is connected then render a code to allow modification features
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.auth = {
            userId: decodedToken.userId
        };
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
}
