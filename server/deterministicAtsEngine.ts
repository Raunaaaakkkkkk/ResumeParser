// ─── Deterministic ATS Engine ────────────────────────────────────────────────
// Zero-dependency, pure-deterministic ATS resume parser & job matcher.
// High-precision pattern recognition, stateful section extraction, and
// multi-dimensional scoring compliant with enterprise recruiter workflows.
// ─────────────────────────────────────────────────────────────────────────────

export interface DeterministicResult {
  candidate_profile: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github_portfolio: string;
    executive_summary: string;
    total_years_experience: number;
    seniority_level: string;
    standardized_skills: string[];
    work_experience: Array<{
      company: string;
      role: string;
      start_date: string;
      end_date: string;
      duration: string;
      location?: string;
      key_achievements: string[];
      verified_technologies: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field_of_study?: string;
      graduation_year?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer?: string;
      year?: string;
    }>;
  };
  ats_audit: {
    overall_parse_rate: number;
    formatting_grade: string;
    readability_score: number;
    red_flags: string[];
    strengths: string[];
  };
  jd_analysis: {
    evaluated_against_jd: boolean;
    target_role_title: string;
    match_score: number;
    fit_level: string;
    scoring_breakdown: {
      skills_match_score: number;
      seniority_alignment_score: number;
      domain_relevance_score: number;
      credentials_education_score: number;
    };
    matched_skills: string[];
    missing_skills: string[];
    recommendation: string;
    executive_summary_gap_analysis: string;
    suggested_interview_questions: Array<{
      question: string;
      focus_area: string;
      rationale: string;
    }>;
    tailoring_recommendations: string[];
  };
}

// ─── Canonical Skill Map (190+ Enterprise & Core Technologies) ───────────────
const SKILL_CANONICAL_MAP: Array<{ canonical: string; patterns: RegExp[] }> = [
  // Programming Languages
  { canonical: "TypeScript",       patterns: [/\btypescript\b/i, /\bts\b(?=\s*(developer|engineer|stack))/i] },
  { canonical: "JavaScript",       patterns: [/\bjavascript\b/i, /\bes(?:6|7|8|9|20\d\d)\+?\b/i, /\becmascript\b/i, /\bjs\b(?=\s*[,|/]\s*(ts|python|html))/i] },
  { canonical: "Python",           patterns: [/\bpython\b/i] },
  { canonical: "Java",             patterns: [/\bjava\b(?!\s*script)/i] },
  { canonical: "C / C++",          patterns: [/\bc\+\+\b/i, /\bcpp\b/i, /\b(c\s*[/,]\s*c\+\+|c\s+language)\b/i, /\bc\b(?=\s*[,/]\s*(c\+\+|python|java|sql))/i] },
  { canonical: "C#",              patterns: [/\bc#\b/i, /\bc-sharp\b/i, /\.net\b/i, /\bdotnet\b/i] },
  { canonical: "Go",               patterns: [/\bgolang\b/i, /\bgo\s+language\b/i, /\bgo\b(?=\s*[,|/]\s*python)/i, /\bgo\b(?=\s+(developer|engineer|sdk|microservices))/i] },
  { canonical: "Rust",             patterns: [/\brust\b(?!\s*(iron|oxide))/i] },
  { canonical: "Ruby",             patterns: [/\bruby\b/i] },
  { canonical: "PHP",              patterns: [/\bphp\b/i] },
  { canonical: "Swift",            patterns: [/\bswift\b(?!\s*tail)/i] },
  { canonical: "Kotlin",           patterns: [/\bkotlin\b/i] },
  { canonical: "Scala",            patterns: [/\bscala\b/i] },
  { canonical: "SQL",              patterns: [/\bsql\b/i, /\bt-sql\b/i, /\bpl\/sql\b/i] },
  { canonical: "HTML & CSS",       patterns: [/\bhtml5?\b/i, /\bcss3?\b/i, /\bsass\b/i, /\bscss\b/i, /\bhtml\/css\b/i] },
  { canonical: "Shell & Bash",     patterns: [/\bbash\b/i, /\bshell\s+script/i, /\bpowershell\b/i, /\bzsh\b/i] },
  { canonical: "R",                patterns: [/\br\s+programming\b/i, /\bggplot2?\b/i, /\btidyverse\b/i] },
  { canonical: "Elixir",           patterns: [/\belixir\b/i, /\bphoenix\s+framework\b/i] },

  // Frontend & UI Engineering
  { canonical: "React.js",         patterns: [/\breact(\.js)?\b/i, /\breactjs\b/i] },
  { canonical: "Next.js",          patterns: [/\bnext(\.js)?\b/i, /\bnextjs\b/i] },
  { canonical: "Vue.js",           patterns: [/\bvue(\.js)?\b/i, /\bvuejs\b/i, /\bnuxt(\.js)?\b/i] },
  { canonical: "Angular",          patterns: [/\bangular(\.js)?\b/i] },
  { canonical: "Svelte",           patterns: [/\bsvelte(kit)?\b/i] },
  { canonical: "Tailwind CSS",     patterns: [/\btailwind(css)?\b/i] },
  { canonical: "Bootstrap",        patterns: [/\bbootstrap\b/i] },
  { canonical: "Redux",            patterns: [/\bredux(\s*toolkit)?\b/i, /\bzustand\b/i, /\bmobx\b/i] },
  { canonical: "React Native",     patterns: [/\breact\s+native\b/i] },
  { canonical: "Three.js / WebGL", patterns: [/\bthree\.js\b/i, /\bwebgl\b/i, /\bwebgpu\b/i] },
  { canonical: "D3.js",            patterns: [/\bd3(\.js)?\b/i] },
  { canonical: "Webpack & Vite",   patterns: [/\b(webpack|vite|esbuild|rollup|parcel)\b/i] },
  { canonical: "Storybook",        patterns: [/\bstorybook\b/i] },

  // Backend, Frameworks & APIs
  { canonical: "Node.js",          patterns: [/\bnode(\.js)?\b/i, /\bnodejs\b/i] },
  { canonical: "Express.js",       patterns: [/\bexpress(\.js)?\b/i] },
  { canonical: "NestJS",           patterns: [/\bnest(\.js)?\b/i, /\bnestjs\b/i] },
  { canonical: "Django",           patterns: [/\bdjango\b/i] },
  { canonical: "FastAPI",          patterns: [/\bfastapi\b/i] },
  { canonical: "Flask",            patterns: [/\bflask\b/i] },
  { canonical: "Spring Boot",      patterns: [/\bspring(\s*boot)?\b/i] },
  { canonical: "Ruby on Rails",    patterns: [/\brails\b/i, /\bruby\s+on\s+rails\b/i] },
  { canonical: "GraphQL",          patterns: [/\bgraphql\b/i, /\bapollo\s+graphql\b/i] },
  { canonical: "REST APIs",        patterns: [/\brest(ful)?(\s*api)?s?\b/i] },
  { canonical: "gRPC",             patterns: [/\bgrpc\b/i, /\bprotobuf\b/i] },
  { canonical: "WebSockets",       patterns: [/\bwebsocket\b/i, /\bsocket\.io\b/i] },
  { canonical: "OAuth2 / JWT",     patterns: [/\boauth2?\b/i, /\bjwt\b/i, /\bopenid\b/i, /\boidc\b/i] },
  { canonical: "MERN Stack",       patterns: [/\bmern(\s*stack)?\b/i] },
  { canonical: "MEAN Stack",       patterns: [/\bmean(\s*stack)?\b/i] },

  // Databases & Storage
  { canonical: "PostgreSQL",       patterns: [/\bpostgres(ql)?\b/i, /\bpsql\b/i, /\baurora\s+postgres/i] },
  { canonical: "MySQL",            patterns: [/\bmysql\b/i, /\bmariadb\b/i] },
  { canonical: "MongoDB",          patterns: [/\bmongo(db)?\b/i] },
  { canonical: "Redis",            patterns: [/\bredis\b/i] },
  { canonical: "Cassandra",        patterns: [/\bcassandra\b/i] },
  { canonical: "DynamoDB",         patterns: [/\bdynamodb\b/i] },
  { canonical: "Elasticsearch",    patterns: [/\belasticsearch\b/i, /\bopensearch\b/i] },
  { canonical: "Snowflake",        patterns: [/\bsnowflake\b/i] },
  { canonical: "BigQuery",         patterns: [/\bbigquery\b/i] },
  { canonical: "Firebase",         patterns: [/\bfirebase\b/i, /\bfirestore\b/i] },
  { canonical: "Prisma ORM",       patterns: [/\bprisma(\s*orm)?\b/i] },
  { canonical: "Supabase",         patterns: [/\bsupabase\b/i] },
  { canonical: "dbt",              patterns: [/\bdbt\b/i, /\bdata\s+build\s+tool\b/i] },

  // Cloud & DevOps Infrastructure
  { canonical: "AWS",              patterns: [/\baws\b/i, /\bamazon\s+web\s+services\b/i, /\b(ec2|ecs|eks|s3|rds|lambda|sqs|sns|cloudformation|cloudwatch|cloudfront|route53|cognito|iam|aurora)\b/i] },
  { canonical: "GCP",              patterns: [/\bgcp\b/i, /\bgoogle\s+cloud\b/i, /\b(gke|cloud\s+run|app\s+engine|pubsub)\b/i] },
  { canonical: "Microsoft Azure",  patterns: [/\b(azure|microsoft\s+azure|aks)\b/i] },
  { canonical: "Docker",           patterns: [/\bdocker\b/i, /\bcontainer(s|ization)?\b/i] },
  { canonical: "Kubernetes",       patterns: [/\bkubernetes\b/i, /\bk8s\b/i, /\bhelm\b/i] },
  { canonical: "Terraform",        patterns: [/\bterraform\b/i, /\bpulumi\b/i, /\binfrastructure\s+as\s+code\b/i, /\biac\b/i] },
  { canonical: "Ansible",          patterns: [/\bansible\b/i] },
  { canonical: "CI/CD",            patterns: [/\bci\/cd\b/i, /\bgithub\s+actions\b/i, /\bgitlab\s+ci\b/i, /\bjenkins\b/i, /\bcircleci\b/i, /\bargocd\b/i] },
  { canonical: "Linux",            patterns: [/\blinux\b/i, /\bubuntu\b/i, /\bdebian\b/i, /\bcentos\b/i, /\bredhat\b/i, /\blinux\s+kernel\b/i] },
  { canonical: "Nginx",            patterns: [/\bnginx\b/i, /\bhaproxy\b/i] },
  { canonical: "Serverless",       patterns: [/\bserverless\b/i, /\bfaas\b/i] },
  { canonical: "Service Mesh",     patterns: [/\b(istio|envoy|linkerd|service\s+mesh)\b/i] },

  // AI / ML & Data Engineering
  { canonical: "PyTorch",              patterns: [/\bpytorch\b/i, /\bfsdp\b/i] },
  { canonical: "TensorFlow",           patterns: [/\btensorflow\b/i, /\bkeras\b/i] },
  { canonical: "Machine Learning",     patterns: [/\bmachine\s+learning\b/i, /\bmlops\b/i] },
  { canonical: "Deep Learning",        patterns: [/\bdeep\s+learning\b/i, /\bneural\s+network\b/i] },
  { canonical: "LLMs & Gen AI",        patterns: [/\b(llm|llms|large\s+language\s+model|generative\s+ai|langchain|llamaindex|rag|prompt\s+engineering|fine-tuning|vllm|deepspeed|kv-cache)\b/i] },
  { canonical: "Scikit-learn",         patterns: [/\bscikit(-learn)?\b/i, /\bsklearn\b/i] },
  { canonical: "Pandas & NumPy",       patterns: [/\b(pandas|numpy|scipy)\b/i] },
  { canonical: "CUDA",                 patterns: [/\bcuda\b/i, /\bcudnn\b/i, /\bgpu\s+(acceleration|clusters?|serving)\b/i] },
  { canonical: "Ray",                  patterns: [/\bray\b(?=\s*(cluster|framework|serve))/i, /\bray\b/i] },
  { canonical: "Triton & Serving",     patterns: [/\btriton(\s+inference\s+server)?\b/i, /\btensorrt(-llm)?\b/i] },
  { canonical: "Hugging Face",         patterns: [/\bhugging\s*face\b/i, /\btransformers\b/i] },
  { canonical: "Apache Kafka",         patterns: [/\b(apache\s+)?kafka\b/i] },
  { canonical: "Apache Spark",         patterns: [/\b(apache\s+)?spark\b/i, /\bpyspark\b/i] },
  { canonical: "Airflow",              patterns: [/\b(apache\s+)?airflow\b/i] },
  { canonical: "MLflow",               patterns: [/\bmlflow\b/i] },
  { canonical: "Computer Vision",      patterns: [/\bcomputer\s+vision\b/i, /\bopencv\b/i] },
  { canonical: "NLP",                  patterns: [/\bnlp\b/i, /\bnatural\s+language\s+processing\b/i] },

  // Developer Tools & Fundamentals
  { canonical: "Git & GitHub",         patterns: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i] },
  { canonical: "VS Code",              patterns: [/\bvs\s*code\b/i, /\bvisual\s+studio\s+code\b/i] },
  { canonical: "Postman",              patterns: [/\bpostman\b/i] },
  { canonical: "Data Structures & Algorithms", patterns: [/\b(data\s+structures?(\s*(&|and)\s*algorithms?)?|dsa)\b/i] },
  { canonical: "Object-Oriented Programming",  patterns: [/\b(oops?|object[- ]oriented\s+programming)\b/i] },
  { canonical: "DBMS",                 patterns: [/\b(dbms|database\s+management(\s+systems?)?)\b/i] },
  { canonical: "Operating Systems",     patterns: [/\boperating\s+systems?\b/i] },
  { canonical: "Computer Networks",     patterns: [/\bcomputer\s+networks?\b/i] },

  // Architecture & Engineering Practices
  { canonical: "Microservices",             patterns: [/\bmicroservices?\b/i] },
  { canonical: "Distributed Systems",       patterns: [/\bdistributed\s+systems?\b/i, /\bdistributed\s+training\b/i, /\bhigh-concurrency\b/i, /\bevent\s+stream\b/i] },
  { canonical: "System Design",             patterns: [/\bsystem\s+(design|architecture)\b/i, /\barchitectural\s+governance\b/i] },
  { canonical: "Event-Driven Architecture", patterns: [/\bevent[- ]driven\b/i, /\bmessage\s+queue\b/i, /\brabbitmq\b/i] },
  { canonical: "Security & SOC2",           patterns: [/\bsoc\s*2(\s+type\s+ii)?\b/i, /\biso\s*27001\b/i, /\bpci[- ]dss\b/i, /\bzero[- ]trust\b/i, /\bgdpr\b/i, /\bdevsecops\b/i, /\bvulnerability\s+scanning\b/i] },
  { canonical: "People Leadership",         patterns: [/\b(org\s+design|engineering\s+management|people\s+leadership|career\s+ladders?|mentorship|managing\s+managers)\b/i] },
  { canonical: "Budget & P&L Management",   patterns: [/\b(cloud\s+budget|p&l|vendor\s+negotiations?|infrastructure\s+overhead)\b/i] },
  { canonical: "Agile / Scrum",             patterns: [/\b(agile|scrum|kanban|sprint)\b/i] },
  { canonical: "Jest & Testing",            patterns: [/\b(jest|vitest|mocha|unit\s+testing|tdd|bdd)\b/i] },
  { canonical: "E2E Testing",              patterns: [/\b(cypress|playwright|selenium|e2e\s+testing|integration\s+test)\b/i] },
  { canonical: "Observability",             patterns: [/\b(prometheus|grafana|datadog|opentelemetry|new\s+relic|sentry|telemetry)\b/i] },
];

export function extractStandardizedSkills(text: string): string[] {
  const found = new Set<string>();
  for (const item of SKILL_CANONICAL_MAP) {
    for (const pat of item.patterns) {
      if (pat.test(text)) {
        found.add(item.canonical);
        break;
      }
    }
  }
  return Array.from(found);
}

// ─── Date Parsing ─────────────────────────────────────────────────────────────
const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9,
  sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function parseMonthNum(raw: string): number {
  if (!raw) return 1;
  const n = parseInt(raw, 10);
  if (!isNaN(n) && n >= 1 && n <= 12) return n;
  return MONTH_MAP[raw.toLowerCase()] ?? 1;
}

function parseYear(raw: string): number | null {
  const y = parseInt(raw, 10);
  return y >= 1980 && y <= 2030 ? y : null;
}

function formatMonthYear(month: number, year: number): string {
  const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month] ?? "Jan"} ${year}`;
}

function durationLabel(sm: number, sy: number, em: number, ey: number): string {
  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths <= 0) return "< 1 mo";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} mo${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} yr${years !== 1 ? "s" : ""}`;
  return `${years} yr${years !== 1 ? "s" : ""} ${months} mo${months !== 1 ? "s" : ""}`;
}

