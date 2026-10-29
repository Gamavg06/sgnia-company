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
  initDynamicProjects();
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
 * 5. SINCRONIZACIÓN Y FILTRO DE PROYECTOS (ESTÁTICOS / DINÁMICOS)
 * ------------------------------------------------------------- */
function initDynamicProjects() {
  const container = document.getElementById('proyectos-container');
  if (!container) {
    initProjectFilters();
    return;
  }

  // 1. Intentar leer desde almacenamiento local (guardado por el panel admin)
  const stored = localStorage.getItem('sgnia_local_projects');
  if (stored) {
    try {
      const projects = JSON.parse(stored);
      if (Array.isArray(projects) && projects.length > 0) {
        renderProjectsToDOM(container, projects);
        initProjectFilters();
        return;
      }
    } catch (e) {
      console.warn('Error leyendo proyectos locales:', e);
    }
  }

  // 2. Si no hay proyectos locales, usar los estáticos originales
  initProjectFilters();
}

function renderProjectsToDOM(container, projects) {
  if (!projects || !projects.length) return;

  // Actualizar contador del filtro "Todos"
  const filterAllBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (filterAllBtn) {
    filterAllBtn.textContent = `Todos (${projects.length})`;
  }

  // Encontrar el proyecto destacado (o el primero de la lista)
  const featuredIndex = projects.findIndex(p => p.destacado == 1);
  const featured = featuredIndex !== -1 ? projects[featuredIndex] : projects[0];
  const others = projects.filter((_, idx) => idx !== (featuredIndex !== -1 ? featuredIndex : 0));

  let html = `
    <!-- PROYECTO PRINCIPAL DESTACADO -->
    <article class="project-item editorial-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0" data-category="${escapeHtml(featured.categoria || 'web')}">
      <div class="lg:col-span-7 bg-slate-900 overflow-hidden relative min-h-[260px] sm:min-h-[340px]">
        <img src="${escapeHtml(featured.imagen_url || 'assets/hotelbookingsystem.png')}" alt="${escapeHtml(featured.titulo)}" class="w-full h-full object-cover object-top" loading="lazy">
      </div>
      <div class="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-brandTeal-dark">${escapeHtml(featured.subtitulo || 'Proyecto Destacado')}</span>
            ${featured.en_mantenimiento == 1 
              ? '<span class="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Demo en Mantenimiento</span>' 
              : '<span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">En Producción</span>'}
          </div>
          <h3 class="font-heading text-2xl font-bold text-brandNavy">${escapeHtml(featured.titulo)}</h3>
          <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(featured.descripcion)}</p>
          <div class="pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
            <span class="text-brandNavy">Tecnologías:</span> ${escapeHtml(featured.tecnologias)}
          </div>
        </div>
        
        <div class="flex items-center gap-3 pt-4">
          ${featured.demo_url ? `
          <a href="${escapeHtml(featured.demo_url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 py-2.5 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
            <span>Demo en Vivo</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>` : ''}
          ${featured.github_url ? `
          <a href="${escapeHtml(featured.github_url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary ${!featured.demo_url ? 'w-full justify-center' : ''} py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5" title="Repositorio de código">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>Código</span>
          </a>` : ''}
        </div>
      </div>
    </article>
  `;

  if (others.length > 0) {
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-8">';
    others.forEach(p => {
      html += `
        <article class="project-item editorial-card rounded-2xl overflow-hidden flex flex-col justify-between" data-category="${escapeHtml(p.categoria || 'web')}">
          <div>
            <div class="h-52 bg-slate-900 overflow-hidden border-b border-slate-200">
              <img src="${escapeHtml(p.imagen_url || 'assets/hotelbookingsystem.png')}" alt="${escapeHtml(p.titulo)}" class="w-full h-full object-cover object-top" loading="lazy">
            </div>
            <div class="p-6 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-brandTeal-dark">${escapeHtml(p.subtitulo || 'Proyecto')}</span>
                ${p.en_mantenimiento == 1 
                  ? '<span class="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Demo en Mantenimiento</span>' 
                  : ''}
              </div>
              <h3 class="font-heading text-xl font-bold text-brandNavy">${escapeHtml(p.titulo)}</h3>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">${escapeHtml(p.descripcion)}</p>
              <div class="pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
                <span class="text-brandNavy">Tecnologías:</span> ${escapeHtml(p.tecnologias)}
              </div>
            </div>
          </div>
          <div class="p-6 pt-0 flex items-center gap-3">
            ${p.demo_url ? `
            <a href="${escapeHtml(p.demo_url)}" target="_blank" rel="noopener noreferrer" class="btn-primary flex-1 py-2.5 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
              <span>Demo en Vivo</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>` : ''}
            ${p.github_url ? `
            <a href="${escapeHtml(p.github_url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary ${!p.demo_url ? 'w-full justify-center' : ''} py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5" title="Repositorio">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <span>${!p.demo_url ? 'Explorar Repositorio en GitHub' : 'Código'}</span>
            </a>` : ''}
          </div>
        </article>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.onclick = () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      const currentCards = document.querySelectorAll('.project-item');
      currentCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    };
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
