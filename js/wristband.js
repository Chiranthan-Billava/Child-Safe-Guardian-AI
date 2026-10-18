/* =============================================
   WRISTBAND.JS – Smart QR Wristband Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  populateEvents();
  updateStats();
  renderTable();
  setupLivePreview();
  renderWristbandHealth();
  renderTamperAlerts();

  document.getElementById('wristbandForm').addEventListener('submit', handleRegistration);
});

function populateEvents() {
  const sel = document.getElementById('eventSelect');
  const events = CSA.getEvents();
  sel.innerHTML = events.map(e => `<option value="${e.event_id}">${e.name}</option>`).join('');
}

function updateStats() {
  const stats = CSA.getStats();
  const wristbands = CSA.getWristbands();
  document.getElementById('statTotalWB').textContent = wristbands.length;
  document.getElementById('statActiveWB').textContent = wristbands.filter(w => w.status === 'active').length;
  document.getElementById('statEventsWB').textContent = stats.events;
  document.getElementById('statSafeWB').textContent = wristbands.filter(w => w.geofence_status === 'safe').length;
  document.getElementById('wbCount').textContent = wristbands.length;
}

function renderTable() {
  const tbody = document.getElementById('wristbandTableBody');
  const wristbands = CSA.getWristbands();

  if (wristbands.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-3)">No wristbands registered yet.</td></tr>';
    return;
  }

  tbody.innerHTML = wristbands.map(w => `
    <tr>
      <td><span style="font-weight:700;color:var(--primary);font-size:.8rem;letter-spacing:.05em">${w.wristband_id}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span style="font-size:1.25rem">${w.child_photo_emoji || '👶'}</span>
          <div>
            <div style="font-weight:600">${w.child_name}</div>
            <div style="font-size:.75rem;color:var(--text-3)">Age ${w.child_age} · ${w.child_gender}</div>
          </div>
        </div>
      </td>
      <td>${w.guardian_name}</td>
      <td style="font-size:.8rem">${w.event_name || CSA.getEventName(w.event_id)}</td>
      <td><span class="geofence-badge ${w.geofence_status}"><span class="status-dot ${w.geofence_status === 'safe' ? 'found' : w.geofence_status === 'breach' || w.geofence_status === 'critical' ? 'active' : 'searching'}"></span> ${w.geofence_status}</span></td>
      <td>
        <div style="display:flex;gap:.375rem">
          <a href="scan-result.html?wbid=${w.wristband_id}" class="btn btn-primary btn-icon-sm" title="View"><i class="fa-solid fa-eye"></i></a>
          <button class="btn btn-ghost btn-icon-sm" title="Copy QR Link" onclick="copyToClipboard('${window.location.origin}${window.location.pathname.replace(/[^/]*$/,'')}scan-result.html?wbid=${w.wristband_id}')"><i class="fa-solid fa-copy"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function setupLivePreview() {
  const fields = ['childName', 'childAge', 'childGender', 'guardianName', 'guardianPhone', 'emergencyPhone', 'bloodGroup', 'eventSelect'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
    if (el) el.addEventListener('change', updatePreview);
  });
}

function updatePreview() {
  const name = document.getElementById('childName').value || 'Child Name';
  const age = document.getElementById('childAge').value || '—';
  const gender = document.getElementById('childGender').value || '—';
  const guardian = document.getElementById('guardianName').value || '—';
  const phone = document.getElementById('guardianPhone').value || '—';
  const blood = document.getElementById('bloodGroup').value || '—';
  const eventSel = document.getElementById('eventSelect');
  const eventName = eventSel.options[eventSel.selectedIndex]?.text || '—';

  document.getElementById('previewChildName').textContent = name;
  document.getElementById('previewChildMeta').textContent = `Age ${age} · ${gender}`;
  document.getElementById('previewGuardian').textContent = guardian;
  document.getElementById('previewEmergency').textContent = phone;
  document.getElementById('previewEvent').textContent = eventName.length > 20 ? eventName.substring(0, 18) + '…' : eventName;
  document.getElementById('previewBlood').textContent = blood;

  // Emoji based on gender
  const emoji = gender === 'Female' ? '👧' : '👦';
  document.getElementById('previewPhoto').textContent = emoji;
}

function handleRegistration(e) {
  e.preventDefault();

  const eventSel = document.getElementById('eventSelect');
  const data = {
    child_name: document.getElementById('childName').value,
    child_age: parseInt(document.getElementById('childAge').value),
    child_gender: document.getElementById('childGender').value,
    child_photo_emoji: document.getElementById('childGender').value === 'Female' ? '👧' : '👦',
    guardian_name: document.getElementById('guardianName').value,
    guardian_phone: document.getElementById('guardianPhone').value,
    guardian_relation: document.getElementById('guardianRelation').value,
    emergency_contact: document.getElementById('emergencyPhone').value || '—',
    emergency_name: document.getElementById('emergencyName').value || '—',
    emergency_relation: document.getElementById('emergencyRelation').value,
    blood_group: document.getElementById('bloodGroup').value,
    allergies: document.getElementById('allergies').value || 'None',
    medical_notes: document.getElementById('medicalNotes').value || 'None',
    event_id: eventSel.value,
    event_name: eventSel.options[eventSel.selectedIndex]?.text || '',
    safe_radius: parseInt(document.getElementById('safeRadius').value),
  };

  const wb = CSA.addWristband(data);

  // Update preview with final ID
  document.getElementById('previewWbId').textContent = wb.wristband_id;

  // Generate QR
  const qrContainer = document.getElementById('previewQR');
  const scanUrl = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}scan-result.html?wbid=${wb.wristband_id}`;
  qrContainer.innerHTML = '';

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: scanUrl,
      width: 120,
      height: 120,
      colorDark: '#0f3460',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    qrContainer.innerHTML = `<div style="width:120px;height:120px;background:linear-gradient(135deg,#1a56db,#0f3460);display:flex;align-items:center;justify-content:center;border-radius:8px;color:white;font-size:2.5rem"><i class="fa-solid fa-qrcode"></i></div>`;
  }

  // Show actions
  document.getElementById('previewActions').classList.remove('hidden');

  // Refresh
  updateStats();
  renderTable();

  Toast.success('Wristband Registered!', `${wb.child_name} → ${wb.wristband_id}`);
}

function downloadWristbandQR() {
  const container = document.getElementById('previewQR');
  const canvas = container.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `wristband-qr.png`;
    link.href = canvas.toDataURL();
    link.click();
    Toast.success('Downloaded!', 'QR Code saved as PNG.');
  } else {
    Toast.info('QR Preview', 'Register a child first to generate a downloadable QR code.');
  }
}

function printWristband() {
  const preview = document.getElementById('wristbandPreview');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html><head><title>Print Wristband</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
      body { font-family: 'Inter', sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; background:#f1f5f9; }
      .print-card { background:linear-gradient(135deg,#1e3a5f,#0f3460,#1a56db); border-radius:16px; padding:2rem; color:white; max-width:400px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,0.2); }
    </style></head><body>
    <div class="print-card">${preview.querySelector('.wristband-preview-inner').innerHTML}</div>
    <script>setTimeout(()=>window.print(),500)<\/script>
    </body></html>
  `);
  printWindow.document.close();
}

/* ── Wristband Health Dashboard ── */
function renderWristbandHealth() {
  const grid = document.getElementById('wbHealthGrid');
  if (!grid) return;
  const wristbands = CSA.getWristbands();

  if (wristbands.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="padding:2rem;text-align:center;grid-column:1/-1"><div class="empty-state-icon"><i class="fa-solid fa-qrcode"></i></div><h3>No Wristbands</h3><p>Register wristbands to view health status.</p></div>';
    return;
  }

  grid.innerHTML = wristbands.map(wb => {
    const health = CSA.getWristbandHealth(wb.wristband_id);
    const batteryColor = health.battery > 70 ? '#22c55e' : health.battery > 30 ? '#f59e0b' : '#ef4444';
    const signalIcon = health.signal === 'strong' ? 'fa-signal' : health.signal === 'weak' ? 'fa-signal' : 'fa-ban';
    const signalLabel = health.signal === 'strong' ? 'Strong' : health.signal === 'weak' ? 'Weak' : 'No Signal';
    const isTampered = health.tamper_detected;

    return `
      <div class="wb-health-card status-${health.status}">
        <div class="wb-health-header">
          <div class="wb-health-child">
            <span class="wb-health-emoji">${wb.child_photo_emoji || '👶'}</span>
            <div>
              <div class="wb-health-name">${wb.child_name}</div>
              <div class="wb-health-id">${wb.wristband_id}</div>
            </div>
          </div>
          <span class="wb-health-status ${health.status}">
            <span class="status-dot ${health.status === 'active' ? 'found' : 'active'}"></span>
            ${health.status.toUpperCase()}
          </span>
        </div>
        <div class="wb-health-metrics">
          <div class="wb-metric">
            <div class="wb-metric-label">Battery</div>
            <div class="wb-metric-value">${health.battery}%</div>
            <div class="battery-bar"><div class="battery-bar-fill" style="width:${health.battery}%;background:${batteryColor}"></div></div>
          </div>
          <div class="wb-metric">
            <div class="wb-metric-label">Signal</div>
            <div class="wb-metric-value"><i class="fa-solid ${signalIcon}" style="margin-right:.25rem;color:${health.signal === 'strong' ? '#22c55e' : '#ef4444'}"></i> ${signalLabel}</div>
          </div>
          <div class="wb-metric">
            <div class="wb-metric-label">GeoFence</div>
            <div class="wb-metric-value" style="text-transform:capitalize;color:${wb.geofence_status === 'safe' ? '#22c55e' : wb.geofence_status === 'warning' ? '#f59e0b' : '#ef4444'}">${wb.geofence_status}</div>
          </div>
          <div class="wb-metric">
            <div class="wb-metric-label">Last Active</div>
            <div class="wb-metric-value" style="font-size:.75rem">${CSA.timeAgo(health.last_active)}</div>
          </div>
        </div>
        <div class="wb-health-actions">
          ${isTampered ?
            `<button class="btn btn-primary btn-sm" style="flex:1" onclick="resetWristbandStatus('${wb.wristband_id}')"><i class="fa-solid fa-rotate-right"></i> Reset</button>` :
            `<button class="btn btn-ghost btn-sm" style="flex:1;border-color:var(--danger);color:var(--danger)" onclick="simulateTamper('${wb.wristband_id}')"><i class="fa-solid fa-shield-halved"></i> Simulate Tamper</button>`
          }
          <a href="scan-result.html?wbid=${wb.wristband_id}" class="btn btn-ghost btn-sm"><i class="fa-solid fa-eye"></i> View</a>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Tamper Alert Feed ── */
function renderTamperAlerts() {
  const feed = document.getElementById('tamperAlertFeed');
  if (!feed) return;
  const notifs = CSA.getNotifications().filter(n => n.type === 'tamper');

  if (notifs.length === 0) {
    feed.innerHTML = '<div class="empty-state" style="padding:2rem;text-align:center"><div class="empty-state-icon"><i class="fa-solid fa-check-circle"></i></div><h3>No Tamper Alerts</h3><p>All wristbands are functioning normally.</p></div>';
    return;
  }

  feed.innerHTML = notifs.slice(0, 10).map(n => {
    const severity = n.priority === 'high' ? 'critical' : 'warning';
    return `
      <div class="tamper-alert-item ${severity}">
        <div class="tamper-alert-icon ${severity}">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="tamper-alert-content">
          <div class="tamper-alert-title">${n.title}</div>
          <div class="tamper-alert-message">${n.message}</div>
          <div class="tamper-alert-time"><i class="fa-regular fa-clock"></i> ${CSA.formatTime(n.timestamp)}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Simulate Tamper Event ── */
function simulateTamper(wristbandId) {
  if (!confirm('Simulate a tamper event on this wristband? This will trigger alerts and notifications.')) return;

  const result = CSA.simulateTamperEvent(wristbandId);
  if (result) {
    Toast.error('Tamper Detected!', `${result.wristband.child_name}: ${result.tamperType.toUpperCase()} – ${result.message}`);
    updateStats();
    renderTable();
    renderWristbandHealth();
    renderTamperAlerts();
  }
}

/* ── Reset Wristband Status ── */
function resetWristbandStatus(wristbandId) {
  if (!confirm('Reset this wristband to active status?')) return;

  const ok = CSA.resetWristband(wristbandId);
  if (ok) {
    Toast.success('Wristband Restored!', 'Wristband has been reset to active status.');
    updateStats();
    renderTable();
    renderWristbandHealth();
    renderTamperAlerts();
  }
}
