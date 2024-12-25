import React from 'react';
import { JobCard } from '../components/home/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { jobs } from '../data/jobs';

export function Jobs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Opportunities</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>
        
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}