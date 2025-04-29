import { getPostUserId } from '../models/database.js';

// Authorization middleware 
export const authorization = (req, res, next) => {
    const postId = req.params.id;
    getPostUserId(postId, (err, row) => {
        if (err) {
            console.error('Database error in authorizePost: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        if (row.post_user_id !== req.user.user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    });
};