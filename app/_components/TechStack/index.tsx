import React from 'react';
import Card from '../UI/Card';

const skills = {
  "Programming Languages": [
    "TypeScript",
    "Java",
    "Go",
  ],
  "Frontend": [
    "React",
    "Next.js",
    "Redux",
    "Redux-Saga",
    "Jest",
    "Storybook",
    "styled-components",
  ],
  "Backend": [
    "Node.js",
    "NestJS",
    "Spring Boot",
    "Express.js",
    "Kafka",
    "Socket.io",
  ],
  "Databases": [
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "BigQuery",
  ],
  "Cloud & DevOps": [
    "AWS",
    "GCP",
    "Kubernetes",
    "Docker",
    "Terraform",
    "New Relic",
    "Jaeger",
    "Vault",
  ],
};

const TechStack = () => {
  return (
    <section id="tech-stack" className="py-20 bg-stone-50/50 dark:bg-stone-900/30">
      <h2 className="text-3xl font-bold text-center mb-4">My Tech Stack</h2>
      <p className="text-xl text-center text-stone-600 dark:text-stone-300 mb-12">Capabilities I bring to product building</p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 mx-10 sm:mx-40 md:mx-60">
        {Object.entries(skills).map(([category, techList]) => (
          <Card key={category}>
            <h3 className="text-xl font-bold mb-4">{category}</h3>
            <div className='flex flex-wrap'>
            {techList.map((tech) => (
                <span key={tech} className='rounded-full bg-stone-200/50 dark:bg-stone-800/50 mr-2 mb-3 px-3 py-1'>{tech}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
