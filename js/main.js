const TECH_STACK = [
  { id: "java", name: "Java", detail: "Core", icon: "java", href: "#backend" },
  { id: "csharp", name: "C#", detail: "Core", icon: "cs", href: "#backend" },
  { id: "python", name: "Python", detail: "Script", icon: "python", href: "#backend" },
  { id: "typescript", name: "TypeScript", detail: "Type", icon: "ts", href: "#frontend" },
  { id: "javascript", name: "JavaScript", detail: "JS", icon: "js", href: "#frontend" },
  { id: "fastapi", name: "FastAPI", detail: "API", icon: "fastapi", href: "#backend" },
  { id: "spring", name: "Spring Boot", detail: "Backend", icon: "spring", href: "#backend" },
  { id: "nestjs", name: "NestJS", detail: "API", icon: "nestjs", href: "#backend" },
  { id: "nodejs", name: "Node.js", detail: "Runtime", icon: "nodejs", href: "#backend" },
  { id: "express", name: "Express", detail: "API", icon: "express", href: "#backend" },
  { id: "react", name: "React", detail: "UI", icon: "react", href: "#frontend" },
  { id: "nextjs", name: "Next.js", detail: "SSR", icon: "nextjs", href: "#frontend" },
  { id: "vue", name: "Vue", detail: "UI", icon: "vue", href: "#frontend" },
  { id: "postgres", name: "PostgreSQL", detail: "DB", icon: "postgres", href: "#database" },
  { id: "mysql", name: "MySQL", detail: "DB", icon: "mysql", href: "#database" },
  { id: "dynamodb", name: "DynamoDB", detail: "DB", icon: "dynamodb", href: "#database" },
  { id: "aws", name: "AWS", detail: "Cloud", icon: "aws", href: "#cloud" },
  { id: "azure", name: "Azure", detail: "Cloud", icon: "azure", href: "#cloud" },
  { id: "gcp", name: "GCP", detail: "Cloud", icon: "gcp", href: "#cloud" },
  { id: "docker", name: "Docker", detail: "Container", icon: "docker", href: "#cloud" },
  { id: "kubernetes", name: "Kubernetes", detail: "K8s", icon: "kubernetes", href: "#cloud" },
  { id: "terraform", name: "Terraform", detail: "IaC", icon: "terraform", href: "#cloud" },
  { id: "githubactions", name: "GH Actions", detail: "CI/CD", icon: "githubactions", href: "#cloud" },
  { id: "nginx", name: "Nginx", detail: "Server", icon: "nginx", href: "#cloud" },
  { id: "linux", name: "Linux", detail: "System", icon: "linux", href: "#cloud" },
  { id: "git", name: "Git", detail: "VCS", icon: "git", href: "#cloud" },
  { id: "intellij", name: "IntelliJ", detail: "IDE", icon: "idea", href: "#tools" },
  { id: "vscode", name: "VS Code", detail: "IDE", icon: "vscode", href: "#tools" },
  { id: "codex", name: "Codex", detail: "Agent", iconSrc: "assets/icons/codex.png", href: "#tools" },
  { id: "gemini", name: "Gemini", detail: "Agent", iconSrc: "assets/icons/gemini.svg", href: "#tools" }
];

const TILE_THEMES = ["deep", "green", "pink", "peach", "mint", "orange", "cyan", "lime", "violet", "gold"];
const TILE_CAROUSEL_PAGE_SIZE = 4;
const TILE_CAROUSEL_INTERVAL = 3600;
const TILE_CAROUSEL_TRANSITION = 280;

function getShuffledItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }
  return shuffled;
}

function renderRandomTechTiles() {
  const cards = [...document.querySelectorAll(".game-tiles .game-card")];
  if (cards.length === 0) return;

  getShuffledItems(TECH_STACK)
    .slice(0, cards.length)
    .forEach((tech, index) => {
      const card = cards[index];
      const image = card.querySelector(".skill-icon");
      const name = card.querySelector("span");
      const detail = card.querySelector("em");

      card.className = `game-card ${TILE_THEMES[index % TILE_THEMES.length]}`;
      card.href = tech.href;
      card.id = tech.id;
      card.setAttribute("aria-label", `${tech.name} ${tech.detail}`);

      if (image) {
        image.className = "skill-icon";
        image.src = tech.iconSrc || `https://skillicons.dev/icons?i=${tech.icon}`;
        image.alt = tech.name;
      }
      if (name) name.textContent = tech.name;
      if (detail) detail.textContent = tech.detail;
    });
}

