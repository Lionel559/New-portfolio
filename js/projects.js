const GITHUB_USER = "Lionel559";

const PROJECTS = [];

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
