import { getAllPosts, getPostById, createPost, updatePost, deletePost} from '../models/database.js'

export const getAll = (req, res) => {
    getAllPosts((err, rows) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(rows);
    });
};

export const getById = (req, res) => {
    const postId = req.params.id;
    getPostById(postId, (err, row) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(row);
    });
};

export const create = (req, res) => {
    const { post_body } = req.body;
    if (!post_body) {
        return res.status(400).json({ error: 'Post body is required' });
    }
    createPost(post_body, req.user.user_id, (err, lastID) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201)
            .header('Location', `/posts/${lastID}`)
            .json({ message: 'Post created successfully', id: lastID });
    });
};

export const edit = (req, res) => {
    const id = req.params.id;
    const { post_body } = req.body;
    if (!post_body) {
        return res.status(400).json({ error: 'Post body is required' });
    }
    updatePost(id, post_body, (err, changes) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Post updated' });
    });    
};

export const remove = (req, res) => {
    const id = req.params.id;
    
    deletePost(id, (err, changes) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Post deleted' });
    });
};