import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BlogList from '../components/BlogList';

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-soft bg-hero-pattern">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-800 mb-4 leading-tight">
              Welcome to <span className="text-secondary-600">BlogHub</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
              Share your ideas, stories, and expertise with the world. Read amazing content from our community of writers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to={currentUser ? "/create-blog" : "/login"}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-xl shadow-hover transition duration-300 transform hover:-translate-y-1"
              >
                Start Writing
              </Link>
              <Link
                to="/blogs"
                className="inline-block bg-white border border-primary-300 text-primary-700 hover:text-primary-800 font-medium px-8 py-3 rounded-xl shadow-soft hover:shadow-hover transition duration-300 transform hover:-translate-y-1"
              >
                Explore Blogs
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-hover bg-white p-4">
              <img 
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                alt="Blog Writing" 
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-primary-600">BlogHub</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-hover transition-shadow duration-300">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Write</h3>
              <p className="text-gray-600">Simple and intuitive interface for writing and publishing your blog posts.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-hover transition-shadow duration-300">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">Your content is safe with us. We prioritize security and privacy.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-hover transition-shadow duration-300">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">Share your thoughts with readers from around the world.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Posts Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Featured Posts
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Discover the latest and most popular content from our talented writers
          </p>
        </div>
        
        <BlogList limit={6} />
      </div>
      
      {/* Call to Action Section - Only show when user is not logged in */}
      {!currentUser && (
        <div className="bg-primary-700 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to share your story?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Join our community of writers and readers. Start your blogging journey today.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-white text-primary-700 hover:bg-primary-50 font-medium px-8 py-3 rounded-xl shadow-hover transition duration-300 transform hover:-translate-y-1"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 