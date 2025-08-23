import { useState } from 'react';
import { User } from '../types';
import EditProfileModal from './EditProfileModal';

interface UserProfileProps {
  user: User;
  totalPosts: number;
  publishedPosts: number;
  onProfileUpdate?: (updatedUser: User) => void;
}

const UserProfile = ({ user, totalPosts, publishedPosts, onProfileUpdate }: UserProfileProps) => {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleProfileUpdate = (updatedUser: User) => {
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-8">
        <div className="bg-primary-600 h-32"></div>
        <div className="px-6 py-4 sm:px-8 sm:py-6 -mt-16 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName}
                  className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-primary-700 text-3xl font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
              <p className="text-gray-600">{user.email}</p>
              
              <div className="mt-2 space-x-2">
                <button 
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  onClick={() => setShowProfileInfo(!showProfileInfo)}
                >
                  {showProfileInfo ? 'Hide Info' : 'Show Info'}
                </button>
                
                <button
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="hidden sm:flex flex-col items-end mt-4 sm:mt-0">
              <div className="bg-primary-50 rounded-xl px-4 py-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Posts</p>
                    <p className="text-2xl font-bold text-primary-700">{totalPosts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="text-2xl font-bold text-primary-700">{publishedPosts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile stats (visible only on small screens) */}
          <div className="sm:hidden mb-6">
            <div className="bg-primary-50 rounded-xl px-4 py-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Total Posts</p>
                  <p className="text-2xl font-bold text-primary-700">{totalPosts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-2xl font-bold text-primary-700">{publishedPosts}</p>
                </div>
              </div>
            </div>
          </div>
          
          {showProfileInfo && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Profile Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-700">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-700">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-700">Blog Author</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditProfileModal 
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default UserProfile; 