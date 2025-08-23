import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Comment } from '../types';
import { getCommentsByBlogId, createComment, ensureCommentsCollectionExists } from '../services/commentService';
import CommentItem from './CommentItem';

interface CommentListProps {
  blogId: string;
}

const CommentList = ({ blogId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  console.log('CommentList rendering with blogId:', blogId, 'type:', typeof blogId);
  
  // Use useCallback to memoize the fetchComments function
  const fetchComments = useCallback(async () => {
    if (!blogId || typeof blogId !== 'string') {
      console.error('Invalid blogId in fetchComments:', blogId);
      setError('Invalid blog ID');
      setLoading(false);
      return;
    }
    
    console.log('Fetching comments for blog ID:', blogId);
    try {
      setLoading(true);
      setError('');
      const fetchedComments = await getCommentsByBlogId(blogId);
      console.log('Comments fetched:', fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [blogId]);
  
  useEffect(() => {
    console.log('CommentList mounted with blogId:', blogId);
    if (!blogId || typeof blogId !== 'string') {
      console.error('Invalid blogId provided to CommentList:', blogId);
      setError('Invalid blog ID');
      setLoading(false);
      return;
    }
    
    const initializeComments = async () => {
      try {
        // First ensure the collection exists
        await ensureCommentsCollectionExists(blogId);
        // Then fetch comments
        fetchComments();
      } catch (error) {
        console.error('Error initializing comments:', error);
        setError('Failed to initialize comments');
        setLoading(false);
      }
    };
    
    initializeComments();
  }, [blogId, fetchComments]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to comment');
      return;
    }
    
    if (!blogId || typeof blogId !== 'string') {
      setError('Invalid blog ID');
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      console.log('Adding comment to blog:', blogId);
      await createComment(
        blogId,
        currentUser.id,
        currentUser.displayName || 'Anonymous',
        newComment
      );
      
      setNewComment('');
      fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>
      
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add a comment..."
                rows={3}
                required
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 mb-6 rounded-lg text-center">
          <p className="text-gray-700">
            Please <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onCommentDeleted={fetchComments} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList; 