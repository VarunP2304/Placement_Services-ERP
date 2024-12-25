import React from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { Education } from '../components/profile/Education';
import { Experience } from '../components/profile/Experience';
import { Skills } from '../components/profile/Skills';
import { profile } from '../data/profile';

export function Profile() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Education education={profile.education} />
          <Experience experience={profile.experience} />
        </div>
        
        <Skills skills={profile.skills} />
      </div>
    </div>
  );
}