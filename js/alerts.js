/* alerts.js */
const PAGE_SIZE = 9;
let currentPage = 1;
let filteredCases = [];

function renderCaseCard(c) {
  const color = getAvatarColor(c.child_name);
  const hasPhoto = c.photo && c.photo.length > 50;
  return `
    <div class="case-card${c.priority?' priority':''}">
      <div class="case-card-photo" style="${!hasPhoto?`background:${color}18`:''}" >
        ${hasPhoto
          ? `<img src="${c.photo}" alt="${c.child_name}">`
          : `<div class="photo-placeholder" style="gap:.5rem">
               <span style="font-size:3.5rem">${c.photo_emoji||'👤'}</span>
               <span style="font-size:.75rem;color:${color};font-weight:600">No Photo</span>
             </div>`
        }
        <div class="case-card-status">
          <span class="badge ${CSA.statusClass(c.status)}">
            <span class="status-dot ${c.status}"></span>${CSA.statusLabel(c.status)}
          </span>
        </div>
        ${c.priority?'<div style="position:absolute;top:.5rem;left:.5rem;background:var(--accent);color:white;font-size:.6rem;font-weight:800;letter-spacing:.08em;padding:.2rem .5rem;border-radius:4px">⚡ PRIORITY</div>':''}
      </div>
      <div class="case-card-body">
        <div class="case-id">${c.case_id}</div>
        <div class="case-name">${c.child_name}</div>
        <div class="case-meta">
          <span><i class="fa-solid fa-cake-candles"></i> Age ${c.age}</span>
          <span><i class="fa-solid fa-venus-mars"></i> ${c.gender}</span>
        </div>
        <div class="case-location"><i class="fa-solid fa-location-dot" style="color:var(--accent)"></i> ${c.last_seen_location}</div>
        <div class="case-time"><i class="fa-regular fa-clock"></i> Reported ${CSA.timeAgo(c.reported_at)}</div>
      </div>
      <div class="case-card-footer" style="display:flex;gap:.5rem">
        <a href="case.html?id=${c.case_id}" class="btn btn-primary btn-sm" style="flex:1">
          <i class="fa-solid fa-eye"></i> View
        </a>
        <a href="sighting.html?case=${c.case_id}" class="btn btn-outline btn-sm" style="flex:1">
          <i class="fa-solid fa-location-arrow"></i> Sighting
        </a>
      </div>
    </div>`;
}

function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const gender = document.getElementById('genderFilter').value;
  const sort   = document.getElementById('sortBy').value;

  let cases = CSA.getCases();

  if (search) {
    cases = cases.filter(c =>
      c.child_name.toLowerCase().includes(search) ||
      c.case_id.toLowerCase().includes(search) ||
      c.last_seen_location.toLowerCase().includes(search)
    );
  }
  if (status) cases = cases.filter(c => c.status === status);
  if (gender) cases = cases.filter(c => c.gender === gender);

  // Sort
  if (sort === 'priority') cases.sort((a,b) => (b.priority?1:0) - (a.priority?1:0));
  else if (sort === 'name') cases.sort((a,b) => a.child_name.localeCompare(b.child_name));
  else if (sort === 'age') cases.sort((a,b) => a.age - b.age);
  else cases.sort((a,b) => new Date(b.reported_at) - new Date(a.reported_at));

  filteredCases = cases;
  currentPage = 1;
  renderPage();
}

function renderPage() {
  const grid = document.getElementById('alertsGrid');
  const emptyEl = document.getElementById('emptyState');
  const countEl = document.getElementById('resultCount');
  const total = filteredCases.length;
  countEl.textContent = `${total} alert${total !== 1 ? 's' : ''} found`;

  if (total === 0) {
    grid.innerHTML = '';
    emptyEl.style.display = 'block';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredCases.slice(start, start + PAGE_SIZE);
  grid.innerHTML = pageItems.map(renderCaseCard).join('');
  renderPagination();
}

function renderPagination() {
  const pages = Math.ceil(filteredCases.length / PAGE_SIZE);
  if (pages <= 1) { document.getElementById('pagination').innerHTML = ''; return; }

  let html = '';
  if (currentPage > 1) html += `<button class="page-btn" onclick="gotoPage(${currentPage-1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn${i===currentPage?' active':''}" onclick="gotoPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span style="padding:0 .25rem;color:var(--text-4)">…</span>`;
    }
  }
  if (currentPage < pages) html += `<button class="page-btn" onclick="gotoPage(${currentPage+1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  document.getElementById('pagination').innerHTML = html;
}

function gotoPage(p) {
  currentPage = p;
  renderPage();
  document.querySelector('.alerts-toolbar').scrollIntoView({ behavior: 'smooth' });
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('genderFilter').value = '';
  document.getElementById('sortBy').value = 'latest';
  applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  applyFilters();
  ['searchInput','statusFilter','genderFilter','sortBy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyFilters);
    if (el) el.addEventListener('change', applyFilters);
  });
});
