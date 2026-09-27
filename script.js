const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = "cubic-bezier(.22,1,.36,1)";
const popIn = (elements, startDelay = 0) => reducedMotion ? [] : [...elements].map((element, index) =>
  element.animate([{ opacity: 0, transform: "translateY(18px) scale(.98)" }, { opacity: 1, transform: "none" }], {
    duration: 600, delay: startDelay + index * 70, easing: easeOut, fill: "backwards",
  }),
);

// =========================
// LOADER + HERO + SVG
// =========================

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const body = document.body;
  const loader = document.querySelector(".loader");
  const hero = document.querySelector(".hero");

  if (!loader) return;

  function drawSvg() {
    const rootColors = getComputedStyle(document.documentElement);
    document
      .querySelectorAll(".art-lines path, .art-orbit path")
      .forEach((path) => {
        const length = path.getTotalLength();

        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 2500,
          delay: 400,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "forwards",
        });
      });

    const svg = document.querySelector(".system-art");
    const routes = svg
      ? [
          svg.querySelectorAll(".art-lines path")[0],
          svg.querySelectorAll(".art-lines path")[1],
          svg.querySelector(".art-orbit path"),
        ]
      : [];
    if (svg && routes.every(Boolean) && !svg.querySelector(".art-flow-dot")) {
      const ns = "http://www.w3.org/2000/svg";
      routes.forEach((route, index) => {
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("class", "art-flow-dot");
        dot.setAttribute("r", "3");
        dot.setAttribute("fill", rootColors.getPropertyValue("--lime").trim());
        dot.setAttribute("stroke", rootColors.getPropertyValue("--ink").trim());
        dot.setAttribute("stroke-width", "1");
        dot.setAttribute("aria-hidden", "true");

        const motion = document.createElementNS(ns, "animateMotion");
        const duration = `${6 + index}s`;
        motion.setAttribute("dur", duration);
        motion.setAttribute("repeatCount", "indefinite");
        motion.setAttribute("path", route.getAttribute("d"));
        dot.appendChild(motion);

        if (index < 2) {
          const fade = document.createElementNS(ns, "animate");
          fade.setAttribute("attributeName", "opacity");
          fade.setAttribute("dur", duration);
          fade.setAttribute("values", "0;1;1;0");
          fade.setAttribute("keyTimes", "0;0.16;0.72;1");
          fade.setAttribute("calcMode", "spline");
          fade.setAttribute("keySplines", "0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1");
          fade.setAttribute("repeatCount", "indefinite");
          dot.appendChild(fade);
        }

        svg.appendChild(dot);
      });
    }
  }

  function startHeroAnimation() {
    if (!hero) return;

    const kicker = document.querySelector(".hero-kicker");
    const lines = document.querySelectorAll(".hero-line");
    const intro = document.querySelector(".hero-intro");
    const actions = document.querySelector(".hero-actions");
    const art = document.querySelector(".hero-art");
    const labels = document.querySelectorAll(".hero-float-label");
    const index = document.querySelector(".hero-index");

    hero.classList.add("loaded");

    kicker?.animate(
      [
        { opacity: 0, transform: "translateY(25px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 700,
        fill: "forwards",
        easing: "cubic-bezier(.22,1,.36,1)",
      },
    );

    lines.forEach((line, i) => {
      line.animate(
        [
          {
            opacity: 0,
            transform: "translateY(120%)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
          },
        ],
        {
          duration: 1000,
          delay: i * 120,
          fill: "forwards",
          easing: "cubic-bezier(.22,1,.36,1)",
        },
      );
    });

    intro?.animate(
      [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 800,
        delay: 700,
        fill: "forwards",
      },
    );

    actions?.animate(
      [
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 800,
        delay: 850,
        fill: "forwards",
      },
    );

    art?.animate(
      [
        {
          opacity: 0,
          transform: "translateY(60px) rotate(-4deg) scale(.92)",
        },
        {
          opacity: 1,
          transform: "translateY(0) rotate(0deg) scale(1)",
        },
      ],
      {
        duration: 1400,
        delay: 250,
        fill: "forwards",
        easing: "cubic-bezier(.22,1,.36,1)",
      },
    );

    labels.forEach((label, i) => {
      label.animate(
        [
          {
            opacity: 0,
            transform: "translateY(20px)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
          },
        ],
        {
          duration: 700,
          delay: 1200 + i * 150,
          fill: "forwards",
        },
      );
    });

    index?.animate(
      [
        {
          opacity: 0,
          transform: "translateY(25px)",
        },
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        duration: 800,
        delay: 1500,
        fill: "forwards",
      },
    );

    drawSvg();
    initParallax();
  }

  function initParallax() {
    const art = document.querySelector(".hero-art");

    if (!art) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;

    art.addEventListener("mousemove", (e) => {
      const rect = art.getBoundingClientRect();

      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 18;

      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
    });

    art.addEventListener("mouseleave", () => {
      tx = 0;
      ty = 0;
    });

    const animate = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;

      art.style.transform = `translate3d(${x}px,${y}px,0) scale(1.02)`;

      requestAnimationFrame(animate);
    };

    animate();
  }

  if (reducedMotion) {
    loader.remove();
    body.classList.add("site-ready");
    startHeroAnimation();
    return;
  }

  body.classList.add("loading");

  const bar = document.querySelector(".loader-track i");
  const percent = document.querySelector(".loader-percent");

  const start = performance.now();
  const duration = 1850;

  const tick = (now) => {
    const amount = Math.min((now - start) / duration, 1);

    const eased = 1 - Math.pow(1 - amount, 3);

    const value = Math.round(eased * 100);

    if (bar) bar.style.width = `${value}%`;

    if (percent) {
      percent.textContent = String(value).padStart(2, "0");
    }

    if (amount < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setTimeout(() => {
      loader.classList.add("done");

      setTimeout(() => {
        body.classList.remove("loading");
        body.classList.add("site-ready");

        startHeroAnimation();

        loader.remove();
      }, 900);
    }, 150);
  };

  requestAnimationFrame(tick);
})();

