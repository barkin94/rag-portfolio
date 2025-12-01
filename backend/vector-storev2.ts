import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";

import Config from "./config";

const createInfoChunks = () => [
  new Document({
    pageContent: `FULL NAME: BARKIN BUYUKSAGIN
    LOCATION: Ankara, Turkey
    E-MAIL: barkinsagin@gmail.com
    LINKEDIN: https://www.linkedin.com/in/barkinsagin`,
    metadata: { category: 'info', chunkType: 'contact' }
  }),
  new Document({
    pageContent: `SUMMARY: Back-End Engineer with strong full-stack experience, specializing in building and optimizing
    high-performance Node.js services and APIs. Focused on enhancing scalability, reducing API latency, and minimizing
    cloud infrastructure costs to deliver tangible business results.`,
    metadata: { category: 'info', chunkType: 'summary' }
  }),
  new Document({
    pageContent: `EXPERTISE: Adept at diagnosing and resolving complex, system-level issues across the backend and infrastructure. 
    Also has commercial experience in Go and Java for distributed systems.`,
    metadata: { category: 'info', chunkType: 'expertise' }
  })
];

// Work experience data with structured information
const workExperienceData = [
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

// Create work experience chunks with rich metadata
const createWorkExperienceChunks = () => {
  const documents: Document[] = [];
  
  workExperienceData.forEach((exp, index) => {
    // Create a full role chunk with all context
    const fullContext = `
    ROLE: ${exp.role}
    COMPANY: ${exp.company}
    LOCATION: ${exp.location}
    START-DATE: ${exp.startDate}
    END-DATE: ${exp.endDate}
    DESCRIPTION:
    ${exp.description.map(d => `- ${d}`).join('\n    ')}
    TECHNOLOGIES: ${exp.technologies.join(', ')}
    `;
    
    documents.push(new Document({
      pageContent: fullContext.trim(),
      metadata: {
        category: 'work_experience',
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate,
        endDate: exp.endDate,
        technologies: exp.technologies,
        location: exp.location,
        chunkType: 'full',
        experienceIndex: index
      }
    }));
    
    // Create individual achievement chunks for better granularity
    exp.description.forEach((achievement, achIndex) => {
      const achievementChunk = `
      ROLE: ${exp.role}
      COMPANY: ${exp.company}
      START-DATE: ${exp.startDate}
      END-DATE: ${exp.endDate}
      ACHIEVEMENT: ${achievement}
      TECHNOLOGIES: ${exp.technologies.join(', ')}
      `;
      
      documents.push(new Document({
        pageContent: achievementChunk.trim(),
        metadata: {
          category: 'work_experience',
          company: exp.company,
          role: exp.role,
          startDate: exp.startDate,
          endDate: exp.endDate,
          technologies: exp.technologies,
          chunkType: 'achievement',
          experienceIndex: index,
          achievementIndex: achIndex
        }
      }));
    });
    
    // Create technology-focused chunks
    const techChunk = `
    ROLE: ${exp.role}
    COMPANY: ${exp.company}
    START-DATE: ${exp.startDate}
    END-DATE: ${exp.endDate}
    TECHNOLOGIES USED: ${exp.technologies.join(', ')}
    CONTEXT: Worked with these technologies at ${exp.company} as a ${exp.role}
    `;
    
    documents.push(new Document({
      pageContent: techChunk.trim(),
      metadata: {
        category: 'work_experience',
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate,
        endDate: exp.endDate,
        technologies: exp.technologies,
        chunkType: 'technologies',
        experienceIndex: index
      }
    }));
  });
  
  return documents;
};

// Education data structured for better chunking
const educationData = {
  degrees: [
    {
      degree: 'B.Sc. in Computer Engineering',
      institution: 'Baskent University',
      location: 'Ankara, Turkey',
      period: '2012-2018'
    },
    {
      degree: 'High School Diploma',
      institution: 'TED Ankara College Private High School',
      location: 'Ankara, Turkey',
      period: '2008-2012'
    }
  ],
  certificates: [
    {
      name: 'Bournemouth Business School International',
      location: 'Bournemouth, UK',
      period: 'Summer 2015',
      subjects: [
        { name: 'Science, Mathematics & IT', grade: 'DISTINCTION' },
        { name: 'Business Skills', grade: 'CREDIT' }
      ]
    }
  ]
};

// Create education chunks with metadata
const createEducationChunks = () => {
  const documents: Document[] = [];
  
  // Full education chunk
  const fullEducation = `
    EDUCATION:
    ${educationData.degrees.map(d => `- ${d.degree}, ${d.institution}, ${d.location} (${d.period})`).join('\n    ')}

    CERTIFICATES:
    ${educationData.certificates.map(c => 
      `- ${c.name}, ${c.location} (${c.period})\n    ${c.subjects.map(s => `${s.name}: ${s.grade}`).join('\n    ')}`
    ).join('\n    ')}
  `;
  
  documents.push(new Document({
    pageContent: fullEducation.trim(),
    metadata: {
      category: 'education',
      chunkType: 'full'
    }
  }));
  
  // Individual degree chunks
  educationData.degrees.forEach((degree, index) => {
    const degreeChunk = `
    DEGREE: ${degree.degree}
    INSTITUTION: ${degree.institution}
    LOCATION: ${degree.location}
    PERIOD: ${degree.period}
    `;
    
    documents.push(new Document({
      pageContent: degreeChunk.trim(),
      metadata: {
        category: 'education',
        chunkType: 'degree',
        degreeIndex: index
      }
    }));
  });
  
  // Certificate chunks
  educationData.certificates.forEach((cert, index) => {
    cert.subjects.forEach((subject, subIndex) => {
      const certChunk = `
      CERTIFICATE: ${cert.name}
      LOCATION: ${cert.location}
      PERIOD: ${cert.period}
      SUBJECT: ${subject.name}
      GRADE: ${subject.grade}
      `;
      
      documents.push(new Document({
        pageContent: certChunk.trim(),
        metadata: {
          category: 'education',
          chunkType: 'certificate',
          certificateIndex: index,
          subjectIndex: subIndex
        }
      }));
    });
  });
  
  return documents;
};

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: Config.gemini.apiKey
});

const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments([
  ...createInfoChunks(),
  ...createWorkExperienceChunks(),
  ...createEducationChunks()
])

export { vectorStore };
