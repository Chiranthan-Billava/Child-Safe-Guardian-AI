/* =============================================
   SCAN-RESULT.JS – QR Recovery Scan Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const wbid = params.get('wbid');

  if (!wbid) {
    showNotFound();
    return;
  }

  const wb = CSA.getWristbandById(wbid);
  if (!wb) {
    showNotFound();
    return;
  }

  populateCard(wb);
  renderTimeline(wbid);

  // Add QR scan notification
  CSA.addNotification({
    type: 'qr-scan',
    title: 'QR Scan Detected',
    message: `Wristband ${wbid} was scanned. Child: ${wb.child_name}.`,
    wristband_id: wbid,
    location: 'Scan Point',
    channels: ['sms', 'push', 'in-app'],
  });
});

function populateCard(wb) {
  document.getElementById('scanPhoto').textContent = wb.child_photo_emoji || '👶';
  document.getElementById('scanName').textContent = wb.child_name;
  document.getElementById('scanMeta').textContent = `Age ${wb.child_age} · ${wb.child_gender} · Registered ${CSA.timeAgo(wb.registered_at)}`;
  document.getElementById('scanGuardian').textContent = wb.guardian_name + ` (${wb.guardian_relation})`;
  document.getElementById('scanPhone').textContent = wb.guardian_phone;
  document.getElementById('scanEvent').textContent = wb.event_name || CSA.getEventName(wb.event_id);
  document.getElementById('scanWbId').textContent = wb.wristband_id;
  document.getElementById('scanEmergency').textContent = `${wb.emergency_name} (${wb.emergency_relation}): ${wb.emergency_contact}`;
  document.getElementById('scanBlood').textContent = wb.blood_group;
  document.getElementById('scanMedical').textContent = wb.medical_notes || 'No known conditions';
  document.getElementById('scanAllergies').textContent = wb.allergies || 'None';

  // Update geofence badge
  const gfBadge = document.getElementById('scanGeofence');
  gfBadge.className = `geofence-badge ${wb.geofence_status}`;
  const statusMap = { safe: 'SAFE', warning: 'WARNING', breach: 'BREACH', critical: 'CRITICAL' };
  gfBadge.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> ${statusMap[wb.geofence_status] || 'UNKNOWN'}`;

  // Update call button
  document.getElementById('btnCall').setAttribute('data-phone', wb.guardian_phone);

  // Update title
  document.title = `${wb.child_name} – QR Recovery Scan – ChildSafe Alert`;
}

function renderTimeline(wbid) {
  const timeline = CSA.getTimeline(wbid);
  const container = document.getElementById('recoveryTimeline');

  if (timeline.length === 0) {
    container.innerHTML = `
      <div class="recovery-event" style="opacity:1">
        <div class="recovery-event-dot qr-scan"><i class="fa-solid fa-qrcode"></i></div>
        <div class="recovery-event-content">
          <div class="recovery-event-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          <div class="recovery-event-title">QR Wristband Scanned</div>
          <div class="recovery-event-source">Source: Volunteer Scan</div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = timeline.map(evt => `
    <div class="recovery-event">
      <div class="recovery-event-dot ${evt.type}"><i class="fa-solid ${evt.icon}"></i></div>
      <div class="recovery-event-content">
        <div class="recovery-event-time">${CSA.formatTimeShort(evt.time)}</div>
        <div class="recovery-event-title">${evt.event}</div>
        <div class="recovery-event-source">Source: ${evt.source}</div>
      </div>
    </div>
  `).join('');
}

function showNotFound() {
  document.getElementById('scanCard').innerHTML = `
    <div class="empty-state" style="padding:3rem">
      <div class="empty-state-icon"><i class="fa-solid fa-circle-xmark" style="color:var(--danger)"></i></div>
      <h3>Wristband Not Found</h3>
      <p>The scanned QR code does not match any registered wristband. Please verify the code or register a new wristband.</p>
      <a href="wristband.html" class="btn btn-primary"><i class="fa-solid fa-qrcode"></i> Register Wristband</a>
    </div>
  `;
}

function callGuardian() {
  const phone = document.getElementById('btnCall').getAttribute('data-phone');
  if (phone && phone !== '—') {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  }
  Toast.success('Calling Guardian', `Dialing ${phone}...`);
}

function notifyCommandCenter() {
  Toast.info('Command Center Notified', 'Emergency alert sent to all active volunteers and command center.');
  sendMockNotification('broadcast', { contact: 'Command Center' });
}

function markChildFound() {
  Toast.success('Child Marked Found! ✅', 'Recovery process initiated. Parent has been notified.');
  const statusBadge = document.getElementById('scanStatus');
  statusBadge.className = 'badge badge-found';
  statusBadge.innerHTML = '<span class="status-dot found"></span> FOUND';

  const gfBadge = document.getElementById('scanGeofence');
  gfBadge.className = 'geofence-badge safe';
  gfBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> RECOVERED';
}
