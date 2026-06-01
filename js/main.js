let allProjects = [];
const CONTACT_EMAIL = "ayooladeji8@gmail.com";
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];
let copyEmailTimer;
const PORTFOLIO_STATS = [
  ["stat-projects", "10+"],
  ["stat-technologies", "12+"],
  ["stat-live-apps", "7+"],
  ["stat-packages", "1+"],
];

document.addEventListener("DOMContentLoaded", () => {
  bindFilterBar();
  bindCopyEmail();
  loadGitHubProjects();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      if (LOCAL_HOSTS.includes(window.location.hostname)) {
        console.warn("Service worker registration failed:", error);
      }
    });
  });
}

async function loadGitHubProjects() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/" + GITHUB_USER),
      fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=100&type=owner"),
    ]);

    if (!userRes.ok) throw new Error("User not found");
    if (!reposRes.ok) throw new Error("Repositories not found");

    const user = await userRes.json();
    const repos = await reposRes.json();
    const ownerRepos = repos.filter((repo) => !repo.fork);

    ownerRepos.sort((a, b) => {
      return (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at);
    });

    allProjects = ownerRepos.map(projectFromRepo);

    updateStats(allProjects);
    updateAboutBio(user);
    updateLanguageFilters(allProjects);
    updateDetectedLanguages(allProjects);
    updateFooterSync();
    renderProjects(allProjects);
  } catch (error) {
    if (PROJECTS.length) {
      allProjects = [...PROJECTS];
      updateStats(allProjects);
      updateLanguageFilters(allProjects);
      updateDetectedLanguages(allProjects);
      renderProjects(allProjects);
      setText("footer-sync", "Showing saved project data");
      return;
    }

    document.getElementById("projects-grid").innerHTML =
      '<div class="empty-state"><div class="empty-icon">!</div><div class="empty-text">Could not load repositories.<br>' +
      escapeHtml(error.message) +
      "</div></div>";

    updateStats();
  }
}

function bindFilterBar() {
  const filterBar = document.getElementById("filter-bar");
  if (!filterBar) return;

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    filterProjects(button.dataset.filter, button);
  });
}

function bindCopyEmail() {
  const button = document.getElementById("copy-email");
  const status = document.getElementById("copy-email-status");
  if (!button || !status) return;

  const email = button.dataset.email || CONTACT_EMAIL;

  button.addEventListener("click", async () => {
    const copied = await copyText(email);
    showCopyStatus(status, copied ? "Email copied!" : "Could not copy email.", !copied);
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return fallbackCopyText(text);
    }
  }

  return fallbackCopyText(text);
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch (error) {
    return false;
  } finally {
    textarea.remove();
  }
}

function showCopyStatus(status, message, isError) {
  status.textContent = message;
  status.classList.toggle("is-error", Boolean(isError));
  status.hidden = false;

  clearTimeout(copyEmailTimer);
  copyEmailTimer = window.setTimeout(() => {
    status.hidden = true;
    status.classList.remove("is-error");
  }, 3000);
}

function filterProjects(filter, button) {
  document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const projects = filter === "all" ? allProjects : allProjects.filter((project) => project.language === filter);
  renderProjects(projects);
}

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">{ }</div><div class="empty-text">No repositories found.</div></div>';
    return;
  }

  grid.innerHTML = projects.map(projectCardTemplate).join("");
  bindProjectCards(grid);
}

function projectCardTemplate(project, index) {
  const language = project.language || "";
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const repoUrl = normalizeProjectUrl(project.repoUrl);
  const liveUrl = normalizeProjectUrl(project.liveUrl);
  const title = project.title || project.name || "Untitled project";
  const liveLabel = project.liveLabel || "Live demo";
  const liveButton = liveUrl
    ? '<a class="project-action project-action-live" href="' +
      escapeAttr(liveUrl) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(liveLabel) +
      "</a>"
    : "";
  const repoButton = repoUrl
    ? '<a class="project-action" href="' + escapeAttr(repoUrl) + '" target="_blank" rel="noopener noreferrer">View repo</a>'
    : "";

  return (
    '<article class="project-card ' +
    escapeAttr(langClass(language)) +
    '" style="animation-delay:' +
    index * 0.04 +
    's" data-repo-url="' +
    escapeAttr(repoUrl) +
    '">' +
    '<div class="project-header">' +
    '<div class="project-icon">' +
    escapeHtml(langIcon(language)) +
    "</div>" +
    '<div class="project-meta">' +
    '<div class="star-count">' +
    fmt(project.stars || 0) +
    "</div>" +
    (project.forks ? '<div class="fork-count">' + fmt(project.forks) + "</div>" : "") +
    "</div>" +
    "</div>" +
    '<h3 class="project-name">' +
    escapeHtml(title) +
    "</h3>" +
    '<p class="project-desc">' +
    escapeHtml(project.description || "No description provided.") +
    "</p>" +
    '<div class="project-footer">' +
    '<div class="project-info">' +
    (language ? '<div class="lang-badge"><div class="lang-dot"></div>' + escapeHtml(language) + "</div>" : "") +
    (tags.length ? '<div class="project-topics">' + tags.map((tag) => '<span class="topic-tag">' + escapeHtml(tag) + "</span>").join("") + "</div>" : "") +
    "</div>" +
    '<div class="project-actions">' +
    repoButton +
    liveButton +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

function bindProjectCards(grid) {
  grid.querySelectorAll(".project-card").forEach((card) => {
    const repoUrl = card.dataset.repoUrl;
    if (!repoUrl) return;

    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      window.open(repoUrl, "_blank", "noopener");
    });
  });
}

function updateStats() {
  PORTFOLIO_STATS.forEach(([id, value]) => setText(id, value));
}

function updateAboutBio(user) {
  if (!user.bio) return;

  const bio = document.querySelector(".about-bio");
  if (bio) bio.textContent = user.bio;
}

function updateLanguageFilters(projects) {
  const filterBar = document.getElementById("filter-bar");
  if (!filterBar) return;

  filterBar.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach((button) => button.remove());

  getLanguages(projects).slice(0, 8).forEach((language) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.type = "button";
    button.dataset.filter = language;
    button.textContent = language;
    filterBar.appendChild(button);
  });
}

function updateDetectedLanguages(projects) {
  const wrap = document.getElementById("detected-langs-wrap");
  const grid = document.getElementById("detected-langs");
  if (!wrap || !grid) return;

  const languages = getLanguages(projects);
  if (!languages.length) return;

  grid.innerHTML = "";
  wrap.style.display = "block";

  languages.forEach((language) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.textContent = language;
    grid.appendChild(chip);
  });
}

function updateFooterSync() {
  const syncedAt = new Date().toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  setText("footer-sync", "Synced " + syncedAt);
}

function getLanguages(projects) {
  return [...new Set(projects.map((project) => project.language).filter(Boolean))];
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
