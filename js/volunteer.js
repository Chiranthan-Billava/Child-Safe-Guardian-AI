/* volunteer.js */
let currentVolunteer = null;

document.addEventListener('DOMContentLoaded', () => {
  // Load saved volunteer
  const savedId = localStorage.getItem('csa_current_volunteer');
  if (savedId) {
    currentVolunteer = CSA.getVolunteers().find(v => v.volunteer_id === savedId);
  }
  if (!currentVolunteer) currentVolunteer = CSA.getVolunteers()[0];

  updateVolunteerHeader();
  loadStats();
  renderAlerts();
  renderSightings();
  renderZones();
  renderNotifications();
  renderVolunteerTeam();

  // Auto-refresh every 30s
  setInterval(() => { loadStats(); renderAlerts(); renderSightings(); }, 30000);
});

function updateVolunteerHeader() {
  if (!currentVolunteer) return;
  const nameEl = document.getElementById('volunteerName');
  const zoneEl = document.getElementById('volunteerZone');
  if (nameEl) nameEl.textContent = currentVolunteer.name;
  if (zoneEl) zoneEl.textContent = currentVolunteer.assigned_area;
}

function loadStats() {
  const stats = CSA.getStats();
  setText('statActive2', stats.active);
  setText('statSightings2', stats.sightings);
  setText('statFound2', stats.reunited);
  setText('statVols2', stats.volunteers);
  const countEl = document.getElementById('sidebarAlertCount');
  if (countEl) countEl.textContent = stats.active;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderAlerts() {
  const cases = CSA.getCases().filter(c => ['active','searching','investigating'].includes(c.status));
  const el = document.getElementById('volAlertsList');
  if (!el) return;

  if (cases.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-check-circle"></i></div><h3>No Active Alerts</h3><p>All children have been reunited.</p></div>';
    return;
  }

  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:.875rem">
    ${cases.map(c => `
      <div class="card" style="box-shadow:none;border-color:${c.priority?'var(--accent)':'var(--border)'}">
        <div class="card-body" style="padding:1rem;display:flex;gap:1rem;align-items:center">
          <div style="width:52px;height:52px;border-radius:var(--radius);background:${getAvatarColor(c.child_name)}18;display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0">${c.photo_emoji||'👤'}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem">
              <span style="font-weight:700;font-size:.9375rem">${c.child_name}</span>
              <span class="badge ${CSA.statusClass(c.status)}">${CSA.statusLabel(c.status)}</span>
              ${c.priority?'<span class="badge badge-priority">⚡ Priority</span>':''}
            </div>
            <div style="font-size:.8rem;color:var(--text-3)">${c.case_id} · Age ${c.age} · ${c.gender}</div>
            <div style="font-size:.8rem;color:var(--text-2);margin-top:.25rem"><i class="fa-solid fa-location-dot" style="color:var(--accent)"></i> ${c.last_seen_location}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:.375rem;flex-shrink:0">
            <a href="case.html?id=${c.case_id}" class="btn btn-primary btn-sm"><i class="fa-solid fa-eye"></i> View</a>
            <a href="sighting.html?case=${c.case_id}" class="btn btn-outline btn-sm"><i class="fa-solid fa-location-arrow"></i> Sighting</a>
          </div>
        </div>
      </div>`).join('')}
  </div>`;
}

function renderSightings() {
  const sightings = CSA.getSightings().slice(0, 10);
  const el = document.getElementById('sightingsList');
  if (!el) return;
  if (sightings.length === 0) { el.innerHTML = '<div class="empty-state"><p>No sightings yet.</p></div>'; return; }
  el.innerHTML = sightings.map(s => {
    const c = CSA.getCaseById(s.case_id);
    return `
      <div class="sighting-item">
        <div class="sighting-icon"><i class="fa-solid fa-eye"></i></div>
        <div class="sighting-info">
          <div class="sighting-title">${c ? c.child_name : s.case_id} — ${s.location}</div>
          <div style="font-size:.8rem;color:var(--text-2);margin:.2rem 0">${s.description}</div>
          <div class="sighting-meta">
            <span><i class="fa-regular fa-clock"></i> ${CSA.timeAgo(s.timestamp)}</span>
            <span><i class="fa-solid fa-id-card"></i> ${s.case_id}</span>
            ${s.verified?'<span style="color:var(--success);font-weight:600"><i class="fa-solid fa-check-circle"></i> Verified</span>':'<span style="color:var(--warning);font-weight:600">Pending</span>'}
          </div>
        </div>
        <a href="case.html?id=${s.case_id}" class="btn btn-ghost btn-sm"><i class="fa-solid fa-arrow-right"></i></a>
      </div>`;
  }).join('');
}

function renderZones() {
  const vols = CSA.getVolunteers().filter(v => v.status === 'active');
  const zones = [...new Set(vols.map(v => v.assigned_area))];
  const el = document.getElementById('zonesGrid');
  if (!el) return;
  el.innerHTML = zones.map(zone => {
    const vol = vols.find(v => v.assigned_area === zone);
    return `
      <div class="card" style="box-shadow:none">
        <div class="card-body" style="padding:1rem;text-align:center">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--primary-ghost);color:var(--primary);display:flex;align-items:center;justify-content:center;margin:0 auto .75rem"><i class="fa-solid fa-map-pin"></i></div>
          <div style="font-weight:700;font-size:.9rem;margin-bottom:.25rem">${zone}</div>
          <div style="font-size:.75rem;color:var(--text-3)">Volunteer: ${vol?vol.name:'Unassigned'}</div>
          <span class="badge badge-volunteer" style="margin-top:.5rem">Active</span>
        </div>
      </div>`;
  }).join('');
}

const NOTIFS = [
  { type: 'notif-alert', icon: 'fa-bell', color: 'var(--danger)', title: '🚨 New Alert: Sneha Krishnamurthy (Age 4)', time: '2 min ago' },
  { type: 'notif-update', icon: 'fa-circle-info', color: 'var(--primary)', title: 'Sighting verified for CSA-2026-001', time: '8 min ago' },
  { type: 'notif-found', icon: 'fa-check-circle', color: 'var(--success)', title: '✅ Case CSA-2025-098 – Child Found!', time: '25 min ago' },
  { type: 'notif-alert', icon: 'fa-triangle-exclamation', color: 'var(--accent)', title: '⚡ Priority case updated: Aryan Sharma', time: '35 min ago' },
  { type: 'notif-info', icon: 'fa-users', color: 'var(--info)', title: '2 new volunteers joined your zone', time: '1 hour ago' },
];

function renderNotifications() {
  const el = document.getElementById('notifsList');
  if (!el) return;
  el.innerHTML = NOTIFS.map(n => `
    <div class="notif-item ${n.type}">
      <i class="fa-solid ${n.icon}" style="color:${n.color}"></i>
      <div class="notif-item-content">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-time"><i class="fa-regular fa-clock"></i> ${n.time}</div>
      </div>
    </div>`).join('');
}

function clearNotifs() {
  document.getElementById('notifCount').textContent = '0';
  document.querySelectorAll('.notif-badge').forEach(b => b.textContent = '0');
  Toast.success('Cleared', 'All notifications marked as read.');
}

function renderVolunteerTeam() {
  const vols = CSA.getVolunteers();
  const el = document.getElementById('volTeamGrid');
  if (!el) return;
  el.innerHTML = vols.map(v => `
    <div class="volunteer-card">
      <div class="volunteer-avatar" style="background:${v.color}">${v.name.charAt(0)}</div>
      <div class="volunteer-info">
        <div class="volunteer-name">${v.name}</div>
        <div class="volunteer-area"><i class="fa-solid fa-map-pin"></i> ${v.assigned_area}</div>
        <div style="margin-top:.25rem"><span class="badge ${v.status==='active'?'badge-found':'badge-searching'}">${v.status}</span></div>
      </div>
    </div>`).join('');
}

function showSection(name) {
  document.querySelectorAll('[id^="section-"]').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
  document.getElementById(`section-${name}`).style.display = 'block';
  event.currentTarget.classList.add('active');
}

function selectVolunteer() {
  const vols = CSA.getVolunteers();
  const list = document.getElementById('volSelectorList');
  if (!list) return;
  list.innerHTML = vols.map(v => `
    <button onclick="setVolunteer('${v.volunteer_id}')" style="display:flex;align-items:center;gap:.875rem;padding:.875rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);cursor:pointer;transition:all .2s;text-align:left;width:100%">
      <div style="width:40px;height:40px;border-radius:50%;background:${v.color};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">${v.name.charAt(0)}</div>
      <div style="flex:1"><div style="font-weight:700;font-size:.9rem">${v.name}</div><div style="font-size:.75rem;color:var(--text-3)">${v.assigned_area}</div></div>
      <span class="badge ${v.status==='active'?'badge-found':'badge-searching'}">${v.status}</span>
    </button>`).join('');
  Modal.open('volSelectorModal');
}

function setVolunteer(id) {
  localStorage.setItem('csa_current_volunteer', id);
  currentVolunteer = CSA.getVolunteers().find(v => v.volunteer_id === id);
  updateVolunteerHeader();
  Modal.close('volSelectorModal');
  Toast.success('Profile Switched', `Now viewing as ${currentVolunteer.name}`);
}