// A quiet top-edge indicator shows reading progress without adding page clutter.
(() => {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<span></span>";
  document.body.append(progress);

  const bar = progress.firstElementChild;
  let updateQueued = false;

  const updateProgress = () => {
    if (updateQueued) return;
    updateQueued = true;

    requestAnimationFrame(() => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressAmount =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

      bar.style.transform = `scaleX(${progressAmount})`;
      updateQueued = false;
    });
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
})();

// Subtle pointer follower for devices with a mouse or trackpad.
(() => {
  const cursor = document.querySelector(".cursor");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!cursor || !finePointer || reducedMotion) return;

  let pointerX = 0;
  let pointerY = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add("active");
    },
    { passive: true },
  );

  const moveCursor = () => {
    cursorX += (pointerX - cursorX) * 0.24;
    cursorY += (pointerY - cursorY) * 0.24;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(moveCursor);
  };
  requestAnimationFrame(moveCursor);

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("hover"));
    item.addEventListener("pointerleave", () =>
      cursor.classList.remove("hover"),
    );
  });

  const art = document.querySelector(".hero-art");
  art?.addEventListener("pointerenter", () => cursor.classList.add("art"));
  art?.addEventListener("pointerleave", () => cursor.classList.remove("art"));
})();

// Reveal page sections and their content as they enter the viewport.
(() => {
  const targets = document.querySelectorAll(
    ".services-intro, .service-row, .outcomes-topline, .outcomes-copy, " +
    ".outcomes-visual, .about-intro, .about-pillars, .about-pillar, .insights-intro, " +
    ".insight-card, .contact-copy, .contact-bottom, .footer-main > *, .footer-bottom, " +
    ".about-hero-copy, .about-hero-copy > .section-kicker, .about-hero h1, " +
    ".about-hero-copy > p, .about-stats > div, .about-ceo, .about-ceo-content, " +
    ".about-ceo-content h2, .about-ceo-content > p, .about-ceo-signoff, " +
    ".about-section-label, .about-story-copy, " +
    ".about-checklist li, .about-purpose-grid article, .about-purpose-grid article > span, " +
    ".about-purpose-grid h2, .about-values-heading, .about-values-grid article, " +
    ".about-values-grid article > b, .about-timeline li, .about-timeline li > span, " +
    ".about-timeline li > div, .about-team-heading, .about-team-heading h2, " +
    ".about-team-heading > p, .about-member-card, .about-member-art, .about-member-meta, " +
    ".about-team-quote, .about-team-quote footer, .about-cta-inner > *, " +
    ".about-cta-inner .contact-button, .insights-hero-inner, " +
    ".insights-stats > div, .insights-search, .insight-filter, .insight-library-card, " +
    ".contact-hero-inner, .contact-facts > *, .contact-form-intro, .project-form .form-field, " +
    ".services-page-hero-inner, .services-page-nav a, .service-category-heading, " +
    ".service-detail-card, .engagement-grid article, .service-faq-list details, .services-final-cta > div"
  );
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!targets.length) return;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("motion-ready");
  targets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  });

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

  targets.forEach((target) => observer.observe(target));

  const textTargets = new Set(document.querySelectorAll(
    ".services-intro h2, .services-intro > p, .service-main h3, .service-main p, " +
    ".outcomes-copy h2, .outcomes-copy p, .about-intro h2, .about-intro > p, " +
    ".about-pillar h3, .about-pillar p, .insights-intro h2, .insights-intro > p, " +
    ".insight-card h3, .insight-card p, .contact-section h2, .contact-section p, " +
    ".about-hero-copy > .section-kicker, .about-hero h1, .about-hero-copy > p, " +
    ".about-stats strong, .about-stats span, .about-ceo-mark, .about-ceo-content h2, " +
    ".about-ceo-content > p, .about-ceo-signature, .about-ceo-signoff b, " +
    ".about-ceo-signoff > div span, .about-section-label > span, " +
    ".about-story h2, .about-story-copy > p, .about-checklist li, " +
    ".about-purpose-grid article > span, .about-purpose-grid h2, .about-purpose-grid p, " +
    ".about-values-heading h2, .about-values-heading > p, .about-values-grid article > b, " +
    ".about-values-grid h3, .about-values-grid p, .about-timeline li > span, " +
    ".about-timeline h3, .about-timeline p, .about-team-heading h2, .about-team-heading > p, " +
    ".about-member-monogram, .about-member-meta h3, .about-member-meta p, " +
    ".about-team-quote > p, .about-team-quote footer b, .about-team-quote footer div span, " +
    ".about-cta-inner > .contact-kicker, " +
    ".about-cta-inner h2, .about-cta-inner > div p, .about-checklist-light li, " +
    ".about-cta-inner .contact-button, .insights-hero h1, .insights-hero-inner > p, " +
    ".insight-library-card h2, .insight-library-card p, .contact-hero h1, " +
    ".contact-hero-inner > p, .contact-form-intro h2, .contact-form-intro > p, " +
    ".services-page-hero h1, .services-page-hero-inner > p, .service-category-heading h2, " +
    ".service-category-heading > p, .service-detail-card h3, .service-detail-card > p, " +
    ".engagement-grid h3, .engagement-grid p, .service-faq-list summary, " +
    ".service-faq-list details p, .services-final-cta h2, .services-final-cta p"
  ));

  if (document.body.classList.contains("about-page")) {
    const pageTextWalker = document.createTreeWalker(
      document.querySelector(".about-page main"),
      NodeFilter.SHOW_TEXT
    );
    while (pageTextWalker.nextNode()) {
      const textNode = pageTextWalker.currentNode;
      const parent = textNode.parentElement;
      if (
        textNode.textContent.trim() && parent &&
        !parent.closest(".loader, .cursor, [aria-hidden='true'], script, style, noscript")
      ) {
        textTargets.add(parent);
      }
    }

    textTargets.forEach((target) => {
      if (!target.closest(".about-page main")) return;

      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) {
        if (
          walker.currentNode.textContent.trim() &&
          !walker.currentNode.parentElement.closest(".typing-char")
        ) {
          textNodes.push(walker.currentNode);
        }
      }

      let characterIndex = 0;
      textNodes.forEach((textNode) => {
        const fragment = document.createDocumentFragment();
        Array.from(textNode.textContent).forEach((character) => {
          const letter = document.createElement("span");
          letter.className = "typing-char";
          letter.style.setProperty("--char-delay", `${characterIndex++ * 8}ms`);
          letter.textContent = character;
          fragment.appendChild(letter);
        });
        textNode.parentNode.replaceChild(fragment, textNode);
      });
    });
  }

  textTargets.forEach((target, index) => {
    if (
      document.body.classList.contains("about-page") &&
      !target.closest(".about-page main")
    ) return;
    target.classList.add("text-reveal");
    target.style.setProperty("--text-delay", `${(index % 3) * 90}ms`);
  });

  const textObserver = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("text-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -4% 0px" });
  textTargets.forEach((target) => textObserver.observe(target));
})();

