/**
 * SGNIA COMPANY - Script Oficial
 * Lógica limpia y ligera para navegación, filtros de proyectos,
 * validación de contacto y animación de divisores entrelazados.
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntertwinedDividers();
  initRevealAnimations();
  initHeader();
  initMobileMenu();
  initProjectFilters();
  initContactActions();
  initScrollTop();
});

/* -------------------------------------------------------------
 * 1. DIVISORES ENTRELAZADOS (Animación de dibujo que corre una sola vez)
 * ------------------------------------------------------------- */
function initIntertwinedDividers() {
  const dividers = document.querySelectorAll('.intertwined-divider-svg');
  if (!dividers.length) return;

  // Si el usuario prefiere movimiento reducido, los dejamos visibles de inmediato
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dividers.forEach(d => d.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Solo se anima una vez
      }
    });
  }, { threshold: 0.2 });

  dividers.forEach(d => observer.observe(d));
}

/* -------------------------------------------------------------
 * 2. ANIMACIONES SUTILES DE APARICIÓN
 * ------------------------------------------------------------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal-fade');
  if (!reveals.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 3. HEADER NAVEGACIÓN (Sombra sutil al hacer scroll)
 * ------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-sm', 'bg-white/95', 'backdrop-blur-md');
      header.classList.remove('bg-white');
    } else {
      header.classList.remove('shadow-sm', 'bg-white/95', 'backdrop-blur-md');
      header.classList.add('bg-white');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------
 * 4. MENÚ MÓVIL
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = !mobileMenu.classList.contains('hidden');
    if (isExpanded) {
      mobileMenu.classList.add('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  };

  menuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  });
}

/* -------------------------------------------------------------
 * 5. FILTRO DE PROYECTOS POR CATEGORÍA
 * ------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 6. CONTACTO RÁPIDO (WhatsApp, SMS, Correo)
 * ------------------------------------------------------------- */
function initContactActions() {
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');
  const btnSMS = document.getElementById('btn-send-sms');
  const btnEmail = document.getElementById('btn-send-email');

  const nameInput = document.getElementById('contact-name');
  const messageInput = document.getElementById('contact-message');

  const getFormValues = () => {
    const name = nameInput ? nameInput.value.trim() : '';
    const msg = messageInput ? messageInput.value.trim() : '';
    return { name, msg };
  };

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      const { name, msg } = getFormValues();
      let text = 'Hola Gamaliel, me gustaría platicar sobre un proyecto con SGNIA COMPANY.';
      if (name || msg) {
        text = `Hola Gamaliel, soy ${name || 'un cliente'}. Mensaje: ${msg || 'Me gustaría cotizar un desarrollo.'}`;
      }
      const url = `https://wa.me/522761095688?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  if (btnSMS) {
    btnSMS.addEventListener('click', () => {
      const { name, msg } = getFormValues();
      const body = `Hola Gamaliel, soy ${name || 'un cliente'}. Mensaje: ${msg || 'Me gustaría cotizar un desarrollo con SGNIA.'}`;
      window.location.href = `sms:+522761095688?body=${encodeURIComponent(body)}`;
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener('click', () => {
      const { name, msg } = getFormValues();
      const subject = `Contacto desde web SGNIA - ${name || 'Proyecto'}`;
      const body = `Nombre: ${name}\n\nMensaje:\n${msg}\n`;
      window.location.href = `mailto:gmlvega0025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
}

/* -------------------------------------------------------------
 * 7. BOTÓN FLOTANTE VOLVER ARRIBA
 * ------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      btn.classList.add('opacity-100', 'translate-y-0');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      btn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
