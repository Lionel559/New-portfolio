const GITHUB_USER = "Lionel559";

const PROJECTS = [
  {
    name: "Internet Memory",
    title: "Internet Memory",
    description:
      "AI-powered browser memory platform that saves, organizes, and helps users rediscover websites with semantic search and AI summaries.",
    language: "TypeScript",
    tags: ["Next.js", "Supabase", "AI"],
    repoUrl: "https://github.com/Lionel559/Internet-memory",
    liveUrl: "https://internet-memory-phi.vercel.app",
    stars: 0,
    forks: 0,
  },
  {
    name: "npm-security-guardian",
    title: "npm-security-guardian",
    description:
      "Published TypeScript security CLI that scans npm dependencies for vulnerabilities, suspicious packages, secret leaks, and supply-chain risks.",
    language: "TypeScript",
    tags: ["Node.js", "npm", "Security"],
    repoUrl: "https://github.com/Lionel559/npm-security-guardian",
    liveUrl: "https://www.npmjs.com/package/npm-security-guardian",
    liveLabel: "npm Package",
    stars: 0,
    forks: 0,
  },
  {
    name: "AIFLOW",
    title: "AIFLOW",
    description:
      "AI-powered business automation platform for captions, customer replies, invoices, FAQs, and product descriptions.",
    language: "TypeScript",
    tags: ["Next.js", "AI APIs", "MongoDB"],
    repoUrl: "https://github.com/Lionel559/Ai-automation",
    liveUrl: "https://ai-automation-khaki.vercel.app",
    stars: 0,
    forks: 0,
  },
  {
    name: "Smart Landing Page AI Analyzer",
    title: "Smart Landing Page AI Analyzer",
    description:
      "AI-powered landing page analyzer that audits SEO, UX, trust signals, CTA effectiveness, responsiveness, and conversion leaks.",
    language: "TypeScript",
    tags: ["Next.js", "AI APIs", "SEO"],
    repoUrl: "https://github.com/Lionel559/Smart-landingpage-Ai-analyzer",
    liveUrl: "https://smart-landingpage-ai-analyzer.vercel.app",
    stars: 0,
    forks: 0,
  },
  {
    name: "AI Error Explainer",
    title: "AI Error Explainer",
    description:
      "Developer tool that explains coding errors, fixes broken code, optimizes snippets, supports source uploads, and exports AI responses.",
    language: "JavaScript",
    tags: ["AI", "Debugging", "PDF Export"],
    repoUrl: "https://github.com/Lionel559/Ai-error-explainer",
    liveUrl: "https://ai-error-explainer-mu.vercel.app",
    stars: 0,
    forks: 0,
  },
  {
    name: "Leo Bank",
    title: "Leo Bank",
    description:
      "Banking app interface focused on account flows, clean financial UI patterns, and responsive JavaScript interactions.",
    language: "JavaScript",
    tags: ["Banking UI", "JavaScript", "Vercel"],
    repoUrl: "https://github.com/Lionel559/Leo-Bank",
    liveUrl: "https://leo-bank-tau.vercel.app",
    stars: 0,
    forks: 0,
  },
];

const LANG_SHORT = {
  JavaScript: "JS",
  TypeScript: "TS",
  Python: "PY",
  Go: "GO",
  Rust: "RS",
  Java: "JV",
  PHP: "PHP",
  Ruby: "RB",
  HTML: "HT",
  CSS: "CS",
  Shell: "SH",
  C: "C",
  "C++": "C+",
  Kotlin: "KT",
  Dart: "DT",
  Vue: "VU",
  Svelte: "SV",
  default: "{ }",
};

const LANG_CLASS = {
  JavaScript: "l-js",
  TypeScript: "l-ts",
  Python: "l-py",
  Go: "l-go",
  Rust: "l-rs",
  Java: "l-java",
  PHP: "l-php",
  Ruby: "l-rb",
  HTML: "l-html",
  CSS: "l-css",
  Shell: "l-sh",
  C: "l-c",
  "C++": "l-c",
  Kotlin: "l-kt",
  Dart: "l-dart",
  Vue: "l-vue",
  Svelte: "l-svelte",
};

function normalizeProjectUrl(url) {
  if (!url) return "";

  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (trimmed === "#" || trimmed.startsWith("#") || trimmed.startsWith("mailto:")) return trimmed;

  return /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
}

function projectFromRepo(repo) {
  return {
    title: repo.name || "Untitled project",
    description: repo.description || "No description provided.",
    language: repo.language || "",
    tags: Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : [],
    stars: repo.stargazers_count || 0,
    repoUrl: repo.html_url || "",
    liveUrl: normalizeProjectUrl(repo.homepage),
    forks: repo.forks_count || 0,
    updatedAt: repo.updated_at || "",
  };
}

function langIcon(language) {
  return LANG_SHORT[language] || LANG_SHORT.default;
}

function langClass(language) {
  return LANG_CLASS[language] || "";
}

function fmt(number) {
  if (number >= 1000) return (number / 1000).toFixed(1) + "k";
  return number;
}
