// app/services/roadmap-generator.ts
// Generates roadmaps via OpenAI if key is set, falls back to smart local generation.

export interface GeneratedDay {
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
}

export interface GeneratedRoadmap {
  title: string
  totalDays: number
  days: GeneratedDay[]
}

// ─── Local Fallback Generator ─────────────────────────────────────────────────
// Keyword-based curriculum builder. Works offline with no API key.

const TRACKS: Record<string, { title: string; phases: { phase: string; tasks: [string, string, number][] }[] }> = {
  frontend: {
    title: 'Frontend Development',
    phases: [
      { phase: 'Foundations', tasks: [
        ['HTML5 Semantics', 'Build a semantic webpage using header, main, article, and footer tags.', 60],
        ['CSS Box Model', 'Style a layout using margin, padding, border, and display properties.', 60],
        ['Flexbox Layouts', 'Convert a design mockup into a responsive flex layout.', 75],
        ['CSS Grid', 'Build a 12-column grid layout from scratch.', 75],
        ['Responsive Design', 'Add media queries to make a page look great on mobile, tablet, desktop.', 60],
      ]},
      { phase: 'JavaScript', tasks: [
        ['JS Variables & Functions', 'Write 10 utility functions covering arrays, strings, and objects.', 90],
        ['DOM Manipulation', 'Build an interactive to-do list using querySelector and addEventListener.', 90],
        ['Fetch & Async/Await', 'Pull data from a public API and render it dynamically.', 75],
        ['ES6+ Features', 'Refactor code using destructuring, spread, optional chaining.', 75],
        ['TypeScript Basics', 'Add types to an existing JS project and fix all type errors.', 90],
      ]},
      { phase: 'React', tasks: [
        ['React Components', 'Build a reusable card component with props.', 90],
        ['State with useState', 'Build a counter and a form with controlled inputs.', 90],
        ['useEffect & Data Fetching', 'Fetch API data on mount and display it with loading state.', 90],
        ['React Router', 'Add multi-page navigation to a React app.', 75],
        ['Global State', 'Lift state up and share it via Context or Zustand.', 90],
      ]},
      { phase: 'Advanced', tasks: [
        ['Performance Optimisation', 'Use React.memo, useMemo, and lazy loading to reduce re-renders.', 90],
        ['Testing with Vitest', 'Write unit tests for 3 components using Testing Library.', 90],
        ['CI/CD Pipeline', 'Set up GitHub Actions to lint and test on every push.', 60],
        ['Deployment', 'Deploy a React app to Vercel with a custom domain.', 60],
        ['Portfolio Project', 'Build and ship a portfolio site showcasing 3 projects.', 120],
      ]},
    ],
  },
  backend: {
    title: 'Backend Engineering',
    phases: [
      { phase: 'Node & Express', tasks: [
        ['Node.js Basics', 'Build a CLI tool that reads files and transforms data.', 75],
        ['Express Server', 'Create a REST API with GET/POST/PUT/DELETE routes.', 90],
        ['Middleware', 'Add logging, CORS, and body-parsing middleware.', 60],
        ['Request Validation', 'Validate all API inputs with Zod schemas.', 60],
        ['Error Handling', 'Add a global error handler and custom error classes.', 60],
      ]},
      { phase: 'Databases', tasks: [
        ['PostgreSQL Basics', 'Create tables, insert data, and run JOIN queries.', 90],
        ['Prisma ORM', 'Model a blog schema with Prisma and run migrations.', 90],
        ['Database Indexing', 'Add indexes to slow queries and measure the speedup.', 75],
        ['Transactions', 'Wrap multi-step operations in atomic transactions.', 60],
        ['Redis Caching', 'Cache API responses in Redis with a 5-minute TTL.', 75],
      ]},
      { phase: 'Auth & Security', tasks: [
        ['JWT Authentication', 'Implement login, signup, and protected routes with JWTs.', 90],
        ['Password Hashing', 'Hash passwords with bcrypt and prevent timing attacks.', 60],
        ['Role-Based Access', 'Add admin and user roles with middleware guards.', 75],
        ['Rate Limiting', 'Protect endpoints from abuse with express-rate-limit.', 60],
        ['Helmet & CORS', 'Add security headers and configure CORS correctly.', 45],
      ]},
      { phase: 'Production', tasks: [
        ['Background Jobs', 'Process emails and notifications with a BullMQ queue.', 90],
        ['API Documentation', 'Auto-generate Swagger docs from your route schemas.', 60],
        ['Docker', 'Containerise the API and run it with docker-compose.', 90],
        ['CI/CD', 'Deploy automatically on merge to main via GitHub Actions.', 75],
        ['Monitoring', 'Add Prometheus metrics and a Grafana dashboard.', 90],
      ]},
    ],
  },
  ai: {
    title: 'AI & Machine Learning',
    phases: [
      { phase: 'Python & Data', tasks: [
        ['Python Fundamentals', 'Write scripts using lists, dicts, functions, and comprehensions.', 90],
        ['NumPy & Pandas', 'Load a CSV dataset and compute descriptive statistics.', 90],
        ['Data Visualisation', 'Plot distributions and correlations with Matplotlib.', 75],
        ['Data Cleaning', 'Handle missing values, outliers, and feature encoding.', 75],
        ['Statistics Essentials', 'Calculate p-values and confidence intervals for a dataset.', 75],
      ]},
      { phase: 'Classical ML', tasks: [
        ['Linear Regression', 'Train and evaluate a regression model on housing data.', 90],
        ['Classification', 'Build a classifier with Scikit-learn and evaluate with F1.', 90],
        ['Cross-Validation', 'Use k-fold CV to avoid overfitting.', 75],
        ['Feature Engineering', 'Create new features and measure their importance.', 75],
        ['Model Pipelines', 'Build a Scikit-learn pipeline from preprocessing to prediction.', 90],
      ]},
      { phase: 'Deep Learning', tasks: [
        ['Neural Networks', 'Build and train a 3-layer MLP on MNIST.', 120],
        ['PyTorch Basics', 'Define a model, write a training loop, and plot loss curves.', 120],
        ['CNNs', 'Train a CNN on CIFAR-10 and visualise activations.', 120],
        ['Transfer Learning', 'Fine-tune ResNet on a custom image dataset.', 120],
        ['Transformers', 'Run inference with a HuggingFace model on text data.', 90],
      ]},
      { phase: 'LLMs & Deployment', tasks: [
        ['Prompt Engineering', 'Write 10 structured prompts using chain-of-thought and few-shot.', 75],
        ['RAG System', 'Build a document Q&A system with embeddings and a vector DB.', 120],
        ['Fine-Tuning', 'Fine-tune a small LLM on a custom dataset with LoRA.', 120],
        ['FastAPI Model Server', 'Wrap a model in FastAPI and serve predictions via REST.', 90],
        ['Capstone AI App', 'Ship an end-to-end AI web app with a model backend.', 180],
      ]},
    ],
  },
  devops: {
    title: 'DevOps Engineering',
    phases: [
      { phase: 'Linux & Scripting', tasks: [
        ['Linux CLI Mastery', 'Navigate the filesystem, manage processes, and write pipes.', 75],
        ['Bash Scripting', 'Write a deployment script with error handling and logging.', 75],
        ['Networking Basics', 'Trace a request from DNS to TCP and back.', 60],
        ['Git Advanced', 'Use rebase, cherry-pick, and bisect to manage history.', 60],
        ['SSH & Security', 'Set up key-based auth and harden an SSH server.', 60],
      ]},
      { phase: 'Containers', tasks: [
        ['Docker Basics', 'Write a Dockerfile for a Node app and run it locally.', 90],
        ['Docker Compose', 'Run a 3-service stack (app + DB + Redis) with compose.', 90],
        ['Container Networking', 'Connect containers across networks and expose ports safely.', 75],
        ['Image Optimisation', 'Reduce image size by 50% using multi-stage builds.', 60],
        ['Docker Hub', 'Build, tag, and push images to a container registry.', 45],
      ]},
      { phase: 'Kubernetes', tasks: [
        ['Kubernetes Basics', 'Deploy a pod, service, and deployment on minikube.', 120],
        ['ConfigMaps & Secrets', 'Inject environment variables from ConfigMaps and Secrets.', 75],
        ['Helm Charts', 'Package and deploy an app with a Helm chart.', 90],
        ['Ingress', 'Route HTTP traffic to multiple services via an Ingress.', 75],
        ['Autoscaling', 'Configure HPA to scale pods based on CPU usage.', 75],
      ]},
      { phase: 'Observability', tasks: [
        ['Prometheus', 'Scrape metrics from an app and write PromQL queries.', 90],
        ['Grafana Dashboards', 'Build a dashboard showing request rate, latency, errors.', 75],
        ['Logging with ELK', 'Ship app logs to Elasticsearch and search them in Kibana.', 90],
        ['Alerting', 'Set up Alertmanager rules and send PagerDuty notifications.', 60],
        ['Capstone: Full Stack Deploy', 'Deploy an app to Kubernetes with CI/CD and monitoring.', 180],
      ]},
    ],
  },
  fullstack: {
    title: 'Full-Stack Engineering',
    phases: [
      { phase: 'Frontend', tasks: [
        ['HTML & CSS', 'Build a pixel-perfect landing page from a Figma design.', 60],
        ['JavaScript Essentials', 'Write 5 utility modules covering arrays, dates, and strings.', 90],
        ['React Fundamentals', 'Build a multi-component UI with props and useState.', 90],
        ['Next.js App Router', 'Create a multi-page app with server and client components.', 90],
        ['Tailwind CSS', 'Style a dashboard UI using utility classes only.', 60],
      ]},
      { phase: 'Backend', tasks: [
        ['REST API with Express', 'Build CRUD endpoints for a resource of your choice.', 90],
        ['PostgreSQL & Prisma', 'Design a schema, migrate it, and query with Prisma.', 90],
        ['Authentication', 'Add JWT login/signup with bcrypt password hashing.', 90],
        ['File Uploads', 'Accept and store file uploads in S3.', 75],
        ['Background Jobs', 'Queue and process email notifications with BullMQ.', 75],
      ]},
      { phase: 'Integration', tasks: [
        ['End-to-End Data Flow', 'Connect the React frontend to your REST API with fetch.', 90],
        ['Form Validation', 'Add Zod validation on both client and server.', 60],
        ['Error Boundaries', 'Handle API errors gracefully with toast notifications.', 60],
        ['Testing', 'Write unit and integration tests for critical paths.', 90],
        ['Real-Time Updates', 'Add WebSocket-based live notifications with Socket.io.', 90],
      ]},
      { phase: 'Deployment', tasks: [
        ['Docker Compose Dev', 'Run frontend, backend, and DB together with compose.', 75],
        ['GitHub Actions CI', 'Lint, test, and build on every pull request.', 60],
        ['Deploy to Vercel & Railway', 'Ship frontend and backend to production.', 60],
        ['Monitoring with Sentry', 'Capture and alert on frontend and backend errors.', 60],
        ['Capstone Product', 'Build and ship a complete SaaS product end-to-end.', 180],
      ]},
    ],
  },
  design: {
    title: 'UI/UX Design',
    phases: [
      { phase: 'Design Basics', tasks: [
        ['Colour Theory', 'Create a 5-colour palette for a brand using HSL values.', 60],
        ['Typography', 'Choose type pairings and set a modular type scale.', 60],
        ['Layout & Grid', 'Design a page using an 8pt grid system.', 60],
        ['Gestalt Principles', 'Apply proximity, similarity, and hierarchy to a UI.', 45],
        ['Accessibility', 'Audit a design for WCAG AA colour contrast and labels.', 60],
      ]},
      { phase: 'Figma Mastery', tasks: [
        ['Figma Basics', 'Build a frame, add text, and use auto-layout.', 75],
        ['Components & Variants', 'Create a button component with 4 state variants.', 90],
        ['Design Tokens', 'Set up colour and spacing variables across a file.', 60],
        ['Prototyping', 'Add interactive flows between 3 screens.', 75],
        ['Developer Handoff', 'Export specs and assets for a developer.', 45],
      ]},
      { phase: 'UX Process', tasks: [
        ['User Research', 'Conduct 3 user interviews and synthesise findings.', 90],
        ['Journey Mapping', 'Map a user journey for a sign-up flow.', 60],
        ['Information Architecture', 'Create a sitemap and card-sort test.', 60],
        ['Wireframing', 'Sketch low-fi wireframes for 5 key screens.', 75],
        ['Usability Testing', 'Run a 5-user test on a prototype and report insights.', 90],
      ]},
      { phase: 'Portfolio', tasks: [
        ['Case Study 1', 'Document a full design process from problem to solution.', 120],
        ['Case Study 2', 'Design and test a mobile app feature.', 120],
        ['Design System', 'Build a component library with tokens and documentation.', 120],
        ['Portfolio Site', 'Publish your portfolio with at least 3 case studies.', 90],
        ['Presentation', 'Prepare a 10-minute design critique walkthrough.', 60],
      ]},
    ],
  },
}

