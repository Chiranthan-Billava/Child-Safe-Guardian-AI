/* analytics.js */
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#64748b';

document.addEventListener('DOMContentLoaded', () => {
  const stats = CSA.getStats();
  const cases = CSA.getCases();

  setText('kpi1', cases.length);
  setText('kpi2', 247);
  setText('kpi4', CSA.getVolunteers().length);

  initDonutChart(cases);
  initLineChart();
  initBarChart(cases);
  initHBarChart(cases);
  initTimeChart();
  initSightingsChart(cases);
  renderEventSummaryTable(cases);
});

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

const CHART_COLORS = {
  active:        '#ef4444',
  searching:     '#f59e0b',
  investigating: '#3b82f6',
  found:         '#22c55e',
  closed:        '#94a3b8',
};

// 1. Donut – Status Distribution
function initDonutChart(cases) {
  const counts = {};
  cases.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
  // Add demo "found" data
  counts['found'] = (counts['found'] || 0) + 8;
  counts['closed'] = (counts['closed'] || 0) + 3;

  new Chart(document.getElementById('chartDonut'), {
    type: 'doughnut',
    data: {
      labels: ['Active', 'Searching', 'Investigating', 'Found', 'Closed'],
      datasets: [{
        data: [
          counts['active']||0, counts['searching']||0,
          counts['investigating']||0, counts['found']||0, counts['closed']||0
        ],
        backgroundColor: ['#ef4444','#f59e0b','#3b82f6','#22c55e','#94a3b8'],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} cases` } }
      }
    }
  });
}

// 2. Line – Monthly Trends
function initLineChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const reported = [8, 12, 7, 15, 18, 10];
  const resolved = [7, 11, 7, 14, 16, 8];

  new Chart(document.getElementById('chartLine'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Cases Reported',
          data: reported,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointRadius: 5,
        },
        {
          label: 'Children Reunited',
          data: resolved,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 2 } },
        x: { grid: { display: false } }
      }
    }
  });
}

// 3. Bar – Cases by Event Type
function initBarChart(cases) {
  const types = { 'Religious Festival': 3, 'Temple Event': 2, 'School Function': 1, 'College Fest': 1, 'Community Fair': 2, 'Exhibition': 1 };

  new Chart(document.getElementById('chartBar'), {
    type: 'bar',
    data: {
      labels: Object.keys(types),
      datasets: [{
        label: 'Cases',
        data: Object.values(types),
        backgroundColor: ['#f97316','#1a56db','#22c55e','#7c3aed','#f59e0b','#0891b2'],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 1 } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

// 4. Horizontal Bar – By Location/City
function initHBarChart(cases) {
  const cities = { 'Mysore': 4, 'Bangalore': 4, 'Tirupathi': 2 };

  new Chart(document.getElementById('chartHBar'), {
    type: 'bar',
    data: {
      labels: Object.keys(cities),
      datasets: [{
        label: 'Cases',
        data: Object.values(cities),
        backgroundColor: ['#1a56db','#f97316','#22c55e'],
        borderRadius: 6,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 1 } },
        y: { grid: { display: false } }
      }
    }
  });
}

// 5. Bar – Reunification Time Distribution
function initTimeChart() {
  new Chart(document.getElementById('chartTime'), {
    type: 'bar',
    data: {
      labels: ['< 5 min', '5-15 min', '15-30 min', '30-60 min', '1-2 hrs', '> 2 hrs'],
      datasets: [{
        label: 'Cases Resolved',
        data: [12, 68, 95, 45, 18, 9],
        backgroundColor: '#1a56db',
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

// 6. Doughnut – Sightings before reunification
function initSightingsChart(cases) {
  new Chart(document.getElementById('chartSightings'), {
    type: 'doughnut',
    data: {
      labels: ['0 sightings', '1 sighting', '2 sightings', '3+ sightings'],
      datasets: [{
        data: [18, 112, 78, 39],
        backgroundColor: ['#94a3b8','#3b82f6','#f97316','#22c55e'],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } }
      }
    }
  });
}

// Event Summary Table
function renderEventSummaryTable(cases) {
  const events = CSA.getEvents();
  const tbody = document.getElementById('eventSummaryTable');
  if (!tbody) return;

  const rows = events.map(ev => {
    const evCases = cases.filter(c => c.event_id === ev.event_id);
    const total = evCases.length + Math.floor(Math.random() * 5 + 2); // Demo: add some resolved
    const active = evCases.filter(c => ['active','searching','investigating'].includes(c.status)).length;
    const resolved = total - active;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { ev, total, active, resolved, rate };
  });

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td style="font-weight:700">${r.ev.name}</td>
      <td style="font-size:.875rem;color:var(--text-3)">${r.ev.venue}</td>
      <td style="font-weight:600">${r.total}</td>
      <td style="color:var(--success);font-weight:600">${r.resolved}</td>
      <td><span class="badge ${r.active>0?'badge-active':'badge-found'}">${r.active}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:.75rem">
          <div class="progress-bar" style="flex:1;max-width:100px">
            <div class="progress-fill ${r.rate>=90?'success':r.rate>=70?'':'danger'}" style="width:${r.rate}%"></div>
          </div>
          <span style="font-weight:700;font-size:.875rem;color:${r.rate>=90?'var(--success)':r.rate>=70?'var(--warning)':'var(--danger)'}">${r.rate}%</span>
        </div>
      </td>
    </tr>`).join('');
}
