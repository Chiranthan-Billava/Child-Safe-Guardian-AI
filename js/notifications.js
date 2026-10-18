/* =============================================
   NOTIFICATIONS.JS – Notification Center & Recovery Timeline
   ============================================= */

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderNotifications();
  setupFilterTabs();
  populateTimelineSelector();
  setupTimelineViewTabs();
});

function updateStats() {
  const notifs = CSA.getNotifications();
  document.getElementById('statTotalNotifs').textContent = notifs.length;
  document.getElementById('statGeoAlerts').textContent = notifs.filter(n => n.type === 'geofence').length;
  document.getElementById('statSightings').textContent = notifs.filter(n => n.type === 'sighting').length;
  document.getElementById('statRecoveries').textContent = notifs.filter(n => n.type === 'recovery').length;
}

function renderNotifications() {
  const container = document.getElementById('notificationsList');
  let notifs = CSA.getNotifications();

  if (currentFilter !== 'all') {
    notifs = notifs.filter(n => n.type === currentFilter);
  }

  if (notifs.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:2rem">
        <div class="empty-state-icon"><i class="fa-solid fa-bell-slash"></i></div>
        <h3>No Notifications</h3>
        <p>No notifications match the current filter.</p>
      </div>
    `;
    return;
  }

  // Sort by timestamp, newest first
  notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  container.innerHTML = notifs.map(n => {
    const iconMap = {
      geofence: 'fa-location-crosshairs',
      sighting: 'fa-eye',
      'qr-scan': 'fa-qrcode',
      commander: 'fa-brain',
      recovery: 'fa-heart',
      tamper: 'fa-shield-halved',
      sos: 'fa-circle-exclamation',
      safety_score: 'fa-brain',
    };
    const icon = iconMap[n.type] || 'fa-bell';

    const channelsHTML = (n.channels || []).map(ch =>
      `<span class="channel-badge ${ch}">${ch}</span>`
    ).join('');

    return `
      <div class="notification-card ${n.read ? '' : 'unread'}" id="notif-${n.id}">
        <div class="notification-icon-wrap ${n.type}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="notification-body">
          <div class="notification-title">${n.title}</div>
          <div class="notification-message">${n.message}</div>
          <div class="notification-meta">
            <span><i class="fa-solid fa-clock" style="margin-right:.25rem"></i> ${CSA.formatTime(n.timestamp)}</span>
            <span><i class="fa-solid fa-location-dot" style="margin-right:.25rem"></i> ${n.location || '—'}</span>
            <div class="notification-channels">${channelsHTML}</div>
          </div>
        </div>
        ${!n.read ? `<button class="btn btn-ghost btn-icon-sm" title="Mark as read" onclick="markRead('${n.id}')"><i class="fa-solid fa-check"></i></button>` : ''}
      </div>
    `;
  }).join('');
}

function setupFilterTabs() {
  const tabs = document.querySelectorAll('#notifTabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderNotifications();
    });
  });
}

function markRead(id) {
  CSA.markNotificationRead(id);
  renderNotifications();
  updateStats();
}

/* ── Recovery Timeline ── */

function populateTimelineSelector() {
  const sel = document.getElementById('timelineSelect');
  const timelines = CSA.getTimelines();
  const wristbandIds = Object.keys(timelines);

  sel.innerHTML = wristbandIds.map(wbid => {
    const wb = CSA.getWristbandById(wbid);
    const name = wb ? wb.child_name : wbid;
    return `<option value="${wbid}">${name} (${wbid})</option>`;
  }).join('');

  if (wristbandIds.length === 0) {
    sel.innerHTML = '<option>No timelines available</option>';
    return;
  }

  sel.addEventListener('change', () => {
    renderRecoveryTimeline(sel.value);
    renderCommandLog(sel.value);
    renderAnalytics(sel.value);
  });

  // Load first
  renderRecoveryTimeline(wristbandIds[0]);
  renderCommandLog(wristbandIds[0]);
  renderAnalytics(wristbandIds[0]);
}

function renderRecoveryTimeline(wbid) {
  const events = CSA.getTimeline(wbid);
  const container = document.getElementById('recoveryTimeline');

  if (events.length === 0) {
    container.innerHTML = '<div class="empty-state" style="padding:1rem"><p>No timeline events.</p></div>';
    return;
  }

  container.innerHTML = events.map(evt => `
    <div class="recovery-event">
      <div class="recovery-event-dot ${evt.type}"><i class="fa-solid ${evt.icon || 'fa-circle'}"></i></div>
      <div class="recovery-event-content">
        <div class="recovery-event-time">${CSA.formatTimeShort(evt.time)}</div>
        <div class="recovery-event-title">${evt.event}</div>
        <div class="recovery-event-source">Source: ${evt.source}</div>
      </div>
    </div>
  `).join('');
}

function renderCommandLog(wbid) {
  const events = CSA.getTimeline(wbid);
  const tbody = document.getElementById('logTableBody');

  tbody.innerHTML = events.map(evt => `
    <tr>
      <td style="white-space:nowrap;font-weight:600">${CSA.formatTimeShort(evt.time)}</td>
      <td>${evt.event}</td>
      <td><span class="badge badge-${evt.type === 'recovery' ? 'found' : 'active'}" style="font-size:.65rem">${evt.source}</span></td>
    </tr>
  `).join('');
}

function renderAnalytics(wbid) {
  const events = CSA.getTimeline(wbid);
  const container = document.getElementById('analyticsCards');

  if (events.length === 0) {
    container.innerHTML = '<p style="color:var(--text-3);font-size:.8125rem">No data available.</p>';
    return;
  }

  // Calculate analytics
  const firstEvent = new Date(events[0].time);
  const lastEvent = new Date(events[events.length - 1].time);
  const totalMinutes = Math.round((lastEvent - firstEvent) / 60000);
  const numEvents = events.length;
  const isRecovered = events.some(e => e.type === 'recovery');
  const numSightings = events.filter(e => e.type === 'sighting').length;

  container.innerHTML = `
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:var(--primary)">${totalMinutes}m</div>
      <div style="font-size:.7rem;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em">Total Duration</div>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:var(--accent)">${numEvents}</div>
      <div style="font-size:.7rem;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em">Total Events</div>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:var(--warning)">${numSightings}</div>
      <div style="font-size:.7rem;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em">Sightings</div>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:${isRecovered ? 'var(--success)' : 'var(--danger)'}">${isRecovered ? '✅' : '🔍'}</div>
      <div style="font-size:.7rem;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em">${isRecovered ? 'Recovered' : 'Searching'}</div>
    </div>
  `;
}

function setupTimelineViewTabs() {
  const tabs = document.querySelectorAll('.timeline-tab');
  const views = {
    timeline: document.getElementById('timelineView'),
    log: document.getElementById('logView'),
    analytics: document.getElementById('analyticsView'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const view = tab.getAttribute('data-view');
      Object.values(views).forEach(v => v.style.display = 'none');
      views[view].style.display = 'block';
    });
  });
}
