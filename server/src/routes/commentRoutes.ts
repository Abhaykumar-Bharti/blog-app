import { Router } from 'express';
import {
  createComment,
  getCommentsByBlogId,
  deleteComment,
  ensureCollectionExists,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/blog/:blogId', getCommentsByBlogId);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.post('/ensure-exists', ensureCollectionExists);

export default router;
