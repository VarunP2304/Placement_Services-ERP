export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
}