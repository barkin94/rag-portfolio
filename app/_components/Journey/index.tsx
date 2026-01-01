import { workExperienceData } from '@/backend/data';
import Card from '../UI/Card';

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
    <section id='journey' className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-4">My Journey</h1>
      <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">The path of building, scaling...</p>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700">
        {timelineItems.map((item, index) => (
          <div key={index} className="mb-8 flex items-start w-full">
            <div className="relative z-1 shrink-0 w-5 h-5 bg-background border-slate-500 border-3 border-solid rounded-full mt-1.5 -ml-2.5">
              <div className="absolute right-1 top-1 z-2 shrink-0 w-1.75 h-1.75 bg-foreground rounded-full"></div>
            </div>

            <div className="grow pl-8">
              <Card>
                <div className='flex justify-between mb-4'>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.role}</h3>
                    <p className="text-lg text-slate-700 dark:text-slate-300">{item.company}</p>
                  </div>
                  <div className="text-md rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 h-fit">{item.startDate} - {item.endDate}</div>
                </div>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
                  {item.description.map((desc, descIndex) => (
                    <li key={descIndex}>{desc}</li>
                  ))}
                </ul>
              </Card>
              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
