/* admin.js */
document.addEventListener('DOMContentLoaded', () => {
  loadAdminStats();
  renderCasesTable();
  renderSightingsTable();
  renderVolunteersAdmin();
  renderActivityFeed();
  updateTabCounts();
});

function loadAdminStats() {
  const stats = CSA.getStats();
  const pending = CSA.getSightings().filter(s => !s.verified).length;
  setText('aStatActive', stats.active);
  setText('aStatSightings', pending);
  setText('aStatFound', stats.reunited);
  setText('aStatVols', stats.volunteers);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateTabCounts() {
  const cases = CSA.getCases();
  const sightings = CSA.getSightings();
  const vols = CSA.getVolunteers();
  setText('tabCaseCount', cases.length);
  setText('tabSightingCount', sightings.length);
  setText('tabVolCount', vols.length);
}

function renderCasesTable() {
  const search = (document.getElementById('caseSearchAdmin')?.value || '').toLowerCase();
  const statusF = document.getElementById('caseStatusFilter')?.value || '';
  let cases = CSA.getCases();
  if (search) cases = cases.filter(c => c.child_name.toLowerCase().includes(search) || c.case_id.toLowerCase().includes(search));
  if (statusF) cases = cases.filter(c => c.status === statusF);

  const tbody = document.getElementById('casesTableBody');
  if (!tbody) return;
  if (cases.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-3)">No cases found</td></tr>';
    return;
  }

  tbody.innerHTML = cases.map(c => `
    <tr>
      <td><span style="font-weight:700;color:var(--primary);font-size:.875rem">${c.case_id}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:.625rem">
          <span style="font-size:1.5rem">${c.photo_emoji||'👤'}</span>
          <div>
            <div style="font-weight:700;font-size:.875rem">${c.child_name}</div>
            <div style="font-size:.75rem;color:var(--text-3)">${c.parent_name}</div>
          </div>
        </div>
      </td>
      <td style="font-size:.875rem">${c.age}y · ${c.gender}</td>
      <td style="font-size:.8rem;color:var(--text-2);max-width:180px">${c.last_seen_location}</td>
      <td style="font-size:.8rem;color:var(--text-3)">${CSA.timeAgo(c.reported_at)}</td>
      <td>
        <select class="status-select" onchange="quickUpdateStatus('${c.case_id}', this.value)" style="font-size:.8rem">
          ${['active','searching','investigating','found','closed'].map(s => `<option value="${s}"${c.status===s?' selected':''}>${CSA.statusLabel(s)}</option>`).join('')}
        </select>
      </td>
      <td>
        <div style="display:flex;gap:.375rem">
          <a href="case.html?id=${c.case_id}" class="btn btn-primary btn-icon-sm" title="View"><i class="fa-solid fa-eye"></i></a>
          <button class="btn btn-success btn-icon-sm" title="Mark Found" onclick="markFound('${c.case_id}')"><i class="fa-solid fa-check"></i></button>
          <button class="btn btn-ghost btn-icon-sm" title="Share" onclick="shareAlert('${c.case_id}','${c.child_name}')"><i class="fa-solid fa-share-nodes"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function quickUpdateStatus(caseId, status) {
  CSA.updateCaseStatus(caseId, status);
  Toast.success('Status Updated', `${caseId} → ${CSA.statusLabel(status)}`);
  loadAdminStats();
  if (status === 'found') {
    setTimeout(() => Toast.success('🎉 Child Found!', 'Family has been notified. Case can now be closed.'), 600);
  }
}

function markFound(caseId) {
  quickUpdateStatus(caseId, 'found');
}

function renderSightingsTable() {
  const sightings = CSA.getSightings();
  const tbody = document.getElementById('sightingsTableBody');
  if (!tbody) return;
  tbody.innerHTML = sightings.map(s => {
    const c = CSA.getCaseById(s.case_id);
    return `
      <tr>
        <td style="font-size:.8rem;color:var(--text-3)">${s.sighting_id}</td>
        <td>
          <div style="font-weight:600;font-size:.875rem">${c ? c.child_name : s.case_id}</div>
          <div style="font-size:.75rem;color:var(--primary)">${s.case_id}</div>
        </td>
        <td style="font-size:.8rem">${s.location}</td>
        <td style="font-size:.8rem;color:var(--text-3)">${CSA.timeAgo(s.timestamp)}</td>
        <td style="font-size:.8rem;color:var(--text-2);max-width:200px">${s.description}</td>
        <td>
          ${s.verified
            ? '<span class="badge badge-found"><i class="fa-solid fa-check"></i> Verified</span>'
            : '<span class="badge badge-searching">Pending</span>'
          }
        </td>
        <td>
          <div style="display:flex;gap:.375rem">
            ${!s.verified ? `<button class="btn btn-success btn-sm" onclick="verifySighting('${s.sighting_id}')"><i class="fa-solid fa-check"></i> Verify</button>` : ''}
            <a href="case.html?id=${s.case_id}" class="btn btn-ghost btn-icon-sm"><i class="fa-solid fa-eye"></i></a>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function verifySighting(id) {
  CSA.verifySighting(id);
  renderSightingsTable();
  Toast.success('Sighting Verified', 'The sighting has been confirmed and added to the case timeline.');
}

function renderVolunteersAdmin() {
  const vols = CSA.getVolunteers();
  const el = document.getElementById('adminVolGrid');
  if (!el) return;
  el.innerHTML = vols.map(v => `
    <div class="volunteer-card">
      <div class="volunteer-avatar" style="background:${v.color}">${v.name.charAt(0)}</div>
      <div class="volunteer-info" style="flex:1">
        <div class="volunteer-name">${v.name}</div>
        <div class="volunteer-area"><i class="fa-solid fa-map-pin"></i> ${v.assigned_area}</div>
        <div style="font-size:.75rem;color:var(--text-3);margin-top:.25rem"><i class="fa-solid fa-phone"></i> ${v.contact}</div>
        <div style="display:flex;gap:.375rem;margin-top:.5rem;align-items:center">
          <span class="badge ${v.status==='active'?'badge-found':'badge-searching'}">${v.status}</span>
          <span style="font-size:.7rem;color:var(--text-4)">${v.sightings_reported} sightings</span>
        </div>
      </div>
    </div>`).join('');
}

const ACTIVITY_FEED = [
  { icon: 'fa-circle-exclamation', color: 'var(--danger)', text: 'New case filed: Siddharth Bhat (CSA-2026-009)', time: '7 min ago' },
  { icon: 'fa-eye', color: 'var(--warning)', text: 'Sighting reported for Aryan Sharma at First Aid Post', time: '12 min ago' },
  { icon: 'fa-user-plus', color: 'var(--primary)', text: 'Volunteer Padma Venkat marked active at Main Entrance', time: '18 min ago' },
  { icon: 'fa-check-circle', color: 'var(--success)', text: 'Sighting SIG-008 verified by admin', time: '25 min ago' },
  { icon: 'fa-circle-exclamation', color: 'var(--danger)', text: 'New case: Sneha Krishnamurthy (CSA-2026-006)', time: '30 min ago' },
  { icon: 'fa-bell', color: 'var(--accent)', text: 'Broadcast alert sent to 18 volunteers', time: '35 min ago' },
  { icon: 'fa-eye', color: 'var(--warning)', text: 'Sighting for Rahul Gowda – Lost & Found Counter', time: '45 min ago' },
  { icon: 'fa-check-circle', color: 'var(--success)', text: 'Case CSA-2025-098: Child reunited with family', time: '1 hour ago' },
];

function renderActivityFeed() {
  const el = document.getElementById('activityFeed');
  if (!el) return;
  el.innerHTML = ACTIVITY_FEED.map(a => `
    <div style="display:flex;gap:.875rem;padding:.875rem 1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);align-items:center">
      <div style="width:36px;height:36px;border-radius:50%;background:${a.color}18;color:${a.color};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid ${a.icon}"></i></div>
      <div style="flex:1;font-size:.875rem;font-weight:500;color:var(--text)">${a.text}</div>
      <div style="font-size:.75rem;color:var(--text-3);white-space:nowrap">${a.time}</div>
    </div>`).join('');
}

function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  btn.classList.add('active');
}
