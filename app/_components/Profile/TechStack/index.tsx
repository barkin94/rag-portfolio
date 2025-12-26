import React from 'react';
import Card from '../../UI/Card';

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
    "Cloud Scheduler",
    "Workflows",
    "Google Vertex AI Search",
  ],
};

const TechStack = () => {
  return (
    <section id="tech-stack" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">My Tech Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, techList]) => (
          <Card key={category}>
            <h3 className="text-xl font-bold mb-4">{category}</h3>
            <ul className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <li key={tech} className="bg-stone-200 dark:bg-stone-700 rounded-full px-3 py-1 text-sm font-medium">
                  {tech}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