// Count the About page statistics once they enter the viewport.
(() => {
  const counters = document.querySelectorAll(".about-stats [data-count]");
  if (!counters.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const setFinalValue = (counter) => {
    counter.textContent = `${counter.dataset.count}${counter.dataset.countSuffix || ""}`;
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const animateCounter = (counter) => {
    const end = Number(counter.dataset.count);
    const suffix = counter.dataset.countSuffix || "";
    const duration = 1500;
    const startTime = performance.now();

    counter.setAttribute("aria-label", `${end}${suffix}`);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
})();

// =========================
// MOBILE MENU
// =========================

// Keep the header available while scrolling upward and tuck it away on the way down.
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let previousY = window.scrollY;
  let queued = false;

  const updateHeader = () => {
    const currentY = window.scrollY;
    const mobileNav = document.querySelector(".mobile-nav");

    if (currentY < 40 || mobileNav?.classList.contains("active")) {
      document.body.classList.remove("header-hidden");
    } else if (currentY > previousY + 6) {
      document.body.classList.add("header-hidden");
    } else if (currentY < previousY - 6) {
      document.body.classList.remove("header-hidden");
    }

    previousY = currentY;
    queued = false;
  };

  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateHeader);
  }, { passive: true });
})();

(() => {
  const menuToggle = document.querySelector(".menu-toggle");

  const mobileNav = document.querySelector(".mobile-nav");

  const backdrop = document.querySelector(".nav-backdrop");

  if (!menuToggle || !mobileNav || !backdrop) return;

  const closeMenu = () => {
    mobileNav.classList.remove("active");
    backdrop.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  const openMenu = () => {
    mobileNav.classList.add("active");
    backdrop.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
  };

  menuToggle.addEventListener("click", () => {
    mobileNav.classList.contains("active") ? closeMenu() : openMenu();
  });

  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  window.matchMedia("(max-width: 768px)").addEventListener("change", closeMenu);
})();

// Search and topic filters for the insights library.
(() => {
  const library = document.querySelector(".insights-library");
  if (!library) return;

  const search = library.querySelector("#insight-search");
  const filters = [...library.querySelectorAll(".insight-filter")];
  const cards = [...library.querySelectorAll(".insight-library-card")];
  const emptyState = library.querySelector(".insights-empty");
  let activeCategory = "all";

  const updateResults = () => {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesQuery = card.textContent.toLowerCase().includes(query);
      const isVisible = matchesCategory && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
  };

  search.addEventListener("input", updateResults);
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeCategory = filter.dataset.filter;
      filters.forEach((item) => {
        const selected = item === filter;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateResults();
    });
  });
})();

