import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  getDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
  arrayUnion, 
  arrayRemove,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { BlogPost } from '../types';

// Collection references
const blogsCollection = collection(db, 'blogs');

// Error handling helper
const handleFirebaseError = (error: any, operation: string): never => {
  console.error(`Error in ${operation}:`, error);
  if (error.code === 'permission-denied') {
    throw new Error(`Access denied: You don't have permission to ${operation}.`);
  } else if (error.code === 'not-found') {
    throw new Error(`The requested resource was not found.`);
  } else if (error.code === 'unavailable') {
    throw new Error('The service is currently unavailable. Please check your internet connection.');
  } else {
    throw new Error(`Failed to ${operation}: ${error.message || 'Unknown error'}`);
  }
};

export const createBlogPost = async (
  blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>, 
  imageFile?: File
): Promise<string> => {
  try {
    let imageUrl = '';
    
    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `blog-images/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Clean up the blog object to remove undefined values
    const blogData = {
      ...blog,
      imageUrl,
      // Only include fields that are not undefined
      summary: blog.summary || null,
      tags: blog.tags || [],
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add blog post to Firestore with server timestamp
    const docRef = await addDoc(blogsCollection, blogData);
    
    return docRef.id;
  } catch (error) {
    return handleFirebaseError(error, 'create blog post');
  }
};

export const updateBlogPost = async (
  id: string, 
  blog: Partial<BlogPost>, 
  imageFile?: File
): Promise<void> => {
  if (!id) {
    throw new Error('Blog ID is required for update');
  }
  
  try {
    const blogRef = doc(db, 'blogs', id);
    
    // Create a clean updates object without undefined values
    const updates: any = {
      ...Object.entries(blog).reduce((acc, [key, value]) => {
        // Only include values that are not undefined
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      updatedAt: serverTimestamp()
    };
    
    // Upload new image if provided
    if (imageFile) {
      // Delete old image if exists
      if (blog.imageUrl) {
        try {
          const oldImageRef = ref(storage, blog.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue with update even if old image deletion fails
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `blog-images/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      updates.imageUrl = await getDownloadURL(storageRef);
    }
    
    await updateDoc(blogRef, updates);
  } catch (error) {
    handleFirebaseError(error, 'update blog post');
  }
};

export const deleteBlogPost = async (id: string, imageUrl?: string): Promise<void> => {
  if (!id) {
    throw new Error('Blog ID is required for deletion');
  }
  
  try {
    // Delete image if exists
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with blog deletion even if image deletion fails
      }
    }
    
    // Delete blog post
    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
  } catch (error) {
    handleFirebaseError(error, 'delete blog post');
  }
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  if (!id) {
    console.error('Invalid blog ID provided to getBlogPost');
    throw new Error('Blog ID is required');
  }
  
  try {
    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);
    
    if (!blogSnap.exists()) {
      return null;
    }
    
    const data = blogSnap.data();
    
    if (!data) {
      console.error('Blog data is empty for ID:', id);
      return null;
    }
    
    return {
      id: blogSnap.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
    } as BlogPost;
  } catch (error) {
    console.error('Error getting blog post:', error);
    throw new Error(`Failed to get blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getAllBlogPosts = async (onlyPublished = true): Promise<BlogPost[]> => {
  try {
    let q = query(blogsCollection, orderBy('createdAt', 'desc'));
    
    if (onlyPublished) {
      q = query(q, where('published', '==', true));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: formatTimestamp(data.updatedAt),
      } as BlogPost;
    });
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

export const getUserBlogPosts = async (userId: string): Promise<BlogPost[]> => {
  if (!userId) {
    console.error('Invalid user ID provided to getUserBlogPosts');
    return [];
  }
  
  try {
    const q = query(
      blogsCollection, 
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: formatTimestamp(data.updatedAt),
      } as BlogPost;
    });
  } catch (error) {
    console.error('Error getting user blog posts:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Add like to a blog post
export const likeBlogPost = async (blogId: string, userId: string): Promise<void> => {
  if (!blogId || !userId) {
    throw new Error('Blog ID and User ID are required for liking a post');
  }
  
  try {
    const blogRef = doc(db, 'blogs', blogId);
    
    await updateDoc(blogRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
  } catch (error) {
    handleFirebaseError(error, 'like blog post');
  }
};

// Remove like from a blog post
export const unlikeBlogPost = async (blogId: string, userId: string): Promise<void> => {
  if (!blogId || !userId) {
    throw new Error('Blog ID and User ID are required for unliking a post');
  }
  
  try {
    const blogRef = doc(db, 'blogs', blogId);
    
    await updateDoc(blogRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
  } catch (error) {
    handleFirebaseError(error, 'unlike blog post');
  }
};

// Check if user has liked a blog post
export const hasUserLikedBlog = async (blogId: string, userId: string): Promise<boolean> => {
  if (!blogId || !userId) {
    return false;
  }
  
  try {
    const blogRef = doc(db, 'blogs', blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (!blogSnap.exists()) {
      return false;
    }
    
    const data = blogSnap.data();
    const likedBy = data.likedBy || [];
    
    return likedBy.includes(userId);
  } catch (error) {
    console.error('Error checking if user liked blog:', error);
    return false;
  }
};

// Helper function to format Firebase timestamps
const formatTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) {
    return new Date().toISOString();
  }
  return timestamp.toDate().toISOString();
}; 