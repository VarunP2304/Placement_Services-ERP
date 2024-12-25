import React from 'react';
import { Search } from 'lucide-react';

export function JobFilters() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All Locations</option>
            <option value="bangalore">Bangalore</option>
            <option value="mumbai">Mumbai</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-2">Full Time</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-2">Internship</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}