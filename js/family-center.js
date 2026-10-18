/* =============================================
   FAMILY-CENTER.JS – Family Safety Center Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  const parent = CSA.getCurrentParent();
  renderNavAvatar(parent);
  renderParentProfile(parent);
  renderFamilyChildren(parent);
  renderSafeZones(parent);
  renderEmergencyContacts(parent);
  renderFamilyStats(parent);
  renderSafetyScores(parent);
  populateSZChildSelect(parent);
});

function renderNavAvatar(parent) {
  const el = document.getElementById('navAvatar');
  if (el) {
    el.style.background = parent.avatar_color;
    el.textContent = parent.full_name.split(' ').map(w => w[0]).join('').substring(0, 2);
    el.title = parent.full_name;
  }
}

function renderParentProfile(parent) {
  document.getElementById('parentProfile').innerHTML = `
    <div class="fp-header">
      <div class="fp-avatar" style="background:${parent.avatar_color}">${parent.full_name.split(' ').map(w => w[0]).join('').substring(0, 2)}</div>
      <div class="fp-info">
        <div class="fp-name">${parent.full_name}</div>
        <div class="fp-meta"><i class="fa-solid fa-envelope"></i> ${parent.email}</div>
        <div class="fp-meta"><i class="fa-solid fa-phone"></i> ${parent.mobile}</div>
        <div class="fp-meta"><i class="fa-solid fa-location-dot"></i> ${parent.address || '—'}</div>
      </div>
      <div class="fp-badge"><i class="fa-solid fa-check-circle"></i> Verified Parent</div>
    </div>
  `;
}

function renderFamilyChildren(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const grid = document.getElementById('familyChildrenGrid');

  grid.innerHTML = children.map(child => {
    const statusColor = CSA.safetyStatusColor(child.safety_status);
    const statusLabel = CSA.safetyStatusLabel(child.safety_status);
    const analytics = CSA.getChildAnalytics(child.child_id);

    return `
      <div class="child-profile-card expanded">
        <div class="child-card-header">
          <div class="child-card-avatar" style="background:${statusColor}15;border-color:${statusColor}">${child.photo_emoji}</div>
          <div class="child-card-info">
            <div class="child-card-name">${child.name}</div>
            <div class="child-card-meta">Age ${child.age} · ${child.gender} · ${child.blood_group}</div>
          </div>
          <div class="safety-status-badge" style="background:${statusColor}18;color:${statusColor};border-color:${statusColor}40"><span class="safety-dot" style="background:${statusColor}"></span>${statusLabel}</div>
        </div>
        <div class="child-card-details">
          <div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-school"></i> School</span><span class="child-detail-value">${child.school_name}</span></div>
          <div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-syringe"></i> Allergies</span><span class="child-detail-value">${child.allergies}</span></div>
          <div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-notes-medical"></i> Medical</span><span class="child-detail-value">${child.medical_conditions}</span></div>
          <div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-qrcode"></i> Wristband</span><span class="child-detail-value">${child.wristband_id || 'Not assigned'}</span></div>
          <div class="child-detail-row"><span class="child-detail-label"><i class="fa-solid fa-chart-simple"></i> Events</span><span class="child-detail-value">${analytics.total} events · ${analytics.compliance}% compliance</span></div>
        </div>
        <div class="child-card-actions">
          <a href="history.html?child=${child.child_id}" class="btn btn-primary btn-sm"><i class="fa-solid fa-clock-rotate-left"></i> Full History</a>
          <a href="tracking-center.html" class="btn btn-outline btn-sm"><i class="fa-solid fa-map-location-dot"></i> Track</a>
        </div>
      </div>`;
  }).join('');
}

function renderSafeZones(parent) {
  const zones = CSA.getSafeZonesForParent(parent.parent_id);
  const container = document.getElementById('safeZonesList');
  const typeIcons = { school: '🏫', festival: '🎪', mall: '🏬', playground: '🏕️', home: '🏠', custom: '📍' };

  if (zones.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)">No safe zones configured. Add your first safe zone above.</div>';
    return;
  }

  container.innerHTML = zones.map(z => {
    const child = CSA.getChildById(z.child_id);
    return `
      <div class="safe-zone-card ${z.active ? 'active' : 'inactive'}">
        <div class="sz-header">
          <span class="sz-icon">${typeIcons[z.type] || '📍'}</span>
          <div class="sz-info"><div class="sz-name">${z.name}</div><div class="sz-meta">${child ? child.name : '—'} · ${z.radius}m radius</div></div>
          <span class="sz-status ${z.active ? 'active' : ''}">${z.active ? 'ACTIVE' : 'OFF'}</span>
        </div>
        <div class="sz-actions">
          <button class="btn btn-ghost btn-sm" onclick="toggleSafeZone('${z.zone_id}', ${!z.active})">${z.active ? '<i class="fa-solid fa-pause"></i> Disable' : '<i class="fa-solid fa-play"></i> Enable'}</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteSafeZone('${z.zone_id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
  }).join('');
}

function renderEmergencyContacts(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const contacts = new Map();
  // Parent's own emergency contact
  contacts.set(parent.emergency_phone, { name: parent.emergency_name, phone: parent.emergency_phone, relation: parent.emergency_relation, for: 'Family' });
  // Children's emergency contacts
  children.forEach(c => {
    (c.emergency_contacts || []).forEach(ec => {
      if (!contacts.has(ec.phone)) contacts.set(ec.phone, { ...ec, for: c.name });
    });
  });

  const container = document.getElementById('emergencyContacts');
  container.innerHTML = Array.from(contacts.values()).map(ec => `
    <div class="ec-card">
      <div class="ec-icon"><i class="fa-solid fa-user-shield"></i></div>
      <div class="ec-info"><div class="ec-name">${ec.name}</div><div class="ec-meta">${ec.relation} · For: ${ec.for}</div></div>
      <a href="tel:${ec.phone.replace(/[\s-]/g,'')}" class="btn btn-primary btn-sm btn-icon"><i class="fa-solid fa-phone"></i></a>
    </div>
  `).join('');
}

function renderFamilyStats(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const totalEvents = children.reduce((sum, c) => sum + CSA.getChildHistory(c.child_id).length, 0);
  const totalAlerts = children.reduce((sum, c) => sum + CSA.getChildAnalytics(c.child_id).alerts, 0);
  const safeZones = CSA.getSafeZonesForParent(parent.parent_id).filter(z => z.active).length;

  document.getElementById('familyStats').innerHTML = `
    <div class="family-stat"><div class="fs-value">${children.length}</div><div class="fs-label">Children</div></div>
    <div class="family-stat"><div class="fs-value">${totalEvents}</div><div class="fs-label">Total Events</div></div>
    <div class="family-stat"><div class="fs-value">${safeZones}</div><div class="fs-label">Active Zones</div></div>
    <div class="family-stat"><div class="fs-value">${totalAlerts}</div><div class="fs-label">Alerts</div></div>
  `;
}

function populateSZChildSelect(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const sel = document.getElementById('szChild');
  sel.innerHTML = children.map(c => `<option value="${c.child_id}">${c.name}</option>`).join('');
}

function openSafeZoneModal() { document.getElementById('safeZoneModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function handleAddSafeZone(e) {
  e.preventDefault();
  const parent = CSA.getCurrentParent();
  CSA.addSafeZone({
    child_id: document.getElementById('szChild').value,
    parent_id: parent.parent_id,
    name: document.getElementById('szName').value,
    type: document.getElementById('szType').value,
    radius: document.getElementById('szRadius').value,
  });
  Toast.success('Safe Zone Created!', 'New zone is now active.');
  closeModal('safeZoneModal');
  renderSafeZones(parent);
  renderFamilyStats(parent);
}

function toggleSafeZone(zoneId, active) {
  CSA.updateSafeZone(zoneId, { active });
  Toast.info('Zone Updated', active ? 'Safe zone activated.' : 'Safe zone disabled.');
  renderSafeZones(CSA.getCurrentParent());
}

function deleteSafeZone(zoneId) {
  if (!confirm('Remove this safe zone?')) return;
  CSA.removeSafeZone(zoneId);
  Toast.info('Zone Removed', 'Safe zone has been deleted.');
  const parent = CSA.getCurrentParent();
  renderSafeZones(parent);
  renderFamilyStats(parent);
}

/* ── Safety Score AI Panel ── */
function renderSafetyScores(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const panel = document.getElementById('safetyScorePanel');
  if (!panel) return;

  if (children.length === 0) {
    panel.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)">No children registered. Add a child from the dashboard.</div>';
    return;
  }

  panel.innerHTML = children.map(child => {
    const score = CSA.calculateSafetyScore(child.child_id);
    const circumference = 2 * Math.PI * 42;
    const dashoffset = circumference - (score.score / 100) * circumference;
    const recommendations = getRecommendations(score);

    return `
      <div class="safety-score-child-card">
        <div class="safety-score-ring">
          <svg viewBox="0 0 100 100">
            <circle class="ring-bg" cx="50" cy="50" r="42"></circle>
            <circle class="ring-fg" cx="50" cy="50" r="42" stroke="${score.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"></circle>
          </svg>
          <div class="score-text">${score.score}<small>${score.label}</small></div>
        </div>
        <div class="safety-score-details">
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
            <span style="font-size:1.25rem">${child.photo_emoji}</span>
            <div>
              <div style="font-weight:700;font-size:.9375rem">${child.name}</div>
              <div style="font-size:.75rem;color:var(--text-3)">Age ${child.age} · ${child.gender}</div>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:.5rem;margin-top:.25rem">
            ${score.factors.map(f => `
              <div class="safety-factor-bar">
                <div class="factor-icon ${f.positive ? 'positive' : 'negative'}"><i class="fa-solid ${f.positive ? 'fa-check' : 'fa-xmark'}"></i></div>
                <span class="factor-name">${f.name}</span>
                <span class="factor-value ${f.positive ? 'positive' : 'negative'}">${f.value}</span>
              </div>
            `).join('')}
          </div>
          ${recommendations.map(r => `
            <div class="safety-score-recommendation">
              <i class="fa-solid fa-lightbulb"></i>
              <span>${r}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getRecommendations(score) {
  const recs = [];
  score.factors.forEach(f => {
    if (!f.positive) {
      if (f.name.includes('Wristband Inactive')) recs.push('Activate or register a wristband for real-time tracking.');
      if (f.name.includes('Outside Safe Zone')) recs.push('Check child location — they appear to be outside the designated safe zone.');
      if (f.name.includes('No Verified Guardians')) recs.push('Add and verify trusted guardians for faster recovery responses.');
      if (f.name.includes('Recent Alert')) recs.push('Review recent alerts and ensure all situations have been resolved.');
      if (f.name.includes('SOS')) recs.push('An SOS emergency is active. Coordinate with volunteers immediately.');
      if (f.name.includes('Tampered')) recs.push('Wristband integrity compromised. Check the device and reset if needed.');
      if (f.name.includes('GeoFence Breach')) recs.push('GeoFence breach detected. Consider expanding the safe zone radius or checking location.');
      if (f.name.includes('Signal Lost')) recs.push('Tracking signal lost. Check wristband battery and range from base station.');
    }
  });
  return recs.slice(0, 3);
}
