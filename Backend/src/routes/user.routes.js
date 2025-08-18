import e from 'express';
import express from 'express';
import { adminOnly, protect } from '../middleware/auth.middleware.js';
import { getUserById, getUsers } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);

export default router;