// Map keywords in the goal to tracks
function detectTrack(goal: string): string {
  const g = goal.toLowerCase()
  if (/\b(frontend|front.end|react|css|html|ui dev|web dev)\b/.test(g))  return 'frontend'
  if (/\b(backend|back.end|server|api|node|express|django|rails)\b/.test(g)) return 'backend'
  if (/\b(ai|ml|machine.learn|deep.learn|llm|nlp|data.sci)\b/.test(g)) return 'ai'
  if (/\b(devops|kubernetes|docker|k8s|infra|cloud|aws|gcp)\b/.test(g)) return 'devops'
  if (/\b(design|ux|ui.ux|figma|product.design)\b/.test(g)) return 'design'
  if (/\b(full.?stack|full stack|end.to.end|mern|mean)\b/.test(g)) return 'fullstack'
  // Fallback: fullstack is a good general path
  return 'fullstack'
}

function localGenerate(goal: string, durationDays: number): GeneratedRoadmap {
  const trackKey = detectTrack(goal)
  const track    = TRACKS[trackKey]

  // Flatten all tasks from all phases
  const allTasks: [string, string, number][] = track.phases.flatMap((p) => p.tasks)

  // Spread tasks across the requested duration
  const days: GeneratedDay[] = Array.from({ length: durationDays }, (_, i) => {
    const task = allTasks[i % allTasks.length]
    return {
      dayNumber:        i + 1,
      title:            task[0],
      description:      task[1],
      estimatedMinutes: task[2],
    }
  })

  // If requested > available, cycle through again with slight variation
  return {
    title:     track.title,
    totalDays: durationDays,
    days,
  }
}

