import api from './api';
import { Comment } from '../types';

export const createComment = async (
  blogId: string,
  authorId: string,
  authorName: string,
  content: string
): Promise<string> => {
  try {
    const response = await api.post('/comments', {
      blogId,
      content,
      authorName,
    });
    return response.data.comment.id;
  } catch (error: any) {
    console.error('Error in createComment:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create comment');
  }
};

export const getCommentsByBlogId = async (blogId: string): Promise<Comment[]> => {
  if (!blogId) {
    return [];
  }
  
  try {
    const response = await api.get(`/comments/blog/${blogId}`);
    return response.data.comments;
  } catch (error) {
    console.error('Error in getCommentsByBlogId:', error);
    return [];
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  if (!commentId) {
    throw new Error('Comment ID is required');
  }
  
  try {
    await api.delete(`/comments/${commentId}`);
  } catch (error: any) {
    console.error('Error in deleteComment:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete comment');
  }
};

// Mock function matching signature for compatibility
export const ensureCommentsCollectionExists = async (blogId: string): Promise<void> => {
  try {
    await api.post('/comments/ensure-exists', { blogId });
  } catch (error) {
    console.error('Error in ensureCommentsCollectionExists check:', error);
  }
};