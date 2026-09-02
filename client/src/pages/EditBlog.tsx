import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPost } from '../services/blogService';
import { BlogPost } from '../types';
import BlogForm from '../components/BlogForm';
import { useAuth } from '../contexts/AuthContext';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedBlog = await getBlogPost(id);
        
        if (!fetchedBlog) {
          setError('Blog post not found');
          return;
        }
        
        // Check if user is the author
        if (currentUser && fetchedBlog.authorId !== currentUser.id) {
          setError('You do not have permission to edit this blog post');
          return;
        }
        
        setBlog(fetchedBlog);
      } catch (err: any) {
        setError('Failed to load blog: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{error || 'Blog post not found'}</p>
          <div className="mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-red-700 font-medium hover:text-red-800"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <BlogForm initialBlog={blog} isEditing={true} />;
};

export default EditBlog; 