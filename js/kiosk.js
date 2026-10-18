/* kiosk.js */
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  loadKioskData();
  generateKioskQR();

  // Auto-refresh every 30s
  setInterval(() => {
    loadKioskData();
    document.getElementById('lastRefresh').textContent = 'Last updated: ' + new Date().toLocaleTimeString('en-IN');
  }, 30000);

  document.getElementById('lastRefresh').textContent = 'Last updated: ' + new Date().toLocaleTimeString('en-IN');
});

function initClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('kioskClock');
    const dateEl = document.getElementById('kioskDate');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
  tick();
  setInterval(tick, 1000);
}

function loadKioskData() {
  const stats = CSA.getStats();
  const cases = CSA.getCases().filter(c => ['active','searching','investigating'].includes(c.status));

  const activeEl = document.getElementById('kioskActive');
  const volsEl = document.getElementById('kioskVols');
  const countEl = document.getElementById('kioskAlertCount');

  if (activeEl) activeEl.textContent = stats.active;
  if (volsEl) volsEl.textContent = stats.volunteers;
  if (countEl) countEl.textContent = `${cases.length} Active Alert${cases.length !== 1 ? 's' : ''}`;

  renderKioskAlerts(cases);
}

function renderKioskAlerts(cases) {
  const container = document.getElementById('kioskAlertsList');
  if (!container) return;

  if (cases.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem;color:rgba(255,255,255,.5)">
        <div style="font-size:3rem;margin-bottom:1rem">✅</div>
        <div style="font-size:1.25rem;font-weight:700;color:rgba(255,255,255,.7)">No Active Alerts</div>
        <div>All children have been reunited with their families.</div>
      </div>`;
    return;
  }

  // Duplicate list for infinite scroll
  const makeItem = (c) => `
    <div class="kiosk-alert-item${c.priority?' urgent':''}">
      <div class="kiosk-alert-photo">${c.photo_emoji||'👤'}</div>
      <div class="kiosk-alert-info">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.25rem">
          <div class="kiosk-alert-name">${c.child_name}</div>
          <span class="badge ${CSA.statusClass(c.status)}">${CSA.statusLabel(c.status)}</span>
          ${c.priority?'<span class="badge badge-priority">⚡ PRIORITY</span>':''}
        </div>
        <div class="kiosk-alert-meta">Age ${c.age} · ${c.gender} · Case: ${c.case_id}</div>
        <div class="kiosk-alert-location"><i class="fa-solid fa-location-dot"></i> ${c.last_seen_location}</div>
        <div style="color:rgba(255,255,255,.5);font-size:.75rem;margin-top:.25rem">
          <i class="fa-regular fa-clock"></i> Reported ${CSA.timeAgo(c.reported_at)} · ${c.clothing}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem;flex-shrink:0">
        <a href="case.html?id=${c.case_id}" style="background:rgba(255,255,255,.15);color:white;border:1px solid rgba(255,255,255,.2);padding:.5rem 1rem;border-radius:var(--radius);font-size:.8rem;font-weight:600;text-decoration:none;text-align:center">
          <i class="fa-solid fa-eye"></i> Details
        </a>
        <a href="sighting.html?case=${c.case_id}" style="background:var(--accent);color:white;padding:.5rem 1rem;border-radius:var(--radius);font-size:.8rem;font-weight:600;text-decoration:none;text-align:center">
          <i class="fa-solid fa-location-arrow"></i> Sighting
        </a>
      </div>
    </div>`;

  const html = cases.map(makeItem).join('');
  // Duplicate for seamless loop
  container.innerHTML = html + html;
}

function generateKioskQR() {
  const el = document.getElementById('kioskQR');
  if (!el) return;
  const url = window.location.origin + window.location.pathname.replace('kiosk.html', 'report.html');
  if (typeof QRCode !== 'undefined') {
    new QRCode(el, {
      text: url,
      width: 180,
      height: 180,
      colorDark: '#0f3460',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen();
  }
}