interface ParsedDate { month: number; year: number; raw: string; isPresent: boolean; }
interface DateRange { start: ParsedDate; end: ParsedDate; }

const DATE_RANGE_RE = /(?:(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+)?(20\d{2}|19\d{2})\s*(?:[-–—]+|to)\s*(?:(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+)?(20\d{2}|19\d{2}|present|current|now|ongoing)/gi;

function extractDateRanges(text: string): DateRange[] {
  const ranges: DateRange[] = [];
  DATE_RANGE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = DATE_RANGE_RE.exec(text)) !== null) {
    const startYear = parseYear(m[2]);
    if (!startYear) continue;
    const start: ParsedDate = {
      month: parseMonthNum(m[1] ?? ""),
      year: startYear,
      raw: m[1] ? `${m[1]} ${startYear}` : `${startYear}`,
      isPresent: false,
    };
    const endRaw = m[4] ?? "";
    const isPresent = /present|current|now|ongoing/i.test(endRaw);
    let end: ParsedDate;
    if (isPresent) {
      const now = new Date();
      end = { month: now.getMonth() + 1, year: now.getFullYear(), raw: "Present", isPresent: true };
    } else {
      const endYear = parseYear(endRaw);
      if (!endYear) continue;
      end = {
        month: parseMonthNum(m[3] ?? ""),
        year: endYear,
        raw: m[3] ? `${m[3]} ${endYear}` : `${endYear}`,
        isPresent: false,
      };
    }
    ranges.push({ start, end });
  }
  return ranges;
}

// ─── Contact Info Extraction ──────────────────────────────────────────────────
const SECTION_HEADER_RE = /^(experience|professional\s+experience|work\s+experience|leadership\s+experience|employment\s+history|education|academic\s+background|summary|executive\s+summary|professional\s+profile|executive\s+biography|profile|skills|core\s+competencies|technical\s+skills|projects|personal\s+projects|certifications|credentials|publications|patents|awards|languages|references)/i;
const URL_LINE_RE = /@|http|www\.|linkedin|github|\.com|\.io|\.dev|\.ai/i;
const BULLET_LINE_RE = /^[-•▸►▶→✓✔*]\s+/;

