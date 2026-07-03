import { Document } from "langchain";
import { Topic } from "../enums";

const source = "behavioral story";

const behavioralStoryChunks: Document[] = [
  new Document({
    pageContent: `
At Cubicl, we relied on a paid third-party service to power real-time notifications
in our task-management platform. As our user base grew, its subscription costs started
scaling aggressively, which put pressure on the team to find a cheaper alternative
without losing real-time responsiveness.

I decided to build an in-house replacement instead of switching providers. I architected
and implemented a dedicated push server from scratch using Socket.io and Node.js,
handling connection state management for all active clients and making sure event
delivery stayed reliable enough to fully replace the external provider.

We were able to drop the paid service entirely. This saved the company a meaningful
amount in recurring SaaS fees while keeping the real-time notification system fast,
stable, and fully under our own control.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-cubicl-cost-optimization",
  }),

  new Document({
    pageContent: `
At Getir, every time we needed to change the layout or behavior of a mobile page,
we had to ship a new app release and then wait days for app store approval before it
reached users. That made even small UI tweaks painfully slow.

I developed a Backend-for-Frontend (BFF) microservice layer using Node.js and Go that
sat between our core services and the mobile app. Its job was to translate backend
data into UI-driven configurations, effectively letting the backend drive and control
how mobile pages were laid out, instead of hardcoding that logic on the client.

This drastically cut down how often we needed mandatory app store updates just for UI
changes. Business and product teams could iterate on page layouts almost instantly
from the backend, which meaningfully improved our agility and time-to-market.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-getir-bff-pattern",
  }),

  new Document({
    pageContent: `
Our e-commerce platform at Getir generated a huge amount of operational data every
day, but the way it was synced across systems was disjointed, which made it hard to
use that data for things like better search relevance or business intelligence.

I built a batch data pipeline on Google Cloud Platform, using BigQuery as the data
warehouse and Cloud Scheduler together with Cloud Workflows to fully automate the
ingestion orchestration. In parallel, I worked on integrating Google's AI-powered
search platform to process that structured data and improve product search relevance
and accuracy.

The result was a fully automated big-data ingestion pipeline that fed clean, structured
data into an AI-powered search layer, which meaningfully improved how accurately and
easily users could find the products they were looking for.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-getir-data-pipeline-ai-search",
  }),

  new Document({
    pageContent: `
At Getir, the core legacy backend services powering our e-commerce platform
struggled under traffic spikes, which caused real performance bottlenecks and
threatened platform stability during peak hours.

I audited the legacy backend infrastructure and systematically migrated the most
brittle parts into event-driven microservices, using a hybrid stack of Go, Node.js,
and Java depending on what fit each service best. I focused the redesign on
high-performance concurrency patterns, more efficient message consumption, and
decoupling operations that were too tightly bound together.

The new architecture drastically improved API performance and horizontal
scalability. The platform became far more resilient, handling large transaction
volumes and traffic spikes without degrading.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-getir-microservice-scaling",
  }),

  new Document({
    pageContent: `
At Getir, we maintained several web and admin applications, but frontend
development was slowed down by fragmented and inconsistent UI implementations
across projects, which meant teams kept reinventing basic UI elements and technical
debt kept growing.

Working within our Nx monorepo, I extracted the common UI patterns scattered across
these projects and built a flexible, reusable React component library with modular,
well-documented APIs so other teams could adopt it easily.

The shared component library noticeably sped up UI development across all of our
internal and public web platforms, eliminated a lot of duplicated code, and made
cross-team contributions and the overall look and feel of our web and admin surfaces
far more consistent.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-getir-component-library",
  }),

  new Document({
    pageContent: `
Key user-facing parts of one of our Next.js applications at Getir had become
brittle and tightly coupled over time, so the app had little real test coverage and
was prone to regressions whenever we shipped new features.

I refactored the coupled logic in that application, separating business logic from
rendering concerns so the codebase became inherently testable. Once that separation
was in place, I introduced a proper testing layer with Jest, adding unit and
integration tests that covered the critical edge cases.

That effort meaningfully improved our test coverage and the app's overall
reliability. With a dependable automated test suite in place, the team could ship
changes with a lot more confidence and stopped seeing the regressions that used to
slip through.
    `,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements, Topic.Skills],
     source,
    },
    id: "story-getir-testing-refactor",
  }),
];

export default behavioralStoryChunks;
