import { PresetResume, PresetJD } from "../types/ats";

export const PRESET_RESUMES: PresetResume[] = [
  {
    id: "elena-cloud-architect",
    name: "Elena Vance",
    role: "Senior Full-Stack & Cloud Architect",
    seniority: "Senior / Lead",
    experienceYears: 8,
    summary: "8+ years building enterprise SaaS platforms across AWS, TypeScript, Node.js, React.js, PostgreSQL, and Kubernetes.",
    resumeText: `ELENA VANCE
San Francisco, CA | elena.vance@techpulse.io | linkedin.com/in/elenavance-arch | github.com/evance-dev

EXECUTIVE SUMMARY
Senior Full-Stack Engineer & Cloud Solutions Architect with 8+ years of expertise designing resilient microservices, high-throughput distributed systems, and modern web applications. Proven track record scaling platforms from 50k to 2.8M DAU while maintaining 99.99% uptime. Expert in TypeScript, React.js, Node.js, PostgreSQL, AWS, and container orchestration.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Vite
- Backend & Cloud: Node.js, Express, NestJS, REST APIs, GraphQL, AWS (ECS, Lambda, RDS, S3, CloudFront), Docker, Kubernetes
- Databases & Storage: PostgreSQL, Redis, DynamoDB, Prisma ORM
- Testing & DevOps: Jest, Cypress, GitHub Actions, Terraform, Datadog

PROFESSIONAL EXPERIENCE

Aether Scale Systems | San Francisco, CA
Lead Full-Stack Architect | March 2022 – Present
- Architected and spearheaded real-time transaction reconciliation microservices handling $45M+ in daily throughput with Node.js, PostgreSQL, and Redis.
- Migrated legacy single-tenant monolith into multi-region AWS containerized architecture (EKS, Terraform), reducing infrastructure overhead by 34%.
- Mentored a distributed team of 9 frontend and backend engineers, instituting bi-weekly design reviews and automated CI/CD gating.
- Re-engineered core customer dashboard using React.js and Vite, cutting P95 Time-to-Interactive (TTI) from 3.2s to 820ms.

Beacon Financial Technologies | New York, NY
Senior Software Engineer | June 2019 – February 2022
- Spearheaded development of automated compliance reporting engine utilizing TypeScript, Express, and PostgreSQL, processing 12M rows per day.
- Authored custom React.js component library adopted across 4 product verticals, decreasing frontend feature delivery cycle by 40%.
- Integrated OAuth2/OIDC multi-tenant identity verification system with automated fraud anomaly detection.
- Led database query optimization initiative across 18 high-cardinality tables, decreasing average query response time by 58%.

Nexus Labs | Boston, MA
Software Engineer | August 2016 – May 2019
- Developed customer-facing analytics dashboards using React.js, D3.js, and Node.js.
- Implemented robust end-to-end integration test suites with Cypress and Jest, raising code coverage from 52% to 89%.
- Built data synchronization workers in Python querying Postgres and external third-party partner REST APIs.

EDUCATION
Bachelor of Science in Computer Science | Northeastern University, Boston, MA | Graduated 2016 (Cum Laude)

CERTIFICATIONS
- AWS Certified Solutions Architect – Professional (2023)
- Certified Kubernetes Administrator (CKA) – Linux Foundation (2022)`,
  },
  {
    id: "marcus-ml-platform",
    name: "Marcus Chen",
    role: "Staff ML Infrastructure Engineer",
    seniority: "Staff / Principal",
    experienceYears: 10,
    summary: "10 years building distributed training infrastructure, GPU clustering, PyTorch, Ray, Triton, and LLM serving pipelines.",
    resumeText: `MARCUS CHEN
Seattle, WA | marcus.chen@mlops-core.ai | github.com/marcuschen-cuda | linkedin.com/in/marcus-chen-ml

PROFESSIONAL PROFILE
Staff Machine Learning Infrastructure Engineer with 10 years of experience designing large-scale distributed training fabrics, high-throughput GPU serving architectures, and production MLOps pipelines. Deep specialization in PyTorch, Ray, Triton Inference Server, Kubernetes, CUDA kernel acceleration, and telemetry for deep learning models at petabyte scale.

CORE COMPETENCIES
- Machine Learning & Deep Learning: PyTorch, JAX, Hugging Face Transformers, vLLM, DeepSpeed, TensorRT-LLM, Triton Inference Server
- Infrastructure & Distributed Systems: Kubernetes (K8s), Ray, Slurm, Docker, CUDA, Linux Kernel Tuning, AWS (p4de, p5 instances, SageMaker)
- Languages & Tooling: Python, C++, Go, Bash, SQL, Git, Prometheus, Grafana, MLflow

PROFESSIONAL EXPERIENCE

Cortex AI Laboratories | Seattle, WA
Staff ML Systems Engineer | January 2021 – Present
- Architected enterprise LLM inference gateway serving 15,000 requests/sec with vLLM and Triton Inference Server, delivering sub-35ms TTFT (Time-to-First-Token).
- Built automated GPU cluster elasticity controller in Go and Kubernetes, scaling 512x H100 GPU clusters based on queue depth and spot availability, saving $1.2M annually.
- Optimized multi-node distributed training jobs utilizing PyTorch FSDP (Fully Sharded Data Parallel) and DeepSpeed ZeRO-3, achieving 84% linear scaling efficiency.
- Led incident post-mortems and designed GPU health telemetry agents tracking memory ECC errors and PCIe bandwidth degradation.

OmniVision Dynamics | Sunnyvale, CA
Senior Distributed Systems Engineer | July 2017 – December 2020
- Built automated training and evaluation pipelines for computer vision foundation models processing 40TB of weekly telemetry data.
- Implemented high-performance data loader using C++ and Python bindings, eliminating GPU starvation and boosting overall GPU utilization from 44% to 91%.
- Deployed distributed model registry and artifact store using MLflow, MinIO, and Kubernetes with strict cryptographic signing.

DataScale Technologies | Austin, TX
Machine Learning Software Engineer | September 2014 – June 2017
- Built scalable feature extraction pipelines in Python, Spark, and Cassandra for recommendation models.
- Maintained production batch inference workflows serving personalized user feeds to 6M monthly active users.

EDUCATION
Master of Science in Computer Science (Machine Learning Focus) | University of Washington | 2014
Bachelor of Science in Electrical Engineering & Computer Science | UC Berkeley | 2012

PUBLICATIONS & PATENTS
- "Adaptive Batching and KV-Cache Prefetching for Multi-Tenant LLM Serving", MLSys Conference 2024.`,
  },
  {
    id: "sarah-dir-eng",
    name: "Sarah Jenkins",
    role: "Director of Engineering",
    seniority: "Director / VP",
    experienceYears: 14,
    summary: "14 years engineering background, scaled organizations from 15 to 80+ engineers, SOC2 Type II compliance, cloud budgets, and modern architecture.",
    resumeText: `SARAH JENKINS
Austin, TX | sjenkins@exec-tech.com | linkedin.com/in/sarahjenkins-leader | 512-555-0198

EXECUTIVE BIOGRAPHY
Executive Engineering Leader with 14 years in tech, having led organizations of up to 85 engineers across platform infrastructure, core product, and enterprise security. Proven record leading SOC2 Type II audits, managing $8M annual cloud budgets, reducing developer cycle time by 45%, and guiding cloud migrations. Combines deep hands-on architectural background in Go, Python, and cloud services with executive talent management.

LEADERSHIP & DOMAIN EXPERTISE
- People Leadership: Org Design, Performance Management, Hiring & Retention, DE&I, Engineering Career Ladders
- Strategic Execution: OKR Alignment, $8M Cloud Infrastructure P&L, Vendor Negotiations, Architecture Governance
- Compliance & Security: SOC2 Type II, ISO 27001, GDPR, Zero-Trust Architecture
- Technical Foundations: Go, Python, Cloud Platforms (AWS, GCP), Microservices, Kafka, PostgreSQL

LEADERSHIP EXPERIENCE

OmniCloud Platforms | Austin, TX
Director of Engineering | October 2020 – Present
- Scaled engineering organization from 24 to 82 engineers across 8 cross-functional teams spanning Platform, Data, Core API, and Developer Experience.
- Overhauled cloud infrastructure governance on AWS and Snowflake, cutting annual cloud spend by 28% ($2.1M run-rate savings) while doubling data throughput.
- Led company-wide SOC2 Type II recertification with zero non-conformities; established shift-left vulnerability scanning and automated compliance evidence collection.
- Reduced mean time to onboard new engineers from 32 days to 9 days by instituting standardized dev containers and structured mentorship pairing.

HyperDrive Software | San Francisco, CA
Senior Engineering Manager | April 2017 – September 2020
- Managed 3 engineering teams (22 engineers) delivering real-time enterprise collaboration tools built in Go and TypeScript.
- Spearheaded zero-downtime database migration from on-prem MySQL cluster to AWS Aurora PostgreSQL, migrating 450M historical records without customer disruption.
- Established quarterly engineering hackathons resulting in 3 patented product features and 15% improvement in employee satisfaction scores.

Apex Interactive | Chicago, IL
Lead Software Architect | June 2013 – March 2017
- Architected high-concurrency event stream ingestion pipelines using Apache Kafka, Go, and Redis handling 80,000 events/sec.
- Mentored junior and mid-level engineers, running weekly code craftsmanship circles and architecture clinics.

EDUCATION
Bachelor of Science in Software Engineering | University of Michigan, Ann Arbor | 2010

EXECUTIVE TRAINING
- Berkeley Executive Leadership Program, Haas School of Business (2022)
- Pragmatic Institute: Certified Product & Engineering Alignment (2019)`,
  },
];

