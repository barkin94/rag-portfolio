import { Document } from "langchain";
import { Topic } from "../enums";

const resumeChunks: Document[] = [
  new Document({
    pageContent: `
  Location: Ankara, Turkey
  Summary: Backend Engineer with strong full-stack experience, specializing in building and optimizing high-performance APIs. Proven track record of enhancing scalability, reducing API latency, minimizing cloud infrastructure costs, and resolving complex, system-level issues across entire stacks. Has commercial experience in Node.js, Go and Java for distributed systems, and a particular interest in AI-driven development and products.
  Work Preferences: Open to remote, hybrid, or on-site roles. I prefer flexible working hours and value a healthy work-life balance.
  `,
    metadata: {
      tags: [Topic.GeneralInfo],
      source: "resume summary section",
    },
    id: "resume-summary",
  }),

  new Document({
    pageContent: `
      Email: barkinsagin@gmail.com
      LinkedIn: https://www.linkedin.com/in/barkinsagin
    `,
    metadata: {
      tags: [Topic.Contact],
      source: "resume contact section",
    },
    id: "resume-contact",
  }),

  new Document({
    pageContent: `
      Role: Backend Software Engineer
      Company: Getir
      Duration: August 2023 - June 2025
      Location: Ankara, Turkey
      Type: Hybrid
      
      At Getir, I maintained and developed event-driven backend microservices using Node.js, Java, and Go on AWS for a large-scale e-commerce platform serving millions of users.
      
      Details:
      • Integrated Google Vertex AI Search for commerce to significantly improve product search relevance and accuracy
      • Built a robust batch data pipeline using BigQuery, Cloud Scheduler, and Workflows for periodic data ingestion
      • Developed BFF (Backend for Frontend) microservices to control mobile app pages dynamically, reducing the need for frequent app releases
      • Worked extensively with event-driven architecture using Kafka for asynchronous communication
      • Optimized database queries and caching strategies with Redis to reduce API latency
      
      Technologies: NestJS, Node.js, Spring Boot, MongoDB, PostgreSQL, Redis, Kafka, Kubernetes, Terraform, AWS, GCP, New Relic
    `,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "resume work experience section",
    },
    id: "resume-work-getir-backend",
  }),

  new Document({
    pageContent: `
      Role: Frontend Software Engineer
      Company: Getir
      Duration: January 2023 - August 2023
      Location: Ankara, Turkey
      Type: Remote
      
      During my frontend role at Getir, I helped build web and admin applications using React and Nx for the e-commerce platform.
      
      Key Achievements:
      • Refactored untestable parts of a Next.js application and added comprehensive test coverage using Jest
      • Built a flexible, reusable component library in React with Storybook documentation
      • Implemented Redux-Saga for complex async state management
      • Collaborated with designers to ensure pixel-perfect implementation of UI/UX designs
      • Integrated New Relic for frontend performance monitoring
      
      Technologies: TypeScript, React, Next.js, Redux, Redux-Saga, Jest, Storybook, styled-components, Node.js, New Relic`,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "resume work experience section",
    },
    id: "resume-work-getir-frontend",
  }),

  new Document({
    pageContent: `
      Role: Full-Stack Software Engineer
      Company: Bilisim Inc.
      Duration: June 2021 - January 2023
      Location: Ankara, Turkey
      Type: On-Site
  
      At Bilisim Inc., I built and maintained React applications for an HR management SaaS platform used by employees and administrators.
      
      Key Achievements:
      • Extracted replicated React components into reusable libraries shared across teams, reducing code duplication by ~40%
      • Increased accessibility of internal UI tools by simplifying their APIs and adding documentation
      • Reduced unnecessary backend requests by implementing intelligent client-side caching
      • Contributed to backend features, working closely with the Java/Spring Boot backend team
      • Worked with Docker for local development and Jaeger for distributed tracing
  
    Technologies: TypeScript, React, Java 21, Spring Boot, PostgreSQL, Docker, Jaeger, Vault
    `,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "resume work experience section",
    },
    id: "resume-work-bilisim",
  }),

  new Document({
    pageContent: `
      Role: Full-Stack Software Engineer
      Company: Cubicl
      Duration: June 2019 - June 2021
      Location: Ankara, Turkey
      Type: On-Site
        
      At Cubicl, I was instrumental in building a JIRA-alternative task management SaaS from the ground up.
      
      Key Achievements:
      • Built the complete frontend in close collaboration with UI/UX designers
      • Developed RESTful APIs, background jobs, and database logic using NestJS and MongoDB
      • Integrated external services including SMS gateways, Google Drive, and email (SMTP/IMAP)
      • Replaced an expensive third-party SaaS by building a custom real-time push server with Socket.io
      • Designed and implemented the MongoDB schema with proper indexing for performance
      
      Technologies: TypeScript, React, Redux, MongoDB, NestJS, Express.js, Node.js, Socket.io, Docker, AWS
    `,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "resume work experience section",
    },
    id: "resume-work-cubicl",
  }),

  new Document({
    pageContent: `
      Languages & Backend: TypeScript, JavaScript, Node.js (Fastify, Express.js, NestJS), Java 21+(Spring Boot), Go (Fiber, Echo)
      Database & Messaging: PostgreSQL, MongoDB, Redis, Upstash Vector, Apache Kafka
      AI: LangChain (TypeScript), OpenRouter, Hugging Face, RAG systems, ETL processes
      Cloud & Infrastructure: AWS, GCP, Docker, Kubernetes, Terraform
      Frontend & Tooling: React, Next.js, Redux, Tailwind CSS, Jest, Storybook
      Monitoring: OpenTelemetry, Grafana
    `,
    metadata: {
      tags: [Topic.Skills],
      source: "resume skills section",
    },
    id: "resume-skills",
  }),

  new Document({
    pageContent: `      
      Bachelor of Science in Computer Engineering
      Baskent University, Ankara, Turkey
      2012 - 2018
      
      High School Diploma
      TED Ankara College Private High School, Ankara, Turkey
      2008 - 2012
      
      Professional Certificate
      Bournemouth Business School International, Bournemouth, UK (Summer 2015)
      • Science, Mathematics & IT: DISTINCTION
      • Business Skills: CREDIT
    `,
    metadata: {
      tags: [Topic.Education],
      source: "resume education and certifications section",
    },
    id: "resume-education",
  }),

//   new Document({
//     pageContent: `PROJECT HIGHLIGHTS & ACHIEVEMENTS
  
//   Performance Optimization:
//   • Reduced API response times by up to 60% through caching and query optimization
//   • Cut cloud infrastructure costs by optimizing resource usage and implementing auto-scaling
//   • Improved performance monitoring with New Relic
  
//   Architecture & Scalability:
//   • Designed event-driven microservices handling millions of requests daily
//   • Built robust data pipelines for batch processing
//   • Implemented BFF pattern to decouple mobile apps from backend changes
  
//   Code Quality:
//   • Increased test coverage significantly across multiple projects
//   • Built reusable component libraries reducing development time
//   • Mentored junior developers on best practices`,
//     metadata: {
//       tags: [Topic.Achievements],
//     },
//     id: "resume-achievements",
//   }),
];

export default resumeChunks;
