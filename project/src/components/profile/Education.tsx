import React from 'react';
import { GraduationCap } from 'lucide-react';
import type { Education as EducationType } from '../../types/profile';

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <GraduationCap className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Education</h2>
      </div>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-gray-600">{edu.institution}</p>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>{edu.year}</span>
              <span>{edu.grade}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}