export const PRESET_JOB_DESCRIPTIONS: PresetJD[] = [
  {
    id: "senior-cloud-fullstack",
    title: "Senior Full-Stack & Cloud Architect",
    companyTier: "Tier-1 Enterprise SaaS",
    department: "Core Architecture & Platform",
    jdText: `Role: Senior Full-Stack & Cloud Architect
Location: Remote (US / Canada)
Compensation: $175,000 - $215,000 + Equity + Comprehensive Benefits

ABOUT THE ROLE:
We are looking for an experienced Senior Full-Stack & Cloud Architect to lead the design and evolution of our next-generation cloud platform. You will establish architectural standards, drive high-impact technical initiatives, and build mission-critical services handling tens of millions of daily operations.

KEY RESPONSIBILITIES:
- Architect, build, and maintain highly available, resilient web applications and microservices using TypeScript, Node.js, and React.js.
- Champion cloud infrastructure best practices across AWS (ECS/EKS, Lambda, RDS PostgreSQL, CloudFront).
- Design and optimize scalable relational schemas in PostgreSQL and in-memory caches with Redis.
- Collaborate closely with product managers, UX designers, and security teams to deliver high-quality, secure features.
- Mentor senior and mid-level engineers and conduct rigorous architectural design reviews.
- Drive automated testing (Jest, Cypress) and CI/CD automation to ensure 99.99% system reliability.

REQUIRED QUALIFICATIONS & SKILLS:
- 7+ years of professional software engineering experience with modern full-stack architectures.
- Strong proficiency with TypeScript, React.js, Node.js, and modern CSS/styling frameworks.
- Deep hands-on experience designing and operating services in AWS (EKS/ECS, RDS, S3, IAM, CloudWatch).
- Strong proficiency with PostgreSQL, including indexing strategies, query plan analysis, and connection pooling.
- Proven experience with Docker, Kubernetes, and automated CI/CD pipelines (GitHub Actions or GitLab CI).
- Demonstrated experience designing distributed REST APIs and GraphQL interfaces.
- Bachelor's degree in Computer Science or equivalent practical industry experience.

NICE-TO-HAVE:
- AWS Certified Solutions Architect or CKA certification.
- Experience with Terraform or Infrastructure as Code (IaC).
- Prior experience in high-growth B2B SaaS or fintech domains.`,
  },
  {
    id: "staff-ml-platform",
    title: "Staff Machine Learning Infrastructure Engineer",
    companyTier: "AI Frontier Scaleup",
    department: "Foundational AI Systems",
    jdText: `Role: Staff Machine Learning Infrastructure Engineer
Location: San Francisco, CA / Seattle, WA / Hybrid
Compensation: $210,000 - $275,000 + Significant Top-Tier Equity

ABOUT THE ROLE:
Join our Foundational AI team to build the distributed computational fabric that powers multi-billion parameter foundation models. You will be responsible for orchestrating hundreds of H100 GPU clusters, optimizing distributed training efficiency, and architecting sub-millisecond model serving engines.

WHAT YOU'LL DO:
- Build, optimize, and maintain distributed model training infrastructure utilizing PyTorch, Ray, Slurm, and Kubernetes.
- Architect high-throughput, low-latency inference serving systems using Triton Inference Server, vLLM, and TensorRT-LLM.
- Optimize low-level GPU communication primitives (NCCL), memory efficiency (FlashAttention, KV-cache management), and CUDA kernels.
- Implement comprehensive telemetry, automated fault tolerance, and GPU health monitoring across heterogeneous compute clusters.
- Collaborate with research scientists to deploy state-of-the-art architectures into high-availability production environments.

REQUIREMENTS:
- 8+ years of software engineering experience with at least 4+ years focused exclusively on ML/DL infrastructure.
- Expert-level proficiency in Python and C++ or Go.
- Deep hands-on experience with PyTorch, distributed training paradigms (FSDP, Megatron-LM, DeepSpeed), and Ray.
- Proven track record operating Kubernetes clusters with GPU workloads at scale.
- Deep understanding of GPU architectures (NVIDIA Ampere/Hopper), CUDA memory hierarchy, and high-speed networking (InfiniBand, RoCE).
- Experience with Triton Inference Server, TensorRT, or vLLM in high-traffic production environments.

PREFERRED:
- Track record of contributions to open-source systems (vLLM, Ray, Triton, DeepSpeed, PyTorch).
- Published research papers at MLSys, NeurIPS, ICML, or OSDI.`,
  },
  {
    id: "director-platform-eng",
    title: "Director of Platform & Infrastructure Engineering",
    companyTier: "Series-D Cloud Scaleup",
    department: "Engineering Leadership",
    jdText: `Role: Director of Platform & Infrastructure Engineering
Location: Austin, TX / Remote
Compensation: $220,000 - $265,000 + Equity Package

MISSION:
We are seeking an executive Director of Engineering to lead our Platform, Reliability, and Cloud Infrastructure organization. In this role, you will lead a 30+ person organization of engineering managers, staff architects, and SREs responsible for the core infrastructure powering our global enterprise clients.

CORE RESPONSIBILITIES:
- Lead, scale, and mentor an organization of 30+ engineers and managers across Platform, SRE, and Developer Productivity.
- Manage a multi-million dollar annual cloud infrastructure budget, driving cost optimization and efficiency initiatives.
- Champion organizational security, compliance standards (SOC2 Type II, ISO 27001), and high-availability SLAs (99.99%).
- Define the technical vision and multi-year roadmap for cloud infrastructure, developer platforms, and data pipelines.
- Partner with executive leadership (CTO, VP Product, CISO) on strategic roadmaps, hiring allocations, and headcount planning.
- Establish robust engineering career development frameworks, retention initiatives, and operational excellence standards.

WHAT WE LOOK FOR:
- 10+ years of software engineering background, with 5+ years of progressive engineering leadership and people management experience.
- Experience managing managers and leading organizations of 25+ engineers.
- Strong technical foundation in cloud infrastructure (AWS or GCP), distributed systems, and modern architectural principles.
- Proven experience guiding SOC2 Type II compliance audits and implementing zero-trust security postures.
- Strong financial acumen with demonstrated track record optimizing large-scale cloud budgets ($5M+).
- Exceptional communication skills with the ability to influence cross-functional executives and board members.`,
  },
];
