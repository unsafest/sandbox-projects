import express from 'express';
import { authentication } from '../middleware/auth.js';
import { authorization } from '../middleware/authorization.js';
import { getAll, getById, create, edit, remove } from '../controllers/postController.js';

const router = express.Router();

// Public
router.get('/posts', getAll);
router.get('/posts/:id', getById);
// Auth
router.post('/posts/create', authentication, create);
// Auth + Authorization
router.put('/posts/edit/:id', authentication, authorization, edit);
router.delete('/posts/delete/:id', authentication, authorization, remove);

export default router;

