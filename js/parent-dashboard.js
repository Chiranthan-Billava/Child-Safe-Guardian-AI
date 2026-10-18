/* =============================================
   PARENT-DASHBOARD.JS – Dashboard Controller
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  const parent = CSA.getCurrentParent();
  renderWelcome(parent);
  renderStats(parent);
  renderChildren(parent);
  renderSOSPanel(parent);
  renderActiveSOSCases();
  renderRecentNotifications(parent);
  renderNavAvatar(parent);
  renderPanicChildList(parent);
});

function renderWelcome(parent) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('welcomeTitle').textContent = `${greeting}, ${parent.full_name.split(' ')[0]} 👋`;
  document.getElementById('welcomeSub').textContent = `Your family's safety overview · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function renderStats(parent) {
  const stats = CSA.getParentStats(parent.parent_id);
  document.getElementById('statChildren').textContent = stats.totalChildren;
  document.getElementById('statWristbands').textContent = stats.activeWristbands;
  document.getElementById('statAlerts').textContent = stats.currentAlerts;
  document.getElementById('statSafeZones').textContent = stats.safeZones;
  document.getElementById('statNotifs').textContent = stats.unread;
  document.getElementById('statRecoveries').textContent = stats.recoveries;
  document.getElementById('navNotifBadge').textContent = stats.unread;
}

function renderChildren(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const grid = document.getElementById('childrenGrid');
  if (children.length === 0) return;

  grid.innerHTML = children.map(child => {
    const wb = child.wristband_id ? CSA.getWristbandById(child.wristband_id) : null;
    const statusLabel = CSA.safetyStatusLabel(child.safety_status);
    const statusColor = CSA.safetyStatusColor(child.safety_status);
    const zones = CSA.getSafeZonesForChild(child.child_id);
    const lastEvent = CSA.getChildHistory(child.child_id).slice(-1)[0];

    const safetyScore = CSA.calculateSafetyScore(child.child_id);
    const circumference = 2 * Math.PI * 28;
    const dashoffset = circumference - (safetyScore.score / 100) * circumference;

    return `
      <div class="child-profile-card">
        <div class="child-card-header">
          <div class="child-card-avatar" style="background:${statusColor}15;border-color:${statusColor}">${child.photo_emoji}</div>
          <div class="child-card-info">
            <div class="child-card-name">${child.name}</div>
            <div class="child-card-meta">Age ${child.age} · ${child.gender} · ${child.blood_group}</div>
          </div>
          <div class="safety-score-ring safety-score-ring-sm">
            <svg viewBox="0 0 64 64">
              <circle class="ring-bg" cx="32" cy="32" r="28"></circle>
              <circle class="ring-fg" cx="32" cy="32" r="28" stroke="${safetyScore.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"></circle>
            </svg>
            <div class="score-text">${safetyScore.score}<small>${safetyScore.label}</small></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem">
          <div class="safety-status-badge" style="background:${statusColor}18;color:${statusColor};border-color:${statusColor}40">
            <span class="safety-dot" style="background:${statusColor}"></span>
            ${statusLabel}
          </div>
        </div>
        <div class="child-card-details">
          <div class="child-detail-row">
            <span class="child-detail-label"><i class="fa-solid fa-qrcode"></i> Wristband</span>
            <span class="child-detail-value">${child.wristband_id || 'Not assigned'}</span>
          </div>
          <div class="child-detail-row">
            <span class="child-detail-label"><i class="fa-solid fa-shield-check"></i> Safe Zones</span>
            <span class="child-detail-value">${zones.length} active</span>
          </div>
          <div class="child-detail-row">
            <span class="child-detail-label"><i class="fa-solid fa-clock"></i> Last Update</span>
            <span class="child-detail-value">${lastEvent ? CSA.timeAgo(lastEvent.timestamp) : '—'}</span>
          </div>
          ${child.allergies && child.allergies !== 'None' ? `<div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-syringe"></i> Allergies</span><span class="child-detail-value" style="color:var(--danger)">${child.allergies}</span></div>` : ''}
        </div>
        <div class="child-card-actions">
          <a href="tracking-center.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-map-location-dot"></i> Track</a>
          ${child.wristband_id ? `<a href="scan-result.html?wbid=${child.wristband_id}" class="btn btn-outline btn-sm"><i class="fa-solid fa-qrcode"></i> QR</a>` : `<a href="wristband.html" class="btn btn-outline btn-sm"><i class="fa-solid fa-plus"></i> QR</a>`}
          <button class="btn btn-danger btn-sm" onclick="triggerChildEmergency('${child.child_id}')"><i class="fa-solid fa-bell"></i> Alert</button>
          <a href="history.html?child=${child.child_id}" class="btn btn-ghost btn-sm"><i class="fa-solid fa-clock-rotate-left"></i> History</a>
        </div>
      </div>`;
  }).join('');
}

function renderRecentNotifications(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const wbIds = children.map(c => c.wristband_id).filter(Boolean);
  const notifs = CSA.getNotifications().filter(n => wbIds.includes(n.wristband_id)).slice(0, 5);
  const container = document.getElementById('recentNotifications');

  if (notifs.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)"><i class="fa-solid fa-bell-slash" style="font-size:1.5rem;margin-bottom:.5rem;display:block"></i>No notifications yet</div>';
    return;
  }

  const iconMap = { geofence: 'fa-location-crosshairs', sighting: 'fa-eye', 'qr-scan': 'fa-qrcode', commander: 'fa-brain', recovery: 'fa-heart', tamper: 'fa-shield-halved', sos: 'fa-circle-exclamation' };
  const colorMap = { geofence: 'var(--danger)', sighting: 'var(--warning)', 'qr-scan': 'var(--primary)', commander: '#7c3aed', recovery: 'var(--success)', tamper: '#f97316', sos: '#dc2626' };

  container.innerHTML = notifs.map(n => `
    <div class="dash-notif-item ${n.read ? 'read' : ''}">
      <div class="dash-notif-icon" style="background:${colorMap[n.type]}15;color:${colorMap[n.type]}"><i class="fa-solid ${iconMap[n.type] || 'fa-bell'}"></i></div>
      <div class="dash-notif-content">
        <div class="dash-notif-title">${n.title}</div>
        <div class="dash-notif-msg">${n.message}</div>
      </div>
      <div class="dash-notif-time">${CSA.timeAgo(n.timestamp)}</div>
    </div>
  `).join('');
}

function renderNavAvatar(parent) {
  const el = document.getElementById('navAvatar');
  if (el) {
    const initials = parent.full_name.split(' ').map(w => w[0]).join('').substring(0, 2);
    el.style.background = parent.avatar_color;
    el.textContent = initials;
    el.title = parent.full_name;
  }
}

function renderPanicChildList(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const container = document.getElementById('panicChildList');
  container.innerHTML = children.map(c => `
    <button class="panic-child-btn" onclick="triggerChildEmergency('${c.child_id}')">
      <span style="font-size:1.5rem">${c.photo_emoji}</span>
      <div><strong>${c.name}</strong><div style="font-size:.75rem;color:var(--text-3)">Age ${c.age}</div></div>
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i>
    </button>
  `).join('');
}

function openAddChildModal() { document.getElementById('addChildModal').classList.add('open'); }
function openPanicModal() { document.getElementById('panicModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function handleAddChild(e) {
  e.preventDefault();
  const parent = CSA.getCurrentParent();
  const child = CSA.addChild({
    parent_id: parent.parent_id,
    name: document.getElementById('acName').value,
    age: document.getElementById('acAge').value,
    gender: document.getElementById('acGender').value,
    blood_group: document.getElementById('acBlood').value,
    school_name: document.getElementById('acSchool').value,
    allergies: document.getElementById('acAllergies').value,
    medical_conditions: document.getElementById('acMedical').value,
    emergency_contacts: [{ name: parent.emergency_name, phone: parent.emergency_phone, relation: parent.emergency_relation }],
  });

  CSA.addChildHistoryEvent(child.child_id, { type: 'registration', location: 'Parent Dashboard', details: `Child profile created by ${parent.full_name}` });
  Toast.success('Child Added!', `${child.name} has been registered.`);
  closeModal('addChildModal');
  document.getElementById('addChildForm').reset();
  renderStats(parent);
  renderChildren(parent);
  renderPanicChildList(parent);
}

function triggerChildEmergency(childId) {
  const child = CSA.getChildById(childId);
  if (!child) return;
  if (!confirm(`⚠️ TRIGGER EMERGENCY ALERT for ${child.name}?\n\nThis will:\n• Create an emergency case\n• Alert all volunteers\n• Activate AI Search Commander\n• Start recovery timeline`)) return;

  const newCase = CSA.triggerEmergency(childId);
  closeModal('panicModal');
  Toast.error('Emergency Alert!', `Case ${newCase.case_id} created for ${child.name}. All units notified.`);

  const parent = CSA.getCurrentParent();
  renderStats(parent);
  renderChildren(parent);
}

function handleLogout() {
  CSA.logoutParent();
  Toast.info('Logged Out', 'You have been signed out.');
  setTimeout(() => { window.location.href = 'login.html'; }, 500);
}

/* ── SOS Emergency Panel ── */
function renderSOSPanel(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const grid = document.getElementById('sosButtonGrid');
  if (!grid) return;

  grid.innerHTML = children.map(child => {
    const isSOSActive = child.safety_status === 'sos_active';
    return `
      <div class="sos-child-card">
        <div class="sos-child-emoji">${child.photo_emoji}</div>
        <div class="sos-child-name">${child.name}</div>
        <div class="sos-child-status">Age ${child.age} · ${CSA.safetyStatusLabel(child.safety_status)}</div>
        <button class="sos-trigger-btn ${isSOSActive ? 'active-sos' : ''}" 
                onclick="${isSOSActive ? '' : `triggerSOSForChild('${child.child_id}')`}">
          <i class="fa-solid fa-circle-exclamation"></i>
          ${isSOSActive ? 'SOS ACTIVE' : 'TRIGGER SOS'}
        </button>
      </div>
    `;
  }).join('');
}

