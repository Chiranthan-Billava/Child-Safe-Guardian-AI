/* sighting.js */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const prefilledCase = params.get('case');

  // Populate case dropdown
  const sel = document.getElementById('caseSelect');
  const cases = CSA.getCases().filter(c => ['active','searching','investigating'].includes(c.status));
  cases.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.case_id;
    opt.textContent = `${c.case_id} – ${c.child_name} (Age ${c.age})`;
    sel.appendChild(opt);
  });

  if (prefilledCase) {
    sel.value = prefilledCase;
    document.getElementById('caseSelectGroup').style.display = 'none';
    showCaseRef(prefilledCase);
  }

  // Default time = now
  const timeInput = document.getElementById('sightingTime');
  if (timeInput) timeInput.value = new Date().toISOString().slice(0,16);
});

function showCaseRef(caseId) {
  const c = CSA.getCaseById(caseId);
  if (!c) return;
  const el = document.getElementById('caseRefCard');
  if (!el) return;
  const color = getAvatarColor(c.child_name);
  el.innerHTML = `
    <div class="card" style="border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)">
      <div class="card-body" style="display:flex;gap:1rem;align-items:center">
        <div style="width:60px;height:60px;border-radius:var(--radius);background:${color}18;display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0">${c.photo_emoji||'👤'}</div>
        <div style="flex:1">
          <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)">Reporting sighting for</div>
          <div style="font-size:1.125rem;font-weight:800;color:var(--text)">${c.child_name}</div>
          <div style="font-size:.8rem;color:var(--text-3)">${c.case_id} · Age ${c.age} · ${c.gender}</div>
        </div>
        <span class="badge ${CSA.statusClass(c.status)}">${CSA.statusLabel(c.status)}</span>
      </div>
    </div>`;
  el.style.display = 'block';

  document.getElementById('sightingSubtitle').textContent = `Where and when did you see ${c.child_name}?`;
}

function submitSighting() {
  const caseId = document.getElementById('caseSelect').value;
  const location = document.getElementById('sightingLocation').value.trim();
  const desc = document.getElementById('sightingDesc').value.trim();
  const contact = document.getElementById('sightingContact').value.trim();
  const time = document.getElementById('sightingTime').value;

  if (!caseId) { Toast.error('No Case Selected', 'Please select or scan a case.'); return; }
  if (!location) { Toast.error('Location Required', 'Please enter where you saw the child.'); document.getElementById('sightingLocation').classList.add('error'); return; }
  if (!desc) { Toast.error('Description Required', 'Please describe what you saw.'); document.getElementById('sightingDesc').classList.add('error'); return; }
  if (!contact) { Toast.error('Contact Required', 'Please provide your phone number.'); document.getElementById('sightingContact').classList.add('error'); return; }

  const sightingData = { case_id: caseId, location, description: desc, contact, timestamp: time || new Date().toISOString() };
  CSA.addSighting(sightingData);

  // Hide form, show success
  document.querySelector('.sighting-container').style.display = 'none';
  document.getElementById('sightingSuccess').style.display = 'block';
  window.scrollTo({ top: 200, behavior: 'smooth' });

  Toast.success('Report Submitted!', 'Volunteers have been notified. Thank you!');
  sendMockNotification('sms', { contact });
}
