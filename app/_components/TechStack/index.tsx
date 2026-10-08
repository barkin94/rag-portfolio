"use client";

import Card from "@/common/components/Card";
import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import Carousel from "@/common/components/Carousel";

interface TechStackProps {
  skills: {
    categories: Record<string, string[]>;
  };
}

const TechStack = ({ skills }: TechStackProps) => {
  const categories = Object.entries(skills.categories);

return (
    <section id="tech-stack" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="mx-auto px-4" style={{ maxWidth: '1400px' }}>
        <WithFadeInAnimation threshold={0.5}>
          <h2 className="text-3xl font-bold text-center mb-4">My Tech Stack</h2>
          <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">
            Technologies and tools I use to ship products
          </p>
        </WithFadeInAnimation>
     
        <WithFadeInAnimation threshold={0.5}>
          <Carousel
          autoplay
          loop
          layout={{ slidesPerView: { base: 1, sm: 2, md: 3 }, gap: 8 }}
          slides={categories.map(([category, techList]) => (
            <Card key={category} hoverScale>
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        />
</WithFadeInAnimation>
     
      </div>
    </section>
  );
};

export default TechStack;

