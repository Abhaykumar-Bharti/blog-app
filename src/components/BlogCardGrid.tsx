import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface BlogCardGridProps {
  blogs: BlogPost[];
  title?: string;
}

const BlogCardGrid = ({ blogs, title }: BlogCardGridProps) => {
  if (blogs.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      {title && (
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          <div className="mt-2 h-1 w-20 bg-primary-500 rounded-full"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {blogs.map(blog => (
          <div 
            key={blog.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              {blog.imageUrl ? (
                <img 
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-soft flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!blog.published && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Draft
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  <Link to={`/blogs/${blog.id}`} className="hover:text-primary-600 transition duration-200">
                    {blog.title}
                  </Link>
                </h3>
                
                {blog.summary && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.summary}</p>
                )}
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/edit-blog/${blog.id}`}
                    className="text-primary-600 hover:text-primary-700"
                    aria-label="Edit blog post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <Link 
                    to={`/blogs/${blog.id}`}
                    className="text-gray-600 hover:text-gray-700"
                    aria-label="View blog post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCardGrid; 