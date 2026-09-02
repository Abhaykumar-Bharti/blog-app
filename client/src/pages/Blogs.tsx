import BlogList from '../components/BlogList';

const Blogs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
        <p className="text-gray-600">Discover articles from our community</p>
      </div>
      
      <BlogList />
    </div>
  );
};

export default Blogs; 