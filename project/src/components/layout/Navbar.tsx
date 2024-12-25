import { BookOpen, BriefcaseIcon, HomeIcon, UserCircle } from 'lucide-react';
import { Link } from '../ui/Link';

export function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">CareerConnect</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/" icon={<HomeIcon className="w-4 h-4" />}>Home</Link>
            <Link href="/jobs" icon={<BriefcaseIcon className="w-4 h-4" />}>Jobs</Link>
            <Link href="/profile" icon={<UserCircle className="w-4 h-4" />}>Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}