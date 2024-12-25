import React from 'react';
import { Code } from 'lucide-react';

interface SkillsProps {
  skills: string[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Code className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Skills</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}