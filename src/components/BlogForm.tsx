import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createBlogPost, updateBlogPost } from '../services/blogService';
import { BlogPost } from '../types';

interface BlogFormProps {
  initialBlog?: BlogPost;
  isEditing?: boolean;
}

const BlogForm = ({ initialBlog, isEditing = false }: BlogFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Set initial values if editing
  useEffect(() => {
    if (initialBlog && isEditing) {
      setTitle(initialBlog.title);
      setContent(initialBlog.content);
      setSummary(initialBlog.summary || '');
      setTags(initialBlog.tags ? initialBlog.tags.join(', ') : '');
      setPublished(initialBlog.published);
      if (initialBlog.imageUrl) {
        setImagePreview(initialBlog.imageUrl);
      }
    }
  }, [initialBlog, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a blog post');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const summaryValue = summary.trim() === '' ? null : summary;
      
      if (isEditing && initialBlog) {
        // Update existing blog
        await updateBlogPost(
          initialBlog.id, 
          {
            title,
            content,
            summary: summaryValue,
            tags: tagsArray,
            published
          },
          image || undefined
        );
        navigate(`/blogs/${initialBlog.id}`);
      } else {
        // Create new blog
        const blogId = await createBlogPost(
          {
            title,
            content,
            summary: summaryValue,
            authorId: currentUser.id,
            authorName: currentUser.displayName,
            published,
            tags: tagsArray
          },
          image || undefined
        );
        navigate(`/blogs/${blogId}`);
      }
    } catch (err: any) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} blog post: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
            placeholder="Enter post title"
          />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary (optional)
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
            placeholder="Brief summary of your post"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
            placeholder="Write your blog post content here"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            Tip: You can use markdown for formatting. Try **bold**, *italic*, or - bullet points.
          </p>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated, optional)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. technology, programming, react"
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image (optional)
          </label>
          <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-auto">
              <label className="block w-full px-4 py-2 bg-primary-50 text-primary-700 rounded-md cursor-pointer hover:bg-primary-100 text-center">
                <span>Select Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {imagePreview && (
              <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-full w-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!imagePreview && (
              <span className="text-sm text-gray-500">No image selected</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish this post (otherwise it will be saved as a draft)
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm; 