import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { BlogPost } from '../models/BlogPost';
import { AppError } from '../middleware/errorMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { title, content, published, summary } = req.body;

    if (!title || !content) {
      return next(new AppError('Title and content are required', 400));
    }

    // Get tags array
    let tagsArr: string[] = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try {
          tagsArr = JSON.parse(req.body.tags);
        } catch (e) {
          tagsArr = req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(req.body.tags)) {
        tagsArr = req.body.tags;
      }
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const blog = await BlogPost.create({
      title,
      content,
      published: published === 'true' || published === true,
      summary: summary || '',
      tags: tagsArr,
      imageUrl,
      authorId: req.user.id,
      authorName: req.body.authorName || 'Anonymous',
    });

    res.status(201).json({
      success: true,
      blog: blog.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { id } = req.params;
    const blog = await BlogPost.findById(id);

    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Authorization check
    if (blog.authorId.toString() !== req.user.id) {
      return next(new AppError('Access denied: You are not the author of this post', 403));
    }

    const { title, content, published, summary } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (published !== undefined) {
      blog.published = published === 'true' || published === true;
    }
    if (summary !== undefined) blog.summary = summary;

    // Handle tags
    if (req.body.tags) {
      let tagsArr: string[] = [];
      if (typeof req.body.tags === 'string') {
        try {
          tagsArr = JSON.parse(req.body.tags);
        } catch (e) {
          tagsArr = req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(req.body.tags)) {
        tagsArr = req.body.tags;
      }
      blog.tags = tagsArr;
    }

    // Handle image upload
    if (req.file) {
      // Delete old image file if it exists locally
      if (blog.imageUrl) {
        try {
          const oldFilename = blog.imageUrl.split('/uploads/')[1];
          if (oldFilename) {
            const oldPath = path.join(__dirname, '../../uploads', oldFilename);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        } catch (err) {
          console.error('Error deleting old image file:', err);
        }
      }
      blog.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      blog: blog.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { id } = req.params;
    const blog = await BlogPost.findById(id);

    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Authorization check
    if (blog.authorId.toString() !== req.user.id) {
      return next(new AppError('Access denied: You are not authorized to delete this post', 403));
    }

    // Delete image from disk
    if (blog.imageUrl) {
      try {
        const filename = blog.imageUrl.split('/uploads/')[1];
        if (filename) {
          const filePath = path.join(__dirname, '../../uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (err) {
        console.error('Error deleting image file during blog deletion:', err);
      }
    }

    await BlogPost.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await BlogPost.findById(id);

    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    res.status(200).json({
      success: true,
      blog: blog.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const onlyPublished = req.query.onlyPublished !== 'false';
    const queryObj: any = {};
    
    if (onlyPublished) {
      queryObj.published = true;
    }

    const blogs = await BlogPost.find(queryObj).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs: blogs.map(b => b.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBlogPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const blogs = await BlogPost.find({ authorId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs: blogs.map(b => b.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

export const likeBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { id } = req.params;
    const blog = await BlogPost.findById(id);

    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    // Check if already liked
    const hasLiked = blog.likedBy.some(userId => userId.toString() === req.user!.id);
    if (hasLiked) {
      return next(new AppError('You have already liked this post', 400));
    }

    blog.likedBy.push(req.user.id as any);
    blog.likes += 1;

    await blog.save();

    res.status(200).json({
      success: true,
      blog: blog.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const unlikeBlogPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const { id } = req.params;
    const blog = await BlogPost.findById(id);

    if (!blog) {
      return next(new AppError('Blog post not found', 404));
    }

    const index = blog.likedBy.findIndex(userId => userId.toString() === req.user!.id);
    if (index === -1) {
      return next(new AppError('You have not liked this post yet', 400));
    }

    blog.likedBy.splice(index, 1);
    blog.likes = Math.max(0, blog.likes - 1);

    await blog.save();

    res.status(200).json({
      success: true,
      blog: blog.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
