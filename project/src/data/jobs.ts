import { Job } from '../types';

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'Bangalore, India',
    description: 'Looking for talented software engineers to join our growing team.',
    skills: ['React', 'TypeScript', 'Node.js'],
    status: 'Open',
    deadline: 'March 30, 2024',
  },
  {
    id: 2,
    title: 'Data Analyst',
    company: 'Analytics Pro',
    location: 'Mumbai, India',
    description: 'Seeking data analysts with strong analytical and visualization skills.',
    skills: ['Python', 'SQL', 'Tableau'],
    status: 'Open',
    deadline: 'April 5, 2024',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'InnovateX',
    location: 'Hyderabad, India',
    description: 'Join us in shaping the future of our product ecosystem.',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    status: 'Open',
    deadline: 'April 10, 2024',
  },
];