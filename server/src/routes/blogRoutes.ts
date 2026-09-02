import { Router } from 'express';
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPost,
  getAllBlogPosts,
  getUserBlogPosts,
  likeBlogPost,
  unlikeBlogPost,
} from '../controllers/blogController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getAllBlogPosts);
router.get('/user/:userId', getUserBlogPosts);
router.get('/:id', getBlogPost);

router.post('/', protect, upload.single('imageFile'), createBlogPost);
router.put('/:id', protect, upload.single('imageFile'), updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

router.post('/:id/like', protect, likeBlogPost);
router.post('/:id/unlike', protect, unlikeBlogPost);

export default router;
