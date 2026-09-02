import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserBlogPosts, deleteBlogPost } from '../services/blogService';
import { BlogPost } from '../types';
import UserProfile from '../components/UserProfile';
import BlogCardGrid from '../components/BlogCardGrid';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userBlogs = await getUserBlogPosts(currentUser.id);
        setBlogs(userBlogs);
      } catch (err: any) {
        setError('Failed to load your blogs: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [currentUser]);

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await deleteBlogPost(id, imageUrl);
      setBlogs(blogs.filter(blog => blog.id !== id));
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

  // Calculate published vs total posts
  const totalPosts = blogs.length;
  const publishedPosts = blogs.filter(blog => blog.published).length;

  // Handle user profile update
  const handleUserUpdate = (updatedUser: any) => {
    // This function would be implemented if we need to update the user context
    console.log('User profile updated:', updatedUser);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {currentUser && (
        <UserProfile 
          user={currentUser} 
          totalPosts={totalPosts} 
          publishedPosts={publishedPosts}
          onProfileUpdate={handleUserUpdate}
        />
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 ${view === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 ${view === 'table' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
              title="Table View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <Link 
            to="/create-blog" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-300"
          >
            Create New Post
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {blogs.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500 mb-4">You haven't created any blog posts yet.</p>
          <Link 
            to="/create-blog" 
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Write your first post →
          </Link>
        </div>
      ) : view === 'grid' ? (
        <BlogCardGrid blogs={blogs} />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-soft">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <Link to={`/blogs/${blog.id}`} className="hover:text-primary-600">
                        {blog.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      blog.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/edit-blog/${blog.id}`} 
                      className="text-primary-600 hover:text-primary-700 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id, blog.imageUrl)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 