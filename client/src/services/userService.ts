import api from './api';
import { User } from '../types';

// Update the user's display name
export const updateUserDisplayName = async (displayName: string): Promise<void> => {
  try {
    const response = await api.put('/auth/profile', { displayName });
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('Display name updated successfully');
  } catch (error: any) {
    console.error('Error updating display name:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error updating display name');
  }
};

// Update the user's profile picture
export const updateUserProfilePicture = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('Profile picture updated successfully');
    return updatedUser.photoURL || '';
  } catch (error: any) {
    console.error('Error updating profile picture:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error updating profile picture');
  }
};

// Get current user details synchronously from local storage cache
export const getCurrentUserDetails = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Error parsing user details from local storage:', e);
    return null;
  }
};

// Update the user's profile including bio and optional avatar photo file
export const updateUserProfile = async (
  userId: string, 
  userData: Partial<User>, 
  photoFile?: File | null
): Promise<void> => {
  try {
    const formData = new FormData();
    if (userData.displayName) {
      formData.append('displayName', userData.displayName);
    }
    if (userData.bio !== undefined) {
      formData.append('bio', userData.bio || '');
    }
    if (userData.photoURL !== undefined && userData.photoURL !== null) {
      formData.append('photoURL', userData.photoURL);
    }
    if (photoFile) {
      formData.append('profileImage', photoFile);
    }

    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('User profile updated successfully');
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error updating user profile');
  }
};