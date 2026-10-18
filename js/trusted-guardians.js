/* =============================================
   TRUSTED-GUARDIANS.JS – Guardian Network Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  const parent = CSA.getCurrentParent();
  renderNavAvatar(parent);
  populateFilters(parent);
  renderPage();
});

function renderNavAvatar(parent) {
  const el = document.getElementById('navAvatar');
  if (el) {
    el.style.background = parent.avatar_color;
    el.textContent = parent.full_name.split(' ').map(w => w[0]).join('').substring(0, 2);
  }
}

/* ── Filter Population ── */
function populateFilters(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const childFilter = document.getElementById('childFilter');
  const nearestSelect = document.getElementById('nearestChildSelect');
  children.forEach(c => {
    childFilter.innerHTML += `<option value="${c.child_id}">${c.photo_emoji} ${c.name}</option>`;
    nearestSelect.innerHTML += `<option value="${c.child_id}">${c.photo_emoji} ${c.name}</option>`;
  });
  // Populate add-modal child checkboxes
  const checkboxes = document.getElementById('agChildCheckboxes');
  checkboxes.innerHTML = children.map(c => `
    <label class="tg-child-checkbox">
      <input type="checkbox" value="${c.child_id}" name="agChildren">
      <span>${c.photo_emoji} ${c.name}</span>
    </label>
  `).join('');
}

/* ── Main Render Orchestrator ── */
function renderPage() {
  const parent = CSA.getCurrentParent();
  renderAnalytics(parent);
  renderGuardianGrid(parent);
  renderNearestGuardians();
  renderRecoveryAuth(parent);
  renderPickupHistory(parent);
}

/* ── Analytics Bar ── */
function renderAnalytics(parent) {
  const a = CSA.getGuardianAnalytics(parent.parent_id);
  document.getElementById('analyticsBar').innerHTML = `
    <div class="tg-analytics-inner">
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(26,86,219,0.1);color:var(--primary)"><i class="fa-solid fa-user-shield"></i></div>
        <div class="tg-ana-value">${a.total}</div>
        <div class="tg-ana-label">Total Guardians</div>
      </div>
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(34,197,94,0.1);color:var(--success)"><i class="fa-solid fa-check-circle"></i></div>
        <div class="tg-ana-value">${a.verified}</div>
        <div class="tg-ana-label">Verified</div>
      </div>
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(245,158,11,0.1);color:var(--warning)"><i class="fa-solid fa-clock"></i></div>
        <div class="tg-ana-value">${a.pending}</div>
        <div class="tg-ana-label">Pending</div>
      </div>
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(6,182,212,0.1);color:var(--info)"><i class="fa-solid fa-signal"></i></div>
        <div class="tg-ana-value">${a.available}</div>
        <div class="tg-ana-label">Available Now</div>
      </div>
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(124,58,237,0.1);color:#7c3aed"><i class="fa-solid fa-heart"></i></div>
        <div class="tg-ana-value">${a.totalRecoveries}</div>
        <div class="tg-ana-label">Recoveries</div>
      </div>
      <div class="tg-ana-item">
        <div class="tg-ana-icon" style="background:rgba(249,115,22,0.1);color:var(--accent)"><i class="fa-solid fa-stopwatch"></i></div>
        <div class="tg-ana-value">${a.avgResponseMins}m</div>
        <div class="tg-ana-label">Avg Response</div>
      </div>
    </div>
  `;
}

