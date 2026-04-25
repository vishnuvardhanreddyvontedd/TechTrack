// prisma/seed-more.mjs — adds 8 new templates
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    }
  } catch {}
}
loadEnv(resolve(__dirname, '../.env.local'))

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const NEW_TEMPLATES = [
  {
    title: 'Data Scientist', slug: 'data-scientist', category: 'DATA_SCIENCE', totalDays: 30, iconEmoji: '📊',
    description: 'Master data analysis, statistical modeling, visualization, and machine learning with Python.',
    days: [
      [1,'Python for Data Analysis','Write data transformation scripts using lists, dicts, and comprehensions.',75],
      [2,'NumPy Fundamentals','Create and manipulate arrays, matrices, and perform vectorized operations.',75],
      [3,'Pandas Basics','Load, clean, and query tabular data with DataFrames.',90],
      [4,'Data Cleaning','Handle missing values, duplicates, and outliers in a real dataset.',90],
      [5,'Exploratory Data Analysis','Compute summary statistics and visualise distributions.',75],
      [6,'Matplotlib & Seaborn','Create line, bar, scatter, and heatmap charts.',60],
      [7,'Statistics: Probability','Apply Bayes theorem and probability distributions.',90],
      [8,'Statistics: Hypothesis Testing','Run t-tests, chi-square tests, and interpret p-values.',90],
      [9,'Linear Regression','Train, evaluate, and interpret a linear regression model.',90],
      [10,'Logistic Regression','Build a binary classifier and compute precision/recall/F1.',90],
      [11,'Decision Trees','Grow a tree, tune depth, and visualize feature importance.',75],
      [12,'Random Forests','Ensemble trees and analyse feature importances.',75],
      [13,'Model Evaluation','Apply cross-validation, ROC curves, and confusion matrices.',75],
      [14,'Feature Engineering','Create polynomial features, encodings, and interaction terms.',75],
      [15,'Scikit-learn Pipelines','Chain preprocessing and model steps into a single pipeline.',75],
      [16,'Clustering: K-Means','Segment a dataset and choose k with the elbow method.',75],
      [17,'Dimensionality Reduction','Apply PCA and TSNE to high-dimensional data.',75],
      [18,'Time Series Basics','Decompose trend/seasonality and build an ARIMA model.',90],
      [19,'SQL for Data Science','Write window functions, CTEs, and analytical queries.',90],
      [20,'A/B Testing','Design an experiment, collect data, and test significance.',90],
      [21,'Introduction to Neural Networks','Build a 2-layer MLP and train it on tabular data.',90],
      [22,'NLP Basics','Tokenise text, compute TF-IDF, and build a classifier.',75],
      [23,'Data Storytelling','Create a Jupyter report with narrative and charts.',60],
      [24,'Dashboard with Streamlit','Deploy an interactive data app in under 1 hour.',60],
      [25,'Big Data Concepts','Understand distributed computing, Spark, and data lakes.',60],
      [26,'MLOps Fundamentals','Version data and models with DVC and MLflow.',75],
      [27,'Ethics & Bias in Data','Audit a model for bias and apply fairness metrics.',60],
      [28,'Kaggle Competition','Submit a solution to a beginner Kaggle competition.',120],
      [29,'Portfolio Analysis Project','Analyse a real-world dataset end-to-end.',120],
      [30,'Capstone: Data Science Report','Publish a full analysis with insights to GitHub.',150],
    ],
  },
  {
    title: 'Mobile Developer', slug: 'mobile-developer', category: 'MOBILE', totalDays: 30, iconEmoji: '📱',
    description: 'Build cross-platform iOS and Android apps with React Native and TypeScript.',
    days: [
      [1,'React Native Setup','Init a project with Expo and run it on a simulator.',60],
      [2,'Core Components','Build screens with View, Text, Image, and ScrollView.',75],
      [3,'Styling in RN','Use StyleSheet, Flexbox, and dimensions.',75],
      [4,'Navigation with Expo Router','Add tabs and stack navigation.',90],
      [5,'useState & useEffect','Manage local state and lifecycle in React Native.',75],
      [6,'FlatList & SectionList','Render large scrollable lists efficiently.',75],
      [7,'Forms & Keyboard','Handle text inputs, pickers, and keyboard avoidance.',75],
      [8,'AsyncStorage','Persist data locally without a backend.',60],
      [9,'Fetching APIs','Call a REST API and display data with loading states.',90],
      [10,'React Query','Cache server state and handle background refetching.',90],
      [11,'Zustand State','Share global state across screens.',60],
      [12,'Gestures','Add swipe, pinch, and long-press with Gesture Handler.',75],
      [13,'Animations','Animate layout and transitions with Reanimated.',90],
      [14,'Camera & Media','Access camera, gallery, and microphone.',75],
      [15,'Push Notifications','Send and receive local and remote notifications.',75],
      [16,'Maps & Location','Render a map and track user location.',75],
      [17,'Authentication Flow','Build login/signup with JWT and secure storage.',90],
      [18,'Offline Support','Cache data and queue writes when offline.',75],
      [19,'Deep Linking','Handle URL schemes and universal links.',60],
      [20,'Performance Optimisation','Profile with Flipper and fix re-renders.',90],
      [21,'Testing with Jest','Write unit tests for components and hooks.',75],
      [22,'E2E with Detox','Automate user flows on a simulator.',90],
      [23,'App Icon & Splash','Add branded icon and splash screen.',45],
      [24,'OTA Updates','Push code updates with Expo Updates.',45],
      [25,'Analytics','Track events with Mixpanel or Amplitude.',60],
      [26,'Monetisation','Add in-app purchases with RevenueCat.',75],
      [27,'Accessibility','Make the app VoiceOver and TalkBack compatible.',60],
      [28,'App Store Build','Create a production build and upload to TestFlight.',90],
      [29,'Google Play Build','Create an AAB and upload to the Play Console.',75],
      [30,'Capstone: Ship an App','Publish a complete app to both stores.',180],
    ],
  },
  {
    title: 'Cloud Architect', slug: 'cloud-architect', category: 'DEVOPS', totalDays: 30, iconEmoji: '☁️',
    description: 'Design, deploy, and operate scalable cloud infrastructure on AWS with security and cost best practices.',
    days: [
      [1,'Cloud Fundamentals','Understand IaaS, PaaS, SaaS, and the shared responsibility model.',60],
      [2,'AWS Core Services','Set up EC2, S3, RDS, VPC, and IAM from the console.',120],
      [3,'IAM Deep Dive','Create users, roles, policies, and apply least-privilege.',90],
      [4,'Networking on AWS','Design a multi-AZ VPC with subnets, NAT, and routing.',90],
      [5,'EC2 & Auto Scaling','Launch an ASG with launch templates and health checks.',90],
      [6,'Load Balancers','Configure an ALB with target groups and path routing.',75],
      [7,'S3 Advanced','Enable versioning, lifecycle, replication, and presigned URLs.',75],
      [8,'RDS & Aurora','Deploy a Multi-AZ database with read replicas.',90],
      [9,'DynamoDB','Design a single-table schema and tune capacity.',90],
      [10,'Lambda & API Gateway','Build a serverless REST API end-to-end.',90],
      [11,'ECS & Fargate','Deploy a containerised app with ECS and Fargate.',90],
      [12,'EKS Basics','Launch a Kubernetes cluster and deploy a workload.',120],
      [13,'CloudFront & CDN','Distribute assets globally and configure caching.',75],
      [14,'Route 53','Set up DNS, health checks, and failover routing.',60],
      [15,'Terraform on AWS','Provision a full VPC and EC2 stack with Terraform.',120],
      [16,'CloudFormation','Write a template to deploy a serverless stack.',90],
      [17,'CI/CD on AWS','Build a CodePipeline from GitHub to ECS.',90],
      [18,'CloudWatch','Set up dashboards, alarms, and log insights.',75],
      [19,'AWS Security','Enable GuardDuty, Config, Security Hub, and WAF.',90],
      [20,'Cost Optimisation','Use Cost Explorer, Trusted Advisor, and Savings Plans.',60],
      [21,'SQS & SNS','Decouple services with queues and pub/sub topics.',75],
      [22,'EventBridge','Trigger Lambda from S3, DynamoDB, and custom events.',75],
      [23,'ElastiCache','Cache database queries with Redis on ElastiCache.',75],
      [24,'Disaster Recovery','Implement RPO/RTO strategies: backup, warm standby.',90],
      [25,'Multi-Region Architecture','Replicate data and failover across regions.',90],
      [26,'FinOps & Tagging','Tag resources, set budgets, and enforce cost allocation.',60],
      [27,'Well-Architected Review','Audit a workload against all 6 pillars.',90],
      [28,'Migration Strategies','Apply the 7 Rs: rehost, replatform, refactor.',75],
      [29,'GCP/Azure Comparison','Map AWS services to GCP and Azure equivalents.',60],
      [30,'Capstone: Architect a SaaS','Design and deploy a production-ready SaaS.',180],
    ],
  },
  {
    title: 'Cybersecurity Engineer', slug: 'cybersecurity', category: 'DEVOPS', totalDays: 30, iconEmoji: '🔐',
    description: 'Learn offensive and defensive security, penetration testing, and securing cloud infrastructure.',
    days: [
      [1,'Networking for Security','Understand TCP/IP, DNS, TLS, and packet analysis.',90],
      [2,'Linux for Security','Manage permissions, logs, processes, and firewalls.',90],
      [3,'Cryptography Basics','Apply symmetric/asymmetric encryption, hashing, and PKI.',75],
      [4,'OWASP Top 10','Study and reproduce each vulnerability with DVWA.',120],
      [5,'Web Reconnaissance','Use Shodan, Amass, and subfinder to map a target.',75],
      [6,'Burp Suite','Intercept, modify, and replay HTTP requests.',90],
      [7,'SQL Injection','Exploit and remediate SQL injection manually and with SQLMap.',90],
      [8,'XSS & CSRF','Exploit reflected, stored, and DOM-based XSS.',90],
      [9,'Authentication Attacks','Test for broken auth, session fixation, and JWT flaws.',90],
      [10,'Nmap & Port Scanning','Scan a target, identify services, and detect OS.',75],
      [11,'Metasploit Framework','Run an exploitation cycle on a lab machine.',90],
      [12,'Privilege Escalation','Escalate from user to root on Linux and Windows.',90],
      [13,'Password Attacks','Use Hashcat and John to crack hashed credentials.',75],
      [14,'Wireless Security','Capture WPA handshakes and analyse 802.11 protocols.',75],
      [15,'Malware Analysis','Run a sample in a sandbox and analyse behaviour.',90],
      [16,'SIEM & Logging','Configure Splunk/Elastic and write detection rules.',90],
      [17,'Incident Response','Follow an IR playbook: contain, eradicate, recover.',75],
      [18,'Cloud Security (AWS)','Apply IAM least-privilege, GuardDuty, and SCPs.',90],
      [19,'Container Security','Scan images, enforce policies, and harden Kubernetes.',75],
      [20,'DevSecOps','Add SAST, DAST, and SCA to a CI/CD pipeline.',90],
      [21,'Threat Modelling','Run a STRIDE exercise for a web application.',75],
      [22,'Zero Trust Architecture','Design a network with no implicit trust.',60],
      [23,'Phishing & Social Eng.','Run a simulated phishing campaign with GoPhish.',75],
      [24,'Red Team Planning','Write an engagement plan with MITRE ATT&CK mapping.',90],
      [25,'Bug Bounty Strategy','Set up a HackerOne profile and submit a first report.',90],
      [26,'Forensics Basics','Recover deleted files and analyse disk images.',75],
      [27,'Compliance Frameworks','Map controls to SOC 2, ISO 27001, and NIST.',60],
      [28,'CTF Challenge','Complete 3 HackTheBox or TryHackMe machines.',120],
      [29,'Security Audit Report','Write a penetration test report for a target.',90],
      [30,'Capstone: Full Pentest','Conduct and document a full engagement.',180],
    ],
  },
  {
    title: 'Product Manager', slug: 'product-manager', category: 'FRONTEND', totalDays: 30, iconEmoji: '📋',
    description: 'Learn product discovery, roadmapping, metrics, and how to ship products users love.',
    days: [
      [1,'Product Management 101','Understand the PM role, types, and how PM differs from PM.',60],
      [2,'User Research','Run 5 user interviews and synthesise key insights.',90],
      [3,'Problem Definition','Write a crisp problem statement from research findings.',60],
      [4,'Jobs-to-be-Done','Map user goals using the JTBD framework.',75],
      [5,'Competitive Analysis','Analyse 5 competitors across 10 product dimensions.',90],
      [6,'Writing a PRD','Draft a product requirements document for a feature.',90],
      [7,'User Stories','Write 10 user stories with acceptance criteria.',60],
      [8,'Prioritisation Frameworks','Apply RICE, ICE, and MoSCoW to a backlog.',75],
      [9,'Roadmapping','Build a 6-month roadmap with themes and milestones.',90],
      [10,'Metrics & KPIs','Define north star metric and supporting KPIs.',75],
      [11,'A/B Testing','Design an experiment hypothesis and success criteria.',75],
      [12,'Product Analytics','Set up Mixpanel and build a retention funnel.',90],
      [13,'Agile & Scrum','Run a sprint planning and retrospective.',75],
      [14,'Working with Engineers','Write technical specs and run grooming sessions.',75],
      [15,'Working with Designers','Give structured design feedback and run usability tests.',60],
      [16,'Go-to-Market Strategy','Write a GTM plan for a new feature launch.',90],
      [17,'Pricing & Monetisation','Model freemium, subscription, and usage pricing.',75],
      [18,'OKRs','Write quarterly OKRs and cascade to teams.',60],
      [19,'Stakeholder Management','Create a RACI and run a stakeholder alignment meeting.',60],
      [20,'Product Strategy','Write a 1-page product strategy document.',90],
      [21,'Customer Journey Mapping','Map the full journey from awareness to retention.',75],
      [22,'Feature Flagging','Roll out a feature with LaunchDarkly and monitor.',60],
      [23,'SQL for PMs','Write queries to answer product questions.',90],
      [24,'Growth Loops','Identify and design a viral or sticky growth loop.',75],
      [25,'B2B vs B2C PM','Compare processes, metrics, and stakeholders.',60],
      [26,'Post-Mortem','Write a post-mortem for a failed product decision.',60],
      [27,'PM Interview Prep','Practice 10 PM interview questions with frameworks.',90],
      [28,'Product Critique','Critique a popular app and suggest 3 improvements.',75],
      [29,'Case Study','Document a full product cycle from discovery to launch.',120],
      [30,'Capstone: Product Spec','Write a complete spec for your own product idea.',150],
    ],
  },
  {
    title: 'UI/UX Designer', slug: 'ui-ux-designer', category: 'FRONTEND', totalDays: 30, iconEmoji: '🎭',
    description: 'Master user research, Figma, design systems, and interaction design for digital products.',
    days: [
      [1,'Design Thinking','Run a full design thinking workshop on a real problem.',75],
      [2,'User Research Methods','Plan and conduct 3 contextual interviews.',90],
      [3,'Affinity Mapping','Cluster research findings into themes.',60],
      [4,'Personas','Create 2 detailed personas from real user data.',75],
      [5,'User Journey Maps','Map the current and ideal journey for a persona.',75],
      [6,'Information Architecture','Build a sitemap and run a card sort test.',60],
      [7,'Wireframing','Sketch lo-fi wireframes for 5 key screens.',75],
      [8,'Figma Basics','Master frames, auto-layout, and components.',90],
      [9,'Design Tokens','Set up colour, spacing, and type variables in Figma.',75],
      [10,'Component Library','Build a button, card, and input component with variants.',90],
      [11,'Typography','Set a modular type scale and choose font pairings.',60],
      [12,'Colour Theory','Create an accessible 5-colour palette.',60],
      [13,'Grid Systems','Apply an 8pt grid and 12-column layout to a design.',60],
      [14,'Hi-Fi Mockups','Polish 5 wireframes into high-fidelity designs.',120],
      [15,'Prototyping','Add interactive flows between 5 screens in Figma.',75],
      [16,'Micro-interactions','Design hover states, loaders, and transition animations.',75],
      [17,'Accessibility','Audit colour contrast and add ARIA labels to designs.',60],
      [18,'Usability Testing','Run a 5-user test and document 10 insights.',90],
      [19,'Design Critique','Give structured feedback using the I like/I wish/What if method.',60],
      [20,'Responsive Design','Adapt a desktop design for tablet and mobile.',75],
      [21,'Motion Design','Create a smooth page transition and micro-animation.',75],
      [22,'Data Visualisation','Design a dashboard with charts and KPI cards.',90],
      [23,'Design Handoff','Export specs and assets for developers via Figma.',60],
      [24,'Dark Mode','Design a dark theme version of a light interface.',75],
      [25,'Onboarding Flow','Design a 3-step onboarding experience.',90],
      [26,'Error States','Design empty, error, and success states for a form.',60],
      [27,'Design System Docs','Document usage guidelines for 10 components.',75],
      [28,'Portfolio Case Study 1','Document a full design process end-to-end.',120],
      [29,'Portfolio Case Study 2','Complete a second case study on a different problem.',120],
      [30,'Capstone: Publish Portfolio','Launch a Figma portfolio with 3 case studies.',150],
    ],
  },
  {
    title: 'Blockchain Developer', slug: 'blockchain-developer', category: 'FULLSTACK', totalDays: 30, iconEmoji: '⛓️',
    description: 'Build smart contracts, DeFi protocols, and Web3 apps on Ethereum and EVM-compatible chains.',
    days: [
      [1,'Blockchain Fundamentals','Understand blocks, hashes, consensus, and distributed ledgers.',75],
      [2,'Ethereum Architecture','Study accounts, gas, EVM, and the transaction lifecycle.',90],
      [3,'Solidity Basics','Write your first contract: variables, functions, and events.',90],
      [4,'Solidity Data Structures','Use mappings, arrays, and structs in contracts.',75],
      [5,'Solidity OOP','Apply inheritance, interfaces, and abstract contracts.',75],
      [6,'Hardhat Setup','Initialize a Hardhat project and deploy to a local node.',75],
      [7,'Writing Tests','Test contracts with Chai and Ethers.js.',90],
      [8,'ERC-20 Token','Deploy a standard fungible token contract.',90],
      [9,'ERC-721 NFT','Mint and transfer an NFT with metadata.',90],
      [10,'Access Control','Add Ownable and role-based access with OpenZeppelin.',60],
      [11,'Upgradeable Contracts','Use the proxy pattern to upgrade deployed contracts.',90],
      [12,'DeFi: AMM Basics','Understand constant product formula and liquidity pools.',75],
      [13,'Build a DEX','Create a simple Uniswap-like swap contract.',120],
      [14,'Lending Protocol','Implement deposit, borrow, and liquidation logic.',120],
      [15,'Oracles','Integrate Chainlink price feeds into a contract.',75],
      [16,'IPFS & Metadata','Store NFT metadata on IPFS with Pinata.',60],
      [17,'Ethers.js',`Connect a frontend to a contract using Ethers.js.`,90],
      [18,'Wagmi & RainbowKit','Build a wallet-connected React app.',90],
      [19,'The Graph','Index contract events and query with GraphQL.',75],
      [20,'Gas Optimisation','Reduce contract gas cost by 20% with storage tricks.',90],
      [21,'Security: Reentrancy','Reproduce and fix the reentrancy attack pattern.',90],
      [22,'Security: Flash Loans','Understand flash loan attacks and mitigations.',75],
      [23,'Audit Preparation','Use Slither and MythX to audit your contracts.',75],
      [24,'Layer 2 Basics','Deploy to Polygon and understand rollup types.',75],
      [25,'Cross-Chain Bridges','Transfer tokens across chains with a bridge.',60],
      [26,'DAO Contracts','Implement a governance contract with voting.',90],
      [27,'Tokenomics Design','Model a token distribution and vesting schedule.',60],
      [28,'Mainnet Fork Testing','Fork Ethereum mainnet and test against live state.',90],
      [29,'Full DApp Project','Build a complete DeFi or NFT project.',150],
      [30,'Capstone: Deploy to Mainnet','Deploy a production contract and verify on Etherscan.',120],
    ],
  },
  {
    title: 'Game Developer', slug: 'game-developer', category: 'FULLSTACK', totalDays: 30, iconEmoji: '🎮',
    description: 'Build 2D and 3D games with Unity, C#, physics, AI, and release on multiple platforms.',
    days: [
      [1,'Unity Editor Tour','Navigate the scene, hierarchy, inspector, and project windows.',60],
      [2,'GameObjects & Components','Add transforms, meshes, and custom components.',75],
      [3,'C# Scripting Basics','Write MonoBehaviours with Start, Update, and events.',90],
      [4,'Physics & Rigidbody','Apply forces, collisions, and triggers.',75],
      [5,'Player Movement','Build a responsive character controller.',90],
      [6,'Camera Systems','Implement follow and orbit cameras.',60],
      [7,'Tilemaps (2D)','Build a 2D platformer level with Unity Tilemaps.',90],
      [8,'Animations','Create an Animator controller with transitions.',75],
      [9,'UI System','Build a HUD with health bar, score, and menus.',75],
      [10,'Scene Management','Load scenes async and manage game states.',60],
      [11,'Audio','Add background music, sound effects, and 3D audio.',60],
      [12,'Particle Systems','Create explosion, fire, and pickup effects.',60],
      [13,'Scriptable Objects','Decouple game data from logic with ScriptableObjects.',75],
      [14,'Enemy AI','Implement patrol, chase, and attack with NavMesh.',90],
      [15,'Pathfinding','Build an A* pathfinding system from scratch.',90],
      [16,'Save System','Persist player data with JSON and PlayerPrefs.',75],
      [17,'Object Pooling','Optimise bullet and enemy spawning with pools.',75],
      [18,'Shader Basics','Write a surface shader and a post-process effect.',90],
      [19,'Lighting & Shadows','Bake global illumination and set up reflections.',75],
      [20,'3D Level Design','Block out a 3D level with props and lighting.',90],
      [21,'Inventory System','Build a drag-and-drop inventory UI.',90],
      [22,'Multiplayer Basics','Add Netcode for GameObjects and sync transforms.',120],
      [23,'Mobile Input','Add touch controls and screen orientation.',60],
      [24,'Performance Profiling','Use Unity Profiler to find and fix bottlenecks.',90],
      [25,'Monetisation','Integrate Unity Ads and in-app purchases.',60],
      [26,'Analytics','Track events with Unity Analytics.',45],
      [27,'Build Pipeline','Create automated builds for PC, iOS, and Android.',75],
      [28,'Playtesting','Run a playtest session and collect feedback.',90],
      [29,'Polish Pass','Add juice: screen shake, hit-stop, and particle feedback.',90],
      [30,'Capstone: Ship a Game','Publish a complete game to itch.io or the App Store.',180],
    ],
  },
]

