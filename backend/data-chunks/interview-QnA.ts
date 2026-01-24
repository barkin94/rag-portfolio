import { Document } from "langchain";
import { Topic } from "../enums";

const interviewQnAChunks: Document[] = [
  new Document({
    pageContent: `
Q: Describe the most complex AWS environment you have managed. What core services
(e.g., EC2, RDS, Lambda) were involved, and did you use Terraform (or another
IaC tool) to define and maintain this infrastructure?

A: The most complex AWS environment I worked with was at Getir. A central platform
team managed the core infrastructure using Terraform and AWS CDK.

My team used internal tools to register new services. These tools auto-generated
the IaC code and repositories for two main use cases: deploying a new microservice
to our EKS cluster with or creating a new Lambda function.

For other AWS resources needed by these services—like S3 buckets, DynamoDB tables,
or SQS queues—we manually wrote the Terraform/AWS CDK code and submitted it via a
pull request to the main IaC repositories. The platform team would review and merge
our PRs to provision the resources.
    `,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "interview QnA",
    },
    id: "interview-aws-environment",
  }),

  new Document({
    pageContent: `
Q: Detail your professional experience building backend systems with TypeScript.
Please describe a specific, challenging feature you built using a Node.js
framework (like NestJS, if applicable) and what made it challenging.

A: I'm a Software Engineer with over 6 years of full-stack experience, specializing
in TypeScript and the Node.js ecosystem. My expertise with Node.js ranges from
vanilla Node.js development with Express.js/Fastify, to framework-based development
with NestJS.

Over the years, I've worked across a variety of architectures, from monolithic
systems to monorepos and microservices running in containerized environments. I
have built both RESTful and event-driven services, designed scalable APIs and data
models, and integrated systems with third-party services.

A specific challenging feature was writing an event aggregation service at Getir.
This service listened to multiple Kafka topics sending out product related events
(like product details, price changes, and stock statuses etc.), and combined these
into one complete "product aggregate" entity. It was difficult because I had to
manage the state carefully to avoid errors and inconsistencies.

After creating these entities, I had to send them to an external API. However, this
API had strict rate limits. My initial approach of sending each entity immediately
failed because it sent too many requests too fast.

I solved this with RxJS streams. I changed the code to collect the entities for a
short time, group them into small batches, and then send each batch with a delay
between them. This method respected the API's rate limit and made the system reliable.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements],
      source: "interview QnA",
    },
    id: "interview-typescript-backend",
  },),

  new Document({
    pageContent: `
Q: Tell us about a time you had to identify and resolve a significant performance
bottleneck in a production system. What tools (e.g., CloudWatch, datadog, etc.) or
methods did you use to find the root cause, and what was the outcome of your fix?

A: I resolved a big performance issue in Getir's product listing microservice. During
peak load, our latency occasionally spiked from 200ms to over 10 seconds, causing
client timeouts.

Using Grafana's APM and distributed tracing, I discovered the problem wasn't the
database or infrastructure, but a caching flaw. The listing service cached product
data with a fixed 5-minute TTL. When the cache expired for hundreds of users
simultaneously, all service instances flooded the database simultaneously to refresh
the cache.

I implemented a two-part fix:
1) Added jitter to cache TTLs (4.5-5.5 minutes) to spread out expirations.
2) Used Redis locks so only one instance could refresh the cache for a given user. Other
instances waited briefly and then read the refreshed cache.

The fix eliminated latency spikes immediately. P99 latency returned to ~200ms, database
load dropped by 80%, and client timeouts ceased.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements],
      source: "interview QnA",
    },
    id: "interview-performance-bottleneck",
  }),

  new Document({
    pageContent: `
Q: Describe your experience with relational databases, specifically PostgreSQL. What
was the most complex database task you've managed, such as optimizing a slow query,
designing a complex schema, or handling a large data migration?

A: The most complex relational database task I have ever managed involved BigQuery
instead of PostgreSQL. While I had previous experience with PostgreSQL designing
complex queries and schemas, none of those tasks were as challenging as this one.

At Getir, I was once tasked with creating the "transform" stage of an ETL pipeline.
This stage's job was processing user events inside BigQuery by selectively picking
them, making complex transformations on them, and outputting them into corresponding
new tables.

The difficulty stemmed from how structurally different the existing user event schemas
were to the target schemas. To achieve all the required transformations, I had to read
through a lot of BigQuery documentation to find specific BigQuery utilities, simply
because standard SQL alone was insufficient, and I had to write many custom stored
procedures, functions, materialized views and transaction scripts to get the job done.
Even with all the utility scripts codes I had written, the end result turned out to be
unmanageable purely because there was a lot of verbose and repetitive SQL code. So then
I had to revise a lot of SQL logic into dynamic SQL which cut the size of the entire
codebase by at least half.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements],
      source: "interview QnA",
    },
    id: "interview-postgresql-bigquery",
  }),

  new Document({
    pageContent: `
Q: This is a backend role, but can you describe a project where you had to collaborate
closely with front-end developers? If you have any experience with React/Next.js (even
simple tasks), please provide a brief example.

A: Even though I focus mostly on backend development today, I have a strong frontend
background with React, and am able to perform complex tasks. At every company I've
worked for, I contributed to frontend projects building by mobile-first web pages from
scratch, bug fixing and code refactoring. Most recently at Getir, I worked in frontend
teams before transitioning to backend teams, maintaining the company's landing pages,
web store and admin panels, all built with React. For most projects we used Typescript,
Redux, Redux-Saga, Styled Components, and Jest. However the landing pages and the web
store were more complex than the others and  required a different kind of scaling. So
we used extras like Next.js for server-side rendering, an Nx monorepo for team-based
development, Storybook for detailed component testing shared UI libraries, CloudFront
CDN for global CDN and CloudFront functions for location based domain redirections.
    `,
    metadata: {
      tags: [Topic.WorkExperience],
      source: "interview QnA",
    },
    id: "interview-frontend-collaboration",
  }),
];

export default interviewQnAChunks;