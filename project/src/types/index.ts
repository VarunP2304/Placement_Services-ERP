export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  status: 'Open' | 'Closed';
  deadline: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
}