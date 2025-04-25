const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;
const JWT_SECRET = 'giga_secret_key_123'

// Middleware to parse JSON requests
app.use(express.json());

// Connect to SQLite database 
const db = new sqlite3.Database('./Xdatabase.db', (err) => {
    if (err) console.error('Database opening error: ', err);
    else console.log('Connected to SQLite database');
});

// Middleware for Authentication (JWT)
const authentication = (req, res, next) => {
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

const authorization = (req, res, next) => {
    const postID = req.params.id;
    db.get('SELECT post_user_id FROM posts WHERE post_id = ?', 
        [postID], 
        (err, row) => {
            if (err) {
                console.error('Database error in authorizePost: ', err);
                return res.status(500).json({ error: 'Database error'});
            }
            if (!row) {
                return res.status(401).json({ message: 'Invalid user'});
            }
            if (row.post_user_id !== req.user.user_id) {
                return res.status(401).json({ message: 'Unauthorized'});
            }
            next();
        }
    );
}

// PUBLIC ROUTES

app.get('/token', (req, res) => {
    db.get(
        `SELECT user_id FROM users WHERE user_token = ?`,
         ['token123'],
         (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error'});
            if (!row) return res.status(401).json({ error: 'Invalid user'});
            const token = jwt.sign({ user_id: row.user_id }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
         }
    );
})

app.get('/', (req, res) => { 
    res.redirect('/posts');
});

// Get all posts
app.get('/posts', (req, res) => {
    db.all(`
        SELECT p.post_id, p.post_body, u.user_name 
        FROM posts p
        JOIN users u ON p.post_user_id = u.user_id
        `, [], (err, rows) => {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Database error'});
            // 200 OK
            res.status(200).json(rows);
    });
});

// Get a specific post by ID
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.get(`
        SELECT p.post_id, p.post_body, u.user_name
        FROM posts p
        JOIN users u ON p.post_user_id = u.user_id
        WHERE p.post_id = ?
        `, [id], (err, row) => {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Database error'});
            // 404 Not Found
            if (!row) return res.status(404).json({ error: 'Post not found'});
            // 200 OK
            res.status(200).json(row);
        });
});

// AUTHENTICADED ROUTES

// Create a post (POST require authentication)
app.post('/posts/create', authentication, (req, res) => {
    // Extract Post Body
    const { post_body } = req.body;
    // Validate Post Body--Not empty
    if(!post_body) {
        // 400 Bad Request
        return res.status(400).json({ error: 'Post body required'});
    }
    // Get User ID from the authenticated user
    const user_id = req.user.user_id;
    // Insert into Database
    db.run(`INSERT INTO posts (post_user_id, post_body ) VALUES (?, ?)`, 
        [user_id, post_body], function (err) {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Database error'});
            // Check if the lastID is set -- this is the ID of the newly created post -- edge case -- schema misconfiguration
            if (!this.lastID) return res.status(500).json({ error: 'Failed to retrive new post ID'});
            // 201 Created
            res.status(201)
                // Adds a Location header with the new post's URL(REST convention)
                .header('Location', `/posts/${this.lastID}`)
                .json({ message: 'Post created'})
    });
});
// Update a post
app.put('/posts/edit/:id', authentication, authorization, (req, res) => {
    // Extract Post ID from the URL -- req.params.id get :id form the URL
    const { id } = req.params;  
    // Extract New Post content from the request body
    const { post_body } = req.body;
    // 400 Bad Request -- No post body
    if (!post_body) return res.status(400).json({ error: 'Post body required'});
    // Get User ID form the authenticated user
    const user_id = req.user.user_id;
   
    // Update the post
    db.run(`UPDATE posts SET post_body = ? WHERE post_id = ?`,
        [post_body, id], function (err) {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Database error'});
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Post not found'});
            }
            // 200 OK
            res.status(200).json({
                post_id: id,
                post_user_id: user_id.toString(),
                post_body: post_body
            });
        }
    );
}); 
// Delete a post
app.delete('/posts/delete/:id', authentication, authorization, (req, res) => {
    // Extract Post ID from the URL
    const id = req.params.id;
    
    // Delete the post
    db.run(`DELETE FROM posts WHERE post_id = ?`, 
        [id], function (err) {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Databse error'});
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Post not found'});
            }
            // 200 OK
            res.status(200).json({ message: 'Post deleted'});
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});