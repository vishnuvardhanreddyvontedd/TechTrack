// prisma/seed.mjs  — plain JS, run with: node prisma/seed.mjs
// No TypeScript, no Prisma client, no compilation. Just pg + SQL.
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local manually (no dotenv dependency needed)
function loadEnv(file) {
  try {
    const lines = readFileSync(file, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    }
  } catch { /* file not found */ }
}
loadEnv(resolve(__dirname, '../.env.local'))

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// ─── Template Data ────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    title: 'Frontend Engineer', slug: 'frontend-engineer',
    description: 'Master modern frontend development: HTML, CSS, JavaScript, React, TypeScript, and performance optimization.',
    category: 'FRONTEND', totalDays: 30, iconEmoji: '🎨',
    days: [
      { n:1,  t:'HTML5 Semantics & Accessibility',     d:'Learn semantic tags, ARIA roles, and accessibility best practices.',                     m:60  },
      { n:2,  t:'CSS Fundamentals & Box Model',         d:'Master the cascade, specificity, box model, and layout basics.',                         m:60  },
      { n:3,  t:'Flexbox Mastery',                      d:'Build flexible 1D layouts with Flexbox.',                                                m:60  },
      { n:4,  t:'CSS Grid Layout',                      d:'Build complex 2D layouts using CSS Grid.',                                               m:75  },
      { n:5,  t:'Responsive Design & Media Queries',    d:'Design mobile-first responsive interfaces.',                                             m:60  },
      { n:6,  t:'JavaScript Fundamentals I',            d:'Variables, data types, functions, and control flow.',                                    m:90  },
      { n:7,  t:'JavaScript Fundamentals II',           d:'Arrays, objects, destructuring, and spread operator.',                                   m:90  },
      { n:8,  t:'DOM Manipulation',                     d:'Querying, creating, and modifying DOM elements.',                                        m:75  },
      { n:9,  t:'Events & Event Delegation',            d:'Handling user events and event propagation.',                                            m:60  },
      { n:10, t:'Async JavaScript: Promises',           d:'Understanding asynchronous code with Promises.',                                         m:75  },
      { n:11, t:'Async/Await & Fetch API',              d:'Writing clean async code and fetching data from APIs.',                                  m:75  },
      { n:12, t:'ES6+ Modern JavaScript',               d:'Modules, classes, iterators, generators.',                                               m:90  },
      { n:13, t:'TypeScript Basics',                    d:'Types, interfaces, generics, and type narrowing.',                                       m:90  },
      { n:14, t:'React Fundamentals I',                 d:'Components, JSX, and props.',                                                            m:90  },
      { n:15, t:'React Fundamentals II',                d:'State with useState and lifecycle with useEffect.',                                      m:90  },
      { n:16, t:'React Hooks Deep Dive',                d:'useCallback, useMemo, useRef, useContext.',                                              m:90  },
      { n:17, t:'React Patterns',                       d:'Compound components, render props, HOCs.',                                               m:90  },
      { n:18, t:'State Management with Zustand',        d:'Global state management without boilerplate.',                                           m:75  },
      { n:19, t:'Next.js App Router Basics',            d:'File-based routing, layouts, and server components.',                                    m:90  },
      { n:20, t:'Next.js Data Fetching',                d:'Server components, fetch caching, and server actions.',                                  m:90  },
      { n:21, t:'Styling with Tailwind CSS',            d:'Utility-first CSS and component variants.',                                              m:75  },
      { n:22, t:'Animations with Framer Motion',        d:'Page transitions, micro-animations, gesture support.',                                   m:75  },
      { n:23, t:'Testing with Vitest + Testing Library',d:'Unit and integration testing for React components.',                                     m:90  },
      { n:24, t:'Web Performance I',                    d:'Core Web Vitals, LCP, CLS, FID.',                                                        m:75  },
      { n:25, t:'Web Performance II',                   d:'Code splitting, lazy loading, image optimization.',                                      m:75  },
      { n:26, t:'SEO & Meta Tags',                      d:'Open Graph, structured data, sitemap.',                                                  m:60  },
      { n:27, t:'Browser DevTools Mastery',             d:'Debugging, profiling, and network inspection.',                                          m:60  },
      { n:28, t:'Git & GitHub Workflow',                d:'Branching, PRs, conflict resolution, and CI.',                                           m:60  },
      { n:29, t:'Build Tool: Vite',                     d:'Project setup, HMR, and production builds.',                                             m:60  },
      { n:30, t:'Portfolio Project & Deployment',       d:'Deploy your project to Vercel and build a portfolio.',                                   m:120 },
    ],
  },
  {
    title: 'Backend Engineer', slug: 'backend-engineer',
    description: 'Become a backend engineer: Node.js, REST APIs, databases, authentication, caching, and deployment.',
    category: 'BACKEND', totalDays: 30, iconEmoji: '⚙️',
    days: [
      { n:1,  t:'Node.js Fundamentals',                 d:'Event loop, modules, and the npm ecosystem.',                                            m:90  },
      { n:2,  t:'TypeScript for Backend',               d:'Strict types, enums, and utility types for server code.',                                m:75  },
      { n:3,  t:'Express.js: Routing & Middleware',     d:'Build a REST API with Express and middleware chains.',                                   m:90  },
      { n:4,  t:'REST API Design Principles',           d:'Resource naming, HTTP verbs, status codes, versioning.',                                 m:60  },
      { n:5,  t:'Request Validation with Zod',          d:'Schema-based validation for API inputs.',                                                m:60  },
      { n:6,  t:'PostgreSQL Fundamentals',              d:'Tables, relations, CRUD queries, and indexes.',                                          m:90  },
      { n:7,  t:'Prisma ORM',                           d:'Schema, migrations, and query API.',                                                     m:90  },
      { n:8,  t:'Database Design & Normalization',      d:'1NF, 2NF, 3NF, and ER diagrams.',                                                        m:75  },
      { n:9,  t:'Authentication: JWT',                  d:'Sign, verify, and refresh JWTs securely.',                                               m:90  },
      { n:10, t:'Authorization: RBAC',                  d:'Role-based access control and permissions middleware.',                                   m:75  },
      { n:11, t:'Password Security',                    d:'bcrypt hashing, timing attacks, and secure storage.',                                    m:60  },
      { n:12, t:'Error Handling Patterns',              d:'Global error handlers, custom error classes, 4xx vs 5xx.',                               m:60  },
      { n:13, t:'Logging with Pino',                    d:'Structured logging, log levels, and correlation IDs.',                                   m:60  },
      { n:14, t:'Caching with Redis',                   d:'Cache-aside, TTL, and invalidation strategies.',                                         m:90  },
      { n:15, t:'File Uploads & Storage',               d:'Multipart forms, S3 pre-signed URLs.',                                                   m:75  },
      { n:16, t:'Email with Resend/Nodemailer',         d:'Transactional email, templates, and queuing.',                                           m:60  },
      { n:17, t:'Background Jobs with BullMQ',          d:'Queue architecture, workers, and retries.',                                              m:90  },
      { n:18, t:'Rate Limiting & Security Headers',     d:'DoS prevention, Helmet.js, and CORS.',                                                   m:60  },
      { n:19, t:'API Testing with Vitest + Supertest',  d:'Integration tests for REST endpoints.',                                                  m:90  },
      { n:20, t:'Database Migrations in Production',    d:'Zero-downtime migrations and rollback strategies.',                                      m:75  },
      { n:21, t:'OpenAPI / Swagger Documentation',      d:'Auto-generate API docs from schemas.',                                                   m:60  },
      { n:22, t:'WebSockets with Socket.io',            d:'Real-time bidirectional communication.',                                                 m:90  },
      { n:23, t:'GraphQL Basics',                       d:'Schemas, resolvers, and queries vs REST.',                                               m:90  },
      { n:24, t:'Docker Fundamentals',                  d:'Containers, Dockerfiles, and docker-compose.',                                           m:90  },
      { n:25, t:'CI/CD with GitHub Actions',            d:'Automated test, build, and deploy pipelines.',                                           m:75  },
      { n:26, t:'Environment Config & Secrets',         d:'.env, secrets management, and 12-factor app.',                                           m:60  },
      { n:27, t:'Monitoring with Prometheus',           d:'Metrics, dashboards, and alerting.',                                                     m:75  },
      { n:28, t:'Load Testing with k6',                 d:'Performance benchmarks and bottleneck identification.',                                  m:75  },
      { n:29, t:'Microservices Patterns',               d:'Service boundaries, event-driven architecture, sagas.',                                  m:90  },
      { n:30, t:'Deploy a Production API',              d:'Deploy to Railway/Render with PostgreSQL and Redis.',                                     m:120 },
    ],
  },
  {
    title: 'AI / ML Engineer', slug: 'ai-ml-engineer',
    description: 'Learn machine learning, deep learning, and how to build and deploy AI-powered applications.',
    category: 'AI_ML', totalDays: 30, iconEmoji: '🤖',
    days: [
      { n:1,  t:'Python for Data Science',              d:'NumPy, Pandas, and Python data structures.',                                             m:90  },
      { n:2,  t:'Statistics & Probability',             d:'Distributions, Bayes theorem, and hypothesis testing.',                                  m:90  },
      { n:3,  t:'Linear Algebra Essentials',            d:'Vectors, matrices, dot products, and eigenvalues.',                                      m:90  },
      { n:4,  t:'Data Visualization with Matplotlib',   d:'Plots, histograms, heatmaps.',                                                           m:60  },
      { n:5,  t:'Exploratory Data Analysis',            d:'Data cleaning, outliers, and feature distributions.',                                    m:75  },
      { n:6,  t:'Supervised Learning: Regression',      d:'Linear regression, regularization, and evaluation.',                                     m:90  },
      { n:7,  t:'Supervised Learning: Classification',  d:'Logistic regression, decision trees, SVM.',                                              m:90  },
      { n:8,  t:'Unsupervised Learning',                d:'K-means, DBSCAN, PCA.',                                                                  m:90  },
      { n:9,  t:'Model Evaluation & Metrics',           d:'Accuracy, F1, AUC-ROC, confusion matrix.',                                               m:75  },
      { n:10, t:'Feature Engineering',                  d:'Encoding, scaling, feature selection.',                                                  m:75  },
      { n:11, t:'Scikit-learn Pipelines',               d:'End-to-end ML pipeline with preprocessing.',                                             m:75  },
      { n:12, t:'Neural Networks Basics',               d:'Perceptrons, activation functions, backprop.',                                           m:90  },
      { n:13, t:'Deep Learning with PyTorch',           d:'Tensors, autograd, and training loops.',                                                 m:120 },
      { n:14, t:'CNNs: Image Classification',           d:'Convolutions, pooling, and transfer learning.',                                          m:120 },
      { n:15, t:'RNNs & LSTMs: Sequence Models',        d:'Time series and NLP with sequential models.',                                            m:90  },
      { n:16, t:'Transformers & Attention',             d:'Self-attention mechanism and the transformer arch.',                                     m:120 },
      { n:17, t:'Hugging Face Transformers',            d:'Fine-tuning BERT, GPT-2, and inference.',                                                m:90  },
      { n:18, t:'LLMs & Prompt Engineering',            d:'OpenAI API, prompt patterns, and chain-of-thought.',                                     m:90  },
      { n:19, t:'RAG: Retrieval-Augmented Generation',  d:'Vector DBs, embeddings, and LangChain.',                                                 m:90  },
      { n:20, t:'MLOps: Experiment Tracking',           d:'MLflow, Weights & Biases, reproducibility.',                                             m:75  },
      { n:21, t:'Model Deployment with FastAPI',        d:'Serve ML models via REST API.',                                                          m:90  },
      { n:22, t:'Containerizing ML Models',             d:'Docker for ML, GPU containers.',                                                         m:75  },
      { n:23, t:'Model Monitoring in Production',       d:'Data drift, concept drift, alerting.',                                                   m:75  },
      { n:24, t:'AI Safety & Bias Mitigation',          d:'Fairness metrics, responsible AI.',                                                      m:75  },
      { n:25, t:'Vector Databases',                     d:'Semantic search and similarity retrieval.',                                               m:75  },
      { n:26, t:'Building AI Agents',                   d:'Tool use, ReAct pattern, multi-step reasoning.',                                         m:90  },
      { n:27, t:'Fine-tuning LLMs',                     d:'LoRA, PEFT, and instruction tuning.',                                                    m:120 },
      { n:28, t:'Computer Vision Project',              d:'End-to-end object detection with YOLOv8.',                                                m:120 },
      { n:29, t:'NLP Project: Sentiment Analysis',      d:'Fine-tune a transformer on custom data.',                                                m:120 },
      { n:30, t:'Capstone: Deploy an AI App',           d:'Ship a full AI-powered web app with a model backend.',                                   m:180 },
    ],
  },
  {
    title: 'DevOps Engineer', slug: 'devops-engineer',
    description: 'Learn CI/CD, Kubernetes, infrastructure as code, monitoring, and cloud platforms (AWS/GCP).',
    category: 'DEVOPS', totalDays: 30, iconEmoji: '🛠️',
    days: [
      { n:1,  t:'Linux Fundamentals',                   d:'Shell, file system, permissions, and processes.',                                        m:90  },
      { n:2,  t:'Bash Scripting',                       d:'Variables, conditionals, loops, and functions.',                                         m:75  },
      { n:3,  t:'Networking Basics',                    d:'TCP/IP, DNS, HTTP, TLS, and load balancers.',                                            m:75  },
      { n:4,  t:'Git Advanced Workflows',               d:'Rebasing, cherry-pick, bisect, and monorepos.',                                          m:60  },
      { n:5,  t:'Docker Fundamentals',                  d:'Images, containers, volumes, and networking.',                                           m:90  },
      { n:6,  t:'Docker Compose',                       d:'Multi-service local environments.',                                                      m:75  },
      { n:7,  t:'CI/CD with GitHub Actions',            d:'Pipelines, matrix builds, and secrets.',                                                 m:90  },
      { n:8,  t:'GitLab CI / CircleCI',                 d:'Alternative CI platforms and pipeline patterns.',                                        m:75  },
      { n:9,  t:'AWS Fundamentals',                     d:'EC2, S3, RDS, IAM, and VPC.',                                                            m:120 },
      { n:10, t:'AWS Compute: Lambda & ECS',            d:'Serverless and container-based workloads.',                                              m:90  },
      { n:11, t:'Infrastructure as Code: Terraform',    d:'HCL, providers, modules, and state.',                                                    m:120 },
      { n:12, t:'Kubernetes Fundamentals',              d:'Pods, deployments, services, and namespaces.',                                           m:120 },
      { n:13, t:'Kubernetes: ConfigMaps & Secrets',     d:'Secrets management and environment injection.',                                          m:75  },
      { n:14, t:'Helm Charts',                          d:'Package management for Kubernetes.',                                                     m:90  },
      { n:15, t:'Monitoring with Prometheus & Grafana', d:'Metrics collection and dashboards.',                                                     m:90  },
      { n:16, t:'Logging with ELK Stack',               d:'Elasticsearch, Logstash, Kibana.',                                                       m:90  },
      { n:17, t:'Alerting & Incident Response',         d:'PagerDuty, runbooks, and on-call.',                                                      m:75  },
      { n:18, t:'SRE Principles',                       d:'SLOs, SLAs, error budgets, and toil reduction.',                                         m:75  },
      { n:19, t:'Security: SAST & DAST',                d:'Static/dynamic analysis in CI pipelines.',                                               m:75  },
      { n:20, t:'Secrets Management: Vault',            d:'HashiCorp Vault for dynamic secrets.',                                                   m:75  },
      { n:21, t:'Service Mesh: Istio',                  d:'mTLS, traffic management, and observability.',                                           m:90  },
      { n:22, t:'CDN & Edge Networking',                d:'CloudFront, Cloudflare, and caching strategies.',                                        m:60  },
      { n:23, t:'Database DevOps',                      d:'Automated migrations, backups, and HA setups.',                                          m:75  },
      { n:24, t:'Cost Optimization on AWS',             d:'Rightsizing, reserved instances, Savings Plans.',                                        m:60  },
      { n:25, t:'Chaos Engineering',                    d:'Chaos Monkey, resilience testing.',                                                      m:75  },
      { n:26, t:'GitOps with ArgoCD',                   d:'Declarative deployments from Git.',                                                      m:90  },
      { n:27, t:'Multi-Cloud Strategy',                 d:'GCP + AWS, cloud-agnostic abstractions.',                                                m:75  },
      { n:28, t:'Compliance: SOC2 / GDPR',              d:'Audit trails, access controls, and data governance.',                                    m:60  },
      { n:29, t:'Platform Engineering',                 d:'Internal developer platforms and golden paths.',                                         m:75  },
      { n:30, t:'Capstone: Deploy a Production App',    d:'Full stack app on Kubernetes with CI/CD, monitoring.',                                   m:180 },
    ],
  },
  {
    title: 'Full-Stack Engineer', slug: 'fullstack-engineer',
    description: 'Become a full-stack engineer by combining frontend, backend, databases, and deployment.',
    category: 'FULLSTACK', totalDays: 30, iconEmoji: '🚀',
    days: [
      { n:1,  t:'HTML5 & CSS3 Foundations',             d:'Semantic HTML, CSS box model, and flexbox.',                                             m:75  },
      { n:2,  t:'JavaScript Essentials',                d:'Core JS: variables, arrays, functions, closures.',                                       m:90  },
      { n:3,  t:'TypeScript Fundamentals',              d:'Types, interfaces, and type narrowing.',                                                 m:75  },
      { n:4,  t:'React: Components & State',            d:'JSX, props, useState, useEffect.',                                                       m:90  },
      { n:5,  t:'React: Advanced Hooks',                d:'useContext, useCallback, useMemo, useRef.',                                              m:75  },
      { n:6,  t:'Tailwind CSS',                         d:'Utility-first styling and responsive design.',                                           m:60  },
      { n:7,  t:'Next.js App Router',                   d:'Routing, layouts, server vs client components.',                                         m:90  },
      { n:8,  t:'Next.js: Server Actions & Data Fetching', d:'Mutations without client-side fetch.',                                                m:90  },
      { n:9,  t:'Node.js & Express Basics',             d:'Server setup, routing, and middleware.',                                                 m:90  },
      { n:10, t:'REST API Design',                      d:'HTTP verbs, status codes, and versioning.',                                              m:60  },
      { n:11, t:'PostgreSQL Basics',                    d:'Tables, relations, and SQL queries.',                                                    m:75  },
      { n:12, t:'Prisma ORM',                           d:'Schema, migrations, and type-safe queries.',                                             m:90  },
      { n:13, t:'Authentication with JWT + Bcrypt',     d:'Login, signup, and session management.',                                                 m:90  },
      { n:14, t:'Authorization & Middleware',           d:'Protected routes and RBAC.',                                                             m:75  },
      { n:15, t:'Form Handling & Validation (Zod)',     d:'Client + server validation patterns.',                                                   m:60  },
      { n:16, t:'Error Handling (Frontend + Backend)',  d:'Error boundaries, API error shapes, toast UX.',                                          m:75  },
      { n:17, t:'File Uploads',                         d:'Multipart forms and cloud storage.',                                                     m:75  },
      { n:18, t:'Real-time with WebSockets',            d:'Socket.io and live updates.',                                                            m:90  },
      { n:19, t:'Testing: Unit & Integration',          d:'Vitest + Testing Library + Supertest.',                                                  m:90  },
      { n:20, t:'State Management with Zustand',        d:'Simple global state for complex UIs.',                                                   m:60  },
      { n:21, t:'Caching Strategies',                   d:'HTTP cache, Redis, and SWR/React Query.',                                                m:75  },
      { n:22, t:'Git & GitHub Collaboration',           d:'Branching, PRs, and code review.',                                                      m:60  },
      { n:23, t:'Docker for Full-Stack',                d:'Containerize frontend + backend + DB.',                                                  m:90  },
      { n:24, t:'CI/CD with GitHub Actions',            d:'Automated testing and deployment.',                                                      m:75  },
      { n:25, t:'SEO & Web Performance',                d:'Core Web Vitals, metadata, and optimization.',                                           m:75  },
      { n:26, t:'Security Fundamentals',                d:'XSS, CSRF, SQL injection, OWASP Top 10.',                                                m:75  },
      { n:27, t:'Monitoring & Logging',                 d:'Sentry for errors, Pino for logs, uptime alerts.',                                       m:60  },
      { n:28, t:'Deployment to Vercel + Railway',       d:'Deploy frontend and backend to production.',                                             m:90  },
      { n:29, t:'API Security: Rate Limiting & CORS',   d:'Protect your API from abuse.',                                                           m:60  },
      { n:30, t:'Capstone: Ship a Full-Stack Product',  d:'Build, deploy, and document a product end-to-end.',                                      m:180 },
    ],
  },
]