// Fill the article page from its matching card in the insights library.
(() => {
  const hero = document.querySelector(".article-hero");
  if (!hero) return;

  const heading = hero.querySelector("h1");
  const slug = new URLSearchParams(location.search).get("article");
  const body = document.querySelector(".article-body");
  const load = (url) => fetch(url).then((response) => {
    if (!response.ok) throw new Error(`Could not load ${url}`);
    return response.text();
  });

  const revealHero = () => {
    hero.classList.remove("is-loading");
    if (reducedMotion) return;
    const words = heading.textContent.trim().split(/\s+/);
    heading.replaceChildren(...words.flatMap((word, index) => {
      const clip = document.createElement("span");
      const inner = document.createElement("span");
      clip.className = "word";
      inner.textContent = word;
      clip.append(inner);
      inner.animate([{ transform: "translateY(110%)" }, { transform: "none" }], {
        duration: 900, delay: 80 + index * 60, easing: easeOut, fill: "backwards",
      });
      return index ? [" ", clip] : [clip];
    }));
    popIn(hero.querySelectorAll(".article-back"));
    popIn(hero.querySelectorAll(".article-hero-inner > p, .article-meta > div"), 350);
  };

  const buildToc = () => {
    const toc = document.querySelector(".article-toc");
    const sections = [...body.querySelectorAll("h2[id]")];
    if (!toc || !sections.length) return;
    const links = sections.map((section) => {
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = section.textContent;
      return link;
    });
    toc.replaceChildren(...links);
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) links.forEach((link) => link.classList.toggle("is-current", link.hash === `#${entry.target.id}`));
    }), { rootMargin: "0px 0px -70% 0px" });
    sections.forEach((section) => observer.observe(section));
  };

  const showCover = (card) => {
    const source = card.querySelector(".insight-card-media");
    const cover = document.querySelector(".article-cover");
    const image = cover?.querySelector("img");
    if (!source || !cover || !image) return;
    image.src = source.src;
    image.alt = source.alt || "";
    cover.hidden = false;
    if (reducedMotion) return;
    cover.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0)" }], { duration: 1200, delay: 250, easing: easeOut, fill: "backwards" });
    image.animate([{ scale: 1.2 }, { scale: 1 }], { duration: 1600, delay: 250, easing: easeOut, fill: "backwards" });

    let queued = false;
    const drift = () => {
      queued = false;
      const box = cover.getBoundingClientRect();
      const offset = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      image.style.translate = `0 ${Math.max(-40, Math.min(40, offset * -40))}px`;
    };
    window.addEventListener("scroll", () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(drift);
    }, { passive: true });
    drift();
  };

  const showRelated = (cards, current) => {
    const section = document.querySelector(".article-related");
    const related = cards.filter((card) => card !== current)
      .sort((a, b) => Number(b.dataset.category === current.dataset.category) - Number(a.dataset.category === current.dataset.category))
      .slice(0, 3).map((card) => document.importNode(card, true));
    if (!section || !related.length) return;
    section.querySelector(".insights-library-grid").replaceChildren(...related);
    section.hidden = false;
    const animations = popIn(related);
    if (!animations.length || !("IntersectionObserver" in window)) return;
    animations.forEach((animation) => animation.pause());
    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      animations.forEach((animation) => animation.play());
      observer.disconnect();
    }, { threshold: .15 }).observe(section);
  };

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return location.replace("insights.html");
  Promise.all([load("insights.html"), load(`articles/${slug}.html`)]).then(([listing, content]) => {
    const cards = [...new DOMParser().parseFromString(listing, "text/html").querySelectorAll(".insight-library-card")];
    const current = cards.find((card) => new URL(card.getAttribute("href"), location.href).searchParams.get("article") === slug);
    if (!current) return location.replace("insights.html");
    const text = (selector) => current.querySelector(selector)?.textContent.trim() || "";
    const title = text("h2");
    document.title = `${title} | Aetonet Insights`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", text(".insight-card-summary"));
    heading.textContent = title;
    hero.querySelector(".article-hero-inner > p").textContent = text(".insight-card-summary");
    hero.querySelector(".article-topic").textContent = text(".insight-topic");
    hero.querySelector(".article-date").textContent = text(".insight-card-meta time");
    hero.querySelector(".article-read-time").textContent = text(".insight-card-meta span");
    body.innerHTML = content;
    buildToc();
    showCover(current);
    showRelated(cards, current);
    revealHero();
  }).catch((error) => {
    console.error("Article loading failed:", error);
    heading.textContent = "This article could not be loaded.";
    revealHero();
  });
})();

