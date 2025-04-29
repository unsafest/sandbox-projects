import express from 'express';
import { getUserByToken } from "../models/database.js";
import { JWT_SECRET } from "../config.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/token', (req, res) => {
    const token = 'token123'; // Hardcoded token for testing
    getUserByToken(token, (err, row) => {
        if (err){
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error'});
        } 
        if (!row){
            return res.status(401).json({ error: 'Invalid user'});
        } 
        const token = jwt.sign({ user_id: row.user_id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

export default router;