async function seed() {
  console.log('🌱 Seeding new templates...\n')
  const client = await pool.connect()
  try {
    for (const tmpl of NEW_TEMPLATES) {
      const { rows } = await client.query('SELECT id FROM "RoadmapTemplate" WHERE slug = $1', [tmpl.slug])
      if (rows.length > 0) { console.log(`  ⏭  Skipping "${tmpl.title}"`); continue }
      const { rows: [row] } = await client.query(
        `INSERT INTO "RoadmapTemplate" (id,title,slug,description,category,"totalDays","iconEmoji","createdAt")
         VALUES (gen_random_uuid()::text,$1,$2,$3,$4::"Category",$5,$6,now()) RETURNING id`,
        [tmpl.title, tmpl.slug, tmpl.description, tmpl.category, tmpl.totalDays, tmpl.iconEmoji]
      )
      for (const [n,t,d,m] of tmpl.days) {
        await client.query(
          `INSERT INTO "DayTemplate" (id,"templateId","dayNumber",title,description,"estimatedMinutes",resources)
           VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,'{}')`,
          [row.id, n, t, d, m]
        )
      }
      console.log(`  ✅ "${tmpl.title}" — ${tmpl.days.length} days`)
    }
    console.log('\n✨ Done!')
  } finally { client.release(); await pool.end() }
}

seed().catch((e) => { console.error('❌', e.message); process.exit(1) })
