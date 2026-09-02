import { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { deleteComment } from '../services/commentService';

interface CommentItemProps {
  comment: Comment;
  onCommentDeleted: () => void;
}

const CommentItem = ({ comment, onCommentDeleted }: CommentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useAuth();
  
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteComment(comment.id);
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const isAuthor = currentUser && currentUser.id === comment.authorId;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-soft mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
            <span className="text-primary-700 font-semibold text-sm">
              {comment.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        {isAuthor && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete comment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-3 text-gray-700">
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem; 