function bindTileCarousel() {
  const track = document.querySelector(".game-tiles");
  const dots = document.querySelector("[data-tile-dots]");
  if (!track || !dots) return;

  const cards = [...track.querySelectorAll(".game-card:not(.is-carousel-clone)")];
  const mobileQuery = window.matchMedia("(max-width: 520px)");
  const pageCount = Math.ceil(cards.length / TILE_CAROUSEL_PAGE_SIZE);
  let currentPage = 0;
  let timerId = 0;
  let resetId = 0;

  if (cards.length === 0 || pageCount <= 1) return;

  const clearReset = () => {
    if (resetId) window.clearTimeout(resetId);
    resetId = 0;
  };

  const stopAutoPlay = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = 0;
  };

  const syncDots = () => {
    dots.querySelectorAll(".tile-dot").forEach((dot, index) => {
      const isActive = index === currentPage;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const buildClones = () => {
    track.querySelectorAll(".is-carousel-clone").forEach((clone) => clone.remove());
    const missingCount = pageCount * TILE_CAROUSEL_PAGE_SIZE - cards.length;
    const cloneCount = missingCount + TILE_CAROUSEL_PAGE_SIZE;

    for (let index = 0; index < cloneCount; index += 1) {
      const source = cards[index % cards.length];
      const clone = source.cloneNode(true);
      clone.classList.add("is-carousel-clone");
      clone.id = `${source.id || "tile"}-clone-${index}`;
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      track.append(clone);
    }
  };

  const setVisibleState = (page) => {
    const logicalPage = page % pageCount;
    const start = logicalPage * TILE_CAROUSEL_PAGE_SIZE;
    const visibleIndexes = Array.from({ length: TILE_CAROUSEL_PAGE_SIZE }, (_, offset) => {
      return (start + offset) % cards.length;
    });

    cards.forEach((card, index) => {
      const isVisible = !mobileQuery.matches || visibleIndexes.includes(index);
      if (mobileQuery.matches && !isVisible) {
        card.setAttribute("aria-hidden", "true");
        card.tabIndex = -1;
      } else {
        card.removeAttribute("aria-hidden");
        card.removeAttribute("tabindex");
      }
    });
  };

  const setPage = (page, instant = false) => {
    const logicalPage = ((page % pageCount) + pageCount) % pageCount;
    currentPage = logicalPage;
    track.classList.toggle("is-carousel-no-transition", instant);
    track.style.transform = mobileQuery.matches ? `translateX(calc(-${page * 100}% - ${page * 4}px))` : "";
    setVisibleState(page);

    syncDots();

    if (instant) {
      window.requestAnimationFrame(() => {
        track.classList.remove("is-carousel-no-transition");
      });
    }
  };

  const showPage = (page, useLoopClone = false) => {
    const nextPage = (page + pageCount) % pageCount;
    clearReset();

    if (!mobileQuery.matches || nextPage === currentPage) {
      setPage(nextPage, true);
      return;
    }

    if (useLoopClone && currentPage === pageCount - 1) {
      setPage(pageCount);
      resetId = window.setTimeout(() => {
        setPage(0, true);
        resetId = 0;
      }, TILE_CAROUSEL_TRANSITION + 40);
      return;
    }

    setPage(nextPage);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (!mobileQuery.matches) return;
    timerId = window.setInterval(() => showPage(currentPage + 1, true), TILE_CAROUSEL_INTERVAL);
  };

  const renderDots = () => {
    dots.innerHTML = "";
    for (let index = 0; index < pageCount; index += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tile-dot";
      button.textContent = `${index + 1}`;
      button.setAttribute("aria-label", `기술 스택 ${index + 1}페이지 보기`);
      button.addEventListener("click", () => {
        showPage(index);
        startAutoPlay();
      });
      dots.append(button);
    }
  };

  const applyMode = () => {
    stopAutoPlay();
    clearReset();
    track.classList.toggle("is-carousel-ready", mobileQuery.matches);
    dots.hidden = !mobileQuery.matches;
    setPage(Math.min(currentPage, pageCount - 1), true);
    startAutoPlay();
  };

  buildClones();
  renderDots();
  dots.addEventListener("mouseenter", stopAutoPlay);
  dots.addEventListener("mouseleave", startAutoPlay);
  track.addEventListener("mouseenter", stopAutoPlay);
  track.addEventListener("mouseleave", startAutoPlay);
  track.addEventListener("focusin", stopAutoPlay);
  track.addEventListener("focusout", startAutoPlay);
  mobileQuery.addEventListener("change", applyMode);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });
  applyMode();
}