function extractName(lines: string[], uploadedFileName?: string): string {
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const raw = lines[i]
      .replace(/["'“”]/g, "")
      .replace(/[|,•*#_▸►▶→]/g, " ")
      .replace(/\b(curriculum vitae|resume|cv|page \d+|contact|email|phone|profile)\b/gi, "")
      .replace(/\s+/g, " ").trim();
    if (
      raw.length >= 2 && raw.length <= 50 &&
      !URL_LINE_RE.test(raw) &&
      !/\d/.test(raw) &&
      !SECTION_HEADER_RE.test(raw) &&
      /^[A-Za-z''\-]+(\s[A-Za-z''\-]+){1,3}$/.test(raw)
    ) {
      return raw.replace(/\b([a-zA-Z])([a-zA-Z]*)\b/g, (_, f, r) => f.toUpperCase() + r.toLowerCase());
    }
  }
  if (uploadedFileName) {
    const base = uploadedFileName
      .replace(/\.(pdf|docx?|txt|md)$/i, "")
      .replace(/[_\-+]+/g, " ")
      .replace(/\b(resume|cv|dossier|document|profile|updated|final|v\d+|\d+)\b/gi, "")
      .replace(/\s+/g, " ").trim();
    if (base.length >= 3 && /[A-Za-z]/.test(base)) {
      return base.replace(/\b([a-zA-Z])([a-zA-Z]*)\b/g, (_, f, r) => f.toUpperCase() + r.toLowerCase());
    }
  }
  return "Candidate Profile";
}

const TITLE_CORE_RE = /\b(?:Chief|VP|Vice President|Head of|Director(?:\s+of)?|Principal|Staff|Lead|Senior|Sr\.?|Junior|Jr\.?|Associate|Intern|Graduate)?\s*(?:Full[\s\-]?Stack|Frontend|Front[\s\-]?End|Backend|Back[\s\-]?End|Software|Cloud|DevOps|Platform|Security|Data|ML|Machine Learning|AI|Blockchain|Mobile|iOS|Android|Systems|Infrastructure|Site Reliability|Embedded|QA|Test)?\s*(?:Engineer|Developer|Architect|Programmer|Scientist|Analyst|Researcher|Manager|Director|Officer|Intern)\b|\b(?:CTO|CEO|CIO|CISO|CPO|CFO)\b/i;

function extractHeadline(lines: string[], name: string): string {
  for (const line of lines.slice(0, 35)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.toLowerCase() === name.toLowerCase()) continue;
    if (URL_LINE_RE.test(trimmed) || SECTION_HEADER_RE.test(trimmed) || BULLET_LINE_RE.test(trimmed)) continue;
    if (TITLE_CORE_RE.test(trimmed) && trimmed.length < 85) {
      return trimmed.replace(/[|•·].*$/, "").trim();
    }
  }
  return "Software Engineering Professional";
}

// Global & Indian Tech Hubs
const KNOWN_CITIES_GLOBAL = /\b(San Francisco|New York(?:\s+City)?|NYC|Seattle|Austin|Boston|Chicago|Los Angeles|San Jose|Sunnyvale|Mountain View|Palo Alto|San Diego|Portland|Denver|Atlanta|Dallas|Houston|Phoenix|Miami|Raleigh|Charlotte|Nashville|Salt Lake City|Las Vegas|London|Manchester|Berlin|Munich|Paris|Amsterdam|Dublin|Stockholm|Toronto|Vancouver|Montreal|Sydney|Melbourne|Singapore|Tokyo|New Delhi|Delhi|Mumbai|Bengaluru|Bangalore|Hyderabad|Pune|Chennai|Kolkata|Noida|Gurgaon|Gurugram|Ahmedabad|Jaipur|Lucknow|Chandigarh|Bhopal|Indore|Patna|Kochi|Trivandrum|Remote|Hybrid)\b/i;
const KNOWN_COUNTRIES = /\b(India|USA|United States|UK|United Kingdom|Canada|Germany|Australia|Singapore)\b/i;
const US_STATE_CODE_RE = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/;

function extractLocation(text: string): string {
  const short = text.slice(0, 800);
  const cm = short.match(KNOWN_CITIES_GLOBAL);
  if (cm) {
    const idx = short.indexOf(cm[0]);
    const tail = short.slice(idx, idx + 50).split(/\n/)[0];
    const ext = tail.match(/^([A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?)(?:\s*[|•·\n]|$)/);
    return ext ? ext[1].trim() : cm[0];
  }
  const cs = short.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2})\b/);
  if (cs && US_STATE_CODE_RE.test(cs[2])) {
    return `${cs[1]}, ${cs[2]}`;
  }
  const co = short.match(KNOWN_COUNTRIES);
  if (co) return co[0];
  if (/\b(remote|hybrid|distributed)\b/i.test(short)) return "Remote";
  return "";
}

function extractEmail(text: string): string {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : "";
}

function extractPhone(text: string): string {
  const contactText = text.slice(0, 1000);
  // 1. International phone with country code (e.g. +91 9876543210 or +1 (415) 555-0192)
  const intlMatch = contactText.match(/(?:\+|00)\d{1,3}[\s\-]?(?:\(\d{1,4}\)|\d{1,4})?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/);
  if (intlMatch && intlMatch[0].replace(/\D/g, "").length >= 10) {
    return intlMatch[0].trim();
  }
  // 2. Standard North American (e.g. (415) 555-0192 or 415-555-0192)
  const usMatch = contactText.match(/(?:\+?1[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/);
  if (usMatch) return usMatch[0].trim();
  // 3. Indian 10-digit mobile starting with 6, 7, 8, or 9
  const inMatch = contactText.match(/\b[6-9]\d{9}\b/);
  if (inMatch) return inMatch[0].trim();
  return "";
}

function extractLinkedIn(text: string): string {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_/]+/i);
  return m ? (m[0].startsWith("http") ? m[0] : `https://${m[0]}`) : "";
}

function extractGitHub(text: string): string {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9\-_/]+/i) ??
            text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/[a-zA-Z0-9\-_/]+/i) ??
            text.match(/(?:portfolio|website|blog):\s*(https?:\/\/[^\s]+)/i);
  return m ? (m[0].startsWith("http") ? m[0] : `https://${m[0]}`) : "";
}

const SUMMARY_HEADER_RE = /^(summary|professional\s+summary|executive\s+summary|professional\s+profile|executive\s+biography|profile|objective|career\s+objective|about\s+me)\s*:?\s*$/i;

function extractSummary(lines: string[]): string {
  for (let i = 0; i < lines.length; i++) {
    if (SUMMARY_HEADER_RE.test(lines[i].trim())) {
      const chunks: string[] = [];
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const l = lines[j].trim();
        if (!l) continue;
        if (SECTION_HEADER_RE.test(l) && l.length < 35) break;
        chunks.push(l);
        if (chunks.join(" ").length > 500) break;
      }
      if (chunks.length) return chunks.join(" ").slice(0, 600);
    }
  }
  return "";
}

// ─── Work Experience & Projects Parsing ───────────────────────────────────────
const EXPERIENCE_HEADER_RE = /^(?:work\s+|professional\s+|leadership\s+|relevant\s+|technical\s+|summer\s+)?(?:experience|employment|work|career|internships?|practical\s+training)(?:\s*(?:&|\/|and)\s*(?:internships?|experience|projects?|training))?\s*:?\s*$/i;
const PROJECTS_HEADER_RE = /^(?:technical\s+|academic\s+|personal\s+|key\s+|selected\s+)?projects?\s*:?\s*$/i;
const SECTION_END_RE = /^(?:education|academic|skills?|technical\s+skills?|core\s+competencies|certifications?|credentials?|publications?|patents?|awards?|languages?|references?|achievements?|coding\s+profiles?|extracurricular|executive\s+training|training)\b/i;

interface RawWorkBlock {
  headerLines: string[];
  bulletLines: string[];
}

function extractRawWorkBlocks(lines: string[], startHeaderRe: RegExp, endHeaderRe: RegExp): RawWorkBlock[] {
  let startIdx = -1;
  let endIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (startHeaderRe.test(l)) {
      startIdx = i + 1;
      for (let j = i + 1; j < lines.length; j++) {
        const lj = lines[j].trim();
        if (endHeaderRe.test(lj) && !startHeaderRe.test(lj)) {
          endIdx = j;
          break;
        }
      }
      break;
    }
  }

  if (startIdx === -1) return [];

  const sectionLines = lines.slice(startIdx, endIdx);
  const blocks: RawWorkBlock[] = [];
  let curHeader: string[] = [];
  let curBullets: string[] = [];

  for (let i = 0; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    const isBullet = BULLET_LINE_RE.test(line);

    if (isBullet) {
      curBullets.push(line);
    } else {
      if (curBullets.length > 0) {
        blocks.push({ headerLines: [...curHeader], bulletLines: [...curBullets] });
        curHeader = [];
        curBullets = [];
      }
      curHeader.push(line);
    }
  }

  if (curHeader.length > 0 || curBullets.length > 0) {
    blocks.push({ headerLines: [...curHeader], bulletLines: [...curBullets] });
  }

  return blocks;
}

