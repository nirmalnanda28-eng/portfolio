(() => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      links.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      links.classList.toggle('open', !isOpen);
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (links.classList.contains('open') && !links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const navItems = links ? Array.from(links.querySelectorAll('a[href^="#"]:not(.nav-cta)')) : [];
  const navTargets = navItems.map(item => ({ item, section: document.querySelector(item.getAttribute('href')) })).filter(entry => entry.section);
  if (navTargets.length) {
    let navUpdateQueued = false;
    const updateActiveNav = () => {
      navUpdateQueued = false;
      const activationLine = Math.min(window.innerHeight * 0.34, 280);
      const passed = navTargets.filter(({ section }) => section.getBoundingClientRect().top <= activationLine);
      const current = passed.length ? passed[passed.length - 1] : navTargets[0];
      navTargets.forEach(({ item }) => {
        if (item === current.item) item.setAttribute('aria-current', 'location');
        else item.removeAttribute('aria-current');
      });
    };
    const queueNavUpdate = () => {
      if (!navUpdateQueued) {
        navUpdateQueued = true;
        window.requestAnimationFrame(updateActiveNav);
      }
    };
    window.addEventListener('scroll', queueNavUpdate, { passive: true });
    window.addEventListener('resize', queueNavUpdate);
    window.addEventListener('hashchange', queueNavUpdate);
    updateActiveNav();
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
})();
