/* case.js */
let caseId = null;
let caseData = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  caseId = params.get('id');

  if (!caseId) { showNotFound(); return; }
  caseData = CSA.getCaseById(caseId);
  if (!caseData) { showNotFound(); return; }

  document.title = `${caseData.child_name} – ${caseId} – ChildSafe Alert`;
  renderCase();
  renderSidebar();
  renderAdminCard();
});

function showNotFound() {
  document.getElementById('notFound').style.display = 'block';
  document.getElementById('caseDetail').style.display = 'none';
}

function renderCase() {
  document.getElementById('caseDetail').style.display = 'grid';
  document.getElementById('breadcrumbId').textContent = caseId;
  document.getElementById('pageTitle').textContent = `${caseData.child_name} — ${caseId}`;
  document.getElementById('pageSubtitle').textContent = `Last seen: ${caseData.last_seen_location}`;

  // Status badge (action bar)
  document.getElementById('statusBadge').innerHTML = `
    <span class="badge ${CSA.statusClass(caseData.status)}" style="font-size:.875rem;padding:.375rem .875rem">
      <span class="status-dot ${caseData.status}"></span>
      ${CSA.statusLabel(caseData.status)}
    </span>`;

  // Photo
  const photoEl = document.getElementById('profilePhoto');
  if (caseData.photo) {
    photoEl.innerHTML = `<img src="${caseData.photo}" alt="${caseData.child_name}" style="width:100%;height:100%;object-fit:cover">
      <div class="profile-status-overlay"><span class="badge ${CSA.statusClass(caseData.status)}"><span class="status-dot ${caseData.status}"></span>${CSA.statusLabel(caseData.status)}</span></div>`;
  } else {
    const color = getAvatarColor(caseData.child_name);
    photoEl.innerHTML = `
      <div class="photo-placeholder-lg" style="background:${color}15;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem">
        <span style="font-size:6rem">${caseData.photo_emoji||'👤'}</span>
        <span style="font-size:.875rem;color:${color};font-weight:600">No Photo Available</span>
      </div>
      <div class="profile-status-overlay"><span class="badge ${CSA.statusClass(caseData.status)}"><span class="status-dot ${caseData.status}"></span>${CSA.statusLabel(caseData.status)}</span></div>`;
  }

  document.getElementById('profileCaseId').textContent = caseId;
  document.getElementById('profileName').textContent = caseData.child_name;
  document.getElementById('profileAge').textContent = `${caseData.age} years`;
  document.getElementById('profileGender').textContent = caseData.gender;
  document.getElementById('profileTime').textContent = CSA.formatTime(caseData.last_seen_time);
  document.getElementById('profileParent').textContent = caseData.parent_name || '—';
  document.getElementById('profileLocation').textContent = caseData.last_seen_location;
  document.getElementById('profileClothing').textContent = caseData.clothing || '—';

  if (caseData.notes) {
    document.getElementById('profileNotes').innerHTML = `
      <div class="alert-box info">
        <i class="fa-solid fa-note-sticky"></i>
        <div><strong>Additional Notes:</strong> ${caseData.notes}</div>
      </div>`;
  }

  // Buttons
  document.getElementById('btnSighting').href = `sighting.html?case=${caseId}`;
  document.getElementById('btnShare').onclick = () => shareAlert(caseId, caseData.child_name);
  document.getElementById('btnDownloadQR').onclick = () => downloadQR('caseQR', `childsafe-${caseId}`);

  // Status update select
  const sel = document.getElementById('statusUpdate');
  if (sel) sel.value = caseData.status;

  renderTimeline();
}