// Copy the current article URL.
(() => {
  const button = document.querySelector(".article-copy-link");
  if (!button) return;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      button.textContent = "Link copied";
    } catch {
      button.textContent = "Copy failed";
    }
    setTimeout(() => { button.textContent = "Copy link"; }, 2000);
  });
})();

// Send a project inquiry through FormSubmit.
(() => {
  const form = document.querySelector("#project-form");
  if (!form) return;

  const note = form.querySelector("#form-note");
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.innerHTML;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    const name = fields.name.trim();
    const email = fields.email.trim();
    if (fields._honey) {
      form.reset();
      note.textContent = "Thanks — your message has been sent.";
      return;
    }

    const payload = {
      _subject: `Project inquiry from ${name}`,
      _replyto: email,
      _template: "table",
      _captcha: "false",
      Name: name,
      Email: email,
      Company: fields.company.trim() || "Not provided",
      "Project type": fields.projectType || "Not selected",
      Budget: fields.budget,
      Timeline: fields.timeline,
      Message: fields.message.trim(),
    };

    button.disabled = true;
    button.innerHTML = "Sending… <span>↗</span>";
    note.textContent = "Sending your message…";
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== "true") throw new Error(result.message || "Submission failed");
      form.reset();
      note.textContent = `Thanks, ${name.split(" ")[0]} — your message has been sent. We’ll reply within one business day.`;
    } catch (error) {
      console.error("Contact form failed:", error);
      note.textContent = "Your message could not be sent. Please try again, or email us at ";
      const link = document.createElement("a");
      link.href = "mailto:minal.aetonet@gmail.com";
      link.textContent = "minal.aetonet@gmail.com";
      note.append(link, ".");
    } finally {
      button.disabled = false;
      button.innerHTML = buttonLabel;
    }
  });
})();