// ─── Seed Logic ───────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding roadmap templates...\n')
  const client = await pool.connect()
  try {
    for (const tmpl of TEMPLATES) {
      // Check if already exists
      const { rows } = await client.query(
        'SELECT id FROM "RoadmapTemplate" WHERE slug = $1',
        [tmpl.slug]
      )
      if (rows.length > 0) {
        console.log(`  ⏭  Skipping "${tmpl.title}" (already exists)`)
        continue
      }

      // Insert template
      const { rows: [row] } = await client.query(
        `INSERT INTO "RoadmapTemplate" (id, title, slug, description, category, "totalDays", "iconEmoji", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4::\"Category\", $5, $6, now())
         RETURNING id`,
        [tmpl.title, tmpl.slug, tmpl.description, tmpl.category, tmpl.totalDays, tmpl.iconEmoji]
      )
      const templateId = row.id

      // Insert day templates
      for (const day of tmpl.days) {
        await client.query(
          `INSERT INTO "DayTemplate" (id, "templateId", "dayNumber", title, description, "estimatedMinutes", resources)
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)`,
          [templateId, day.n, day.t, day.d, day.m, '{}']
        )
      }
      console.log(`  ✅ "${tmpl.title}" — ${tmpl.days.length} days`)
    }
    console.log('\n✨ Seed complete!')
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((e) => { console.error('❌', e.message); process.exit(1) })
