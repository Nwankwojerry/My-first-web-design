document.addEventListener('DOMContentLoaded', () => {
  const onInnerPage = window.location.pathname.includes('/pages/');
  const pagePath = (file) => onInnerPage ? file : `pages/${file}`;
  const homePath = onInnerPage ? '../index.html' : 'index.html';

  if (!document.querySelector('.site-header')) {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `<div class="container header-inner"><a class="brand" href="${homePath}" aria-label="Homestreet Media home"><img src="${onInnerPage ? '../' : ''}images/logo/homestreet-media.svg" alt="Homestreet Media"></a><nav class="desktop-nav" aria-label="Primary"><a class="nav-link" href="${homePath}">Home</a><a class="nav-link" href="${pagePath('news.html')}">News</a><a class="nav-link" href="${pagePath('tech.html')}">Tech</a><a class="nav-link" href="${pagePath('economy.html')}">Economy</a><div class="nav-item"><button class="nav-button" type="button" aria-expanded="false">Explore</button><div class="dropdown"><a href="${pagePath('resources.html')}">Resources</a><a href="${pagePath('tutorials.html')}">Tutorials</a><a href="${pagePath('guides.html')}">Guides</a><a href="${pagePath('tips-tricks.html')}">Tips &amp; Tricks</a></div></div><div class="nav-item"><button class="nav-button" type="button" aria-expanded="false">Blog</button><div class="dropdown"><a href="${pagePath('stories.html')}">Stories</a><a href="${pagePath('articles.html')}">Articles</a><a href="${pagePath('posts.html')}">Posts</a></div></div><div class="nav-item"><button class="nav-button" type="button" aria-expanded="false">Entertainment</button><div class="dropdown"><a href="${pagePath('movie-news.html')}">Movie News</a><a href="${pagePath('upcoming-movies.html')}">Upcoming Movies</a><a href="${pagePath('celebrities.html')}">Celebrities</a><a href="${pagePath('comedy.html')}">Comedy</a></div></div><a class="nav-link" href="${pagePath('about.html')}">About</a><a class="nav-link" href="${pagePath('contact.html')}">Contact</a></nav><div class="header-actions"><button class="icon-button" id="searchToggle" type="button" aria-label="Open search" aria-expanded="false">⌕</button><button class="menu-button" id="menuToggle" type="button" aria-label="Open menu" aria-expanded="false">☰</button></div></div><div class="search-panel" id="searchPanel"><form class="container search-form" id="searchForm" action="${pagePath('news.html')}"><input id="searchInput" name="q" type="search" placeholder="Search Homestreet…" aria-label="Search Homestreet"><button type="submit">Search</button></form></div>`;
    document.body.prepend(header);

    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobileDrawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `<div class="drawer-backdrop" data-close-menu></div><aside class="drawer-panel" aria-label="Mobile navigation panel"><div class="drawer-top"><img class="drawer-brand" src="${onInnerPage ? '../' : ''}images/logo/homestreet-media.svg" alt="Homestreet Media"><button class="icon-button" type="button" data-close-menu aria-label="Close menu">×</button></div><nav class="drawer-nav" aria-label="Mobile"><a class="drawer-link" href="${homePath}">Home</a><a class="drawer-link" href="${pagePath('news.html')}">News</a><a class="drawer-link" href="${pagePath('tech.html')}">Tech</a><a class="drawer-link" href="${pagePath('economy.html')}">Economy</a><button class="drawer-toggle" type="button" aria-expanded="false">Explore <span>+</span></button><div class="drawer-submenu"><a href="${pagePath('resources.html')}">Resources</a><a href="${pagePath('tutorials.html')}">Tutorials</a><a href="${pagePath('guides.html')}">Guides</a><a href="${pagePath('tips-tricks.html')}">Tips &amp; Tricks</a></div><button class="drawer-toggle" type="button" aria-expanded="false">Blog <span>+</span></button><div class="drawer-submenu"><a href="${pagePath('stories.html')}">Stories</a><a href="${pagePath('articles.html')}">Articles</a><a href="${pagePath('posts.html')}">Posts</a></div><button class="drawer-toggle" type="button" aria-expanded="false">Entertainment <span>+</span></button><div class="drawer-submenu"><a href="${pagePath('movie-news.html')}">Movie News</a><a href="${pagePath('upcoming-movies.html')}">Upcoming Movies</a><a href="${pagePath('celebrities.html')}">Celebrities</a><a href="${pagePath('comedy.html')}">Comedy</a></div><a class="drawer-link" href="${pagePath('about.html')}">About</a><a class="drawer-link" href="${pagePath('contact.html')}">Contact</a></nav></aside></div>`;
    document.body.prepend(drawer);

    if (!document.querySelector('.footer')) {
      const footer = document.createElement('footer');
      footer.className = 'footer';
      footer.innerHTML = `<div class="container footer-inner"><div class="footer-brand"><img src="${onInnerPage ? '../' : ''}images/logo/homestreet-media.svg" alt="Homestreet Media"><p>Your go-to platform for news, insights, tutorials, and stories that matter.</p></div><div><h3>Explore</h3><a href="${pagePath('news.html')}">News</a><a href="${pagePath('tech.html')}">Tech</a><a href="${pagePath('economy.html')}">Economy</a><a href="${pagePath('entertainment.html')}">Entertainment</a></div><div><h3>Resources</h3><a href="${pagePath('guides.html')}">Guides</a><a href="${pagePath('tutorials.html')}">Tutorials</a><a href="${pagePath('tips-tricks.html')}">Tips &amp; Tricks</a><a href="${pagePath('resources.html')}">Resources</a></div><div><h3>Company</h3><a href="${pagePath('about.html')}">About</a><a href="${pagePath('contact.html')}">Contact</a><a href="${pagePath('privacy-policy.html')}">Privacy Policy</a><a href="${pagePath('terms.html')}">Terms</a></div></div><div class="container footer-bottom"><span>© 2026 Homestreet Media. All rights reserved.</span><span><a href="${pagePath('sitemap.html')}">Sitemap</a></span></div>`;
      document.body.append(footer);
    }
  }

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

  menuToggle?.addEventListener('click', () => setMenuState(!mobileDrawer?.classList.contains('open')));
  document.querySelectorAll('[data-close-menu]').forEach((element) => element.addEventListener('click', closeMenu));

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

  document.querySelectorAll('.drawer-link, .drawer-submenu a').forEach((link) => link.addEventListener('click', closeMenu));

  const setSearchState = (open) => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.classList.toggle('open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
    if (open) searchInput?.focus();
  };

  searchToggle?.addEventListener('click', () => setSearchState(!searchPanel?.classList.contains('open')));

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) return;
    const action = searchForm.getAttribute('action') || pagePath('news.html');
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