/* ── Guardian Profile Cards ── */
function renderGuardianGrid(parent) {
  let guardians = CSA.getGuardiansForParent(parent.parent_id);

  // Apply filters
  const childVal = document.getElementById('childFilter').value;
  const statusVal = document.getElementById('statusFilter').value;
  if (childVal !== 'all') guardians = guardians.filter(g => g.child_ids.includes(childVal));
  if (statusVal !== 'all') guardians = guardians.filter(g => g.status === statusVal);

  const grid = document.getElementById('guardianGrid');
  if (guardians.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:3rem"><div class="empty-state-icon"><i class="fa-solid fa-user-shield"></i></div><h3>No Guardians Found</h3><p>Add trusted guardians to your network.</p><button class="btn btn-primary" onclick="openAddGuardianModal()"><i class="fa-solid fa-user-plus"></i> Add Guardian</button></div>';
    return;
  }

  const priorityIcons = { primary: '🟢', secondary: '🟡', tertiary: '🔵' };
  const priorityLabels = { primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary' };
  const availColors = { available: 'var(--success)', busy: 'var(--warning)', unavailable: 'var(--text-4)' };
  const availLabels = { available: 'Available', busy: 'Busy', unavailable: 'Unavailable' };

  grid.innerHTML = guardians.map(g => {
    const assignedChildren = g.child_ids.map(id => CSA.getChildById(id)).filter(Boolean);
    return `
    <div class="guardian-card ${g.status === 'pending' ? 'pending' : ''}">
      <div class="gc-header">
        <div class="gc-avatar">${g.photo_emoji}</div>
        <div class="gc-info">
          <div class="gc-name">${g.full_name}</div>
          <div class="gc-relation">${g.relationship} · ${priorityIcons[g.priority]} ${priorityLabels[g.priority]}</div>
        </div>
        <div class="gc-badges">
          <span class="gc-status-badge ${g.status}">${g.status === 'verified' ? '<i class="fa-solid fa-check-circle"></i> Verified' : '<i class="fa-solid fa-clock"></i> Pending'}</span>
          <span class="gc-avail-dot" style="background:${availColors[g.availability]}" title="${availLabels[g.availability]}"></span>
        </div>
      </div>
      <div class="gc-body">
        <div class="gc-detail"><i class="fa-solid fa-phone"></i> <span>${g.mobile}</span></div>
        <div class="gc-detail"><i class="fa-solid fa-id-card"></i> <span>${g.id_type ? g.id_type + ': ' + g.id_number : '—'}</span></div>
        <div class="gc-detail"><i class="fa-solid fa-qrcode"></i> <span class="gc-qr-id">${g.qr_code}</span></div>
        <div class="gc-children-row">
          <span class="gc-children-label">Assigned to:</span>
          ${assignedChildren.map(c => `<span class="gc-child-tag">${c.photo_emoji} ${c.name}</span>`).join('')}
        </div>
        ${g.recovery_count > 0 ? `<div class="gc-detail" style="color:var(--success)"><i class="fa-solid fa-heart"></i> <span>${g.recovery_count} recovery${g.recovery_count > 1 ? 'ies' : ''} · Last: ${CSA.timeAgo(g.last_recovery)}</span></div>` : ''}
      </div>
      <div class="gc-actions">
        <button class="btn btn-primary btn-sm" onclick="showGuardianDetail('${g.guardian_id}')"><i class="fa-solid fa-id-card"></i> Pass</button>
        <a href="tel:${g.mobile.replace(/[\s-]/g,'')}" class="btn btn-success btn-sm"><i class="fa-solid fa-phone"></i> Call</a>
        ${g.status === 'pending' ? `<button class="btn btn-outline btn-sm" onclick="handleVerify('${g.guardian_id}')"><i class="fa-solid fa-check"></i> Verify</button>` : ''}
        <div class="gc-actions-more">
          <select class="form-select" style="font-size:.75rem;padding:.25rem .5rem;min-width:110px" onchange="handleAvailability('${g.guardian_id}', this.value)">
            <option value="available" ${g.availability==='available'?'selected':''}>🟢 Available</option>
            <option value="busy" ${g.availability==='busy'?'selected':''}>🟡 Busy</option>
            <option value="unavailable" ${g.availability==='unavailable'?'selected':''}>⚫ Unavailable</option>
          </select>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="handleRemove('${g.guardian_id}','${g.full_name}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Guardian Detail / QR Pass Modal ── */
function showGuardianDetail(guardianId) {
  const g = CSA.getGuardianById(guardianId);
  if (!g) return;
  const children = g.child_ids.map(id => CSA.getChildById(id)).filter(Boolean);

  document.getElementById('guardianDetailContent').innerHTML = `
    <div class="gd-pass">
      <div class="gd-pass-header">
        <div class="gd-pass-avatar">${g.photo_emoji}</div>
        <div>
          <div class="gd-pass-name">${g.full_name}</div>
          <div class="gd-pass-relation">${g.relationship}</div>
        </div>
        <span class="gc-status-badge ${g.status}" style="margin-left:auto">${g.status === 'verified' ? '<i class="fa-solid fa-check-circle"></i> Verified' : '<i class="fa-solid fa-clock"></i> Pending'}</span>
      </div>
      <div class="gd-pass-qr">
        <div class="gd-qr-box">
          <div class="gd-qr-placeholder"><i class="fa-solid fa-qrcode"></i></div>
        </div>
        <div class="gd-qr-id">${g.qr_code}</div>
        <div class="gd-qr-sub">Guardian Verification QR</div>
      </div>
      <div class="gd-pass-details">
        <div class="gd-row"><span class="gd-label">Guardian ID</span><span class="gd-value">${g.guardian_id}</span></div>
        <div class="gd-row"><span class="gd-label">Mobile</span><span class="gd-value">${g.mobile}</span></div>
        <div class="gd-row"><span class="gd-label">Email</span><span class="gd-value">${g.email || '—'}</span></div>
        <div class="gd-row"><span class="gd-label">ID Type</span><span class="gd-value">${g.id_type || '—'}</span></div>
        <div class="gd-row"><span class="gd-label">ID Number</span><span class="gd-value">${g.id_number || '—'}</span></div>
        <div class="gd-row"><span class="gd-label">Priority</span><span class="gd-value">${g.priority.charAt(0).toUpperCase()+g.priority.slice(1)}</span></div>
        <div class="gd-row"><span class="gd-label">Recoveries</span><span class="gd-value">${g.recovery_count}</span></div>
        <div class="gd-row"><span class="gd-label">Avg Response</span><span class="gd-value">${g.avg_response_mins ? g.avg_response_mins + ' min' : '—'}</span></div>
      </div>
      <div class="gd-pass-children">
        <div class="gd-label" style="margin-bottom:.5rem">Authorized for:</div>
        ${children.map(c => `<span class="gc-child-tag">${c.photo_emoji} ${c.name} (Age ${c.age})</span>`).join('')}
      </div>
      <div style="display:flex;gap:.5rem;margin-top:1rem">
        <a href="tel:${g.mobile.replace(/[\s-]/g,'')}" class="btn btn-success btn-sm" style="flex:1"><i class="fa-solid fa-phone"></i> Call Guardian</a>
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="Toast.info('SMS Sent','Location link sent to ${g.full_name} (demo).')"><i class="fa-solid fa-location-arrow"></i> Send Location</button>
      </div>
    </div>
  `;
  document.getElementById('guardianDetailModal').classList.add('open');
}

/* ── Nearest Guardians ── */
function renderNearestGuardians() {
  const childId = document.getElementById('nearestChildSelect').value;
  if (!childId) return;
  const guardians = CSA.getNearestGuardians(childId);
  const container = document.getElementById('nearestGuardiansList');

  if (guardians.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)">No verified guardians for this child.</div>';
    return;
  }

  const availColors = { available: 'var(--success)', busy: 'var(--warning)', unavailable: 'var(--text-4)' };
  const availLabels = { available: 'Available', busy: 'Busy', unavailable: 'Unavailable' };

  container.innerHTML = guardians.map((g, i) => `
    <div class="nearest-guardian-card ${i === 0 ? 'closest' : ''}">
      <div class="ng-rank">${i === 0 ? '<i class="fa-solid fa-location-crosshairs" style="color:var(--primary)"></i>' : '#' + (i+1)}</div>
      <div class="ng-avatar">${g.photo_emoji}</div>
      <div class="ng-info">
        <div class="ng-name">${g.full_name}</div>
        <div class="ng-relation">${g.relationship}</div>
      </div>
      <div class="ng-metrics">
        <div class="ng-metric"><span class="ng-metric-val">${g.distance_m}m</span><span class="ng-metric-lbl">Distance</span></div>
        <div class="ng-metric"><span class="ng-metric-val">${g.eta_mins} min</span><span class="ng-metric-lbl">ETA</span></div>
      </div>
      <div class="ng-status">
        <span class="gc-avail-dot" style="background:${availColors[g.availability]}"></span>
        <span style="font-size:.75rem;color:var(--text-3)">${availLabels[g.availability]}</span>
      </div>
      <div class="ng-actions">
        <a href="tel:${g.mobile.replace(/[\s-]/g,'')}" class="btn btn-success btn-sm btn-icon" title="Call"><i class="fa-solid fa-phone"></i></a>
        <button class="btn btn-primary btn-sm btn-icon" title="Send Location" onclick="Toast.info('Location Sent','Shared with ${g.full_name}.')"><i class="fa-solid fa-location-arrow"></i></button>
        <button class="btn btn-outline btn-sm btn-icon" title="Request Assistance" onclick="Toast.success('Assistance Requested','${g.full_name} has been notified.')"><i class="fa-solid fa-bell"></i></button>
      </div>
    </div>
  `).join('');
}

/* ── Recovery Authorization Panel ── */
function renderRecoveryAuth(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const container = document.getElementById('recoveryAuthPanel');

  container.innerHTML = children.map(child => {
    const guardians = CSA.getGuardiansForChild(child.child_id);
    const verified = guardians.filter(g => g.status === 'verified');
    const pending = guardians.filter(g => g.status === 'pending');

    return `
      <div class="ra-child-block">
        <div class="ra-child-header">
          <span style="font-size:1.25rem">${child.photo_emoji}</span>
          <div><strong>${child.name}</strong><div style="font-size:.75rem;color:var(--text-3)">Age ${child.age} · ${child.blood_group}</div></div>
          <span class="safety-status-badge" style="background:${CSA.safetyStatusColor(child.safety_status)}18;color:${CSA.safetyStatusColor(child.safety_status)};border-color:${CSA.safetyStatusColor(child.safety_status)}40;margin-left:auto"><span class="safety-dot" style="background:${CSA.safetyStatusColor(child.safety_status)}"></span>${CSA.safetyStatusLabel(child.safety_status)}</span>
        </div>
        <div class="ra-guardian-list">
          <div class="ra-section-label">Authorized Guardians</div>
          ${verified.length === 0 ? '<div style="font-size:.8rem;color:var(--text-4);padding:.25rem 0">No verified guardians</div>' : ''}
          ${verified.map(g => `
            <div class="ra-guardian-item authorized">
              <i class="fa-solid fa-check-circle" style="color:var(--success)"></i>
              <span class="ra-g-name">${g.full_name}</span>
              <span class="ra-g-rel">${g.relationship}</span>
              <button class="btn btn-success btn-sm" style="margin-left:auto;font-size:.7rem" onclick="initiatePickup('${child.child_id}','${g.guardian_id}')"><i class="fa-solid fa-hand-holding-heart"></i> Verify Pickup</button>
            </div>
          `).join('')}
          ${pending.length > 0 ? `
            <div class="ra-section-label" style="margin-top:.75rem;color:var(--warning)">Pending Verification</div>
            ${pending.map(g => `
              <div class="ra-guardian-item pending">
                <i class="fa-solid fa-clock" style="color:var(--warning)"></i>
                <span class="ra-g-name">${g.full_name}</span>
                <span class="ra-g-rel">${g.relationship}</span>
                <button class="btn btn-outline btn-sm" style="margin-left:auto;font-size:.7rem" onclick="handleVerify('${g.guardian_id}')"><i class="fa-solid fa-check"></i> Verify</button>
              </div>
            `).join('')}
          ` : ''}
        </div>
      </div>`;
  }).join('');
}

/* ── Pickup History ── */
function renderPickupHistory(parent) {
  const children = CSA.getChildrenForParent(parent.parent_id);
  const childIds = children.map(c => c.child_id);
  const pickups = CSA.getPickups().filter(p => childIds.includes(p.child_id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const container = document.getElementById('pickupHistory');

  if (pickups.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-3)"><i class="fa-solid fa-clock-rotate-left" style="font-size:1.5rem;margin-bottom:.5rem;display:block"></i>No pickup records yet.</div>';
    return;
  }

  container.innerHTML = pickups.map(p => {
    const child = CSA.getChildById(p.child_id);
    const guardian = CSA.getGuardianById(p.guardian_id);
    const isComplete = p.status === 'completed';
    return `
      <div class="pickup-record ${isComplete ? 'completed' : 'pending'}">
        <div class="pickup-icon ${isComplete ? 'success' : 'pending'}"><i class="fa-solid ${isComplete ? 'fa-check-circle' : 'fa-clock'}"></i></div>
        <div class="pickup-info">
          <div class="pickup-title">${isComplete ? 'PICKUP VERIFIED' : 'PICKUP PENDING'}</div>
          <div class="pickup-meta">
            <span><i class="fa-solid fa-child"></i> ${child ? child.name : '—'}</span>
            <span><i class="fa-solid fa-user-shield"></i> ${guardian ? guardian.full_name : '—'} (${guardian ? guardian.relationship : ''})</span>
          </div>
          ${isComplete ? `<div class="pickup-meta"><span><i class="fa-solid fa-location-dot"></i> ${p.location}</span><span><i class="fa-solid fa-clock"></i> ${CSA.formatTime(p.verified_at)}</span><span><i class="fa-solid fa-key"></i> ${p.recovery_code}</span></div>` : `<div class="pickup-meta"><span><i class="fa-solid fa-key"></i> Recovery Code: <strong>${p.recovery_code}</strong></span></div>`}
        </div>
      </div>`;
  }).join('');
}

/* ── Actions ── */
function openAddGuardianModal() { document.getElementById('addGuardianModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function handleAddGuardian(e) {
  e.preventDefault();
  const parent = CSA.getCurrentParent();
  const checkedChildren = Array.from(document.querySelectorAll('input[name="agChildren"]:checked')).map(cb => cb.value);
  if (checkedChildren.length === 0) { Toast.warning('Select Children', 'Please select at least one child.'); return; }

  const relEmojis = { Mother: '👩', Father: '👨', Grandparent: '👴', Uncle: '👨', Aunt: '👩', Teacher: '👩‍🏫', 'School Coordinator': '👨‍🏫', 'Family Friend': '👤', Caretaker: '👤' };
  const rel = document.getElementById('agRelation').value;

  const guardian = CSA.addGuardian({
    parent_id: parent.parent_id,
    child_ids: checkedChildren,
    full_name: document.getElementById('agName').value,
    relationship: rel,
    mobile: document.getElementById('agMobile').value,
    email: document.getElementById('agEmail').value,
    address: document.getElementById('agAddress').value,
    id_type: document.getElementById('agIdType').value,
    id_number: document.getElementById('agIdNum').value,
    priority: document.getElementById('agPriority').value,
    photo_emoji: relEmojis[rel] || '👤',
  });

  Toast.success('Guardian Added!', `${guardian.full_name} added to your trusted network.`);
  closeModal('addGuardianModal');
  document.getElementById('addGuardianForm').reset();
  renderPage();
}

function handleVerify(guardianId) {
  CSA.verifyGuardian(guardianId);
  const g = CSA.getGuardianById(guardianId);
  Toast.success('Guardian Verified!', `${g.full_name} is now a verified trusted guardian.`);
  renderPage();
}

function handleAvailability(guardianId, availability) {
  CSA.setGuardianAvailability(guardianId, availability);
  renderPage();
}

function handleRemove(guardianId, name) {
  if (!confirm(`Remove ${name} from your trusted guardian network?`)) return;
  CSA.removeGuardian(guardianId);
  Toast.info('Guardian Removed', `${name} has been removed.`);
  renderPage();
}

/* ── Safe Pickup Verification Flow ── */
function initiatePickup(childId, guardianId) {
  const child = CSA.getChildById(childId);
  const guardian = CSA.getGuardianById(guardianId);
  if (!child || !guardian) return;

  // Create a pending pickup
  const pickup = CSA.createPickupRequest(childId, guardianId);

  document.getElementById('pickupModalContent').innerHTML = `
    <div class="pickup-verify-flow">
      <div class="pv-step active" id="pvStep1">
        <div class="pv-icon"><i class="fa-solid fa-qrcode"></i></div>
        <h3>Step 1: Verify Guardian QR Pass</h3>
        <p>Scan the guardian's QR verification card</p>
        <div class="pv-qr-scan-area">
          <div class="pv-qr-placeholder"><i class="fa-solid fa-camera"></i><span>Simulating QR scan...</span></div>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="pickupStep2('${pickup.pickup_id}')"><i class="fa-solid fa-check"></i> QR Verified</button>
      </div>

      <div class="pv-step" id="pvStep2" style="display:none">
        <div class="pv-icon"><i class="fa-solid fa-id-card"></i></div>
        <h3>Step 2: Verify Guardian Identity</h3>
        <p>Confirm guardian ID: <strong>${guardian.id_type} — ${guardian.id_number}</strong></p>
        <div class="pv-match-row">
          <div class="pv-match"><span>Guardian</span><div class="pv-match-avatar">${guardian.photo_emoji}</div><strong>${guardian.full_name}</strong><small>${guardian.relationship}</small></div>
          <div class="pv-match-arrow"><i class="fa-solid fa-arrows-left-right"></i></div>
          <div class="pv-match"><span>Child</span><div class="pv-match-avatar">${child.photo_emoji}</div><strong>${child.name}</strong><small>Age ${child.age}</small></div>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="pickupStep3('${pickup.pickup_id}')"><i class="fa-solid fa-check"></i> Identity Confirmed</button>
      </div>

      <div class="pv-step" id="pvStep3" style="display:none">
        <div class="pv-icon"><i class="fa-solid fa-key"></i></div>
        <h3>Step 3: Enter Recovery Code</h3>
        <p>Recovery Code: <strong class="pv-code">${pickup.recovery_code}</strong></p>
        <div class="otp-group" style="margin:1rem 0">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,0)">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,1)">
          <input type="text" maxlength="1" class="otp-input" value="-" disabled style="width:20px;border:none;background:none;font-size:1.5rem">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,3)">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,4)">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,5)">
          <input type="text" maxlength="1" class="otp-input" oninput="otpNextPV(this,6)">
        </div>
        <p style="font-size:.75rem;color:var(--text-4)">Demo: any 4 digits will work</p>
        <button class="btn btn-success" style="width:100%" onclick="pickupComplete('${pickup.pickup_id}','${guardian.guardian_id}','${child.child_id}')"><i class="fa-solid fa-hand-holding-heart"></i> Confirm Pickup</button>
      </div>

      <div class="pv-step" id="pvSuccess" style="display:none">
        <div class="pv-success-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h3 style="color:var(--success)">PICKUP VERIFIED ✅</h3>
        <div class="pv-success-details">
          <div class="pv-sd-row"><span>Guardian</span><strong>${guardian.full_name}</strong></div>
          <div class="pv-sd-row"><span>Relationship</span><strong>${guardian.relationship}</strong></div>
          <div class="pv-sd-row"><span>Time</span><strong>${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</strong></div>
          <div class="pv-sd-row"><span>Location</span><strong>Recovery Center</strong></div>
          <div class="pv-sd-row"><span>Recovery Code</span><strong>${pickup.recovery_code}</strong></div>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:1rem" onclick="closeModal('pickupModal');renderPage()"><i class="fa-solid fa-check"></i> Done</button>
      </div>
    </div>
  `;
  document.getElementById('pickupModal').classList.add('open');
}

function pickupStep2(pickupId) {
  document.getElementById('pvStep1').style.display = 'none';
  document.getElementById('pvStep2').style.display = 'block';
}

function pickupStep3(pickupId) {
  document.getElementById('pvStep2').style.display = 'none';
  document.getElementById('pvStep3').style.display = 'block';
  setTimeout(() => document.querySelector('#pvStep3 .otp-input:not([disabled])')?.focus(), 100);
}

function pickupComplete(pickupId, guardianId, childId) {
  CSA.completePickup(pickupId, {
    location: 'Recovery Center',
    verification_method: 'qr_scan + id + recovery_code',
    notes: 'Full verification completed via Guardian Network.',
  });

  document.getElementById('pvStep3').style.display = 'none';
  document.getElementById('pvSuccess').style.display = 'block';
  Toast.success('Child Reunited!', 'Secure pickup verified. Timeline updated.');
}

function otpNextPV(input, idx) {
  if (input.value.length === 1) {
    const all = document.querySelectorAll('#pvStep3 .otp-input:not([disabled])');
    const currentIdx = Array.from(all).indexOf(input);
    if (currentIdx < all.length - 1) all[currentIdx + 1].focus();
  }
}
