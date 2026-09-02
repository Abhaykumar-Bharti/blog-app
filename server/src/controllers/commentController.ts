import { Request, Response, NextFunction } from 'express';
import { Comment } from '../models/Comment';
import { AppError } from '../middleware/errorMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';

export const createComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { blogId, content, authorName } = req.body;

    if (!blogId || !content) {
      return next(new AppError('Blog ID and content are required', 400));
    }

    const comment = await Comment.create({
      blogId,
      content,
      authorId: req.user.id,
      authorName: authorName || 'Anonymous User',
    });

    res.status(201).json({
      success: true,
      comment: comment.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByBlogId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      return next(new AppError('Blog ID is required', 400));
    }

    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments: comments.map(c => c.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Auth check: Only the author of the comment can delete it
    if (comment.authorId.toString() !== req.user.id) {
      return next(new AppError('Access denied: You are not authorized to delete this comment', 403));
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// No-op connection verification/initialization helper endpoint
export const ensureCollectionExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      message: 'MongoDB collections are dynamically initialized.',
    });
  } catch (error) {
    next(error);
  }
};
