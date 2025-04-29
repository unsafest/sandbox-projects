import express from 'express';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';

const port = 4000;
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Mount routes
app.use('/', authRoutes)
app.use('/', postRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});