import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { User } from '../types';

// Update the user's display name
export const updateUserDisplayName = async (displayName: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently logged in');
  }
  
  try {
    await updateProfile(auth.currentUser, { displayName });
    
    // If you're also storing user data in Firestore, update it there too
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDoc, { displayName });
    
    console.log('Display name updated successfully');
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};

// Update the user's profile picture
export const updateUserProfilePicture = async (imageFile: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently logged in');
  }
  
  try {
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `profile-images/${auth.currentUser.uid}/${Date.now()}-${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const photoURL = await getDownloadURL(storageRef);
    
    // Update profile with new photo URL
    await updateProfile(auth.currentUser, { photoURL });
    
    // If you're also storing user data in Firestore, update it there too
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDoc, { photoURL });
    
    console.log('Profile picture updated successfully');
    return photoURL;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Get current user details
export const getCurrentUserDetails = (): User | null => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return null;
  }
  
  return {
    id: currentUser.uid,
    email: currentUser.email || '',
    displayName: currentUser.displayName || 'User',
    photoURL: currentUser.photoURL || undefined
  };
};

// Update the user's profile including bio
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently logged in');
  }
  
  try {
    const updates: Record<string, any> = {};
    
    // Update displayName if provided
    if (userData.displayName) {
      updates.displayName = userData.displayName;
      await updateProfile(auth.currentUser, { displayName: userData.displayName });
    }
    
    // Update photoURL if provided
    if (userData.photoURL !== undefined) {
      updates.photoURL = userData.photoURL;
      await updateProfile(auth.currentUser, { photoURL: userData.photoURL });
    }
    
    // Update bio if provided
    if (userData.bio !== undefined) {
      updates.bio = userData.bio;
    }
    
    // Only update Firestore if we have changes
    if (Object.keys(updates).length > 0) {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, updates);
      console.log('User profile updated successfully');
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 