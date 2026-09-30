import Card from '@/common/components/Card';
import WithFadeInAnimation from '@/common/components/FadeInOnViewportEntry';

interface TechStackProps {
  skills: {
    categories: Record<string, string[]>;
  };
}

const TechStack = ({ skills }: TechStackProps) => {
  return (
    <section id="tech-stack" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <WithFadeInAnimation threshold={0.5}>
        <h2 className="text-3xl font-bold text-center mb-4">My Tech Stack</h2>
        <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">Technologies and tools I use to ship products</p>
      </WithFadeInAnimation>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 mx-10 sm:mx-40 lg:mx-60">
        {Object.entries(skills.categories).map(([category, techList]) => (
          <WithFadeInAnimation key={category} threshold={0.5}>
            <Card>
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className='flex flex-wrap'>
                {techList.map((tech) => (
                  <span key={tech} className='rounded-full bg-slate-200/50 dark:bg-slate-800/50 mr-2 mb-3 px-3 py-1'>{tech}</span>
                ))}
              </div>
            </Card>
          </WithFadeInAnimation>

        ))}
      </div>
    </section>
  );
};

export default TechStack;
