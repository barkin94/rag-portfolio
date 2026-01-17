import Card from '@/common/components/Card';
import WithFadeInAnimation from '@/common/components/FadeInOnViewportEntry';

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
    <section id='journey' className="container mx-auto px-4 py-20 max-w-4xl">
      <WithFadeInAnimation threshold={0.5}>
        <h1 className="text-4xl font-bold text-center mb-4">My Journey</h1>
        <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">The path of building, scaling...</p>
      </WithFadeInAnimation>

      {timelineItems.map((item, index) => (
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
        </WithFadeInAnimation>
      ))}
    </section>
  );
}

export const workExperienceData = [
  {
    role: 'Backend Software Engineer',
    company: 'Getir',
    location: 'Hybrid (Ankara, Turkey)',
    startDate: 'August 2023',
    endDate: 'June 2025',
    description: [
      'Maintained and developed event-driven backend microservices (Node.js, Java, Go) on AWS for a large-scale e-commerce platform.',
      'Integrated Google Vertex AI Search for commerce to improve product search relevance and accuracy.',
      'Built a batch data pipeline using BigQuery, Cloud Scheduler, and Workflows for periodic data ingestion.',
      'Developed BFF services to control mobile app pages from the backend, reducing the need for frequent app releases.'
    ],
    technologies: ['NestJS', 'Node.js', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'New Relic']
  },
  {
    role: 'Frontend Software Engineer',
    company: 'Getir',
    location: 'Remote',
    startDate: 'January 2023',
    endDate: 'August 2023',
    description: [
      'Helped build web and admin apps using React and Nx for a large e-commerce platform.',
      'Refactored untestable parts of a Next.js app and added tests to improve test coverage and reliability.',
      'Built a flexible, reusable component library in React to speed up UI development.'
    ],
    technologies: ['Typescript', 'React', 'Next.js', 'Redux', 'Redux-Saga', 'Jest', 'Storybook', 'styled-components', 'Node.js', 'New Relic']
  },
  {
    role: 'Full-stack Software Engineer',
    company: 'Bilisim Inc.',
    location: 'On-Site (Ankara, Turkey)',
    startDate: 'June 2021',
    endDate: 'January 2023',
    description: [
      'Built and maintained React apps of an HR management SaaS used by employees and admins.',
      'Extracted replicated React components (buttons, inputs, etc.) into reusable libraries shared across teams.',
      'Increased the accessibility of internal UI tools by simplifying their APIs and adding examples.',
      'Reduced unnecessary backend requests by adding client-side caching for common data.',
      'Helped with backend features when needed, working closely with the backend team.'
    ],
    technologies: ['React', 'Typescript', 'Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Jaeger', 'Vault']
  },
  {
    role: 'Full-stack Software Engineer',
    company: 'Cubicl',
    location: 'On-Site (Ankara, Turkey)',
    startDate: 'June 2019',
    endDate: 'June 2021',
    description: [
      'Built the frontend of a JIRA-alternative, user-friendly task management SaaS in collaboration with UI/UX designers.',
      'Developed REST APIs, background jobs, and database logic using NestJS for core app features.',
      'Integrated external services like SMS gateways, Google Drive, and email (SMTP/IMAP).',
      'Replaced a 3rd-party SaaS dependency by building a custom push server with Socket.io.'
    ],
    technologies: ['Typescript', 'React', 'Redux', 'MongoDB', 'NestJS', 'Express.js', 'Node.js', 'Docker', 'AWS']
  }
];
