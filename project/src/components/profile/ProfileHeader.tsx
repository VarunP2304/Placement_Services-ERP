import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Profile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {profile.email}
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {profile.phone}
            </div>
          </div>
          <p className="mt-4 text-gray-600">{profile.bio}</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
}