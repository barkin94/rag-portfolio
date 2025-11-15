import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Document } from "@langchain/core/documents";

const raw_chunk_list = [
    `
    BARKIN BUYUKSAGIN
    Backend Software Engineer
    Ankara, Turkey (+90) 536 582 6820 barkinsagin@gmail.com
    [www.linkedin.com/in/barkinsagin](https://www.linkedin.com/in/barkinsagin)

    Summary: Back-End Engineer with strong full-stack experience, specializing in building and optimizing high-performance Node.js services and APIs. Focused on enhancing scalability, reducing API latency, and minimizing cloud infrastructure costs to deliver tangible business results. Adept at diagnosing and resolving complex, system-level issues across the backend and infrastructure. Also has commercial experience in Go and Java for distributed systems.
`,
    `
    TITLE: Backend Software Engineer
    COMPANY: Getir
    LOCATION: Hybrid (Ankara, Turkey)
    DATES: August 2023 - June 2025
    DESCRIPTION:
    - Maintained and developed event-driven backend microservices (Node.js, Java, Go) on AWS for a large-scale e-commerce platform.
    - Integrated "Google Vertex Al Search for commerce" to improve product search relevance and accuracy.
    - Built a batch data pipeline using BigQuery, Cloud Scheduler, and Workflows for periodic data ingestion.
    - Developed BFF services to control mobile app pages from the backend, reducing the need for frequent app releases.
    TECHNOLOGIES: NestJS, Node.js, Spring Boot, MongoDB, PostgreSQL, Redis, Kafka, Kubernetes, Terraform, AWS, GCP, New Relic
`,
    `
    TITLE: Frontend Software Engineer
    COMPANY: Getir
    LOCATION: Remote
    DATES: January 2023 - August 2023
    DESCRIPTION:
    - Helped build web and admin apps using React and Nx for a large e-commerce platform.
    - Refactored untestable parts of a Next.js app and added tests to improve test coverage and reliability.
    - Built a flexible, reusable component library in React to speed up UI development.
    TECHNOLOGIES: Typescript, React, Next.js, Redux, Redux-Saga, Jest, Storybook, styled-components, Node.js, New Relic
`,
    `
    TITLE: Full-stack Software Engineer
    COMPANY: Bilisim Inc.
    LOCATION: On-Site (Ankara, Turkey)
    DATES: June 2021 - January 2023
    DESCRIPTION:
    - Built and maintained React apps of an HR management SaaS used by employees and admins.
    - Extracted replicated React components (buttons, inputs, etc.) into reusable libraries shared across teams.
    - Increased the accessibility of internal Ul tools by simplifying their APIs and adding examples.
    - Reduced unnecessary backend requests by adding client-side caching for common data.
    - Helped with backend features when needed, working closely with the backend team.
    TECHNOLOGIES: React, Typescript, Java, Spring Boot, PostgreSQL, Docker, Jaeger, Vault
`,
    `
    TITLE: Full-stack Software Engineer
    COMPANY: Cubicl
    LOCATION: On-Site (Ankara, Turkey)
    DATES: June 2019 - June 2021
    DESCRIPTION:
    - Built the frontend of a JIRA-alternative, user-friendly task management SaaS in collaboration with UI/UX designers.
    - Developed REST APIs, background jobs, and database logic using NestJS for core app features.
    - Integrated external services like SMS gateways, Google Drive, and email (SMTP/IMAP).
    - Replaced a 3rd-party SaaS dependency by building a custom push server with Socket.io.
    TECHNOLOGIES: Typescript, React, Redux, MongoDB, NestJS, Express.js, Node.js, Docker, AWS
`,
    `
    EDUCATION:
    - B.Sc. in Computer Engineering, Baskent University, Ankara, Turkey (2012-2018)
    - TED Ankara College Private High School, Ankara, Turkey (2008-2012)

    CERTIFICATES:
    - Bournemouth Business School International, Bournemouth, UK (Summer 2015)
    - Science, Mathematics & IT: DISTINCTION
    - Business Skills: CREDIT
`
];

const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
});

const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments(raw_chunk_list.map((text) => new Document({ pageContent: text })));

export { vectorStore };