function parseWorkHeader(headerLines: string[]) {
  let role = "";
  let company = "";
  let location = "";
  let dateRaw = "";

  for (const rawLine of headerLines) {
    const line = rawLine.trim();

    DATE_RANGE_RE.lastIndex = 0;
    const dateMatch = DATE_RANGE_RE.exec(line);
    if (dateMatch && !dateRaw) {
      dateRaw = dateMatch[0];
    }

    const stripped = line.replace(DATE_RANGE_RE, "").replace(/\s{2,}/g, " ").trim();
    DATE_RANGE_RE.lastIndex = 0;

    if (stripped.includes("|") || stripped.includes("•") || stripped.includes("·")) {
      const parts = stripped.split(/[|•·]/).map((p) => p.trim()).filter(Boolean);
      for (const part of parts) {
        if (KNOWN_CITIES_GLOBAL.test(part) || US_STATE_CODE_RE.test(part) || KNOWN_COUNTRIES.test(part)) {
          if (!location) location = part;
          continue;
        }

        const atMatch = part.match(/^(.+?)\s*(?:\bat\b|@)\s*(.+)$/i);
        if (atMatch) {
          if (!role) role = atMatch[1].trim();
          if (!company) company = atMatch[2].trim();
          continue;
        }

        if (TITLE_CORE_RE.test(part)) {
          if (!role) role = part;
          continue;
        }

        if (!company && part.length > 2 && part.length < 60) {
          company = part;
        }
      }
      continue;
    }

    const atMatch = stripped.match(/^(.+?)\s*(?:\bat\b|@)\s*(.+)$/i);
    if (atMatch) {
      if (!role) role = atMatch[1].trim();
      if (!company) company = atMatch[2].trim();
      continue;
    }

    if (TITLE_CORE_RE.test(stripped) && !role) {
      role = stripped;
    } else if (!company && stripped.length > 2 && stripped.length < 60) {
      company = stripped;
    }
  }

  return {
    role: role || "Software Engineer",
    company: company || "Company",
    location: location || undefined,
    dateRaw,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseWorkExperience(lines: string[]): DeterministicResult["candidate_profile"]["work_experience"] {
  // 1. Extract from standard Experience / Internships section
  const expEndRegex = new RegExp(`(?:${PROJECTS_HEADER_RE.source}|${SECTION_END_RE.source})`, "i");
  let rawBlocks = extractRawWorkBlocks(lines, EXPERIENCE_HEADER_RE, expEndRegex);

  // Fallback: If no experience section, scan for date anchors (skipping any dates in education)
  if (rawBlocks.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      if (DATE_RANGE_RE.test(lines[i])) {
        DATE_RANGE_RE.lastIndex = 0;
        // Don't treat education lines as work experience anchors
        const prev = lines[Math.max(0, i - 1)];
        if (/degree|b\.?tech|b\.?e\.|bachelor|master|university|college|school|cgpa/i.test(prev + " " + lines[i])) {
          continue;
        }
        const escaped = escapeRegex(prev.slice(0, 20));
        const fakeHeader = new RegExp(`^${escaped}`, "i");
        rawBlocks = extractRawWorkBlocks(lines, fakeHeader, SECTION_END_RE);
        break;
      }
    }
  }

  const results: DeterministicResult["candidate_profile"]["work_experience"] = [];

  for (const block of rawBlocks) {
    if (!block.headerLines.length && !block.bulletLines.length) continue;

    const { role, company, location, dateRaw } = parseWorkHeader(block.headerLines);

    let startDate = "";
    let endDate = "";
    let duration = "";

    if (dateRaw) {
      const ranges = extractDateRanges(dateRaw);
      if (ranges[0]) {
        const r = ranges[0];
        startDate = formatMonthYear(r.start.month, r.start.year);
        endDate = r.end.isPresent ? "Present" : formatMonthYear(r.end.month, r.end.year);
        duration = durationLabel(r.start.month, r.start.year, r.end.month, r.end.year);
      }
    }

    const achievements: string[] = [];
    for (const line of block.bulletLines) {
      const clean = line.replace(BULLET_LINE_RE, "").trim();
      if (clean.length > 10) achievements.push(clean);
    }

    const allJobText = `${block.headerLines.join(" ")} ${block.bulletLines.join(" ")}`;
    const verifiedTech = extractStandardizedSkills(allJobText);

    results.push({
      company,
      role,
      start_date: startDate,
      end_date: endDate,
      duration,
      location,
      key_achievements: achievements.slice(0, 6),
      verified_technologies: verifiedTech.slice(0, 8),
    });
  }

  // 2. Also extract from PROJECTS section if available
  const projBlocks = extractRawWorkBlocks(lines, PROJECTS_HEADER_RE, SECTION_END_RE);
  for (const pb of projBlocks) {
    if (!pb.headerLines.length && !pb.bulletLines.length) continue;

    const titleLine = pb.headerLines[0] || "Technical Project";
    const parts = titleLine.split(/[|•·]/).map((p) => p.trim()).filter(Boolean);
    const projectName = parts[0] || "Project";

    const achievements: string[] = [];
    for (const line of pb.bulletLines) {
      const clean = line.replace(BULLET_LINE_RE, "").trim();
      if (clean.length > 10) achievements.push(clean);
    }

    const allProjText = `${pb.headerLines.join(" ")} ${pb.bulletLines.join(" ")}`;
    const verifiedTech = extractStandardizedSkills(allProjText);

    results.push({
      company: projectName,
      role: "Project Developer",
      start_date: "",
      end_date: "",
      duration: "Project Showcase",
      location: "Personal / Open Source Project",
      key_achievements: achievements.slice(0, 5),
      verified_technologies: verifiedTech.slice(0, 8),
    });
  }

  return results.slice(0, 10);
}

// ─── Education Parsing ────────────────────────────────────────────────────────
const EDUCATION_HEADER_RE = /^(?:education(?:\s*(?:&|and|\/)\s*(?:training|qualifications?|certifications?|accreditations?))?|academics?|academic\s+(?:qualifications?|background|details|records?|credentials?|profile|achievements?)|educational\s+(?:qualifications?|background|details|records?)|qualifications?|degrees?)\s*:?\s*$/i;
const EDU_SECTION_END_RE = /^(?:experience|professional\s+experience|work\s+experience|leadership\s+experience|skills|technical\s+skills|core\s+competencies|projects|certifications|publications|patents|awards|languages|references|achievements|coding\s+profiles|executive\s+training|training|courses)\b/i;

function cleanHeaderStr(raw: string): string {
  return raw
    .replace(/^[^\w\s]+/, "")
    .replace(/[^\w\s]+$/, "")
    .trim();
}

const DEGREE_MAPPINGS: Array<{ pattern: RegExp; canonical: string; defaultField?: string }> = [
  // Doctoral
  { pattern: /\b(?:Doctor\s+of\s+Philosophy|Ph\.?D\.?|Doctorate)\b/i, canonical: "Ph.D." },
  // Master's
  { pattern: /\b(?:Master\s+of\s+Technology|M\.?Tech\b|MTech)\b/i, canonical: "Master of Technology (M.Tech)" },
  { pattern: /\b(?:Master\s+of\s+Engineering|M\.?Eng\b|M\.E\.)\b/i, canonical: "Master of Engineering (M.E.)" },
  { pattern: /\b(?:Master\s+of\s+Computer\s+Applications?|M\.?C\.?A\.?\b|MCA\b)\b/i, canonical: "Master of Computer Applications (MCA)", defaultField: "Computer Applications" },
  { pattern: /\b(?:Master\s+of\s+Business\s+Administration|M\.?B\.?A\.?\b|MBA\b)\b/i, canonical: "Master of Business Administration (MBA)", defaultField: "Business Administration" },
  // Lookahead guard to avoid matching "MS Office", "MS Excel", "MS Word", "MS Teams", "MS SQL", etc.
  { pattern: /\b(?:Master\s+of\s+Science|M\.S\.|(?:\bMS\b(?!\s+(?:Office|Excel|Word|PowerPoint|Access|Teams|SQL|Project|DOS|Paint|Windows|Azure|Dynamics|SharePoint|Exchange|365|Visio|Outlook))))\b/i, canonical: "Master of Science (M.S.)" },
  { pattern: /\b(?:Master\s+of\s+Arts|M\.A\.)\b/i, canonical: "Master of Arts (M.A.)" },
  { pattern: /\bMaster(?:'s)?(?:\s+Degree)?\b/i, canonical: "Master's Degree" },
  // Bachelor's
  { pattern: /\b(?:Bachelor\s+of\s+Technology(?:\s*\/\s*Bachelor\s+of\s+Engineering)?|B\.?Tech\s*\/\s*B\.?E\.?|B\.?Tech\b|BTech)\b/i, canonical: "Bachelor of Technology (B.Tech / B.E.)" },
  { pattern: /\b(?:Bachelor\s+of\s+Engineering|B\.?Eng\b|B\.E\.)\b/i, canonical: "Bachelor of Engineering (B.E.)" },
  { pattern: /\b(?:Bachelor\s+of\s+Computer\s+Applications?|B\.?C\.?A\.?\b|BCA\b)\b/i, canonical: "Bachelor of Computer Applications (BCA)", defaultField: "Computer Applications" },
  { pattern: /\b(?:Bachelor\s+of\s+Business\s+Administration|B\.?B\.?A\.?\b|BBA\b)\b/i, canonical: "Bachelor of Business Administration (BBA)", defaultField: "Business Administration" },
  { pattern: /\b(?:Bachelor\s+of\s+Science|B\.?S\.|B\.?Sc\.?)\b/i, canonical: "Bachelor of Science (B.S.)" },
  { pattern: /\b(?:Bachelor\s+of\s+Arts|B\.A\.)\b/i, canonical: "Bachelor of Arts (B.A.)" },
  { pattern: /\b(?:Graduation|Undergraduate|Bachelor(?:'s)?(?:\s+Degree)?)\b/i, canonical: "Bachelor's Degree" },
  // Associate & Diploma
  { pattern: /\b(?:Associate(?:'s)?(?:\s+Degree)?|A\.?A\.?S?\.?)\b/i, canonical: "Associate Degree" },
  { pattern: /\b(?:Diploma\s+in\s+[A-Za-z\s&]+|Polytechnic\s+Diploma)\b/i, canonical: "Diploma" },
  // High School / Secondary
  { pattern: /\b(?:Class\s+XII|Class\s+12|12th\s+(?:Grade|Standard|Board)?|Senior\s+Secondary|Higher\s+Secondary|HSC|CBSE\s+(?:Class\s+)?12)\b/i, canonical: "Senior Secondary (Class XII)" },
  { pattern: /\b(?:Class\s+X\b|Class\s+10|10th\s+(?:Grade|Standard|Board)?|Secondary\s+School|Matriculation|SSC|CBSE\s+(?:Class\s+)?10)\b/i, canonical: "Secondary School (Class X)" },
];

const KNOWN_INSTITUTIONS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /\b(?:Delhi\s+Technological\s+University|DTU|Delhi\s+College\s+of\s+Engineering|DCE)\b/i, name: "Delhi Technological University (DTU)" },
  { pattern: /\b(?:Galgotias\s+University|Galgotia(?:\s+College)?)\b/i, name: "Galgotias University" },
  { pattern: /\b(?:Netaji\s+Subhas\s+University\s+of\s+Technology|NSUT|NSIT)\b/i, name: "Netaji Subhas University of Technology (NSUT)" },
  { pattern: /\b(?:Indira\s+Gandhi\s+Delhi\s+Technical\s+University\s+for\s+Women|IGDTUW)\b/i, name: "IGDTUW Delhi" },
  { pattern: /\b(?:BITS\s+Pilani|Birla\s+Institute\s+of\s+Technology\s+and\s+Science)\b/i, name: "BITS Pilani" },
  { pattern: /\b(?:IIT\s+([A-Za-z]+)|Indian\s+Institute\s+of\s+Technology(?:\s+(?:at\s+|in\s+)?([A-Za-z]+))?)\b/i, name: "Indian Institute of Technology" },
  { pattern: /\b(?:NIT\s+([A-Za-z]+)|National\s+Institute\s+of\s+Technology(?:\s+(?:at\s+|in\s+)?([A-Za-z]+))?)\b/i, name: "National Institute of Technology" },
  { pattern: /\b(?:IIIT\s+([A-Za-z]+)|Indian\s+Institute\s+of\s+Information\s+Technology(?:\s+(?:at\s+|in\s+)?([A-Za-z]+))?)\b/i, name: "Indian Institute of Information Technology" },
  { pattern: /\b(?:Vellore\s+Institute\s+of\s+Technology|VIT)\b/i, name: "Vellore Institute of Technology (VIT)" },
  { pattern: /\b(?:SRM\s+Institute|SRM\s+University)\b/i, name: "SRM Institute of Science and Technology" },
  { pattern: /\b(?:Manipal\s+Institute\s+of\s+Technology|MAHE)\b/i, name: "Manipal Institute of Technology" },
  { pattern: /\b(?:Thapar\s+Institute|TIET)\b/i, name: "Thapar Institute of Engineering and Technology" },
  { pattern: /\b(?:UC\s+Berkeley|University\s+of\s+California[,\s]+Berkeley)\b/i, name: "UC Berkeley" },
  { pattern: /\b(?:UCLA|University\s+of\s+California[,\s]+Los\s+Angeles)\b/i, name: "UCLA" },
  { pattern: /\b(?:Northeastern\s+University)\b/i, name: "Northeastern University" },
  { pattern: /\b(?:University\s+of\s+Washington)\b/i, name: "University of Washington" },
  { pattern: /\b(?:University\s+of\s+Michigan)\b/i, name: "University of Michigan" },
  { pattern: /\b(?:Stanford\s+University)\b/i, name: "Stanford University" },
  { pattern: /\b(?:Carnegie\s+Mellon\s+University|CMU)\b/i, name: "Carnegie Mellon University" },
  { pattern: /\b(?:Massachusetts\s+Institute\s+of\s+Technology|MIT)\b/i, name: "MIT" },
  { pattern: /\b(?:Harvard\s+University)\b/i, name: "Harvard University" },
  { pattern: /\b(?:Columbia\s+University)\b/i, name: "Columbia University" },
  { pattern: /\b(?:Cornell\s+University)\b/i, name: "Cornell University" },
];

function cleanInstitutionName(raw: string): string {
  for (const ki of KNOWN_INSTITUTIONS) {
    const match = raw.match(ki.pattern);
    if (match) {
      if (match[1] || match[2]) {
        const campus = (match[1] || match[2]).trim();
        return `${ki.name} (${campus.toUpperCase()})`;
      }
      const locMatch = raw.match(/\b(Greater\s+Noida|Noida|Delhi|New\s+Delhi|Gurugram|Bangalore|Hyderabad|Pune|Mumbai|Chennai|Kolkata)\b/i);
      if (locMatch && !ki.name.toLowerCase().includes(locMatch[1].toLowerCase())) {
        return `${ki.name}, ${locMatch[1]}`;
      }
      return ki.name;
    }
  }

  let cleaned = raw
    .replace(/^(?:from|at|college|university|school|institute)\s*[:\-]?\s*/i, "")
    .replace(/\b(?:CGPA|GPA|Grade|Marks|Percentage|Percentage\s+scored)[\s:]*[\d.]+(?:\/\d+)?%?/gi, "")
    .replace(/\b(?:with\s+[\d.]+%?\s+(?:in\s+)?)\b/gi, "")
    .replace(/\b(?:Graduated|Passed|Batch\s+of|Class\s+of)?\s*(?:20\d{2}|19\d{2})\b/gi, "")
    .replace(/\((?:20\d{2}|19\d{2})[^)]*\)/g, "")
    .replace(/\s*[|\-–•·]\s*$/g, "")
    .replace(/^\s*[|\-–•·]\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Deduplicate consecutive repeated comma-separated tokens (e.g. "Greater Noida, Greater Noida")
  const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
  const dedupedParts: string[] = [];
  for (const p of parts) {
    if (!dedupedParts.some((dp) => dp.toLowerCase() === p.toLowerCase())) {
      dedupedParts.push(p);
    }
  }
  cleaned = dedupedParts.join(", ");

  cleaned = cleaned.replace(/[,;\-]+$/, "").trim();
  return cleaned || "University";
}

function extractDegreeAndField(text: string): { degree: string; field?: string } {
  let degree = "";
  let field: string | undefined = undefined;

  for (const dm of DEGREE_MAPPINGS) {
    if (dm.pattern.test(text)) {
      degree = dm.canonical;
      if (dm.defaultField && !field) {
        field = dm.defaultField;
      }
      break;
    }
  }

  // 1. Look for explicit field: "in <Field>"
  const inMatch = text.match(/\b(?:in|major(?:ing)?\s+in|specializ(?:ing|ation)\s+in)\s+([A-Za-z\s&/]+?)(?:\s+from\b|\s*\(|\s*\||\s*–|\s*-|\s*,|\s*;\s*|$)/i);
  if (inMatch) {
    const cand = inMatch[1].trim();
    if (cand.length > 2 && !/^(the|a|an|from|at|both|english|hindi|languages?|first|second|sem|semester|year)$/i.test(cand)) {
      field = cand;
    }
  }

  // 2. Look for comma or hyphen separated field after degree: e.g. "B.Tech, Computer Science & Engineering"
  if (!field) {
    const postDegreeMatch = text.match(/\b(?:B\.?Tech|B\.?E\.?|Bachelor\s+of\s+Technology|Bachelor\s+of\s+Science|Master\s+of\s+Science|M\.?S\.?|B\.?S\.?)\s*[,–\-]\s*([A-Za-z\s&/]+?)(?:\s+from\b|\s*\(|\s*\||\s*–|\s*-|\s*,|\s*;\s*|$)/i);
    if (postDegreeMatch && postDegreeMatch[1].trim().length > 2) {
      const cand = postDegreeMatch[1].trim();
      if (!/^(the|a|an|from|at|university|college|institute|cgpa|gpa|both)$/i.test(cand)) {
        field = cand;
      }
    }
  }

  // 3. Look for parenthesized field: e.g. "B.Tech/B.E. ( Computers )" or "B.Tech (Computer Science)"
  if (!field) {
    const parenMatch = text.match(/\b(?:B\.?Tech|B\.?E\.?|B\.?S\.?|M\.?S\.?|Bachelor|Master|Graduation)\b[^(]*\(([^)]+)\)/i);
    if (parenMatch && parenMatch[1].trim().length > 1) {
      const cand = parenMatch[1].trim();
      if (!/\d/.test(cand) && !/^(cum\s+laude|magna|summa|honors|both)$/i.test(cand)) {
        if (/^computers?$/i.test(cand)) {
          field = "Computer Science & Engineering";
        } else if (/^it$/i.test(cand)) {
          field = "Information Technology";
        } else if (/^ece$/i.test(cand)) {
          field = "Electronics & Communication Engineering";
        } else {
          field = cand;
        }
      }
    }
  }

  // 4. Known fields fallback
  if (!field) {
    const knownFields: Array<{ pattern: RegExp; canonical: string }> = [
      { pattern: /\b(?:Computer\s+Science(?:\s+(?:and|&)\s+Engineering)?|CSE|CS|Computers)\b/i, canonical: "Computer Science & Engineering" },
      { pattern: /\b(?:Information\s+Technology|IT)\b/i, canonical: "Information Technology" },
      { pattern: /\b(?:Software\s+Engineering|SE)\b/i, canonical: "Software Engineering" },
      { pattern: /\b(?:Electronics\s+(?:and|&)\s+Communication(?:\s+Engineering)?|ECE)\b/i, canonical: "Electronics & Communication Engineering" },
      { pattern: /\b(?:Electrical(?:\s+(?:and|&)\s+Electronics)?\s+Engineering|EEE|EE)\b/i, canonical: "Electrical Engineering" },
      { pattern: /\b(?:Mechanical\s+Engineering|ME)\b/i, canonical: "Mechanical Engineering" },
      { pattern: /\b(?:Civil\s+Engineering|CE)\b/i, canonical: "Civil Engineering" },
      { pattern: /\b(?:Data\s+Science|Data\s+Analytics)\b/i, canonical: "Data Science" },
      { pattern: /\b(?:Artificial\s+Intelligence(?:\s+(?:and|&)\s+Machine\s+Learning)?|AI(?:\s*\/\s*ML)?)\b/i, canonical: "Artificial Intelligence" },
      { pattern: /\b(?:Mathematics\s+(?:and|&)\s+Computing|M&C)\b/i, canonical: "Mathematics & Computing" },
      { pattern: /\b(?:Cyber\s*security|Information\s+Security)\b/i, canonical: "Cybersecurity" },
      { pattern: /\b(?:Business\s+Administration|Management)\b/i, canonical: "Business Administration" },
      { pattern: /\b(?:Economics|Finance)\b/i, canonical: "Economics" },
    ];
    for (const kf of knownFields) {
      if (kf.pattern.test(text)) {
        field = kf.canonical;
        break;
      }
    }
  }

  return { degree, field };
}

function extractGraduationYear(text: string): string | undefined {
  const sanitized = text
    .replace(/\b(?:Date\s+of\s+birth|DOB|Birth\s*date|Born|D\.O\.B\.?)[\s:]*[^|\n,;]+?(?:20\d{2}|19\d{2})/gi, "")
    .replace(/\b(?:October|November|December|January|February|March|April|May|June|July|August|September)\s+\d{1,2},\s*(?:20\d{2}|19\d{2})\b/gi, "");

  const yrMatches = [...sanitized.matchAll(/\b(20\d{2}|19\d{2})\b/g)].map((m) => m[0]);
  if (yrMatches.length > 0) {
    return yrMatches[yrMatches.length - 1];
  }
  return undefined;
}

function parseEducation(lines: string[]): DeterministicResult["candidate_profile"]["education"] {
  let eduStart = -1;
  let eduEnd = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const cleanHeader = cleanHeaderStr(lines[i]);
    if (EDUCATION_HEADER_RE.test(cleanHeader)) {
      eduStart = i + 1;
      for (let j = i + 1; j < lines.length; j++) {
        const lj = cleanHeaderStr(lines[j]);
        if (EDU_SECTION_END_RE.test(lj) && !EDUCATION_HEADER_RE.test(lj)) {
          eduEnd = j;
          break;
        }
      }
      break;
    }
  }

  const hasExplicitHeader = eduStart !== -1;
  const searchLines = hasExplicitHeader ? lines.slice(eduStart, eduEnd) : lines;

  const rawBlocks: string[][] = [];
  let curBlock: string[] = [];

  for (const rawLine of searchLines) {
    const line = rawLine.trim();
    if (!line) {
      if (curBlock.length > 0) {
        rawBlocks.push([...curBlock]);
        curBlock = [];
      }
      continue;
    }

    const isCertificationRow = /^(?:certification\s+courses?|certifications?|courses?|training)\b/i.test(line);
    if (isCertificationRow) {
      if (curBlock.length > 0) {
        rawBlocks.push([...curBlock]);
        curBlock = [];
      }
      continue;
    }

    const isBullet = /^[•·*\-]\s+/.test(line);
    const hasDegree = DEGREE_MAPPINGS.some((d) => d.pattern.test(line));
    const lineHasUni = KNOWN_INSTITUTIONS.some((k) => k.pattern.test(line)) || /\b(?:University|College|Institute|Polytechnic|Academy|School)\b/i.test(line);

    const blockHasDegree = curBlock.some((l) => DEGREE_MAPPINGS.some((d) => d.pattern.test(l)));
    const blockHasUni = curBlock.some((l) => KNOWN_INSTITUTIONS.some((k) => k.pattern.test(l)) || /\b(?:University|College|Institute|Polytechnic|Academy|School)\b/i.test(l));

    if (curBlock.length > 0 && ((hasDegree && blockHasDegree) || (lineHasUni && blockHasUni) || isBullet)) {
      rawBlocks.push([...curBlock]);
      curBlock = [];
    }

    curBlock.push(line);
  }

  if (curBlock.length > 0) {
    rawBlocks.push([...curBlock]);
  }

  const edu: DeterministicResult["candidate_profile"]["education"] = [];
  const seen = new Set<string>();

  for (const block of rawBlocks) {
    const fullBlockText = block.join(" | ");

    if (/^(?:certification|course|computational\s+thinking)/i.test(fullBlockText.trim())) {
      continue;
    }

    const { degree, field } = extractDegreeAndField(fullBlockText);
    const year = extractGraduationYear(fullBlockText);

    if (!hasExplicitHeader && !degree) {
      continue;
    }

    let institution = "";

    // 1. Check known institutions across the block lines
    for (const line of block) {
      for (const ki of KNOWN_INSTITUTIONS) {
        if (ki.pattern.test(line)) {
          institution = cleanInstitutionName(line);
          break;
        }
      }
      if (institution) break;
    }

    // 2. Check for lines with University, College, Institute, etc.
    if (!institution) {
      for (const line of block) {
        if (/\b(?:University|College|Institute|Polytechnic|Academy|School)\b/i.test(line)) {
          let candidate = line;
          if (degree) {
            candidate = candidate.replace(new RegExp(`\\b(?:${degree}|B\\.?Tech|M\\.?Tech|B\\.?S\\.?|Bachelor|Master)[^,|–•-]*`, "gi"), "");
          }
          institution = cleanInstitutionName(candidate);
          break;
        }
      }
    }

    // 3. Check for "from <School>" or "at <School>"
    if (!institution) {
      const fromMatch = fullBlockText.match(/\b(?:from|at)\s+([A-Za-z0-9\s&.,'-]+?)(?:\s*\(|\s*\||\s*–|\s*-|\s*;\s*|$)/i);
      if (fromMatch && fromMatch[1].trim().length > 2) {
        institution = cleanInstitutionName(fromMatch[1]);
      }
    }

    // 4. Secondary school boards (CBSE / ICSE / State Board)
    if (!institution && (degree?.includes("Class XII") || degree?.includes("Class X"))) {
      if (/CBSE/i.test(fullBlockText)) {
        institution = "Central Board of Secondary Education (CBSE)";
      } else if (/ICSE/i.test(fullBlockText)) {
        institution = "ICSE Board";
      } else if (/State\s+Board/i.test(fullBlockText)) {
        institution = "State Board";
      } else {
        institution = "Secondary School";
      }
    }

    // 5. Fallback: if block has multiple lines and line 0 doesn't have degree, line 0 might be university name
    if (!institution && block.length >= 2) {
      const line0HasDegree = DEGREE_MAPPINGS.some((d) => d.pattern.test(block[0]));
      if (!line0HasDegree && block[0].length > 3 && block[0].length < 80) {
        institution = cleanInstitutionName(block[0]);
      }
    }

    if (!degree && !institution) continue;

    const finalDegree = degree || "Bachelor's Degree";
    const finalInst = institution || "Recognized Institution";
    const key = `${finalInst}|${finalDegree}`.toLowerCase();

    if (!seen.has(key)) {
      edu.push({
        institution: finalInst,
        degree: finalDegree,
        field_of_study: field || undefined,
        graduation_year: year || undefined,
      });
      seen.add(key);
    }
  }

  return edu.slice(0, 5);
}

// ─── Certification Parsing ────────────────────────────────────────────────────
const KNOWN_CERTS: Array<{ pattern: RegExp; canonical: string; issuer: string }> = [
  { pattern: /aws\s+certified/i, canonical: "AWS Certified", issuer: "Amazon Web Services" },
  { pattern: /google\s+cloud\s+certified|google\s+certified/i, canonical: "Google Cloud Certified", issuer: "Google" },
  { pattern: /azure\s+(fundamentals|administrator|developer|architect|devops|security)/i, canonical: "Microsoft Azure Certified", issuer: "Microsoft" },
  { pattern: /\bckad\b|certified\s+kubernetes\s+application\s+developer/i, canonical: "Certified Kubernetes Application Developer (CKAD)", issuer: "CNCF" },
  { pattern: /\bcka\b|certified\s+kubernetes\s+administrator/i, canonical: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF" },
  { pattern: /\bcks\b|certified\s+kubernetes\s+security\s+specialist/i, canonical: "Certified Kubernetes Security Specialist (CKS)", issuer: "CNCF" },
  { pattern: /hashicorp\s+certified|terraform\s+associate/i, canonical: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp" },
  { pattern: /\bpmp\b|project\s+management\s+professional/i, canonical: "Project Management Professional (PMP)", issuer: "PMI" },
  { pattern: /\bcsm\b|certified\s+scrum\s*master/i, canonical: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance" },
  { pattern: /\bcissp\b|certified\s+information\s+systems\s+security/i, canonical: "CISSP", issuer: "ISC2" },
  { pattern: /\bceh\b|certified\s+ethical\s+hacker/i, canonical: "Certified Ethical Hacker (CEH)", issuer: "EC-Council" },
  { pattern: /comptia\s+(security\+|a\+|network\+|cloud\+)/i, canonical: "CompTIA Certification", issuer: "CompTIA" },
  { pattern: /databricks\s+certified/i, canonical: "Databricks Certified", issuer: "Databricks" },
  { pattern: /snowflake\s+(pro|architect|developer)/i, canonical: "Snowflake Certification", issuer: "Snowflake" },
];

const CERT_HEADER_RE = /^(certifications?|licenses?|credentials?|professional\s+development)\s*:?\s*$/i;

function parseCertifications(lines: string[], fullText: string): DeterministicResult["candidate_profile"]["certifications"] {
  const certs: DeterministicResult["candidate_profile"]["certifications"] = [];
  const seen = new Set<string>();

  // 1. Parse line-by-line from CERTIFICATIONS section or standalone certification course rows
  let inCert = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const cleanHeader = cleanHeaderStr(trimmed);
    if (CERT_HEADER_RE.test(cleanHeader)) { inCert = true; continue; }
    if (inCert && SECTION_HEADER_RE.test(cleanHeader) && !CERT_HEADER_RE.test(cleanHeader)) { inCert = false; continue; }

    const courseMatch = trimmed.match(/^(?:certification\s+courses?|certificate\s+courses?)\s*[:\-]?\s*(.+)$/i);
    if (!inCert && !courseMatch) continue;

    const rawStr = courseMatch ? courseMatch[1] : trimmed;
    const clean = rawStr.replace(BULLET_LINE_RE, "").trim();
    if (!clean) continue;

    const ym = clean.match(/\b(20\d{2}|19\d{2})\b/);
    const year = ym ? ym[0] : undefined;
    let nameClean = clean.replace(/\(\s*20\d{2}\s*\)|\b20\d{2}\b/g, "").replace(/\s{2,}/g, " ").trim();

    let issuer: string | undefined = undefined;
    for (const kc of KNOWN_CERTS) {
      if (kc.pattern.test(clean)) {
        issuer = kc.issuer;
        seen.add(kc.canonical.toLowerCase());
        break;
      }
    }

    if (!issuer && /Galgotias/i.test(clean)) {
      issuer = "Galgotias University";
      nameClean = nameClean.replace(/-\s*Galgotias\b/i, "").trim();
    }

    const key = nameClean.toLowerCase();
    if (!seen.has(key)) {
      certs.push({ name: nameClean, issuer, year });
      seen.add(key);
    }
  }

  // 2. Fallback: match known certs across document if section was omitted
  for (const item of KNOWN_CERTS) {
    if (item.pattern.test(fullText) && !seen.has(item.canonical.toLowerCase())) {
      const yearMatch = fullText.match(new RegExp(item.pattern.source + ".{0,40}?(20\\d{2}|19\\d{2})", "i"));
      certs.push({
        name: item.canonical,
        issuer: item.issuer,
        year: yearMatch ? yearMatch[1] : undefined,
      });
      seen.add(item.canonical.toLowerCase());
    }
  }

  return certs.slice(0, 8);
}

// ─── Experience Years & Seniority ─────────────────────────────────────────────
function calculateTotalExperience(workExp: DeterministicResult["candidate_profile"]["work_experience"]): number {
  if (!workExp.length) return 0;

  const intervals: Array<[number, number]> = [];
  for (const job of workExp) {
    if (!job.start_date || !job.end_date) continue;
    const smatch = job.start_date.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);
    const ematch = job.end_date === "Present"
      ? [null, (new Date().getMonth() + 1).toString(), new Date().getFullYear().toString()]
      : job.end_date.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);
    if (!smatch || !ematch) continue;
    const sy = parseInt(smatch[2], 10), sm = parseMonthNum(smatch[1]);
    const ey = parseInt(ematch[2]!, 10), em = parseMonthNum(ematch[1] ?? "");
    intervals.push([sy * 12 + sm, ey * 12 + em]);
  }

  if (!intervals.length) {
    // If corporate dates were not specified, count project showcases as ~1 year of practical experience
    return Math.min(workExp.length * 0.5, 2.0);
  }

  intervals.sort((a, b) => a[0] - b[0]);
  let totalMonths = 0;
  let [curStart, curEnd] = intervals[0]!;
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i]!;
    if (s <= curEnd) {
      curEnd = Math.max(curEnd, e);
    } else {
      totalMonths += curEnd - curStart;
      curStart = s;
      curEnd = e;
    }
  }
  totalMonths += curEnd - curStart;

  return Math.max(0.1, parseFloat((totalMonths / 12).toFixed(1)));
}

function determineSeniority(years: number, headline: string): string {
  const h = headline.toLowerCase();
  if (/\b(cto|ceo|cio|ciso|chief)\b/.test(h)) return "C-Suite Executive";
  if (/\b(vp|vice president)\b/.test(h)) return "VP / Vice President";
  if (/\bdirector\b/.test(h)) return "Director";
  if (/\bprincipal\b/.test(h)) return "Principal";
  if (/\bstaff\b/.test(h)) return "Staff";
  if (/\b(lead|head of)\b/.test(h)) return "Tech Lead";
  if (/\b(intern|graduate|entry|junior)\b/.test(h) || years < 2.5) return "Junior / Entry-Level";
  if (/\bsenior\b/.test(h) || years >= 7) return "Senior";
  if (years >= 2.5) return "Mid-Level";
  return "Junior / Entry-Level";
}

// ─── ATS Audit ────────────────────────────────────────────────────────────────
function runAtsAudit(
  fullText: string,
  skills: string[],
  workExp: DeterministicResult["candidate_profile"]["work_experience"],
  education: DeterministicResult["candidate_profile"]["education"]
): DeterministicResult["ats_audit"] {
  const redFlags: string[] = [];
  const strengths: string[] = [];

  const hasEmail = !!extractEmail(fullText);
  const hasPhone = !!extractPhone(fullText);
  const hasLinkedIn = !!extractLinkedIn(fullText);
  const wordCount = fullText.split(/\s+/).length;
  const hasQuantifiedImpact = /\b\d+\s*(%|percent|x\b|million|billion|k\b|users|customers|teams?|engineers?|requests)/i.test(fullText);
  const hasDates = workExp.some((e) => !!e.start_date);

  if (!hasEmail) redFlags.push("No email address detected — contact info is mandatory for ATS indexing.");
  if (!hasPhone) redFlags.push("No phone number found.");
  if (wordCount < 100) redFlags.push("Resume appears very brief — may lack sufficient keyword context.");
  if (wordCount > 1400) redFlags.push("Resume is lengthy — consider condensing to 1-2 pages.");
  if (skills.length < 5) redFlags.push("Fewer than 5 standardized technical skills detected.");
  if (workExp.length === 0) redFlags.push("No structured work experience or project entries parsed.");

  if (hasEmail) strengths.push("Valid contact information parsed successfully.");
  if (hasPhone) strengths.push("Direct phone number verified.");
  if (hasLinkedIn) strengths.push("LinkedIn or professional portfolio profile present.");
  if (skills.length >= 8) strengths.push(`Comprehensive skill footprint (${skills.length} verified technologies).`);
  if (workExp.length >= 1) strengths.push(`${workExp.length} chronological work experience / technical project blocks parsed.`);
  if (education.length > 0) strengths.push("Education credentials parsed cleanly.");
  if (hasQuantifiedImpact) strengths.push("Resume includes strong quantified achievements and scale metrics.");
  if (hasDates) strengths.push("Consistent date ranges detected across timeline.");

  const checks = [hasEmail, hasLinkedIn || hasPhone, skills.length >= 5, workExp.length >= 1, education.length >= 1];
  const passed = checks.filter(Boolean).length;
  const parseRate = Math.round((passed / checks.length) * 100);

  let grade = "A";
  if (parseRate < 60) grade = "C";
  else if (parseRate < 80) grade = "B";

  const readability = Math.min(100, 65 + skills.length * 1.5 + (hasQuantifiedImpact ? 10 : 0) + (hasDates ? 5 : 0));

  return {
    overall_parse_rate: parseRate,
    formatting_grade: grade,
    readability_score: Math.min(Math.round(readability), 100),
    red_flags: redFlags,
    strengths,
  };
}

// ─── JD Matching & Fit Analysis ──────────────────────────────────────────────
function runJdAnalysis(
  resumeText: string,
  jdText: string,
  candidateSkills: string[],
  education: DeterministicResult["candidate_profile"]["education"],
  totalYears: number,
  seniority: string
): DeterministicResult["jd_analysis"] {
  if (!jdText.trim()) {
    return {
      evaluated_against_jd: false,
      target_role_title: "N/A",
      match_score: 0,
      fit_level: "N/A",
      scoring_breakdown: { skills_match_score: 0, seniority_alignment_score: 0, domain_relevance_score: 0, credentials_education_score: 0 },
      matched_skills: [],
      missing_skills: [],
      recommendation: "Provide a job description to perform deep alignment analysis.",
      executive_summary_gap_analysis: "",
      suggested_interview_questions: [],
      tailoring_recommendations: [],
    };
  }

  const jdSkills = extractStandardizedSkills(jdText);
  const candSkillSet = new Set(candidateSkills);

  const matched = jdSkills.filter((s) => candSkillSet.has(s));
  const missing = jdSkills.filter((s) => !candSkillSet.has(s));

  // 1. Skills match score
  const skillsScore = jdSkills.length > 0
    ? Math.round((matched.length / jdSkills.length) * 100)
    : 70;

  // 2. Seniority alignment score
  const jdYearsMatch = jdText.match(/(\d+)\+?\s+years?\s+(?:of\s+)?(?:experience|exp)/i);
  const jdYearsRequired = jdYearsMatch ? parseInt(jdYearsMatch[1], 10) : 0;

  const jdLower = jdText.toLowerCase();
  let expectedSeniority = "Mid-Level";
  if (/\b(senior|sr\.?)\b/.test(jdLower)) expectedSeniority = "Senior";
  if (/\b(principal|staff|lead|head)\b/.test(jdLower)) expectedSeniority = "Staff";
  if (/\b(director|vp|vice president)\b/.test(jdLower)) expectedSeniority = "Director";
  if (/\b(junior|entry[\s\-]level|intern|fresher|graduate)\b/.test(jdLower)) expectedSeniority = "Junior / Entry-Level";

  const tiers: Record<string, number> = {
    "Junior / Entry-Level": 1, "Mid-Level": 2, "Senior": 3, "Staff": 4, "Tech Lead": 4,
    "Principal": 5, "Director": 6, "VP / Vice President": 7, "C-Suite Executive": 8,
  };
  const diff = Math.abs((tiers[seniority] ?? 2) - (tiers[expectedSeniority] ?? 2));
  let seniorityScore = 100;
  if (diff === 1) seniorityScore = 85;
  else if (diff === 2) seniorityScore = 65;
  else if (diff >= 3) seniorityScore = 40;
  if (jdYearsRequired > 0 && totalYears < jdYearsRequired * 0.75) {
    seniorityScore = Math.min(seniorityScore, 65);
  }

  // 3. Domain relevance score
  const jdWords = (jdText.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? []);
  const resumeWordSet = new Set(resumeText.toLowerCase().match(/\b[a-z]{5,}\b/g) ?? []);
  const domainHits = jdWords.filter((w) => resumeWordSet.has(w)).length;
  const domainScore = Math.min(100, Math.round((domainHits / Math.max(jdWords.length, 1)) * 140));

  // 4. Credentials & Education score
  const jdNeedsDegree = /\b(bachelor|master|phd|degree|b\.s\.|m\.s\.|b\.tech|b\.e\.)\b/i.test(jdText);
  let eduScore = 80;
  if (jdNeedsDegree && education.length > 0) eduScore = 100;
  else if (jdNeedsDegree && education.length === 0) eduScore = 40;

  // Weighted overall match
  const matchScore = Math.round(
    skillsScore * 0.40 +
    seniorityScore * 0.25 +
    domainScore * 0.20 +
    eduScore * 0.15
  );

  let fitLevel = "Poor Fit";
  if (matchScore >= 85) fitLevel = "Excellent Fit";
  else if (matchScore >= 70) fitLevel = "Strong Fit";
  else if (matchScore >= 55) fitLevel = "Moderate Fit";
  else if (matchScore >= 40) fitLevel = "Partial Fit";

  // Target role title from JD
  const titleLine = jdText.split(/\r?\n/).find((l) => /^(position|role|title|job title)\s*:/i.test(l.trim()));
  let targetRole = "Target Role";
  if (titleLine) {
    targetRole = titleLine.replace(/^(position|role|title|job title)\s*:/i, "").trim();
  } else {
    const tm = jdText.match(TITLE_CORE_RE);
    if (tm) targetRole = tm[0].trim();
  }

  // Recommendation
  let recommendation = "";
  if (matchScore >= 85) {
    recommendation = `Outstanding alignment — candidate satisfies ${matched.length} of ${jdSkills.length} required competencies. Highly recommended for technical screen.`;
  } else if (matchScore >= 70) {
    if (missing.length === 0) {
      recommendation = `Strong candidate — full coverage across all ${jdSkills.length} core technical requirements. Proceed with interview.`;
    } else {
      recommendation = `Strong candidate — ${matched.length} of ${jdSkills.length} required skills match. Validate exposure to ${missing.slice(0, 2).join(", ")} during technical evaluation.`;
    }
  } else if (matchScore >= 55) {
    recommendation = `Moderate alignment — candidate covers ${matched.length}/${jdSkills.length} skills. Noticeable gaps in: ${missing.slice(0, 3).join(", ")}. Consider if on-the-job upskilling is viable.`;
  } else {
    recommendation = `Low alignment (${matchScore}%) — significant technical and domain gaps identified in: ${missing.slice(0, 4).join(", ")}.`;
  }

  // Gap analysis
  const gapAnalysis = missing.length > 0
    ? `Candidate covers ${matched.length}/${jdSkills.length} primary requirements. Notable gaps: ${missing.slice(0, 5).join(", ")}. ${jdYearsRequired > totalYears ? `Job requests ${jdYearsRequired}+ years; candidate has ~${totalYears}.` : ""}`
    : `Candidate's verified footprint completely covers all ${jdSkills.length} technologies requested in the job description.`;

  // Interview questions
  const interviewQs: DeterministicResult["jd_analysis"]["suggested_interview_questions"] = [];
  if (missing.length > 0) {
    interviewQs.push({
      question: `How would you approach integrating or building with ${missing[0]} based on your existing technical foundation?`,
      focus_area: "Skill Gap & Adaptability",
      rationale: `${missing[0]} is required in the job description but not present on the candidate's resume.`,
    });
  }
  if (matched.length > 0) {
    interviewQs.push({
      question: `Can you walk through a practical scenario where you utilized ${matched[0]} to solve a performance, reliability, or design challenge?`,
      focus_area: "Technical Depth",
      rationale: "Validates practical hands-on proficiency with a core matched technology.",
    });
  }
  interviewQs.push({
    question: "Walk through the architectural design of your most complex technical project. What trade-offs did you make between simplicity, latency, and maintainability?",
    focus_area: "System & Project Architecture",
    rationale: "Assesses architectural judgment, code craftsmanship, and engineering thinking.",
  });
  interviewQs.push({
    question: "Tell me about a technical decision you made that did not go as planned. How did you diagnose the issue and what did you learn?",
    focus_area: "Resilience & Problem Solving",
    rationale: "Evaluates problem-solving rigor and continuous learning mindset.",
  });

  // Tailoring recommendations
  const tailoringRecs: string[] = [];
  if (missing.length > 0) {
    tailoringRecs.push(`Highlight any direct or adjacent project experience with ${missing.slice(0, 3).join(", ")}.`);
  }
  tailoringRecs.push("Ensure job description keywords appear verbatim in your project bullet points to maximize ATS match scoring.");
  if (!/(led|architected|spearheaded|drove|orchestrated|built|developed)/i.test(resumeText)) {
    tailoringRecs.push("Use strong action verbs like 'Architected', 'Spearheaded', 'Developed' to emphasize ownership.");
  }
  if (!/\d+\s*(%|million|\$|k\b)/i.test(resumeText)) {
    tailoringRecs.push("Add quantified outcomes (e.g., '% latency reduced', 'X requests handled') to each role or project.");
  }

  return {
    evaluated_against_jd: true,
    target_role_title: targetRole,
    match_score: matchScore,
    fit_level: fitLevel,
    scoring_breakdown: {
      skills_match_score: skillsScore,
      seniority_alignment_score: seniorityScore,
      domain_relevance_score: domainScore,
      credentials_education_score: eduScore,
    },
    matched_skills: matched,
    missing_skills: missing,
    recommendation,
    executive_summary_gap_analysis: gapAnalysis,
    suggested_interview_questions: interviewQs,
    tailoring_recommendations: tailoringRecs,
  };
}

// ─── Main Deterministic Engine Entry Point ─────────────────────────────────────
export function runDeterministicAtsEngine(
  resumeText: string,
  jobDescriptionText: string = "",
  uploadedFileName?: string
): DeterministicResult {
  const lines = resumeText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const fullText = resumeText;

  const name = extractName(lines, uploadedFileName);
  const email = extractEmail(fullText);
  const phone = extractPhone(fullText);
  const linkedin = extractLinkedIn(fullText);
  const github = extractGitHub(fullText);
  const location = extractLocation(fullText);
  const headline = extractHeadline(lines, name);
  const summary = extractSummary(lines);

  const standardizedSkills = extractStandardizedSkills(fullText);
  const workExperience = parseWorkExperience(lines);
  const education = parseEducation(lines);
  const certifications = parseCertifications(lines, fullText);

  const totalYears = calculateTotalExperience(workExperience);
  const seniority = determineSeniority(totalYears, headline);

  const atsAudit = runAtsAudit(fullText, standardizedSkills, workExperience, education);
  const jdAnalysis = runJdAnalysis(
    fullText,
    jobDescriptionText,
    standardizedSkills,
    education,
    totalYears,
    seniority
  );

  return {
    candidate_profile: {
      name,
      headline,
      email,
      phone,
      location,
      linkedin,
      github_portfolio: github,
      executive_summary: summary,
      total_years_experience: totalYears,
      seniority_level: seniority,
      standardized_skills: standardizedSkills,
      work_experience: workExperience,
      education,
      certifications,
    },
    ats_audit: atsAudit,
    jd_analysis: jdAnalysis,
  };
}
