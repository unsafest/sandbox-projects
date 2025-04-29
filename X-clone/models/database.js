import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./Xdatabase.db', (err) => {
    if (err) console.error('Database opening error: ', err);
    else console.log('Connected to SQLite database');
});

export const getAllPosts = (callback) => {
    db.all(
        `SELECT p.post_id, p.post_body, u.user_name
        FROM posts p 
        JOIN users u ON p.post_user_id = u.user_id`,
        [],
        callback
    );
};

export const getPostById = (id, callback) => {
    db.get(
        `SELECT p.post_id, p.post_body, u.user_name
        FROM posts p
        JOIN users u ON p.post_user_id = u.user_id
        WHERE p.post_id = ?`,
        [id],
        callback
    );
};

export const createPost = (postBody, userId, callback) => {
    db.run(
        `INSERT INTO posts (post_body, post_user_id) VALUES (?, ?)`,
        [postBody, userId],
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.lastID);
            }
        }
    );
};

export const updatePost = (postId, postBody, callback) => {
    db.run(
        `UPDATE posts SET post_body = ? WHERE post_id = ?`,
        [postBody, postId],
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.changes);
            }
        }
    );
};

export const deletePost = (postId, callback) => {
    db.run(
        `DELETE FROM posts WHERE post_id = ?`,
        [postId],
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.changes);
            }
        }
    );
};

export const getUserByToken = (userToken, callback) => {
    db.get(
        `SELECT user_id FROM users WHERE user_token = ?`,
        [userToken],
        callback
    );
};

export const getPostUserId = (postId, callback) => {
    db.get(
        'SELECT post_user_id FROM posts WHERE post_id = ?',
        [postId],
        callback
    );
};