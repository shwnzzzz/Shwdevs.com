(() => {
  const projects = {
    quintal: {
      name: '💜 | NexoraFinance',
      file: 'demos/nexorafinance.html',
    },
    bairro: {
      name: '🍔 | MenuGo',
      file: 'demos/menugo.html',
    },
    bossa: {
      name: '🧡 | Apexsports',
      file: 'demos/apexsports.html',
    },
  };

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');

  const menuIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>
    </svg>`;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 6l12 12"></path><path d="M18 6 6 18"></path>
    </svg>`;

  function setMenu(open) {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuToggle.innerHTML = open ? closeIcon : menuIcon;
    navigation.classList.toggle('is-open', open);
  }

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('#navigation a')];

  function markActiveSection(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) markActiveSection(entry.target.id);
      }),
      { rootMargin: '-20% 0px -55% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const animatedElements = document.querySelectorAll(
      '.section-heading, .section-description, .about-graphic, .about-copy, .skill-card, .portfolio-card, .journey-card, .contact-layout > *, .site-footer',
    );
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const siblings = [...(entry.target.parentElement?.children || [])];
        const index = siblings.indexOf(entry.target);
        const delay = entry.target.matches('.skill-card, .portfolio-card, .journey-card')
          ? (index % 5) * 65
          : 0;
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 650,
            delay,
            easing: 'cubic-bezier(.2,.7,.2,1)',
            fill: 'backwards',
          },
        );
      });
    }, { threshold: 0.08 });
    animatedElements.forEach((element) => revealObserver.observe(element));
  }

  let activeDialog;

  function getProjectFromCard(card) {
    const preview = card.querySelector('.portfolio-preview');
    const theme = Object.keys(projects).find((key) => preview?.classList.contains(key));
    return theme ? { ...projects[theme], theme } : null;
  }

  function closeDialog() {
    if (!activeDialog) return;
    const dialog = activeDialog;
    activeDialog = null;
    dialog.close();
    dialog.remove();
    document.body.style.overflow = '';
  }

  function openDemo(card) {
    const project = getProjectFromCard(card);
    if (!project) return;

    closeDialog();
    const dialog = document.createElement('dialog');
    dialog.className = 'demo-dialog';
    dialog.style.width = 'min(98vw, 1700px)';
    dialog.style.maxWidth = 'none';
    dialog.setAttribute('aria-label', `Demonstração ${project.name}`);
    dialog.innerHTML = `
      <div class="demo-toolbar">
        <span>${project.name} <small>Conceito interativo</small></span>
        <a href="">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          </svg>
        </a>
        <button type="button" aria-label="Fechar demonstração">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <iframe
        title="Demo ${project.name}"
        src="${project.file}"
        sandbox="allow-scripts"
        style="width: 100%; height: min(78vh, 760px); min-height: 560px; border: 0; display: block;"
      ></iframe>
      <p class="demo-note">Dados ilustrativos. Esta demonstração não processa pagamentos nem salva informações | Shwdevs.com</p>`;

    dialog.addEventListener('cancel', closeDialog);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.querySelector('button')?.addEventListener('click', closeDialog);

    document.body.append(dialog);
    activeDialog = dialog;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.portfolio-preview, .project-actions button').forEach((button) => {
    button.addEventListener('click', () => openDemo(button.closest('.portfolio-card')));
  });
})();