const services = document.querySelector("#services");
const outcomes = document.querySelector("#outcomes");

if (outcomes && "IntersectionObserver" in window) {
  const textElements = [
    ...outcomes.querySelectorAll(
      "h2, h3, h4, p, .section-kicker, .principle-number, .principle-label, .feature-index",
    ),
  ].filter((element) => element.textContent.trim());
  const groupCounts = new Map();

  for (const element of textElements) {
    const group =
      element.closest(
        ".outcomes-heading, .outcome-principle, .outcome-feature",
      ) || element.parentElement;
    const index = groupCounts.get(group) || 0;
    element.style.setProperty(
      "--text-reveal-delay",
      `${Math.min(index * 90, 180)}ms`,
    );
    groupCounts.set(group, index + 1);
    element.classList.add("outcomes-text-reveal");
  }

  document.documentElement.classList.add("js-enabled");
  const textObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.18 },
  );

  textElements.forEach((element) => textObserver.observe(element));
}

if (services && "IntersectionObserver" in window) {
  const rows = [...services.querySelectorAll(".service-row")];
  document.documentElement.classList.add("js-enabled");

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );

  sectionObserver.observe(services);

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );

  rows.forEach((row) => revealObserver.observe(row));

  const visibility = new Map(rows.map((row) => [row, 0]));
  const activeObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visibility.set(
          entry.target,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        );
      }

      let activeRow = null;
      let highestRatio = 0;
      for (const [row, ratio] of visibility) {
        if (ratio > highestRatio) {
          activeRow = row;
          highestRatio = ratio;
        }
      }

      rows.forEach((row) =>
        row.classList.toggle("is-active", row === activeRow),
      );
    },
    {
      threshold: [0, 0.15, 0.35, 0.6],
      rootMargin: "-28% 0px -28% 0px",
    },
  );

  rows.forEach((row) => activeObserver.observe(row));
}