function triggerSOSForChild(childId) {
  const child = CSA.getChildById(childId);
  if (!child) return;
  if (!confirm(`🆘 TRIGGER SOS EMERGENCY for ${child.name}?\n\nThis will:\n• Create a CRITICAL priority case\n• Alert ALL volunteers and guardians\n• Broadcast via SMS, Push, Email, Loudspeaker\n• Start SOS response timer`)) return;

  const newCase = CSA.triggerSOSEmergency(childId);
  Toast.error('🆘 SOS EMERGENCY!', `Case ${newCase.case_id} created. All units alerted for ${child.name}.`);

  const parent = CSA.getCurrentParent();
  renderStats(parent);
  renderChildren(parent);
  renderSOSPanel(parent);
  renderActiveSOSCases();
  renderRecentNotifications(parent);
}

/* ── Active SOS Dashboard ── */
function renderActiveSOSCases() {
  const sosCases = CSA.getActiveSOSCases();
  const section = document.getElementById('activeSOSSection');
  const grid = document.getElementById('activeSOSGrid');
  if (!section || !grid) return;

  if (sosCases.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  grid.innerHTML = sosCases.map(c => {
    const elapsed = c.sos_triggered_at ? Math.floor((Date.now() - new Date(c.sos_triggered_at).getTime()) / 60000) : 0;
    return `
      <div class="sos-case-card">
        <div class="sos-case-header">
          <div class="sos-label"><i class="fa-solid fa-circle-exclamation"></i> SOS EMERGENCY</div>
          <div class="sos-time">${c.case_id}</div>
        </div>
        <div class="sos-case-body">
          <div class="sos-case-child">
            <div class="sos-case-child-emoji">${c.photo_emoji || '👤'}</div>
            <div>
              <div class="sos-case-child-name">${c.child_name}</div>
              <div class="sos-case-child-meta">Age ${c.age} · ${c.gender}</div>
            </div>
          </div>
          <div class="sos-case-metrics">
            <div class="sos-metric">
              <div class="sos-metric-value">${elapsed}m</div>
              <div class="sos-metric-label">Response Time</div>
            </div>
            <div class="sos-metric">
              <div class="sos-metric-value" style="color:var(--accent)">${c.assigned_volunteer || 'Pending'}</div>
              <div class="sos-metric-label">Assigned Volunteer</div>
            </div>
          </div>
          <div class="sos-case-actions">
            <a href="case.html?id=${c.case_id}" class="btn btn-primary btn-sm" style="flex:1"><i class="fa-solid fa-eye"></i> View Case</a>
            <button class="btn btn-ghost btn-sm" style="flex:1;border-color:var(--success);color:var(--success)" onclick="resolveSOSFromDash('${c.case_id}')"><i class="fa-solid fa-check"></i> Resolve</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resolveSOSFromDash(caseId) {
  if (!confirm('Mark this SOS emergency as resolved? The child has been found safe.')) return;
  CSA.resolveSOSCase(caseId);
  Toast.success('SOS Resolved!', 'Emergency has been resolved. Child is safe.');
  const parent = CSA.getCurrentParent();
  renderStats(parent);
  renderChildren(parent);
  renderSOSPanel(parent);
  renderActiveSOSCases();
  renderRecentNotifications(parent);
}
