document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav") || document.querySelector(".sidebar-nav");
  const toggleBtn = document.querySelector(".site-header__toggle") || document.querySelector(".menu-btn");
  const overlay = document.querySelector(".overlay");

  if (!nav || !toggleBtn) return;

  const closeMenu = () => {
    nav.classList.remove("site-nav--open", "open");
    if (overlay) overlay.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    nav.classList.add(nav.classList.contains("sidebar-nav") ? "open" : "site-nav--open");
    if (overlay) overlay.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
  };

  toggleBtn.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("site-nav--open") && !nav.classList.contains("open");
    if (willOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  document.querySelectorAll(".site-nav__button").forEach((button) => {
    button.addEventListener("click", () => {
      const submenu = button.nextElementSibling;
      if (!submenu) return;

      const isOpen = submenu.classList.toggle("site-nav__submenu--open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".site-nav__link, .site-nav__sublink, .site-nav__footer-link, .site-footer__link, .sidebar-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  document.querySelectorAll(".site-footer__social-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      console.log(`User clicked social link: ${event.target.textContent.trim()}`);
    });
  });

  console.log("JS is working");
});
