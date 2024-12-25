import { Profile } from '../types/profile';

export const profile: Profile = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  bio: 'Final year Computer Science student passionate about web development and AI.',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  education: [
    {
      id: 1,
      degree: 'B.Tech in Computer Science',
      institution: 'Tech University',
      year: '2020-2024',
      grade: '8.5 CGPA',
    },
  ],
  experience: [
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'TechCorp',
      duration: 'Summer 2023',
      description: 'Worked on developing full-stack web applications using React and Node.js.',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
};