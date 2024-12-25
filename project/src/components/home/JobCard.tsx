import { Building2, MapPin, Timer } from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <div className="flex items-center space-x-2 text-gray-600 mt-2">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 mt-1">
            <Timer className="w-4 h-4" />
            <span>{job.deadline}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {job.status}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">{job.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
      <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
        Apply Now
      </button>
    </div>
  );
}