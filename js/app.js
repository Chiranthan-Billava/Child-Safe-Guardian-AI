/* =============================================
   APP.JS – Global Navigation, Toasts, Utils
   ============================================= */

// ── Toast System ──
const Toast = (function () {
  let container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(title, message = '', type = 'info', duration = 4000) {
    const icons = { success: 'fa-check', error: 'fa-xmark', warning: 'fa-triangle-exclamation', info: 'fa-bell' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${icons[type] || icons.info}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button onclick="this.closest('.toast').remove()" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1rem;margin-left:auto;padding:0 0 0 0.5rem">
        <i class="fa-solid fa-xmark"></i>
      </button>`;
    getContainer().appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
    return toast;
  }

  return { show, success: (t,m) => show(t,m,'success'), error: (t,m) => show(t,m,'error'), warning: (t,m) => show(t,m,'warning'), info: (t,m) => show(t,m,'info') };
})();

// ── Modal System ──
const Modal = (function () {
  function open(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }
  function close(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }
  function closeAll() {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
  return { open, close, closeAll };
})();

// ── Role Management ──
const Role = (function () {
  const roles = [
    { id: 'public',    label: 'Public',    icon: 'fa-user', color: '#64748b' },
    { id: 'parent',    label: 'Parent',    icon: 'fa-house-user', color: '#059669' },
    { id: 'volunteer', label: 'Volunteer', icon: 'fa-hand-holding-heart', color: '#0891b2' },
    { id: 'admin',     label: 'Admin',     icon: 'fa-shield-halved', color: '#7c3aed' },
  ];

  function getCurrent() {
    return localStorage.getItem('csa_role') || 'public';
  }

  function set(roleId) {
    localStorage.setItem('csa_role', roleId);
    updateUI();
  }

  function updateUI() {
    const current = getCurrent();
    const role = roles.find(r => r.id === current);
    if (!role) return;

    const selectors = document.querySelectorAll('.role-selector-text');
    selectors.forEach(s => s.textContent = role.label);

    const dots = document.querySelectorAll('.role-dot');
    dots.forEach(d => d.style.background = role.color);

    // Show/hide role-specific nav items
    document.querySelectorAll('[data-role]').forEach(el => {
      const allowed = el.dataset.role.split(',').map(r => r.trim());
      el.style.display = allowed.includes(current) || allowed.includes('all') ? '' : 'none';
    });
  }

  function isAdmin()     { return getCurrent() === 'admin'; }
  function isVolunteer() { return getCurrent() === 'volunteer'; }

  return { getCurrent, set, updateUI, roles, isAdmin, isVolunteer };
})();

// ── Navigation Builder ──
function buildNav() {
  const navLinks = document.querySelector('.navbar-nav');
  const mobileMenu = document.querySelector('.mobile-menu');

  const isParentLoggedIn = typeof CSA !== 'undefined' && CSA.isLoggedIn();

  const links = [
    { href: 'index.html',     icon: 'fa-house',        label: 'Home',       roles: 'all' },
    { href: 'alerts.html',    icon: 'fa-bell',         label: 'Alerts',     roles: 'all' },
    { href: 'report.html',    icon: 'fa-circle-exclamation', label: 'Report', roles: 'all' },
    { href: 'wristband.html', icon: 'fa-qrcode',       label: 'Wristband',  roles: 'all' },
    { href: 'parent-dashboard.html', icon: 'fa-house-user', label: 'Dashboard', roles: 'parent,admin', authRequired: true },
    { href: 'family-center.html', icon: 'fa-people-roof', label: 'Family', roles: 'parent,admin', authRequired: true },
    { href: 'trusted-guardians.html', icon: 'fa-user-shield', label: 'Guardians', roles: 'parent,admin', authRequired: true },
    { href: 'history.html',   icon: 'fa-clock-rotate-left', label: 'History', roles: 'parent,admin', authRequired: true },
    { href: 'volunteer.html', icon: 'fa-hand-holding-heart', label: 'Volunteer', roles: 'volunteer,admin' },
    { href: 'tracking-center.html', icon: 'fa-map-location-dot', label: 'Tracking', roles: 'volunteer,admin,parent' },
    { href: 'ai-search-commander.html', icon: 'fa-brain', label: 'AI Commander', roles: 'admin' },
    { href: 'notifications.html', icon: 'fa-bell',      label: 'Notifications', roles: 'parent,admin' },
    { href: 'admin.html',     icon: 'fa-shield-halved', label: 'Admin',     roles: 'admin' },
    { href: 'analytics.html', icon: 'fa-chart-bar',    label: 'Analytics',  roles: 'admin,volunteer' },
    { href: 'kiosk.html',     icon: 'fa-display',      label: 'Kiosk',      roles: 'admin' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  function makeLink(link) {
    // Hide auth-required links when not logged in
    if (link.authRequired && !isParentLoggedIn) return '';
    const isActive = current === link.href || current === link.href.replace('.html','');
    return `<a href="${link.href}" class="nav-link${isActive ? ' active' : ''}" data-role="${link.roles}">
      <i class="fa-solid ${link.icon}"></i> ${link.label}
    </a>`;
  }

  // Build auth button
  const authBtn = isParentLoggedIn
    ? ''
    : `<a href="login.html" class="nav-link" style="color:var(--primary);font-weight:700"><i class="fa-solid fa-right-to-bracket"></i> Login</a>`;

  if (navLinks) navLinks.innerHTML = links.map(makeLink).join('') + authBtn;
  if (mobileMenu) mobileMenu.innerHTML = links.map(makeLink).join('') + authBtn;
}


// ── Hamburger Toggle ──
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const bars = btn.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
}

// ── Role Selector ──
function initRoleSelector() {
  const selectors = document.querySelectorAll('.role-selector');
  selectors.forEach(sel => {
    sel.addEventListener('click', () => {
      showRoleModal();
    });
  });
}

function showRoleModal() {
  const current = Role.getCurrent();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop open';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div class="modal" style="max-width:420px">
      <div class="modal-header">
        <h3 class="modal-title"><i class="fa-solid fa-user-tag" style="color:var(--primary);margin-right:.5rem"></i>Switch Role</h3>
        <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom:1rem;color:var(--text-3);font-size:.875rem">Select your role to access relevant features:</p>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          ${Role.roles.map(r => `
            <button onclick="Role.set('${r.id}');this.closest('.modal-backdrop').remove();location.reload()" 
              style="display:flex;align-items:center;gap:1rem;padding:.875rem 1.125rem;border:2px solid ${current===r.id?'var(--primary)':'var(--border)'};border-radius:var(--radius);background:${current===r.id?'var(--primary-ghost)':'var(--surface)'};cursor:pointer;transition:all .2s;text-align:left">
              <span style="width:36px;height:36px;border-radius:50%;background:${r.color}20;color:${r.color};display:flex;align-items:center;justify-content:center"><i class="fa-solid ${r.icon}"></i></span>
              <span style="font-weight:600;color:var(--text)">${r.label}</span>
              ${current===r.id?'<span style="margin-left:auto;color:var(--primary);font-size:.75rem;font-weight:700">CURRENT</span>':''}
            </button>`).join('')}
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ── Counter Animation ──
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g,''));
        if (target > 0) animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

// ── QR Code Generation ──
function generateQR(containerId, url, size = 160) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    new QRCode(container, {
      text: url,
      width: size,
      height: size,
      colorDark: '#0f3460',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    container.innerHTML = `<div style="width:${size}px;height:${size}px;background:linear-gradient(135deg,#e2e8f0,#cbd5e1);display:flex;align-items:center;justify-content:center;border-radius:8px;color:#64748b;font-size:.75rem;text-align:center;padding:1rem">QR Code<br><small>${url}</small></div>`;
  }
}

// ── Copy to Clipboard ──
function copyToClipboard(text, msg = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    Toast.success('Copied!', msg);
  }).catch(() => {
    Toast.error('Copy failed', 'Please copy manually.');
  });
}

// ── Download QR ──
function downloadQR(containerId, filename = 'qrcode') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const canvas = container.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
    Toast.success('Downloaded!', 'QR Code saved as PNG.');
  }
}

// ── Photo placeholder colors ──
function getAvatarColor(name) {
  const colors = ['#1a56db','#7c3aed','#0891b2','#059669','#dc2626','#d97706','#0f766e','#7e22ce','#15803d','#b45309'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getCasePageUrl(caseId) {
  return window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + `case.html?id=${caseId}`;
}

// ── Share Alert ──
function shareAlert(caseId, childName) {
  const url = getCasePageUrl(caseId);
  if (navigator.share) {
    navigator.share({
      title: `🚨 Missing Child Alert: ${childName}`,
      text: `URGENT: ${childName} is missing. Case: ${caseId}. Please help locate this child.`,
      url: url,
    }).catch(() => {});
  } else {
    copyToClipboard(url, 'Alert link copied! Share it to help find the child.');
  }
}

// ── Mock Notification Sender ──
function sendMockNotification(type, details) {
  setTimeout(() => {
    if (type === 'sms') Toast.success('SMS Sent ✓', `Alert sent to ${details.contact}`);
    if (type === 'email') Toast.success('Email Sent ✓', `Case details sent to registered email`);
    if (type === 'broadcast') Toast.info('Broadcast Active', `Alert broadcasting on all channels`);
  }, 800);
}

// ── Page Loader ──
function hideLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
}

// ── Modal click-outside close ──
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

// ── Global Init ──
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initHamburger();
  initRoleSelector();
  Role.updateUI();
  initCounters();
  hideLoader();
});
