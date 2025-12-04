import { workExperienceData } from '@/backend/data';

interface TimelineItem {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export default function Timeline() {
  const timelineItems: TimelineItem[] = workExperienceData.map(item => ({
    role: item.role,
    company: item.company,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-4">My Journey</h1>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">The path of building, scaling...</p>

      <div className="relative border-l-2 border-gray-200 dark:border-gray-700">
        {timelineItems.map((item, index) => (
          <div key={index} className="mb-8 flex items-start w-full">
            <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1.5 -ml-2"></div>
            <div className="flex-grow pl-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.role}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200">{item.company}</p>
              <p className="text-md text-gray-500 dark:text-gray-400 mb-2">{item.startDate} - {item.endDate}</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {item.description.map((desc, descIndex) => (
                  <li key={descIndex}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
