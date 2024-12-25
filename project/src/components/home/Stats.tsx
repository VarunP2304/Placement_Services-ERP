import { BriefcaseIcon, BuildingIcon, GraduationCapIcon } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'Total Placements',
    value: '500+',
    icon: GraduationCapIcon,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Companies Visited',
    value: '50+',
    icon: BuildingIcon,
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'Active Openings',
    value: '25',
    icon: BriefcaseIcon,
    color: 'bg-purple-500',
  },
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
        >
          <div className={`${stat.color} p-3 rounded-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}