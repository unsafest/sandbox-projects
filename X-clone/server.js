const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to SQLite database 
const db = new sqlite3.Database('./Xdatabase.db', (err) => {
    if (err) console.error('Database opening error: ', err);
    else console.log('Connected to SQLite database');
});

// Middleware for Authentication
const authentication = (req, res, next) => {
    // Extrach the Authorization Header
    const authHeader = req.headers['authorization'];
    // Check if the Header exists and is valid--follows HTTP Basic Auth format
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        // 401 Unauthorized
        return res.status(401).json({ message: 'Invalid user'});
    }
    // Extract the Base64 Token
    const base64Token = authHeader.split(' ')[1];
    // Decode the Base64 Token
    let userToken;
    // Decoding can fail, and if it does, it throws an error that would crash the server in not caught
    try {
        // Convers the Basic64 string into binary buffer, then converts the 
        // buffer to utf8 string--giving original token
        userToken = Buffer.from(base64Token, 'base64').toString('utf8');
        // Try/cath handles malformed Base64 string 
    } catch (err) {
        // 400 Bad Request
        return res.status(400).json({ message: 'Invalid Base64 token'});
    }
    // Query the Databse for user id with the token
    db.get(`SELECT user_id FROM users WHERE user_token = ?`, 
    [userToken], (err, row) => {
        // Handle Database errors
        if (err) {
            // 500 Internal Seerver Error
            return res.status(500).json({ message: 'Database error'});
        }
        // Check if user exists
        if (!row) {
            // 401 Unauthorized
            return res.status(401).json({ message: 'Invalid user'});
        }
        // Attach the User (id) to the request object for use in the route handler
        // This identifies the authenticated user, ensuring actions are tied to them
        req.user = { user_id: row.user_id }; // req.user becomes { user_id: n }
        // Passes controll to the next middleware or the route handler
        next();
    });  
}

// PUBLIC ROUTES

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
app.put('/posts/edit/:id', authentication, (req, res) => {
    // Extract Post ID from the URL -- req.params.id get :id form the URL
    const { id } = req.params;  
    // Extract New Post content from the request body
    const { post_body } = req.body;
    // 400 Bad Request -- No post body
    if (!post_body) return res.status(400).json({ error: 'Post body required'});
    // Get User ID form the authenticated user
    const user_id = req.user.user_id;
    // Check Post Ownership
    db.get('SELECT post_user_id FROM posts WHERE post_id = ?', 
        [id], (err, row) => {
        // 500 Internal Server Error
        if (err) return res.status(500).json({ error: 'Database error'});
        // 404 Not Found
        if (!row) return res.status(404).json({ error: 'Post not found'});
        // 401 Unauthorized -- Authorization Check -- Ensure the user is the owner of the post
        if (row.post_user_id !== user_id) return res.status(401).json({ error: 'You don\'t have access to this post'})
        // Update the post
            db.run(`UPDATE posts SET post_body = ? WHERE post_id = ?`,
            [post_body, id], function (err) {
                // 500 Internal Server Error
                if (err) return res.status(500).json({ error: 'Database error'});
                // 200 OK
                res.status(200).json({
                    post_id: id,
                    post_user_id: user_id.toString(),
                    post_body: post_body
                });
        });
    });
}); 
// Delete a post
app.delete('/posts/delete/:id', authentication, (req, res) => {
    // Extract Post ID from the URL
    const { id } = req.params;
    // Get User ID from the authenticated user
    const user_id = req.user.user_id;
    // Check Post Ownership
    db.get('SELECT post_user_id FROM posts WHERE post_id = ?',
        [id], (err, row) => {
            // 500 Internal Server Error
            if (err) return res.status(500).json({ error: 'Database error'});
            // 404 Not found
            if (!row) return res.status(404).json({ error: 'Post not found'});
            // 401 Unauthorized -- Authorization Check
            if (row.post_user_id !== user_id) return res.status(401).json({ error: 'You don\'t have access to this post'});
            // Delete the post
                db.run(`DELETE FROM posts WHERE post_id = ?`, 
                [id], function (err) {
                    // 500 Internal Server Error
                    if (err) return res.status(500).json({ error: 'Databse error'});
                    // 200 OK
                    res.status(200).json({ message: 'Post deleted'});
            });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});