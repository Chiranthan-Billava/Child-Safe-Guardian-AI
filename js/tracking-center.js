/* =============================================
   TRACKING-CENTER.JS – Live Tracking & GeoFence
   ============================================= */

let currentWB = null;
let childPos = { x: 60, y: 35 };
let guardianPos = { x: 50, y: 50 };
let breadcrumbs = [];
let trackingInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  populateCaseSelector();
  populateActiveWristbands();
  startTracking();
});

function populateCaseSelector() {
  const sel = document.getElementById('caseSelector');
  const wristbands = CSA.getWristbands();

  sel.innerHTML = wristbands.map(w =>
    `<option value="${w.wristband_id}">${w.child_name} (${w.wristband_id}) – ${w.event_name || ''}</option>`
  ).join('');

  sel.addEventListener('change', () => {
    breadcrumbs = [];
    document.getElementById('breadcrumbTrail').innerHTML = '';
    loadWristband(sel.value);
  });

  if (wristbands.length > 0) {
    loadWristband(wristbands[0].wristband_id);
  }
}

function loadWristband(wbid) {
  currentWB = CSA.getWristbandById(wbid);
  if (!currentWB) return;

  // Update info panel
  document.getElementById('infoChild').textContent = currentWB.child_name;
  document.getElementById('infoRadius').textContent = currentWB.safe_radius + 'm';
  document.getElementById('childMarkerLabel').textContent = currentWB.child_name;

  // Reset child position
  childPos = { x: 55 + Math.random() * 15, y: 30 + Math.random() * 15 };
  updateGeofenceStatus();
  updateSafetyScore();
}

function populateActiveWristbands() {
  const container = document.getElementById('activeWristbandsList');
  const wristbands = CSA.getWristbands().slice(0, 5);

  container.innerHTML = wristbands.map(w => `
    <div style="display:flex;align-items:center;gap:.625rem;padding:.5rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
      <span style="font-size:1.25rem">${w.child_photo_emoji || '👶'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:.8rem;font-weight:600;color:var(--text)">${w.child_name}</div>
        <div style="font-size:.7rem;color:var(--text-3)">${w.wristband_id}</div>
      </div>
      <span class="geofence-badge ${w.geofence_status}" style="font-size:.55rem">${w.geofence_status}</span>
    </div>
  `).join('');
}

function startTracking() {
  trackingInterval = setInterval(() => {
    if (!currentWB) return;

    // Simulate child movement
    childPos.x += (Math.random() - 0.45) * 3;
    childPos.y += (Math.random() - 0.45) * 3;
    childPos.x = Math.max(5, Math.min(95, childPos.x));
    childPos.y = Math.max(5, Math.min(95, childPos.y));

    // Update child marker
    const marker = document.getElementById('childMarker');
    marker.style.left = childPos.x + '%';
    marker.style.top = childPos.y + '%';

    // Add breadcrumb
    breadcrumbs.push({ x: childPos.x, y: childPos.y });
    if (breadcrumbs.length > 20) breadcrumbs.shift();

    renderBreadcrumbs();
    updateGeofenceStatus();
    updateInfoPanel();
    updateSafetyScore();
  }, 3000);
}

function renderBreadcrumbs() {
  const container = document.getElementById('breadcrumbTrail');
  container.innerHTML = breadcrumbs.map((b, i) => {
    const opacity = 0.2 + (i / breadcrumbs.length) * 0.6;
    return `<div class="breadcrumb-dot" style="left:${b.x}%;top:${b.y}%;opacity:${opacity}"></div>`;
  }).join('');
}

function updateGeofenceStatus() {
  if (!currentWB) return;

  // Calculate distance from guardian (center)
  const dx = childPos.x - guardianPos.x;
  const dy = childPos.y - guardianPos.y;
  const distPx = Math.sqrt(dx * dx + dy * dy);

  // Map pixel distance to geofence percentage (100px radius in map = safe_radius)
  const geofenceRadiusPx = 15; // Percentage radius of the geofence circle on map
  const ratio = distPx / geofenceRadiusPx;

  let status = 'safe';
  if (ratio > 1.0) status = 'critical';
  else if (ratio > 0.9) status = 'breach';
  else if (ratio > 0.75) status = 'warning';

  // Update geofence circle color
  const circle = document.getElementById('geofenceCircle');
  circle.className = `geofence-circle ${status}`;

  // Update badge
  const badge = document.getElementById('geoStatusBadge');
  const statusMap = { safe: 'SAFE', warning: 'WARNING', breach: 'BREACH', critical: 'CRITICAL' };
  const dotClass = status === 'safe' ? 'found' : status === 'warning' ? 'searching' : 'active';
  badge.className = `geofence-badge ${status}`;
  badge.innerHTML = `<span class="status-dot ${dotClass}"></span> ${statusMap[status]}`;

  // Show/hide breach alert
  const alert = document.getElementById('breachAlert');
  if (status === 'breach' || status === 'critical') {
    alert.style.display = 'flex';
    document.getElementById('breachChild').textContent = currentWB.child_name;
  } else {
    alert.style.display = 'none';
  }
}

