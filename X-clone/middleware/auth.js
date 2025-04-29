import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Middleware for Authentication (JWT)
export const authentication = (req, res, next) => {
    // Extrach the Authorization Header
    const authHeader = req.headers['authorization'];
    // Check if the Header exists and is valid--follows HTTP Basic Auth format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized
        return res.status(401).json({ message: 'Invalid user' });
    }
    try {
        const token = authHeader.split(' ')[1];
        let userToken = jwt.verify(token, JWT_SECRET);
        req.user = { user_id: userToken.user_id };
        next();
    } catch (err) {
        console.error('JWT verification error: ', err);
        res.status(401).json({ message: 'Invalid user' });
    }
}