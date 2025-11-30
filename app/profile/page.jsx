'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

const ProfilePage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    birthDate: '',
    gender: '',
    bio: '',
    imageUrl: user?.imageUrl || ''
  });
  const [tempData, setTempData] = useState(profileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile data from backend
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data.profile);
        setTempData(data.profile);
      } else {
        // Fallback to Clerk user data if API fails
        const clerkData = {
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
          phone: '',
          address: '',
          birthDate: '',
          gender: '',
          bio: '',
          imageUrl: user?.imageUrl || ''
        };
        setProfileData(clerkData);
        setTempData(clerkData);
        toast.error('Using basic profile info. Some details may not be saved.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to Clerk user data on error
      const clerkData = {
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: '',
        address: '',
        birthDate: '',
        gender: '',
        bio: '',
        imageUrl: user?.imageUrl || ''
      };
      setProfileData(clerkData);
      setTempData(clerkData);
      toast.error('Using basic profile info. Some details may not be saved.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile data to backend
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data.profile);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    saveProfile();
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-700 mb-2">My Profile</h1>
            <p className="text-gray-600 text-sm sm:text-base">Loading your profile information...</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-700 mb-2">My Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-rose-400 to-pink-400 p-4 sm:p-6 md:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-rose-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{profileData.name}</h2>
                <p className="text-rose-100 text-sm sm:text-base">{profileData.email}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {/* Personal Information */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-rose-700 mb-4">Personal Information</h3>
                
                {/* Name */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Address</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base resize-none"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.address}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date of Birth</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={tempData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.birthDate}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Gender</span>
                  </label>
                  {isEditing ? (
                    <select
                      value={tempData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">{profileData.gender}</p>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-rose-700 mb-4">About Me</h3>
                
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Bio</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm sm:text-base resize-none"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base min-h-[100px]">
                      {profileData.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-rose-700 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-rose-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-rose-600">12</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">8</p>
                  <p className="text-sm text-gray-600">Wishlist</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-indigo-600">2024</p>
                  <p className="text-sm text-gray-600">Member Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
