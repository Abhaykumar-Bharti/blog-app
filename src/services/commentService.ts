import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Comment } from '../types';

// Collection reference
const commentsCollection = collection(db, 'comments');

export const createComment = async (
  blogId: string,
  authorId: string,
  authorName: string,
  content: string
): Promise<string> => {
  console.log('Creating comment with data:', { blogId, authorId, authorName });
  try {
    const commentData = {
      blogId,
      authorId,
      authorName,
      content,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(commentsCollection, commentData);
    console.log('Comment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error in createComment:', error);
    throw error;
  }
};

export const getCommentsByBlogId = async (blogId: string): Promise<Comment[]> => {
  if (!blogId) {
    console.error('Invalid blogId provided to getCommentsByBlogId:', blogId);
    return [];
  }
  
  console.log('Getting comments for blogId:', blogId);
  try {
    const q = query(
      commentsCollection,
      where('blogId', '==', blogId),
      orderBy('createdAt', 'desc')
    );
    
    console.log('Comment query created');
    const querySnapshot = await getDocs(q);
    console.log('Comment query executed, found:', querySnapshot.size, 'comments');
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Comment data:', data);
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      } as Comment;
    });
  } catch (error) {
    console.error('Error in getCommentsByBlogId:', error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  if (!commentId) {
    console.error('Invalid commentId provided to deleteComment');
    throw new Error('Comment ID is required');
  }
  
  try {
    console.log('Deleting comment:', commentId);
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
    console.log('Comment deleted successfully');
  } catch (error) {
    console.error('Error in deleteComment:', error);
    throw error;
  }
};

// Function to ensure the comments collection exists by adding a test comment if empty
export const ensureCommentsCollectionExists = async (blogId: string): Promise<void> => {
  if (!blogId) {
    console.error('Invalid blogId provided to ensureCommentsCollectionExists');
    return; // Exit early if no valid blogId
  }
  
  console.log('Checking if comments collection exists...');
  try {
    const q = query(commentsCollection, where('blogId', '==', blogId), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No comments found, creating test comment to initialize collection...');
      try {
        const testCommentId = await createComment(
          blogId,
          'system',
          'System',
          'This is a test comment to initialize the comments collection.'
        );
        console.log('Test comment created successfully with ID:', testCommentId);
        
        // Now delete the test comment
        if (testCommentId) {
          await deleteComment(testCommentId);
          console.log('Test comment deleted.');
        }
      } catch (innerError) {
        console.error('Error creating/deleting test comment:', innerError);
        // Don't throw here, as this is a background initialization
      }
    } else {
      console.log('Comments collection exists and contains data.');
    }
  } catch (error) {
    console.error('Error checking comments collection:', error);
    // We don't rethrow here because this is an initialization function
    // and we don't want to block the application from working
  }
}; 