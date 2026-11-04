(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('main-navigation');
  const moreInfo = nav?.querySelector('.nav-parent');
  const group = nav?.querySelector('.nav-group');
  if (!toggle || !nav || !moreInfo || !group) return;

  const closeMenu = () => {
    nav.classList.remove('mobile-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    group.classList.remove('mobile-submenu-open');
    moreInfo.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    nav.classList.toggle('mobile-nav-open', opening);
    if (!opening) closeMenu();
  });

  moreInfo.addEventListener('click', () => {
    const opening = moreInfo.getAttribute('aria-expanded') !== 'true';
    moreInfo.setAttribute('aria-expanded', String(opening));
    group.classList.toggle('mobile-submenu-open', opening);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
})();
