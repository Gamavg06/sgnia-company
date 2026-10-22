/**
 * SGNIA COMPANY - Futuristic Cinematic Experience & Scene Presentation Logic
 * Interactive HUD, ambient background canvas, scroll scene tracker, and form actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initSceneCanvas();
  initSceneTracker();
  initRevealAnimations();
  initNavbar();
  initMobileMenu();
  initProjectFilters();
  initContactActions();
  initScrollTop();
});

/* -------------------------------------------------------------
 * 1. TOP SCROLL PROGRESS BAR
 * ------------------------------------------------------------- */
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* -------------------------------------------------------------
 * 2. AMBIENT PARTICLES & GRID CANVAS (Cinematic Background)
 * ------------------------------------------------------------- */
function initSceneCanvas() {
  const canvas = document.getElementById('scene-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(33, 209, 198, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(23, 148, 143, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connect();
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });
}

/* -------------------------------------------------------------
 * 3. HUD SCENE TRACKER (Cinematic Scene Indicator)
 * ------------------------------------------------------------- */
function initSceneTracker() {
  const trackerText = document.getElementById('hud-scene-name');
  if (!trackerText) return;

  const scenes = [
    { id: 'inicio', name: '01 // OVERTURE' },
    { id: 'nosotros', name: '02 // ORIGIN & FOUNDER' },
    { id: 'metodologia', name: '03 // PIPELINE' },
    { id: 'servicios', name: '04 // CAPABILITIES' },
    { id: 'proyectos', name: '05 // SHOWCASE REEL' },
    { id: 'tecnologias', name: '06 // TECH ARSENAL' },
    { id: 'contacto', name: '07 // CONNECT' }
  ];

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = scenes.find(s => s.id === entry.target.id);
          if (match) {
            trackerText.textContent = match.name;
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  scenes.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
}

/* -------------------------------------------------------------
 * 4. REVEAL ANIMATIONS ON SCROLL
 * ------------------------------------------------------------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 5. NAVBAR SCROLL EFFECT
 * ------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('bg-[#050B14]/90', 'backdrop-blur-xl', 'py-3', 'shadow-2xl', 'shadow-black/60', 'border-white/10');
      header.classList.remove('py-4', 'bg-transparent', 'border-transparent');
    } else {
      header.classList.add('py-4', 'bg-transparent', 'border-transparent');
      header.classList.remove('bg-[#050B14]/90', 'backdrop-blur-xl', 'py-3', 'shadow-2xl', 'shadow-black/60', 'border-white/10');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------
 * 6. MOBILE MENU TOGGLE
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
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }
  };

  menuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
}

/* -------------------------------------------------------------
 * 7. PROJECT CATEGORY FILTER
 * ------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.classList.add('text-slate-400', 'font-medium');
      });
      btn.classList.add('active');
      btn.classList.remove('text-slate-400', 'font-medium');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 8. CONTACT FORM VALIDATION & DIRECT ACTIONS (WhatsApp, SMS, Email)
 * ------------------------------------------------------------- */
function initContactActions() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const serviceInput = document.getElementById('contact-service');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let isValid = true;

    // Nombre
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Por favor, ingresa tu nombre completo.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Email
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Mensaje
    if (!messageInput.value.trim()) {
      showError(messageInput, messageError, 'Escribe un mensaje describiendo tu proyecto.');
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    return isValid;
  };

  const showError = (input, errorEl, msg) => {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
    }
    input.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
  };

  const clearError = (input, errorEl) => {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
  };

  // Botón WhatsApp
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', e => {
      e.preventDefault();
      if (!validate()) return;

      const name = nameInput.value.trim();
      const service = serviceInput ? serviceInput.value : 'Desarrollo de Software';
      const msg = messageInput.value.trim();

      const text = `Hola, mi nombre es ${name}. Me interesa cotizar un proyecto de "${service}" con SGNIA COMPANY. Mensaje: ${msg}`;
      const url = `https://wa.me/522761095688?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Botón SMS
  const btnSMS = document.getElementById('btn-send-sms');
  if (btnSMS) {
    btnSMS.addEventListener('click', e => {
      e.preventDefault();
      if (!validate()) return;

      const name = nameInput.value.trim();
      const service = serviceInput ? serviceInput.value : 'Desarrollo de Software';
      const msg = messageInput.value.trim();

      const text = `SGNIA COMPANY - Proyecto: ${service} | De: ${name} | Mensaje: ${msg}`;
      const url = `sms:+522761095688?body=${encodeURIComponent(text)}`;
      window.location.href = url;
    });
  }

  // Botón Correo
  const btnEmail = document.getElementById('btn-send-email');
  if (btnEmail) {
    btnEmail.addEventListener('click', e => {
      e.preventDefault();
      if (!validate()) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const service = serviceInput ? serviceInput.value : 'Desarrollo de Software';
      const msg = messageInput.value.trim();

      const subject = `Cotización de Proyecto: ${service} - SGNIA COMPANY`;
      const body = `Hola Gamaliel Velazquez / SGNIA COMPANY,\n\nMi nombre es ${name} (${email}).\nMe comunico para cotizar un proyecto de tipo "${service}".\n\nDetalles del proyecto:\n${msg}\n\nQuedo a la espera de su respuesta.`;
      const url = `mailto:gmlvega0025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    });
  }
}

/* -------------------------------------------------------------
 * 9. SCROLL TO TOP FLOATING BUTTON
 * ------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
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
