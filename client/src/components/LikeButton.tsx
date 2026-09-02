import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { likeBlogPost, unlikeBlogPost, hasUserLikedBlog } from '../services/blogService';

interface LikeButtonProps {
  blogId: string;
  likesCount: number;
}

const LikeButton = ({ blogId, likesCount = 0 }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!currentUser) {
        setLiked(false);
        return;
      }
      
      try {
        const isLiked = await hasUserLikedBlog(blogId, currentUser.id);
        setLiked(isLiked);
      } catch (error) {
        console.error('Error checking if blog is liked:', error);
      }
    };
    
    checkIfLiked();
  }, [blogId, currentUser]);
  
  const handleLikeClick = async () => {
    if (!currentUser) {
      alert('You must be logged in to like a post');
      return;
    }
    
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (liked) {
        await unlikeBlogPost(blogId, currentUser.id);
        setLikes((prev) => Math.max(prev - 1, 0));
        setLiked(false);
      } else {
        await likeBlogPost(blogId, currentUser.id);
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handleLikeClick}
      disabled={loading || !currentUser}
      className={`flex items-center space-x-1 rounded-full px-3 py-1 ${
        liked 
          ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } transition-colors duration-300`}
      title={currentUser ? (liked ? 'Unlike' : 'Like') : 'Login to like'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 ${liked ? 'text-primary-600 fill-current' : 'text-gray-600'}`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={liked ? 0 : 1.5} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
};

export default LikeButton; 