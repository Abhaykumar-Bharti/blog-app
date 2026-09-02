import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPost, deleteBlogPost } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import { BlogPost } from '../types';
import LikeButton from '../components/LikeButton';
import CommentList from '../components/CommentList';
import { testFirestoreConnectionDetailed } from '../services/testService';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
  const [dbErrorDetails, setDbErrorDetails] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError('Blog ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const fetchedBlog = await getBlogPost(id);
        
        if (!fetchedBlog) {
          setError('Blog post not found');
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
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("BlogDetail has blogId:", id);
    } else {
      console.error("BlogDetail has no blogId");
      setError('Blog ID is missing');
    }
  }, [id]);

  useEffect(() => {
    // Test Firestore connection with detailed results
    const testConnection = async () => {
      try {
        const result = await testFirestoreConnectionDetailed();
        console.log('Firestore connection test result:', result);
        setFirestoreConnected(result.connected);
        
        if (!result.connected) {
          console.error('Firestore connection failed:', result.error);
          setError(prev => prev || 'Database connection failed. Please try again later.');
          setDbErrorDetails(result.details || 'Unknown connection error');
        }
      } catch (err) {
        console.error('Error testing Firestore connection:', err);
        setFirestoreConnected(false);
        setError(prev => prev || 'Database connection failed. Please try again later.');
      }
    };
    
    testConnection();
  }, []);

  const handleDelete = async () => {
    if (!blog) return;
    
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await deleteBlogPost(blog.id, blog.imageUrl);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to delete blog: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{error || 'Blog post not found'}</p>
          {dbErrorDetails && (
            <p className="mt-2 text-sm">{dbErrorDetails}</p>
          )}
          <div className="mt-4">
            <Link to="/blogs" className="text-red-700 font-medium hover:text-red-800">
              ← Return to all blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === blog.authorId;
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get a preview of content for non-authenticated users
  const contentPreview = blog.content.split('\n').slice(0, 3).join('\n');
  const isPreview = !currentUser && blog.content.split('\n').length > 3;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm sm:shadow-md overflow-hidden">
        {blog.imageUrl && (
          <div className="w-full overflow-hidden">
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        <div className="p-4 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-600 mb-4">
              <span className="mr-2 mb-2">By {blog.authorName}</span>
              <span className="mr-2 mb-2">•</span>
              <span className="mb-2">{formattedDate}</span>
              {!blog.published && (
                <>
                  <span className="mx-2 mb-2">•</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">Draft</span>
                </>
              )}
            </div>
            
            <div className="flex items-center mb-6">
              <LikeButton blogId={blog.id} likesCount={blog.likes || 0} />
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div className="prose max-w-none">
            {currentUser ? (
              // Show full content to authenticated users
              blog.content.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
              ))
            ) : (
              // Show preview to non-authenticated users
              <>
                {contentPreview.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                ))}
                
                {isPreview && (
                  <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-100">
                    <h3 className="text-xl font-semibold text-primary-800 mb-2">Want to read more?</h3>
                    <p className="text-primary-700 mb-4">Sign in or create an account to read the full article.</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/login"
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="inline-block bg-white border border-primary-300 text-primary-700 hover:text-primary-800 font-medium px-6 py-2 rounded-lg transition duration-300"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {isAuthor && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <Link 
                to={`/edit-blog/${blog.id}`} 
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/blogs" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all blogs
            </Link>
          </div>
          
          {firestoreConnected === false ? (
            <div className="mt-8 bg-red-50 text-red-700 p-4 rounded-lg">
              <p>Unable to load comments due to a database connection issue.</p>
              {dbErrorDetails && (
                <p className="mt-2 text-sm">{dbErrorDetails}</p>
              )}
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          ) : id ? (
            <CommentList blogId={id} />
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail; 