// ─── OpenAI Generator ─────────────────────────────────────────────────────────

function buildPrompt(goal: string, durationDays: number): string {
  return `You are a world-class career coach. A user wants to achieve: "${goal}"

Create a ${durationDays}-day learning roadmap. Each day = one focused task.

Rules:
- Day titles: concise, max 8 words
- Descriptions: 1 practical action sentence
- Estimated minutes: 45-120
- Progress: fundamentals → intermediate → advanced → project
- Be specific to the goal

Respond with ONLY valid JSON:
{
  "title": "3-6 word display title",
  "totalDays": ${durationDays},
  "days": [{"dayNumber": 1, "title": "...", "description": "...", "estimatedMinutes": 60}]
}
Generate all ${durationDays} days.`
}

async function openAIGenerate(goal: string, durationDays: number, apiKey: string): Promise<GeneratedRoadmap> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a precise JSON API. Output only valid JSON.' },
        { role: 'user',   content: buildPrompt(goal, durationDays) },
      ],
    }),
  })

  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${await response.text()}`)

  const json    = await response.json()
  const content = json.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty OpenAI response')

  const parsed = JSON.parse(content) as GeneratedRoadmap
  if (!parsed.title || !Array.isArray(parsed.days) || parsed.days.length === 0) {
    throw new Error('Malformed OpenAI response')
  }
  parsed.days      = parsed.days.slice(0, durationDays)
  parsed.totalDays = parsed.days.length
  return parsed
}

// ─── Public Entry Point ───────────────────────────────────────────────────────

export async function generateRoadmap(
  goal: string,
  durationDays: number,
): Promise<GeneratedRoadmap> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  // Use OpenAI if key is set and non-empty, otherwise fall back to local generator
  if (apiKey) {
    try {
      return await openAIGenerate(goal, durationDays, apiKey)
    } catch (err) {
      console.warn('[roadmap-generator] OpenAI failed, using local fallback:', err)
      // Fall through to local generator on any API error
    }
  }

  return localGenerate(goal, durationDays)
}

export { localGenerate } // exported for testing
