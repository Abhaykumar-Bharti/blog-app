import api from './api';
import { BlogPost } from '../types';

export const createBlogPost = async (
  blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>, 
  imageFile?: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('authorName', blog.authorName);
    formData.append('published', String(blog.published));
    
    if (blog.summary) {
      formData.append('summary', blog.summary);
    }
    if (blog.tags && blog.tags.length > 0) {
      formData.append('tags', JSON.stringify(blog.tags));
    }
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.blog.id;
  } catch (error: any) {
    console.error('Error in createBlogPost:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create blog post');
  }
};

export const updateBlogPost = async (
  id: string, 
  blog: Partial<BlogPost>, 
  imageFile?: File
): Promise<void> => {
  if (!id) {
    throw new Error('Blog ID is required for update');
  }
  
  try {
    const formData = new FormData();
    if (blog.title) formData.append('title', blog.title);
    if (blog.content) formData.append('content', blog.content);
    if (blog.authorName) formData.append('authorName', blog.authorName);
    if (blog.published !== undefined) formData.append('published', String(blog.published));
    if (blog.summary !== undefined) formData.append('summary', blog.summary || '');
    
    if (blog.tags) {
      formData.append('tags', JSON.stringify(blog.tags));
    }
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    console.error('Error in updateBlogPost:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to update blog post');
  }
};

export const deleteBlogPost = async (id: string, imageUrl?: string): Promise<void> => {
  if (!id) {
    throw new Error('Blog ID is required for deletion');
  }
  
  try {
    await api.delete(`/blogs/${id}`);
  } catch (error: any) {
    console.error('Error in deleteBlogPost:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete blog post');
  }
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  if (!id) {
    throw new Error('Blog ID is required');
  }
  
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data.blog;
  } catch (error: any) {
    console.error('Error getting blog post:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to get blog post');
  }
};

export const getAllBlogPosts = async (onlyPublished = true): Promise<BlogPost[]> => {
  try {
    const response = await api.get('/blogs', {
      params: { onlyPublished },
    });
    return response.data.blogs;
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    return [];
  }
};

export const getUserBlogPosts = async (userId: string): Promise<BlogPost[]> => {
  if (!userId) {
    return [];
  }
  
  try {
    const response = await api.get(`/blogs/user/${userId}`);
    return response.data.blogs;
  } catch (error) {
    console.error('Error getting user blog posts:', error);
    return [];
  }
};

// Add like to a blog post
export const likeBlogPost = async (blogId: string, userId: string): Promise<void> => {
  try {
    await api.post(`/blogs/${blogId}/like`);
  } catch (error: any) {
    console.error('Error in likeBlogPost:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to like blog post');
  }
};

// Remove like from a blog post
export const unlikeBlogPost = async (blogId: string, userId: string): Promise<void> => {
  try {
    await api.post(`/blogs/${blogId}/unlike`);
  } catch (error: any) {
    console.error('Error in unlikeBlogPost:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to unlike blog post');
  }
};

// Check if user has liked a blog post
export const hasUserLikedBlog = async (blogId: string, userId: string): Promise<boolean> => {
  if (!blogId || !userId) {
    return false;
  }
  
  try {
    const response = await api.get(`/blogs/${blogId}`);
    const blog = response.data.blog;
    const likedBy = blog.likedBy || [];
    return likedBy.includes(userId);
  } catch (error) {
    console.error('Error checking if user liked blog:', error);
    return false;
  }
};