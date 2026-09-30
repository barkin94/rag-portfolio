import Card from '@/common/components/Card';
import WithFadeInAnimation from '@/common/components/FadeInOnViewportEntry';

interface ExperienceProps {
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    location?: string | null;
    type?: string | null;
    bullets: string[];
  }>;
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id='journey' className="container mx-auto px-4 py-20 max-w-4xl">
      <WithFadeInAnimation threshold={0.5}>
        <h1 className="text-4xl font-bold text-center mb-4">My Journey</h1>
        <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">The path of building, scaling...</p>
      </WithFadeInAnimation>

      {experience.map((item, index) => {
        return (
          <WithFadeInAnimation key={index} threshold={0.5}>
            <div className="mb-8 flex items-start w-full relative border-l-2 border-slate-200 dark:border-slate-700">
              <div className="relative z-1 shrink-0 w-5 h-5 bg-background border-slate-500 border-3 border-solid rounded-full -mt-1.5 -ml-2.75">
                <div className="absolute right-[3.5px] top-[3.5px] z-2 shrink-0 w-1.75 h-1.75 bg-foreground rounded-full"></div>
              </div>

              <div className="grow pl-8">
                <Card>
                  <div className='flex justify-between mb-4'>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.role}</h3>
                      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item.company}</p>
                    </div>
                    <div className="text-md rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 h-fit">{item.duration}</div>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
                    {item.bullets.map((desc, descIndex) => (
                      <li key={descIndex}>{desc}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </WithFadeInAnimation>
        );
      })}
    </section>
  );
}
