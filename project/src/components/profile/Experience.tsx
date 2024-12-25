import React from 'react';
import { Briefcase } from 'lucide-react';
import type { Experience as ExperienceType } from '../../types/profile';

interface ExperienceProps {
  experience: ExperienceType[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Experience</h2>
      </div>
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
            <p className="text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">{exp.duration}</p>
            <p className="mt-2 text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}