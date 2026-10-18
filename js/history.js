/* =============================================
   HISTORY.JS – Child History & Analytics Logic
   ============================================= */

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  const parent = CSA.getCurrentParent();
  renderNavAvatar(parent);
  populateChildSelector(parent);
  setupFilterTabs();
  renderHistory();
});

function renderNavAvatar(parent) {
  const el = document.getElementById('navAvatar');
  if (el) {
    el.style.background = parent.avatar_color;
    el.textContent = parent.full_name.split(' ').map(w => w[0]).join('').substring(0, 2);
  }
}

function populateChildSelector(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const sel = document.getElementById('childSelector');
  sel.innerHTML = children.map(c => `<option value="${c.child_id}">${c.photo_emoji} ${c.name} (Age ${c.age})</option>`).join('');

  // Pre-select from URL param
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('child');
  if (preselect && children.find(c => c.child_id === preselect)) {
    sel.value = preselect;
  }
}

function setupFilterTabs() {
  document.querySelectorAll('#historyTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#historyTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderHistory();
    });
  });
}

function renderHistory() {
  const childId = document.getElementById('childSelector').value;
  if (!childId) return;

  renderAnalytics(childId);
  renderTimeline(childId);
  renderCharts(childId);
}

function renderAnalytics(childId) {
  const a = CSA.getChildAnalytics(childId);
  const child = CSA.getChildById(childId);
  const statusColor = CSA.safetyStatusColor(child?.safety_status);

  document.getElementById('analyticsCards').innerHTML = `
    <div class="h-stat"><div class="h-stat-icon" style="background:${statusColor}15;color:${statusColor}"><i class="fa-solid fa-shield-check"></i></div><div class="h-stat-value">${a.compliance}%</div><div class="h-stat-label">Safe Zone Compliance</div></div>
    <div class="h-stat"><div class="h-stat-icon" style="background:rgba(239,68,68,0.1);color:var(--danger)"><i class="fa-solid fa-bell"></i></div><div class="h-stat-value">${a.alerts}</div><div class="h-stat-label">Alerts Triggered</div></div>
    <div class="h-stat"><div class="h-stat-icon" style="background:rgba(34,197,94,0.1);color:var(--success)"><i class="fa-solid fa-heart"></i></div><div class="h-stat-value">${a.recoveries}</div><div class="h-stat-label">Recoveries</div></div>
    <div class="h-stat"><div class="h-stat-icon" style="background:rgba(6,182,212,0.1);color:var(--info)"><i class="fa-solid fa-qrcode"></i></div><div class="h-stat-value">${a.scans}</div><div class="h-stat-label">QR Scans</div></div>
    <div class="h-stat"><div class="h-stat-icon" style="background:rgba(124,58,237,0.1);color:#7c3aed"><i class="fa-solid fa-eye"></i></div><div class="h-stat-value">${a.sightings}</div><div class="h-stat-label">Sightings</div></div>
    <div class="h-stat"><div class="h-stat-icon" style="background:rgba(245,158,11,0.1);color:var(--warning)"><i class="fa-solid fa-clock"></i></div><div class="h-stat-value">${a.safeHours}h</div><div class="h-stat-label">Safe Hours</div></div>
  `;
}

function renderTimeline(childId) {
  let history = CSA.getChildHistory(childId);
  if (currentFilter !== 'all') {
    history = history.filter(h => h.type === currentFilter);
  }

  document.getElementById('eventCount').textContent = `${history.length} events`;
  const container = document.getElementById('historyTimeline');

  const iconMap = { registration: 'fa-user-plus', tracking: 'fa-map-location-dot', geofence: 'fa-location-crosshairs', alert: 'fa-triangle-exclamation', sighting: 'fa-eye', qr_scan: 'fa-qrcode', recovery: 'fa-heart' };
  const typeMap = { registration: 'volunteer', tracking: 'commander', geofence: 'geofence', alert: 'report', sighting: 'sighting', qr_scan: 'qr-scan', recovery: 'recovery' };

  if (history.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)"><i class="fa-solid fa-clock-rotate-left" style="font-size:1.5rem;margin-bottom:.5rem;display:block"></i>No events found for this filter.</div>';
    return;
  }

  container.innerHTML = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(evt => `
    <div class="recovery-event">
      <div class="recovery-event-dot ${typeMap[evt.type] || 'report'}"><i class="fa-solid ${iconMap[evt.type] || 'fa-circle'}"></i></div>
      <div class="recovery-event-content">
        <div class="recovery-event-time">${CSA.formatTime(evt.timestamp)}</div>
        <div class="recovery-event-title">${evt.details}</div>
        <div class="recovery-event-source"><i class="fa-solid fa-location-dot" style="margin-right:.25rem"></i> ${evt.location}</div>
      </div>
    </div>
  `).join('');
}

function renderCharts(childId) {
  const a = CSA.getChildAnalytics(childId);
  const history = CSA.getChildHistory(childId);

  // Bar chart
  const types = [
    { label: 'Registration', count: a.events, color: '#06b6d4' },
    { label: 'Tracking', count: history.filter(h => h.type === 'tracking').length, color: '#7c3aed' },
    { label: 'GeoFence', count: history.filter(h => h.type === 'geofence').length, color: '#ef4444' },
    { label: 'Alerts', count: a.alerts, color: '#f97316' },
    { label: 'Sightings', count: a.sightings, color: '#f59e0b' },
    { label: 'QR Scans', count: a.scans, color: '#1a56db' },
    { label: 'Recovery', count: a.recoveries, color: '#22c55e' },
  ];
  const maxVal = Math.max(...types.map(t => t.count), 1);

  document.getElementById('eventDistChart').innerHTML = `
    <div class="css-bar-chart">
      ${types.map(t => `
        <div class="bar-item">
          <div class="bar-label">${t.label}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${(t.count / maxVal) * 100}%;background:${t.color}"></div></div>
          <div class="bar-value">${t.count}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Pie chart (CSS-only approximation)
  const safePercent = a.compliance;
  const alertPercent = 100 - safePercent;
  document.getElementById('safetyPieChart').innerHTML = `
    <div style="display:flex;align-items:center;gap:2rem;justify-content:center;padding:1rem">
      <div class="css-pie" style="--safe:${safePercent};--alert:${alertPercent}">
        <div class="css-pie-inner">${safePercent}%</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem;font-size:.8125rem">
        <div style="display:flex;align-items:center;gap:.5rem"><span style="width:12px;height:12px;border-radius:3px;background:#22c55e"></span> Safe (${safePercent}%)</div>
        <div style="display:flex;align-items:center;gap:.5rem"><span style="width:12px;height:12px;border-radius:3px;background:#ef4444"></span> Alert (${alertPercent}%)</div>
      </div>
    </div>
  `;
}
