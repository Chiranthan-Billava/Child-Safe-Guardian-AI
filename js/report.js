/* report.js */
document.addEventListener('DOMContentLoaded', () => {
  // Populate events dropdown
  const eventSel = document.getElementById('eventId');
  if (eventSel) {
    CSA.getEvents().forEach(ev => {
      const opt = document.createElement('option');
      opt.value = ev.event_id;
      opt.textContent = ev.name;
      eventSel.appendChild(opt);
    });
  }

  // Set default time to now
  const timeInput = document.getElementById('lastSeenTime');
  if (timeInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    timeInput.value = now.toISOString().slice(0,16);
  }

  // Photo Upload Preview
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const uploadArea = document.getElementById('photoUploadArea');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          photoPreview.src = ev.target.result;
          photoPreview.classList.add('visible');
          uploadArea.querySelector('.file-upload-icon').innerHTML = '<i class="fa-solid fa-check" style="color:var(--success)"></i>';
          uploadArea.querySelector('p').innerHTML = '<strong>Photo uploaded</strong>';
        };
        reader.readAsDataURL(file);
      }
    });

    uploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        photoInput.files = e.dataTransfer.files;
        photoInput.dispatchEvent(new Event('change'));
      }
    });
  }
});

function validate(step) {
  const required = { 1: ['childName','childAge','childGender','clothing'], 2: ['parentName','parentContact','lastSeenLocation','lastSeenTime'] };
  let valid = true;
  if (!required[step]) return true;
  required[step].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
      el.addEventListener('input', () => el.classList.remove('error'), { once: true });
    }
  });
  if (!valid) Toast.error('Missing Fields', 'Please fill all required fields marked with *.');
  return valid;
}

function goToStep(step) {
  const prev = step - 1;
  if (step > 1 && !validate(prev)) return;

  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`step${i}`);
    if (panel) panel.style.display = i === step ? 'block' : 'none';
    const ws = document.getElementById(`ws${i}`);
    if (ws) {
      ws.classList.toggle('active', i === step);
      ws.classList.toggle('done', i < step);
    }
  }

  if (step === 3) buildReview();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function buildReview() {
  const el = document.getElementById('reviewContent');
  if (!el) return;
  const eventSel = document.getElementById('eventId');
  const eventName = eventSel && eventSel.selectedOptions[0] ? eventSel.selectedOptions[0].text : '—';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem 2rem">
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Child's Name</div><div style="font-weight:700;color:var(--text)">${g('childName')}</div></div>
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Age / Gender</div><div style="font-weight:600;color:var(--text)">${g('childAge')} years · ${g('childGender')}</div></div>
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Parent/Guardian</div><div style="font-weight:600;color:var(--text)">${g('parentName')}</div></div>
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Contact</div><div style="font-weight:600;color:var(--text)">${g('parentContact')}</div></div>
      <div style="grid-column:1/-1"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Last Seen Location</div><div style="font-weight:600;color:var(--text)">${g('lastSeenLocation')}</div></div>
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Last Seen Time</div><div style="font-weight:600;color:var(--text)">${formatDT(g('lastSeenTime'))}</div></div>
      <div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Event</div><div style="font-weight:600;color:var(--text)">${eventName}</div></div>
      <div style="grid-column:1/-1"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Clothing</div><div style="font-weight:600;color:var(--text)">${g('clothing')}</div></div>
      ${g('notes')?`<div style="grid-column:1/-1"><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-4);font-weight:700">Notes</div><div style="color:var(--text-2)">${g('notes')}</div></div>`:''}
    </div>`;
}

function g(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function formatDT(val) {
  if (!val) return '—';
  return new Date(val).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });
}

function submitReport() {
  const consent = document.getElementById('confirmConsent');
  if (!consent || !consent.checked) {
    Toast.warning('Consent Required', 'Please check the consent box before submitting.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  const photo = document.getElementById('photoPreview');
  const photoData = photo && photo.classList.contains('visible') ? photo.src : null;
  const photoEmojis = { Male: '👦', Female: '👧', Other: '🧒' };

  const caseData = {
    child_name: g('childName'),
    age: parseInt(g('childAge')) || 0,
    gender: g('childGender'),
    parent_name: g('parentName'),
    parent_contact: g('parentContact'),
    last_seen_location: g('lastSeenLocation'),
    last_seen_time: g('lastSeenTime') || new Date().toISOString(),
    clothing: g('clothing'),
    notes: g('notes'),
    event_id: g('eventId') || null,
    photo: photoData,
    photo_emoji: photoEmojis[g('childGender')] || '🧒',
    priority: false,
  };

  setTimeout(() => {
    const newCase = CSA.addCase(caseData);

    // Show success modal
    const idEl = document.getElementById('newCaseId');
    if (idEl) idEl.textContent = newCase.case_id;

    const url = getCasePageUrl(newCase.case_id);
    generateQR('successQR', url, 160);

    const shareBtn = document.getElementById('shareBtnModal');
    if (shareBtn) shareBtn.onclick = () => shareAlert(newCase.case_id, newCase.child_name);

    Modal.open('successModal');
    sendMockNotification('sms', { contact: newCase.parent_contact });
    sendMockNotification('broadcast', {});

    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Emergency Report';
    submitBtn.disabled = false;
  }, 1200);
}
