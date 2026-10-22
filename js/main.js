/**
 * SGNIA COMPANY - Interactive Landing Page Logic
 * Handles navigation, mobile menu, project filtering, form validation and dynamic actions (WhatsApp, SMS, Email).
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initProjectFilters();
  initContactActions();
  initScrollTop();
  initActiveNavSpy();
});

/* -------------------------------------------------------------
 * 1. NAVBAR SCROLL EFFECT
 * ------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-[#0B172C]/95', 'shadow-xl', 'py-3');
      header.classList.remove('py-4', 'bg-[#12264A]/90');
    } else {
      header.classList.add('py-4', 'bg-[#12264A]/90');
      header.classList.remove('bg-[#0B172C]/95', 'shadow-xl', 'py-3');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* -------------------------------------------------------------
 * 2. MOBILE MENU TOGGLE
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
 * 3. PROJECT CATEGORY FILTER
 * ------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.classList.add('text-slate-600', 'font-semibold');
      });
      btn.classList.add('active');
      btn.classList.remove('text-slate-600', 'font-semibold');

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
 * 4. CONTACT FORM VALIDATION & ACTIONS (WhatsApp, SMS, Correo)
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

  // Real-time error clearance
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('border-rose-500');
      nameError.classList.add('hidden');
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('border-rose-500');
      emailError.classList.add('hidden');
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      messageInput.classList.remove('border-rose-500');
      messageError.classList.add('hidden');
    });
  }

  function validateForm() {
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameError.classList.remove('hidden');
      nameInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      nameError.classList.add('hidden');
      nameInput.classList.remove('border-rose-500');
    }

    // Validate Email
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailError.classList.remove('hidden');
      emailInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      emailError.classList.add('hidden');
      emailInput.classList.remove('border-rose-500');
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
      messageError.classList.remove('hidden');
      messageInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      messageError.classList.add('hidden');
      messageInput.classList.remove('border-rose-500');
    }

    return isValid;
  }

  function getFormData() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const service = serviceInput && serviceInput.value ? serviceInput.options[serviceInput.selectedIndex].text : 'Solución Tecnológica General';
    const message = messageInput.value.trim();
    return { name, email, service, message };
  }

  // 1. WhatsApp Action
  const btnWhatsapp = document.getElementById('btn-send-whatsapp');
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const data = getFormData();
      const text = `Hola, mi nombre es ${data.name} (${data.email}). Me interesa el servicio de: ${data.service}. Mensaje: ${data.message}`;
      const url = `https://wa.me/522761095688?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('Abriendo WhatsApp', 'Se preparó tu mensaje para enviar a Gamaliel Velazquez Galicia.');
    });
  }

  // 2. SMS Action
  const btnSms = document.getElementById('btn-send-sms');
  if (btnSms) {
    btnSms.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const data = getFormData();
      const body = `SGNIA COMPANY - De: ${data.name} (${data.email}) | Proyecto: ${data.service} | Mensaje: ${data.message}`;
      // Standard SMS uri scheme
      const smsUrl = `sms:+522761095688?body=${encodeURIComponent(body)}`;
      window.location.href = smsUrl;
      showToast('Abriendo Mensajería SMS', 'Se preparó tu mensaje de texto para el número +52 276 109 5688.');
    });
  }

  // 3. Email Action
  const btnEmail = document.getElementById('btn-send-email');
  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const data = getFormData();
      const subject = `Cotización SGNIA COMPANY - ${data.name} (${data.service})`;
      const body = `Hola Gamaliel,\n\nMi nombre es: ${data.name}\nCorreo de contacto: ${data.email}\nServicio de interés: ${data.service}\n\nDetalles del proyecto:\n${data.message}\n\nSaludos cordiales.`;
      const mailtoUrl = `mailto:gmlvega0025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      showToast('Abriendo Correo Electrónico', 'Se preparó el correo con destino a gmlvega0025@gmail.com.');
    });
  }
}

/* -------------------------------------------------------------
 * 5. TOAST NOTIFICATION HANDLER
 * ------------------------------------------------------------- */
function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const toastClose = document.getElementById('toast-close');

  if (!toast) return;

  if (title && toastTitle) toastTitle.textContent = title;
  if (message && toastDesc) toastDesc.textContent = message;

  toast.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

  const hideToast = () => {
    toast.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
  };

  if (toastClose) {
    toastClose.onclick = hideToast;
  }

  setTimeout(hideToast, 5000);
}

/* -------------------------------------------------------------
 * 6. SCROLL TO TOP
 * ------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------
 * 7. ACTIVE NAV LINK TRACKING (SCROLLSPY)
 * ------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-[#17948F]', 'bg-white/10');
            link.classList.remove('text-slate-200');
          } else {
            link.classList.remove('text-[#17948F]', 'bg-white/10');
            link.classList.add('text-slate-200');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}
