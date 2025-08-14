// main.js
document.addEventListener("DOMContentLoaded", () => {
  // ---- Year ----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const closeNav = () => { if (nav) nav.classList.remove("open"); if (menuBtn) menuBtn.setAttribute("aria-expanded", "false"); };

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    // Close when a link is clicked
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
    // Close when resizing to desktop
    window.addEventListener("resize", () => { if (window.innerWidth > 720) closeNav(); });
  }

  // ---- Back to top ----
  const btt = document.getElementById("backToTop");
  if (btt) {
    window.addEventListener("scroll", () => {
      btt.classList.toggle("show", window.scrollY > 300);
    });
    btt.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Copy email ----
  const copyBtn = document.getElementById("copyEmail");
  const emailLink = document.getElementById("emailLink");
  if (copyBtn && emailLink) {
    copyBtn.addEventListener("click", async () => {
      const email = emailLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = prev), 1100);
      } catch {
        window.prompt("Copy email address:", email);
      }
    });
  }

  // ---- Smooth in-page scrolling (anchors that start with #) ----
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      const target = id && document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // ---- Active nav highlight while scrolling ----
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main .section");
  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-50% 0px -45% 0px", threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  // ---- Scroll reveal (gentle fade up) ----
  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealables = document.querySelectorAll(".skill-card, .card, .tl-content");
    revealables.forEach(el => el.classList.add("will-reveal"));
    const rev = new IntersectionObserver((ents, obs) => {
      ents.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add("reveal");
          ent.target.classList.remove("will-reveal");
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.15 });
    revealables.forEach(el => rev.observe(el));
  }
});
