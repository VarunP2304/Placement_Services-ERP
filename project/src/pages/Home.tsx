import React from 'react';
import { Stats } from '../components/home/Stats';
import { JobCard } from '../components/home/JobCard';
import { jobs } from '../data/jobs';

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Launch Your Career with Confidence
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            Connect with top companies and find your dream job through our placement portal
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-indigo-50 transition-colors">
            View Opportunities
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stats />
      </div>

      {/* Featured Companies */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {['Microsoft', 'Google', 'Amazon', 'Meta'].map((company) => (
            <div key={company} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-700">{company}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </>
  );
}