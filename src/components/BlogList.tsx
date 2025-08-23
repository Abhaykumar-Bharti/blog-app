import { useState, useEffect } from 'react';
import { getAllBlogPosts } from '../services/blogService';
import { BlogPost } from '../types';
import BlogCard from './BlogCard';

interface BlogListProps {
  showPublishedOnly?: boolean;
  userId?: string;
  limit?: number;
}

const BlogList = ({ 
  showPublishedOnly = true, 
  userId,
  limit
}: BlogListProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        let fetchedBlogs: BlogPost[] = [];
        
        if (userId) {
          // If userId is provided, fetch only that user's blogs
          const { getUserBlogPosts } = await import('../services/blogService');
          fetchedBlogs = await getUserBlogPosts(userId);
        } else {
          // Otherwise fetch all blogs
          fetchedBlogs = await getAllBlogPosts(showPublishedOnly);
        }
        
        // Apply limit if provided
        if (limit && limit > 0) {
          fetchedBlogs = fetchedBlogs.slice(0, limit);
        }
        
        setBlogs(fetchedBlogs);
      } catch (error: any) {
        setError('Failed to load blogs: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [showPublishedOnly, userId, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList; 