function formatDate(date) {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `TODAY : ${yyyy}.${mm}.${dd} (${weekdays[date.getDay()]})`;
}

function setToday() {
  const today = document.getElementById("today");
  if (!today) return;
  const now = new Date();
  today.textContent = formatDate(now);
  today.dateTime = now.toISOString().slice(0, 10);
}

function setVisitorCount() {
  const key = "swlee-portal-visit-count";
  let current = 1234;
  try {
    current = Number(localStorage.getItem(key) || "1233") + 1;
    localStorage.setItem(key, String(current));
  } catch {
    current = 1234;
  }
  const count = document.getElementById("visitor-count");
  if (count) count.textContent = String(current).padStart(6, "0");
}

function bindScrollControls() {
  document.querySelectorAll("[data-scroll-top]").forEach((control) => {
    control.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });

  document.querySelectorAll("[data-scroll-target]").forEach((control) => {
    control.addEventListener("click", () => {
      const target = document.querySelector(control.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindMobileMenu() {
  const button = document.querySelector(".mobile-menu-button");
  const menu = document.getElementById("main-menu");
  if (!button || !menu) return;

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "주요 메뉴 열기");
    menu.classList.remove("is-open");
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "주요 메뉴 열기" : "주요 메뉴 닫기");
    menu.classList.toggle("is-open", !isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function bindStackAccordions() {
  const articles = [...document.querySelectorAll(".category-board article")];
  const mobileQuery = window.matchMedia("(max-width: 520px)");
  if (articles.length === 0) return;

  const setCollapsed = (article, collapsed) => {
    const button = article.querySelector(".stack-toggle");
    const list = article.querySelector("ul");
    article.classList.toggle("is-collapsed", collapsed);
    if (list) list.hidden = collapsed;
    if (!button) return;
    button.setAttribute("aria-expanded", String(!collapsed));
    button.setAttribute("aria-label", collapsed ? "기술 목록 열기" : "기술 목록 접기");
  };

  articles.forEach((article, index) => {
    const heading = article.querySelector("h2");
    const list = article.querySelector("ul");
    if (!heading || !list || heading.querySelector(".stack-toggle")) return;

    if (!list.id) list.id = `${article.id || `stack-${index}`}-list`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "stack-toggle";
    button.textContent = "v";
    button.setAttribute("aria-controls", list.id);
    heading.append(button);

    const toggle = () => {
      if (!mobileQuery.matches) return;
      setCollapsed(article, !article.classList.contains("is-collapsed"));
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggle();
    });
    heading.addEventListener("click", toggle);
  });

  const applyMode = () => {
    articles.forEach((article, index) => {
      setCollapsed(article, mobileQuery.matches ? index > 1 : false);
    });
  };

  applyMode();
  mobileQuery.addEventListener("change", applyMode);
}

function markActiveTabs() {
  const links = [...document.querySelectorAll(".main-tabs a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}

setToday();
setVisitorCount();
renderRandomTechTiles();
bindTileCarousel();
bindScrollControls();
bindMobileMenu();
bindStackAccordions();
markActiveTabs();
