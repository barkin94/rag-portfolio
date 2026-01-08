import { Document } from "langchain";

const resumeChunks: Document[] = [
  new Document({
    pageContent: `ABOUT BARKIN BUYUKSAGIN
      
  Location: Ankara, Turkey
  Email: barkinsagin@gmail.com
  LinkedIn: https://www.linkedin.com/in/barkinsagin
  
  I'm a Back-End Engineer with strong full-stack experience, specializing in building and optimizing high-performance Node.js services and APIs. I focus on enhancing scalability, reducing API latency, and minimizing cloud infrastructure costs to deliver tangible business results.
  
  I'm adept at diagnosing and resolving complex, system-level issues across the backend and infrastructure, and have commercial experience in Go and Java for distributed systems.
  
  Work Preferences: Open to remote, hybrid, or on-site roles. I prefer flexible working hours and value a healthy work-life balance.`,
    metadata: {
      section: "overview",
      topics: ["about", "summary", "contact", "preferences"],
    },
  }),

  new Document({
    pageContent: `GETIR - BACKEND SOFTWARE ENGINEER (August 2023 - June 2025)
  Hybrid in Ankara, Turkey
  
  At Getir, I maintained and developed event-driven backend microservices using Node.js, Java, and Go on AWS for a large-scale e-commerce platform serving millions of users.
  
  Key Achievements:
  • Integrated Google Vertex AI Search for commerce to significantly improve product search relevance and accuracy
  • Built a robust batch data pipeline using BigQuery, Cloud Scheduler, and Workflows for periodic data ingestion
  • Developed BFF (Backend for Frontend) services to control mobile app pages dynamically, reducing the need for frequent app releases
  • Worked extensively with event-driven architecture using Kafka for asynchronous communication
  • Optimized database queries and caching strategies with Redis to reduce API latency
  
  Technologies: NestJS, Node.js, Spring Boot, MongoDB, PostgreSQL, Redis, Kafka, Kubernetes, Terraform, AWS, GCP, New Relic`,
    metadata: {
      section: "work",
      company: "getir",
      role: "backend",
    },
  }),

  new Document({
    pageContent: `GETIR - FRONTEND SOFTWARE ENGINEER (January 2023 - August 2023)
  Remote
  
  During my frontend role at Getir, I helped build web and admin applications using React and Nx for the e-commerce platform.
  
  Key Achievements:
  • Refactored untestable parts of a Next.js application and added comprehensive test coverage using Jest
  • Built a flexible, reusable component library in React with Storybook documentation
  • Implemented Redux-Saga for complex async state management
  • Collaborated with designers to ensure pixel-perfect implementation of UI/UX designs
  • Integrated New Relic for frontend performance monitoring
  
  Technologies: TypeScript, React, Next.js, Redux, Redux-Saga, Jest, Storybook, styled-components, Node.js, New Relic`,
    metadata: {
      section: "work",
      company: "getir",
      role: "frontend",
    },
  }),

  new Document({
    pageContent: `BILISIM INC. - FULL-STACK SOFTWARE ENGINEER (June 2021 - January 2023)
  On-Site in Ankara, Turkey
  
  At Bilisim Inc., I built and maintained React applications for an HR management SaaS platform used by employees and administrators.
  
  Key Achievements:
  • Extracted replicated React components into reusable libraries shared across teams, reducing code duplication by ~40%
  • Increased accessibility of internal UI tools by simplifying their APIs and adding documentation
  • Reduced unnecessary backend requests by implementing intelligent client-side caching
  • Contributed to backend features, working closely with the Java/Spring Boot backend team
  • Worked with Docker for local development and Jaeger for distributed tracing
  
  Technologies: React, TypeScript, Java, Spring Boot, PostgreSQL, Docker, Jaeger, Vault`,
    metadata: {
      section: "work",
      company: "bilisim",
      role: "fullstack",
    },
  }),

  new Document({
    pageContent: `CUBICL - FULL-STACK SOFTWARE ENGINEER (June 2019 - June 2021)
  On-Site in Ankara, Turkey
  
  At Cubicl, I was instrumental in building a JIRA-alternative task management SaaS from the ground up.
  
  Key Achievements:
  • Built the complete frontend in close collaboration with UI/UX designers
  • Developed RESTful APIs, background jobs, and database logic using NestJS and MongoDB
  • Integrated external services including SMS gateways, Google Drive, and email (SMTP/IMAP)
  • Replaced an expensive third-party SaaS by building a custom real-time push server with Socket.io
  • Designed and implemented the MongoDB schema with proper indexing for performance
  
  Technologies: TypeScript, React, Redux, MongoDB, NestJS, Express.js, Node.js, Socket.io, Docker, AWS`,
    metadata: {
      section: "work",
      company: "cubicl",
      role: "fullstack",
    },
  }),

  new Document({
    pageContent: `TECHNICAL SKILLS & EXPERTISE
  
  Primary Strengths:
  • Backend Development: Node.js, NestJS, TypeScript, Express.js - extensive experience building scalable APIs and microservices
  • Frontend Development: React, Next.js, Redux, TypeScript - strong skills in building modern web applications
  • Databases: PostgreSQL, MongoDB, Redis - proficient in both SQL and NoSQL databases
  
  Additional Technologies:
  • Languages: JavaScript/TypeScript (expert), Java (commercial experience), Go (commercial experience)
  • Backend Frameworks: Spring Boot, NestJS, Express.js
  • Infrastructure: AWS, GCP, Docker, Kubernetes, Terraform
  • Message Queues: Kafka, Redis Pub/Sub
  • Monitoring: New Relic, Jaeger
  • Testing: Jest, integration testing, unit testing
  • Real-time: Socket.io, WebSockets
  
  Specializations:
  • Building and optimizing high-performance backend services
  • Reducing API latency through caching and database optimization
  • Event-driven microservices architecture
  • Scalability improvements and cost optimization`,
    metadata: {
      section: "skills",
      topics: ["technologies", "expertise", "skills"],
    },
  }),

  new Document({
    pageContent: `EDUCATION & CERTIFICATIONS
  
  Bachelor of Science in Computer Engineering
  Baskent University, Ankara, Turkey
  2012 - 2018
  
  High School Diploma
  TED Ankara College Private High School, Ankara, Turkey
  2008 - 2012
  
  Professional Certificate
  Bournemouth Business School International, Bournemouth, UK (Summer 2015)
  • Science, Mathematics & IT: DISTINCTION
  • Business Skills: CREDIT`,
    metadata: {
      section: "education",
    },
  }),

  new Document({
    pageContent: `PROJECT HIGHLIGHTS & ACHIEVEMENTS
  
  Performance Optimization:
  • Reduced API response times by up to 60% through caching and query optimization
  • Cut cloud infrastructure costs by optimizing resource usage and implementing auto-scaling
  • Improved performance monitoring with New Relic
  
  Architecture & Scalability:
  • Designed event-driven microservices handling millions of requests daily
  • Built robust data pipelines for batch processing
  • Implemented BFF pattern to decouple mobile apps from backend changes
  
  Code Quality:
  • Increased test coverage significantly across multiple projects
  • Built reusable component libraries reducing development time
  • Mentored junior developers on best practices`,
    metadata: {
      section: "achievements",
    },
  }),
];

export default resumeChunks;