function renderTimeline() {
  const sightings = CSA.getSightingsForCase(caseId);
  const countEl = document.getElementById('sightingsCount');
  if (countEl) countEl.textContent = `${sightings.length} sighting${sightings.length !== 1 ? 's' : ''}`;

  const timeline = document.getElementById('caseTimeline');
  if (!timeline) return;

  // Build timeline from sightings + updates
  const items = [];

  // Initial report
  items.push({ type: 'active', time: caseData.reported_at, title: '🚨 Case Reported', desc: `Missing child report filed. Case ${caseId} created. Alert broadcast to volunteers.` });

  // Custom updates
  (caseData.updates || []).forEach(u => {
    items.push({ type: u.type || 'update', time: u.time, title: u.description });
  });

  // Sightings
  sightings.forEach(s => {
    items.push({
      type: 'sighting',
      time: s.timestamp,
      title: `👁️ Sighting Reported${s.verified?' ✓ Verified':''}`,
      desc: `📍 ${s.location}<br><span style="color:var(--text-3)">${s.description}</span>${s.verified?'<br><span style="color:var(--success);font-size:.75rem;font-weight:600"><i class="fa-solid fa-check-circle"></i> Verified by organizer</span>':''}`
    });
  });

  // Sort by time desc
  items.sort((a,b) => new Date(b.time) - new Date(a.time));

  if (items.length === 0) {
    timeline.innerHTML = '<div class="empty-state" style="padding:2rem"><div class="empty-state-icon"><i class="fa-solid fa-clock"></i></div><h3>No Updates Yet</h3><p>Timeline updates will appear here as the search progresses.</p></div>';
    return;
  }

  timeline.innerHTML = items.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot ${item.type}"></div>
      <div class="timeline-time"><i class="fa-regular fa-clock"></i> ${CSA.timeAgo(item.time)} &nbsp;·&nbsp; ${CSA.formatTime(item.time)}</div>
      <div class="timeline-content">
        <div class="timeline-title">${item.title}</div>
        ${item.desc ? `<div class="timeline-desc">${item.desc}</div>` : ''}
      </div>
    </div>`).join('');
}

function renderSidebar() {
  // QR
  const url = getCasePageUrl(caseId);
  generateQR('caseQR', url, 148);

  // Contact
  document.getElementById('contactName').textContent = caseData.parent_name || '—';
  const phoneEl = document.getElementById('contactPhone');
  if (phoneEl) {
    phoneEl.href = `tel:${caseData.parent_contact}`;
    phoneEl.innerHTML = `<i class="fa-solid fa-phone"></i> ${caseData.parent_contact}`;
  }
  document.getElementById('sightingBtn2').href = `sighting.html?case=${caseId}`;

  // Event info
  const events = CSA.getEvents();
  const ev = events.find(e => e.event_id === caseData.event_id);
  const evEl = document.getElementById('eventInfo');
  if (ev && evEl) {
    evEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <div><div class="profile-info-label">Event Name</div><div style="font-weight:700">${ev.name}</div></div>
        <div><div class="profile-info-label">Venue</div><div style="font-weight:600;color:var(--text-2)">${ev.venue}</div></div>
        <div><div class="profile-info-label">City</div><div style="font-weight:600;color:var(--text-2)">${ev.city}</div></div>
        <div><div class="profile-info-label">Date</div><div style="font-weight:600;color:var(--text-2)">${ev.date}</div></div>
      </div>`;
  } else if (evEl) {
    evEl.innerHTML = '<p style="color:var(--text-3);font-size:.875rem">No event information available.</p>';
  }
}

function renderAdminCard() {
  const role = Role.getCurrent();
  const card = document.getElementById('adminCard');
  if (card && ['admin','volunteer'].includes(role)) {
    card.style.display = 'block';
  }
}

function updateStatus() {
  const sel = document.getElementById('statusUpdate');
  if (!sel || !caseId) return;
  const newStatus = sel.value;
  CSA.updateCaseStatus(caseId, newStatus);
  caseData = CSA.getCaseById(caseId);
  Toast.success('Status Updated', `Case ${caseId} is now marked as "${CSA.statusLabel(newStatus)}".`);
  renderCase();
  if (newStatus === 'found') {
    setTimeout(() => Toast.success('🎉 Child Found!', `${caseData.child_name} has been reunited with their family!`), 800);
  }
}
