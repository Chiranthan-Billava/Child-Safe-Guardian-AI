/* =============================================
   AI-SEARCH-COMMANDER.JS – Commander & Heatmap
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  populateCaseSelect();
  generateHeatmap();
  startHeatmapUpdates();
});

function populateCaseSelect() {
  const sel = document.getElementById('commanderCaseSelect');
  const wristbands = CSA.getWristbands();
  sel.innerHTML = wristbands.map(w =>
    `<option value="${w.wristband_id}">${w.child_name} – ${w.wristband_id}</option>`
  ).join('');

  sel.addEventListener('change', () => {
    updateCommanderForCase(sel.value);
  });

  if (wristbands.length > 0) {
    updateCommanderForCase(wristbands[0].wristband_id);
  }
}

function updateCommanderForCase(wbid) {
  const wb = CSA.getWristbandById(wbid);
  if (!wb) return;

  // Randomize some values for realism
  const riskScores = [6.5, 7.2, 8.1, 5.8, 9.0, 7.8];
  const recoveryProbs = [88, 92, 85, 94, 78, 91];
  const searchRadii = [150, 250, 300, 200, 400, 175];
  const estTimes = [6, 8, 12, 5, 15, 10];

  const idx = parseInt(wbid.slice(-1)) % riskScores.length;

  document.getElementById('cmdRiskScore').textContent = riskScores[idx];
  document.getElementById('cmdRecoveryProb').textContent = recoveryProbs[idx] + '%';
  document.getElementById('cmdSearchRadius').textContent = searchRadii[idx] + 'm';
  document.getElementById('cmdEstTime').textContent = estTimes[idx] + ' min';
}

function generateHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  const cells = 80; // 10x8 grid
  const levels = ['low', 'low', 'low', 'medium', 'medium', 'high', 'low', 'low', 'medium', 'critical'];

  let html = '';
  for (let i = 0; i < cells; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    html += `<div class="heatmap-cell ${level}" data-cell="${i}" title="Zone ${Math.floor(i/10)+1}-${(i%10)+1}: ${level}"></div>`;
  }
  grid.innerHTML = html;

  // Set some specific hot zones
  const hotZones = [23, 24, 33, 34, 43, 44]; // Food court area
  const warmZones = [15, 16, 25, 26]; // Main stage
  hotZones.forEach(idx => {
    const cell = grid.children[idx];
    if (cell) { cell.className = 'heatmap-cell critical'; }
  });
  warmZones.forEach(idx => {
    const cell = grid.children[idx];
    if (cell) { cell.className = 'heatmap-cell high'; }
  });
}

function startHeatmapUpdates() {
  setInterval(() => {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    // Randomly update 3-5 cells
    const numUpdates = 3 + Math.floor(Math.random() * 3);
    const levels = ['low', 'medium', 'high', 'medium', 'low'];

    for (let i = 0; i < numUpdates; i++) {
      const cellIdx = Math.floor(Math.random() * 80);
      const cell = grid.children[cellIdx];
      if (cell && !cell.classList.contains('critical')) {
        const newLevel = levels[Math.floor(Math.random() * levels.length)];
        cell.className = `heatmap-cell ${newLevel}`;
      }
    }
  }, 5000);
}