function updateInfoPanel() {
  const dx = childPos.x - guardianPos.x;
  const dy = childPos.y - guardianPos.y;
  const distPx = Math.sqrt(dx * dx + dy * dy);

  // Calculate direction
  let dir = '';
  if (dy < -2) dir += 'N';
  if (dy > 2) dir += 'S';
  if (dx > 2) dir += '/E ↗';
  else if (dx < -2) dir += '/W ↖';
  else dir += ' ↑';

  const distMeters = Math.round(distPx * 3.5);

  document.getElementById('infoDirection').textContent = dir || 'Stationary';
  document.getElementById('infoDistance').textContent = distMeters + 'm';
  document.getElementById('infoLastUpdate').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

function triggerEmergency() {
  Toast.warning('🚨 Emergency Broadcast', 'Alert sent to all volunteers and nearby emergency services.');
  sendMockNotification('broadcast', { contact: 'All Channels' });
}

/* ── Live Safety Score Widget ── */
function updateSafetyScore() {
  if (!currentWB) return;
  // Find child linked to this wristband
  const children = CSA.getWristbands().length > 0 ? (function() {
    const allChildren = CSA.getCases ? [] : [];
    // Use wristband child_id if available
    const wbs = CSA.getWristbands();
    const wb = wbs.find(w => w.wristband_id === currentWB.wristband_id);
    if (!wb) return null;
    // Search through parent children
    try {
      const parent = CSA.getCurrentParent();
      if (parent) {
        const kids = CSA.getChildrenForParent(parent.parent_id);
        return kids.find(c => c.wristband_id === currentWB.wristband_id) || null;
      }
    } catch(e) {}
    return null;
  })() : null;

  const card = document.getElementById('safetyScoreCard');
  const ring = document.getElementById('trackingSafetyRing');
  const factors = document.getElementById('safetyScoreFactors');
  const label = document.getElementById('safetyScoreLabel');

  if (!card || !ring) return;

  if (!children) {
    // Fallback: show a generic score based on wristband status
    const status = currentWB.status || 'active';
    const baseScore = status === 'active' ? 75 : status === 'tampered' ? 25 : status === 'removed' ? 15 : 40;
    const scoreColor = baseScore >= 60 ? '#22c55e' : baseScore >= 40 ? '#f59e0b' : '#ef4444';
    const scoreLabel = baseScore >= 60 ? 'Good' : baseScore >= 40 ? 'Moderate' : 'At Risk';
    const circumference = 2 * Math.PI * 28;
    const dashoffset = circumference - (baseScore / 100) * circumference;

    card.style.display = 'block';
    label.textContent = scoreLabel;
    label.style.background = scoreColor + '18';
    label.style.color = scoreColor;

    ring.innerHTML = `
      <svg viewBox="0 0 64 64">
        <circle class="ring-bg" cx="32" cy="32" r="28"></circle>
        <circle class="ring-fg" cx="32" cy="32" r="28" stroke="${scoreColor}" stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"></circle>
      </svg>
      <div class="score-text">${baseScore}<small>${scoreLabel}</small></div>
    `;
    factors.innerHTML = `<div style="color:var(--text-3)">Score based on wristband status: <strong style="text-transform:capitalize">${status}</strong></div>`;
    return;
  }

  const score = CSA.calculateSafetyScore(children.child_id);
  const circumference = 2 * Math.PI * 28;
  const dashoffset = circumference - (score.score / 100) * circumference;

  card.style.display = 'block';
  label.textContent = score.label;
  label.style.background = score.color + '18';
  label.style.color = score.color;

  ring.innerHTML = `
    <svg viewBox="0 0 64 64">
      <circle class="ring-bg" cx="32" cy="32" r="28"></circle>
      <circle class="ring-fg" cx="32" cy="32" r="28" stroke="${score.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"></circle>
    </svg>
    <div class="score-text">${score.score}<small>${score.label}</small></div>
  `;

  // Show top 3 factors
  const topFactors = score.factors.slice(0, 4);
  factors.innerHTML = topFactors.map(f => `
    <div style="display:flex;align-items:center;gap:.375rem;margin-bottom:.25rem">
      <i class="fa-solid ${f.positive ? 'fa-check' : 'fa-xmark'}" style="color:${f.positive ? '#22c55e' : '#ef4444'};font-size:.6rem"></i>
      <span>${f.name}</span>
    </div>
  `).join('');
}
