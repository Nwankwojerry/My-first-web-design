document.addEventListener('DOMContentLoaded', () => {
  const mobileDrawer = document.querySelector('#mobileDrawer');
  const menuToggle = document.querySelector('#menuToggle');
  const searchToggle = document.querySelector('#searchToggle');
  const searchPanel = document.querySelector('#searchPanel');
  const searchForm = document.querySelector('#searchForm');
  const searchInput = document.querySelector('#searchInput');

  const setMenuState = (open) => {
    if (!mobileDrawer || !menuToggle) return;
    mobileDrawer.classList.toggle('open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const closeMenu = () => {
    setMenuState(false);
    document.querySelectorAll('.drawer-toggle[aria-expanded="true"]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      const icon = button.querySelector('span');
      if (icon) icon.textContent = '+';
      button.nextElementSibling?.classList.remove('open');
    });
  };

  menuToggle?.addEventListener('click', () => {
    setMenuState(!mobileDrawer?.classList.contains('open'));
  });

  document.querySelectorAll('[data-close-menu]').forEach((element) => {
    element.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.drawer-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const submenu = button.nextElementSibling;
      if (!submenu) return;
      const open = submenu.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      const icon = button.querySelector('span');
      if (icon) icon.textContent = open ? '−' : '+';
    });
  });

  document.querySelectorAll('.drawer-link, .drawer-submenu a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  const setSearchState = (open) => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.classList.toggle('open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
    if (open) searchInput?.focus();
  };

  searchToggle?.addEventListener('click', () => {
    setSearchState(!searchPanel?.classList.contains('open'));
  });

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) return;

    const action = searchForm.getAttribute('action') || 'pages/news.html';
    const destination = new URL(action, document.baseURI);
    destination.searchParams.set('q', query);
    window.location.href = destination.href;
  });

  document.querySelectorAll('.nav-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const item = button.closest('.nav-item');
      if (!item) return;

      const open = item.classList.toggle('dropdown-open');
      button.setAttribute('aria-expanded', String(open));

      document.querySelectorAll('.nav-item.dropdown-open').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('dropdown-open');
          otherItem.querySelector('.nav-button')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.dropdown-open').forEach((item) => {
        item.classList.remove('dropdown-open');
        item.querySelector('.nav-button')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      setSearchState(false);
      document.querySelectorAll('.nav-item.dropdown-open').forEach((item) => {
        item.classList.remove('dropdown-open');
        item.querySelector('.nav-button')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
});
