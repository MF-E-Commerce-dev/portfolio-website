/* ==========================================================
   Professional Business Portfolio - JavaScript
   - Mobile menu toggle
   - Smooth scrolling with header offset
   - Contact form interaction + validation feedback
   ========================================================== */

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function getHeaderOffset() {
  const header = qs(".site-header");
  if (!header) return 0;
  const rect = header.getBoundingClientRect();
  return Math.ceil(rect.height);
}

function scrollToId(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const offset = getHeaderOffset() + 12;
  const top = window.scrollY + target.getBoundingClientRect().top - offset;

  window.scrollTo({ top, behavior: "smooth" });
}

function initMobileMenu() {
  const nav = qs(".nav");
  const toggle = qs(".nav__toggle");
  const menu = qs("#navMenu");
  if (!nav || !toggle || !menu) return;

  const openMenu = () => {
    nav.classList.add("nav--open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  const closeMenu = () => {
    nav.classList.remove("nav--open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("nav--open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  qsa("a.nav__link", menu).forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // Close when clicking outside (mobile overlay style)
  document.addEventListener("click", (e) => {
    const isOpen = nav.classList.contains("nav--open");
    if (!isOpen) return;
    if (nav.contains(e.target)) return;
    closeMenu();
  });

  // Close on ESC for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function initSmoothScroll() {
  const links = qsa('a[href^="#"]');
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const id = href.slice(1);
    if (!id) return;

    link.addEventListener("click", (e) => {
      // Only handle on-page anchors that exist
      if (!document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      history.pushState(null, "", `#${id}`);
    });
  });
}

function setFieldError(fieldEl, message) {
  const wrapper = fieldEl.closest(".field");
  if (!wrapper) return;
  wrapper.classList.add("field--error");
  const errorEl = qs(".field__error", wrapper);
  if (errorEl) errorEl.textContent = message || "";
}

function clearFieldError(fieldEl) {
  const wrapper = fieldEl.closest(".field");
  if (!wrapper) return;
  wrapper.classList.remove("field--error");
  const errorEl = qs(".field__error", wrapper);
  if (errorEl) errorEl.textContent = "";
}

function initFormHandler() {
  const form = qs("#contactForm");
  const status = qs("#formStatus");
  if (!form) return;

  const fields = qsa(".field__input", form);
  const setStatus = (msg, kind = "info") => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.kind = kind;
  };

  const validate = () => {
    let ok = true;
    fields.forEach((el) => {
      clearFieldError(el);
      if (!el.hasAttribute("required")) return;

      const value = String(el.value || "").trim();
      if (!value) {
        ok = false;
        setFieldError(el, "This field is required.");
        return;
      }

      if (el.name === "email") {
        // Basic email check; browser will also validate type="email"
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!emailOk) {
          ok = false;
          setFieldError(el, "Please enter a valid email address.");
        }
      }
    });

    return ok;
  };

  fields.forEach((el) => {
    el.addEventListener("input", () => clearFieldError(el));
    el.addEventListener("blur", () => {
      if (!el.hasAttribute("required")) return;
      const value = String(el.value || "").trim();
      if (!value) setFieldError(el, "This field is required.");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus("");

    const ok = validate();
    if (!ok) {
      setStatus("Please fix the highlighted fields and try again.", "error");
      const firstError = qs(".field--error .field__input", form);
      if (firstError) firstError.focus();
      return;
    }

    // Demo interaction (no backend)
    setStatus("Thanks — your message has been prepared. I’ll get back to you shortly.", "success");
    form.reset();
  });
}

function initYear() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSmoothScroll();
  initFormHandler();
  initYear();
});

