// lib/roadmap-data.ts
// Static roadmap template definitions.
// These get seeded into the DB once via `prisma/seed.ts`.
// Keeping them here means the seed and any future re-seeds share one source of truth.

import type { Category } from '@/app/generated/prisma/client'

export interface DayData {
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
  resources: string[]
}

export interface TemplateData {
  title: string
  slug: string
  description: string
  category: Category
  totalDays: number
  iconEmoji: string
  days: DayData[]
}

export const ROADMAP_TEMPLATES: TemplateData[] = [
  // ─── Frontend Engineer ─────────────────────────────────────────────────────
  {
    title: 'Frontend Engineer',
    slug: 'frontend-engineer',
    description:
      'Master modern frontend development: HTML, CSS, JavaScript, React, TypeScript, and performance optimization.',
    category: 'FRONTEND',
    totalDays: 30,
    iconEmoji: '🎨',
    days: [
      { dayNumber: 1, title: 'HTML5 Semantics & Accessibility', description: 'Learn semantic tags, ARIA roles, and accessibility best practices.', estimatedMinutes: 60, resources: ['https://developer.mozilla.org/en-US/docs/Web/HTML'] },
      { dayNumber: 2, title: 'CSS Fundamentals & Box Model', description: 'Master the cascade, specificity, box model, and layout basics.', estimatedMinutes: 60, resources: ['https://developer.mozilla.org/en-US/docs/Learn/CSS'] },
      { dayNumber: 3, title: 'Flexbox Mastery', description: 'Build flexible 1D layouts with Flexbox.', estimatedMinutes: 60, resources: ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'] },
      { dayNumber: 4, title: 'CSS Grid Layout', description: 'Build complex 2D layouts using CSS Grid.', estimatedMinutes: 75, resources: ['https://css-tricks.com/snippets/css/complete-guide-grid/'] },
      { dayNumber: 5, title: 'Responsive Design & Media Queries', description: 'Design mobile-first responsive interfaces.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 6, title: 'JavaScript Fundamentals I', description: 'Variables, data types, functions, and control flow.', estimatedMinutes: 90, resources: ['https://javascript.info/'] },
      { dayNumber: 7, title: 'JavaScript Fundamentals II', description: 'Arrays, objects, destructuring, and spread operator.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 8, title: 'DOM Manipulation', description: 'Querying, creating, and modifying DOM elements.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 9, title: 'Events & Event Delegation', description: 'Handling user events and event propagation.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 10, title: 'Async JavaScript: Promises', description: 'Understanding asynchronous code with Promises.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 11, title: 'Async/Await & Fetch API', description: 'Writing clean async code and fetching data from APIs.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 12, title: 'ES6+ Modern JavaScript', description: 'Modules, classes, iterators, generators.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 13, title: 'TypeScript Basics', description: 'Types, interfaces, generics, and type narrowing.', estimatedMinutes: 90, resources: ['https://www.typescriptlang.org/docs/'] },
      { dayNumber: 14, title: 'React Fundamentals I', description: 'Components, JSX, and props.', estimatedMinutes: 90, resources: ['https://react.dev'] },
      { dayNumber: 15, title: 'React Fundamentals II', description: 'State with useState and lifecycle with useEffect.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 16, title: 'React Hooks Deep Dive', description: 'useCallback, useMemo, useRef, useContext.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 17, title: 'React Patterns', description: 'Compound components, render props, HOCs.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 18, title: 'State Management with Zustand', description: 'Global state management without boilerplate.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 19, title: 'Next.js App Router Basics', description: 'File-based routing, layouts, and server components.', estimatedMinutes: 90, resources: ['https://nextjs.org/docs'] },
      { dayNumber: 20, title: 'Next.js Data Fetching', description: 'Server components, fetch caching, and server actions.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 21, title: 'Styling with Tailwind CSS', description: 'Utility-first CSS and component variants.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 22, title: 'Animations with Framer Motion', description: 'Page transitions, micro-animations, gesture support.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 23, title: 'Testing with Vitest + Testing Library', description: 'Unit and integration testing for React components.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 24, title: 'Web Performance I', description: 'Core Web Vitals, LCP, CLS, FID.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 25, title: 'Web Performance II', description: 'Code splitting, lazy loading, image optimization.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 26, title: 'SEO & Meta Tags', description: 'Open Graph, structured data, sitemap.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 27, title: 'Browser DevTools Mastery', description: 'Debugging, profiling, and network inspection.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 28, title: 'Git & GitHub Workflow', description: 'Branching, PRs, conflict resolution, and CI.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 29, title: 'Build Tool: Vite', description: 'Project setup, HMR, and production builds.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 30, title: 'Portfolio Project & Deployment', description: 'Deploy your project to Vercel and build a portfolio.', estimatedMinutes: 120, resources: [] },
    ],
  },

  // ─── Backend Engineer ──────────────────────────────────────────────────────
  {
    title: 'Backend Engineer',
    slug: 'backend-engineer',
    description:
      'Become a backend engineer: Node.js, REST APIs, databases, authentication, caching, and deployment.',
    category: 'BACKEND',
    totalDays: 30,
    iconEmoji: '⚙️',
    days: [
      { dayNumber: 1, title: 'Node.js Fundamentals', description: 'Event loop, modules, and the npm ecosystem.', estimatedMinutes: 90, resources: ['https://nodejs.org/en/docs/'] },
      { dayNumber: 2, title: 'TypeScript for Backend', description: 'Strict types, enums, and utility types for server code.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 3, title: 'Express.js: Routing & Middleware', description: 'Build a REST API with Express and middleware chains.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 4, title: 'REST API Design Principles', description: 'Resource naming, HTTP verbs, status codes, versioning.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 5, title: 'Request Validation with Zod', description: 'Schema-based validation for API inputs.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 6, title: 'PostgreSQL Fundamentals', description: 'Tables, relations, CRUD queries, and indexes.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 7, title: 'Prisma ORM', description: 'Schema, migrations, and query API.', estimatedMinutes: 90, resources: ['https://www.prisma.io/docs'] },
      { dayNumber: 8, title: 'Database Design & Normalization', description: '1NF, 2NF, 3NF, and ER diagrams.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 9, title: 'Authentication: JWT', description: 'Sign, verify, and refresh JWTs securely.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 10, title: 'Authorization: RBAC', description: 'Role-based access control and permissions middleware.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 11, title: 'Password Security', description: 'bcrypt hashing, timing attacks, and secure storage.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 12, title: 'Error Handling Patterns', description: 'Global error handlers, custom error classes, 4xx vs 5xx.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 13, title: 'Logging with Pino', description: 'Structured logging, log levels, and correlation IDs.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 14, title: 'Caching with Redis', description: 'Cache-aside, TTL, and invalidation strategies.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 15, title: 'File Uploads & Storage', description: 'Multipart forms, S3 pre-signed URLs.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 16, title: 'Email with Resend/Nodemailer', description: 'Transactional email, templates, and queuing.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 17, title: 'Background Jobs with BullMQ', description: 'Queue architecture, workers, and retries.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 18, title: 'Rate Limiting & Security Headers', description: 'DoS prevention, Helmet.js, and CORS.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 19, title: 'API Testing with Vitest + Supertest', description: 'Integration tests for REST endpoints.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 20, title: 'Database Migrations in Production', description: 'Zero-downtime migrations and rollback strategies.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 21, title: 'OpenAPI / Swagger Documentation', description: 'Auto-generate API docs from schemas.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 22, title: 'WebSockets with Socket.io', description: 'Real-time bidirectional communication.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 23, title: 'GraphQL Basics', description: 'Schemas, resolvers, and queries vs REST.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 24, title: 'Docker Fundamentals', description: 'Containers, Dockerfiles, and docker-compose.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 25, title: 'CI/CD with GitHub Actions', description: 'Automated test, build, and deploy pipelines.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 26, title: 'Environment Config & Secrets', description: '.env, secrets management, and 12-factor app.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 27, title: 'Monitoring with Prometheus', description: 'Metrics, dashboards, and alerting.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 28, title: 'Load Testing with k6', description: 'Performance benchmarks and bottleneck identification.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 29, title: 'Microservices Patterns', description: 'Service boundaries, event-driven architecture, sagas.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 30, title: 'Deploy a Production API', description: 'Deploy to Railway/Render with PostgreSQL and Redis.', estimatedMinutes: 120, resources: [] },
    ],
  },

  // ─── AI / ML Engineer ─────────────────────────────────────────────────────
  {
    title: 'AI / ML Engineer',
    slug: 'ai-ml-engineer',
    description:
      'Learn machine learning, deep learning, and how to build and deploy AI-powered applications.',
    category: 'AI_ML',
    totalDays: 30,
    iconEmoji: '🤖',
    days: [
      { dayNumber: 1, title: 'Python for Data Science', description: 'NumPy, Pandas, and Python data structures.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Statistics & Probability', description: 'Distributions, Bayes theorem, and hypothesis testing.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 3, title: 'Linear Algebra Essentials', description: 'Vectors, matrices, dot products, and eigenvalues.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 4, title: 'Data Visualization with Matplotlib', description: 'Plots, histograms, heatmaps.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 5, title: 'Exploratory Data Analysis', description: 'Data cleaning, outliers, and feature distributions.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 6, title: 'Supervised Learning: Regression', description: 'Linear regression, regularization, and evaluation.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 7, title: 'Supervised Learning: Classification', description: 'Logistic regression, decision trees, SVM.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 8, title: 'Unsupervised Learning', description: 'K-means, DBSCAN, PCA.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 9, title: 'Model Evaluation & Metrics', description: 'Accuracy, F1, AUC-ROC, confusion matrix.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 10, title: 'Feature Engineering', description: 'Encoding, scaling, feature selection.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 11, title: 'Scikit-learn Pipelines', description: 'End-to-end ML pipeline with preprocessing.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 12, title: 'Neural Networks Basics', description: 'Perceptrons, activation functions, backprop.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 13, title: 'Deep Learning with PyTorch', description: 'Tensors, autograd, and training loops.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 14, title: 'CNNs: Image Classification', description: 'Convolutions, pooling, and transfer learning.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 15, title: 'RNNs & LSTMs: Sequence Models', description: 'Time series and NLP with sequential models.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 16, title: 'Transformers & Attention', description: 'Self-attention mechanism and the transformer arch.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 17, title: 'Hugging Face Transformers', description: 'Fine-tuning BERT, GPT-2, and inference.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 18, title: 'LLMs & Prompt Engineering', description: 'OpenAI API, prompt patterns, and chain-of-thought.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 19, title: 'RAG: Retrieval-Augmented Generation', description: 'Vector DBs, embeddings, and LangChain.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 20, title: 'MLOps: Experiment Tracking', description: 'MLflow, Weights & Biases, reproducibility.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 21, title: 'Model Deployment with FastAPI', description: 'Serve ML models via REST API.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 22, title: 'Containerizing ML Models', description: 'Docker for ML, GPU containers.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 23, title: 'Model Monitoring in Production', description: 'Data drift, concept drift, alerting.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 24, title: 'AI Safety & Bias Mitigation', description: 'Fairness metrics, responsible AI.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 25, title: 'Vector Databases (Pinecone/Weaviate)', description: 'Semantic search and similarity retrieval.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 26, title: 'Building AI Agents', description: 'Tool use, ReAct pattern, multi-step reasoning.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 27, title: 'Fine-tuning LLMs', description: 'LoRA, PEFT, and instruction tuning.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 28, title: 'Computer Vision Project', description: 'End-to-end object detection with YOLOv8.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 29, title: 'NLP Project: Sentiment Analysis', description: 'Fine-tune a transformer on custom data.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 30, title: 'Capstone: Deploy an AI App', description: 'Ship a full AI-powered web app with a model backend.', estimatedMinutes: 180, resources: [] },
    ],
  },

  // ─── DevOps Engineer ──────────────────────────────────────────────────────
  {
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    description:
      'Learn CI/CD, Kubernetes, infrastructure as code, monitoring, and cloud platforms (AWS/GCP).',
    category: 'DEVOPS',
    totalDays: 30,
    iconEmoji: '🛠️',
    days: [
      { dayNumber: 1, title: 'Linux Fundamentals', description: 'Shell, file system, permissions, and processes.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Bash Scripting', description: 'Variables, conditionals, loops, and functions.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 3, title: 'Networking Basics', description: 'TCP/IP, DNS, HTTP, TLS, and load balancers.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 4, title: 'Git Advanced Workflows', description: 'Rebasing, cherry-pick, bisect, and monorepos.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 5, title: 'Docker Fundamentals', description: 'Images, containers, volumes, and networking.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 6, title: 'Docker Compose', description: 'Multi-service local environments.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 7, title: 'CI/CD with GitHub Actions', description: 'Pipelines, matrix builds, and secrets.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 8, title: 'GitLab CI / CircleCI', description: 'Alternative CI platforms and pipeline patterns.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 9, title: 'AWS Fundamentals', description: 'EC2, S3, RDS, IAM, and VPC.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 10, title: 'AWS Compute: Lambda & ECS', description: 'Serverless and container-based workloads.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 11, title: 'Infrastructure as Code: Terraform', description: 'HCL, providers, modules, and state.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 12, title: 'Kubernetes Fundamentals', description: 'Pods, deployments, services, and namespaces.', estimatedMinutes: 120, resources: [] },
      { dayNumber: 13, title: 'Kubernetes: ConfigMaps & Secrets', description: 'Secrets management and environment injection.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 14, title: 'Helm Charts', description: 'Package management for Kubernetes.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 15, title: 'Monitoring with Prometheus & Grafana', description: 'Metrics collection and dashboards.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 16, title: 'Logging with ELK Stack', description: 'Elasticsearch, Logstash, Kibana.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 17, title: 'Alerting & Incident Response', description: 'PagerDuty, runbooks, and on-call.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 18, title: 'SRE Principles', description: 'SLOs, SLAs, error budgets, and toil reduction.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 19, title: 'Security: SAST & DAST', description: 'Static/dynamic analysis in CI pipelines.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 20, title: 'Secrets Management: Vault', description: 'HashiCorp Vault for dynamic secrets.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 21, title: 'Service Mesh: Istio', description: 'mTLS, traffic management, and observability.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 22, title: 'CDN & Edge Networking', description: 'CloudFront, Cloudflare, and caching strategies.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 23, title: 'Database DevOps', description: 'Automated migrations, backups, and HA setups.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 24, title: 'Cost Optimization on AWS', description: 'Rightsizing, reserved instances, Savings Plans.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 25, title: 'Chaos Engineering', description: 'Chaos Monkey, resilience testing.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 26, title: 'GitOps with ArgoCD', description: 'Declarative deployments from Git.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 27, title: 'Multi-Cloud Strategy', description: 'GCP + AWS, cloud-agnostic abstractions.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 28, title: 'Compliance: SOC2 / GDPR', description: 'Audit trails, access controls, and data governance.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 29, title: 'Platform Engineering', description: 'Internal developer platforms and golden paths.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 30, title: 'Capstone: Deploy a Production App', description: 'Full stack app on Kubernetes with CI/CD, monitoring.', estimatedMinutes: 180, resources: [] },
    ],
  },

  // ─── Full-Stack Engineer ───────────────────────────────────────────────────
  {
    title: 'Full-Stack Engineer',
    slug: 'fullstack-engineer',
    description:
      'Become a full-stack engineer by combining frontend, backend, databases, and deployment into one cohesive skillset.',
    category: 'FULLSTACK',
    totalDays: 30,
    iconEmoji: '🚀',
    days: [
      { dayNumber: 1, title: 'HTML5 & CSS3 Foundations', description: 'Semantic HTML, CSS box model, and flexbox.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 2, title: 'JavaScript Essentials', description: 'Core JS: variables, arrays, functions, closures.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 3, title: 'TypeScript Fundamentals', description: 'Types, interfaces, and type narrowing.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 4, title: 'React: Components & State', description: 'JSX, props, useState, useEffect.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 5, title: 'React: Advanced Hooks', description: 'useContext, useCallback, useMemo, useRef.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 6, title: 'Tailwind CSS', description: 'Utility-first styling and responsive design.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 7, title: 'Next.js App Router', description: 'Routing, layouts, server vs client components.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 8, title: 'Next.js: Server Actions & Data Fetching', description: 'Mutations without client-side fetch.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 9, title: 'Node.js & Express Basics', description: 'Server setup, routing, and middleware.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 10, title: 'REST API Design', description: 'HTTP verbs, status codes, and versioning.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 11, title: 'PostgreSQL Basics', description: 'Tables, relations, and SQL queries.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 12, title: 'Prisma ORM', description: 'Schema, migrations, and type-safe queries.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 13, title: 'Authentication with JWT + Bcrypt', description: 'Login, signup, and session management.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 14, title: 'Authorization & Middleware', description: 'Protected routes and RBAC.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 15, title: 'Form Handling & Validation (Zod)', description: 'Client + server validation patterns.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 16, title: 'Error Handling (Frontend + Backend)', description: 'Error boundaries, API error shapes, toast UX.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 17, title: 'File Uploads', description: 'Multipart forms and cloud storage (S3/Cloudinary).', estimatedMinutes: 75, resources: [] },
      { dayNumber: 18, title: 'Real-time with WebSockets', description: 'Socket.io and live updates.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 19, title: 'Testing: Unit & Integration', description: 'Vitest + Testing Library + Supertest.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 20, title: 'State Management with Zustand', description: 'Simple global state for complex UIs.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 21, title: 'Caching Strategies', description: 'HTTP cache, Redis, and SWR/React Query.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 22, title: 'Git & GitHub Collaboration', description: 'Branching, PRs, and code review.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 23, title: 'Docker for Full-Stack', description: 'Containerize frontend + backend + DB.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 24, title: 'CI/CD with GitHub Actions', description: 'Automated testing and deployment.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 25, title: 'SEO & Web Performance', description: 'Core Web Vitals, metadata, and optimization.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 26, title: 'Security Fundamentals', description: 'XSS, CSRF, SQL injection, OWASP Top 10.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 27, title: 'Monitoring & Logging', description: 'Sentry for errors, Pino for logs, uptime alerts.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 28, title: 'Deployment to Vercel + Railway', description: 'Deploy frontend and backend to production.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 29, title: 'API Security: Rate Limiting & CORS', description: 'Protect your API from abuse.', estimatedMinutes: 60, resources: [] },
      { dayNumber: 30, title: 'Capstone: Ship a Full-Stack Product', description: 'Build, deploy, and document a product end-to-end.', estimatedMinutes: 180, resources: [] },
    ],
  },
  // ─── Mobile Engineer ──────────────────────────────────────────────────────
  {
    title: 'Mobile Engineer (iOS & Android)',
    slug: 'mobile-engineer',
    description: 'Build native and cross-platform mobile apps with Swift, Kotlin, React Native, and performance best practices.',
    category: 'MOBILE',
    totalDays: 30,
    iconEmoji: '📱',
    days: [
      { dayNumber: 1, title: 'Mobile Platform Fundamentals', description: 'App lifecycle, manifests, permissions, and app stores.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 2, title: 'iOS Basics (Swift)', description: 'Swift syntax, UIKit/SwiftUI basics.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 3, title: 'Android Basics (Kotlin)', description: 'Activities, Intents, and fragments.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 4, title: 'React Native / Cross-Platform', description: 'Shared logic, native modules, and bridging.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 5, title: 'Mobile Networking & Persistence', description: 'REST, GraphQL, SQLite, and secure storage.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 6, title: 'App Performance & Battery', description: 'Profiling, memory, and battery considerations.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 7, title: 'Publishing & CI for Mobile', description: 'App Store / Play Store workflows and CI/CD.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── React Native Developer ──────────────────────────────────────────────
  {
    title: 'React Native Developer',
    slug: 'react-native-developer',
    description: 'Build performant cross-platform apps using React Native and native integrations.',
    category: 'MOBILE',
    totalDays: 21,
    iconEmoji: '📲',
    days: [
      { dayNumber: 1, title: 'React Native Core', description: 'Components, styling, and navigation.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 2, title: 'Native Modules & Bridging', description: 'Integrate native iOS/Android code.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 3, title: 'Performance Optimization', description: 'Interaction manager, list virtualization.', estimatedMinutes: 75, resources: [] },
    ],
  },

  // ─── Data Engineer ───────────────────────────────────────────────────────
  {
    title: 'Data Engineer',
    slug: 'data-engineer',
    description: 'Build data pipelines, ETL processes, data warehouses, and real-time streaming.',
    category: 'DATA_SCIENCE',
    totalDays: 30,
    iconEmoji: '🧰',
    days: [
      { dayNumber: 1, title: 'SQL & Data Modeling', description: 'Normalized vs dimensional models and SQL basics.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'ETL with Airflow', description: 'DAGs, scheduling, and retries.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 3, title: 'Data Warehouses', description: 'Redshift, BigQuery, Snowflake basics.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── Data Analyst ────────────────────────────────────────────────────────
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    description: 'Analyze data, build dashboards, and communicate insights with SQL and visualization tools.',
    category: 'DATA_SCIENCE',
    totalDays: 14,
    iconEmoji: '📊',
    days: [
      { dayNumber: 1, title: 'SQL for Analysis', description: 'Joins, window functions, aggregations.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Data Visualization', description: 'Principles of charts and dashboard design.', estimatedMinutes: 75, resources: [] },
    ],
  },

  // ─── UX Designer ─────────────────────────────────────────────────────────
  {
    title: 'UX / Product Designer',
    slug: 'ux-designer',
    description: 'Design user-centric interfaces, prototypes, and user research methods.',
    category: 'FRONTEND',
    totalDays: 21,
    iconEmoji: '🎨',
    days: [
      { dayNumber: 1, title: 'Design Fundamentals', description: 'Typography, spacing, and layout principles.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 2, title: 'User Research Basics', description: 'Interviews, surveys, and usability testing.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── Product Manager ─────────────────────────────────────────────────────
  {
    title: 'Product Manager',
    slug: 'product-manager',
    description: 'Learn product discovery, roadmap planning, metrics, and stakeholder communication.',
    category: 'FULLSTACK',
    totalDays: 14,
    iconEmoji: '📈',
    days: [
      { dayNumber: 1, title: 'Product Discovery', description: 'User needs, problem validation, and interviews.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Roadmapping & Prioritization', description: 'OKRs, RICE scoring, and MVP definition.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── QA / Test Engineer ──────────────────────────────────────────────────
  {
    title: 'QA / Test Engineer',
    slug: 'qa-test-engineer',
    description: 'Testing strategies, automation, and test tooling for reliable releases.',
    category: 'BACKEND',
    totalDays: 14,
    iconEmoji: '🧪',
    days: [
      { dayNumber: 1, title: 'Testing Fundamentals', description: 'Unit, integration, and E2E testing principles.', estimatedMinutes: 75, resources: [] },
      { dayNumber: 2, title: 'Test Automation', description: 'Playwright / Cypress and CI integration.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── Security Engineer ───────────────────────────────────────────────────
  {
    title: 'Security Engineer',
    slug: 'security-engineer',
    description: 'Application security, threat modeling, secure coding, and defensive practices.',
    category: 'BACKEND',
    totalDays: 14,
    iconEmoji: '🔒',
    days: [
      { dayNumber: 1, title: 'Security Basics', description: 'Common web vulnerabilities and OWASP Top 10.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Secure Coding', description: 'Input validation, cryptography basics, and secrets management.', estimatedMinutes: 90, resources: [] },
    ],
  },

  // ─── Blockchain Developer ───────────────────────────────────────────────
  {
    title: 'Blockchain Developer',
    slug: 'blockchain-developer',
    description: 'Smart contracts, Web3 basics, and decentralized app architectures.',
    category: 'BACKEND',
    totalDays: 21,
    iconEmoji: '⛓️',
    days: [
      { dayNumber: 1, title: 'Blockchain Fundamentals', description: 'Consensus, transactions, and wallets.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Smart Contracts (Solidity)', description: 'Contracts, deployment, and tooling.', estimatedMinutes: 120, resources: [] },
    ],
  },

  // ─── Game Developer ─────────────────────────────────────────────────────
  {
    title: 'Game Developer',
    slug: 'game-developer',
    description: 'Game loops, physics, rendering, and building prototypes with Unity or Godot.',
    category: 'FULLSTACK',
    totalDays: 21,
    iconEmoji: '🎮',
    days: [
      { dayNumber: 1, title: 'Game Dev Basics', description: 'Game loops, delta time, and input handling.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: '2D/3D Rendering', description: 'Sprites, meshes, and basic shaders.', estimatedMinutes: 120, resources: [] },
    ],
  },

  // ─── Embedded Systems Engineer ──────────────────────────────────────────
  {
    title: 'Embedded Systems Engineer',
    slug: 'embedded-engineer',
    description: 'Microcontrollers, C/C++, hardware interfaces, and low-level optimization.',
    category: 'BACKEND',
    totalDays: 21,
    iconEmoji: '🔩',
    days: [
      { dayNumber: 1, title: 'Microcontroller Basics', description: 'GPIO, interrupts, and timers.', estimatedMinutes: 90, resources: [] },
      { dayNumber: 2, title: 'Embedded C/C++', description: 'Memory, pointers, and build toolchains.', estimatedMinutes: 120, resources: [] },
    ],
  },
]
