// ARENA XI — renderização dos cards de times a partir de TEAMS (teams-data.js)

const LEAGUE_LABELS = {
  premier: 'Premier League · Inglaterra',
  laliga: 'La Liga · Espanha',
  seriea: 'Serie A · Itália',
  bundesliga: 'Bundesliga · Alemanha',
  ligue1: 'Ligue 1 · França',
  brasileirao: 'Brasileirão · Brasil'
};

function pillList(items){
  return items.map(i => `<span class="tag-pill">${i}</span>`).join('');
}

function lineupRows(lines){
  return lines.map(row => {
    const players = row.map(p => `<div class="player">${p}</div>`).join('');
    return `<div class="row">${players}</div>`;
  }).join('');
}

function crestMarkup(t){
  return `<img class="team-card__crest" src="assets/crests/${t.id}.png" alt="Escudo do ${t.name}" loading="lazy" style="border-color:${t.color};" data-crest-fallback data-crest-color="${t.color}">`;
}

function teamCardHTML(t){
  return `
  <article class="team-card reveal in" id="${t.id}" data-league="${t.league}" data-name="${t.name.toLowerCase()}">
    <div class="team-card__top">
      ${crestMarkup(t)}
      <div>
        <small>${LEAGUE_LABELS[t.league]}</small>
        <h3 style="margin:0;">${t.name}</h3>
      </div>
      <span class="chev">▾</span>
    </div>
    <div class="team-card__body">
      <div class="team-card__inner">
        <div>
          <div class="info-list">
            <div><b>Fundação</b>${t.founded}</div>
            <div><b>Cidade</b>${t.city}, ${t.country}</div>
            <div><b>Estádio</b>${t.stadium}</div>
            <div><b>Técnico</b>${t.coach}</div>
          </div>
          <h4 style="font-family:var(--mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);">Principais títulos</h4>
          <div class="tag-list">${pillList(t.titles)}</div>
          <h4 style="font-family:var(--mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);">Ídolos históricos</h4>
          <div class="tag-list">${pillList(t.legends)}</div>
          <h4 style="font-family:var(--mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);">Elenco atual (destaques)</h4>
          <div class="tag-list">${pillList(t.squad)}</div>
        </div>
        <div>
          <div class="lineup">
            <span class="meta" style="display:block;text-align:center;margin-bottom:8px;">Provável escalação (exemplo · ${t.formation})</span>
            ${lineupRows(t.lines)}
          </div>
          <div class="stadium-strip"><span>🏟️ ${t.stadium}</span></div>
        </div>
      </div>
    </div>
  </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('teams-grid');
  if(!grid || typeof TEAMS === 'undefined') return;

  grid.innerHTML = TEAMS.map(teamCardHTML).join('');
  if(typeof initCrestFallbacks === 'function') initCrestFallbacks(grid);

  // acordeão (precisa ser religado pois os cards foram criados agora)
  grid.querySelectorAll('.team-card__top').forEach(top => {
    top.addEventListener('click', () => top.closest('.team-card').classList.toggle('open'));
  });

  // filtro por liga
  const filterBtns = document.querySelectorAll('.filter-btn');
  const applyFilters = () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const league = activeBtn ? activeBtn.dataset.filter : 'todas';
    const term = (document.getElementById('team-search')?.value || '').trim().toLowerCase();
    let visible = 0;
    grid.querySelectorAll('.team-card').forEach(card => {
      const matchLeague = league === 'todas' || card.dataset.league === league;
      const matchTerm = !term || card.dataset.name.includes(term);
      const show = matchLeague && matchTerm;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    const emptyMsg = document.getElementById('no-results');
    if(emptyMsg) emptyMsg.style.display = visible === 0 ? 'block' : 'none';
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  const searchInput = document.getElementById('team-search');
  if(searchInput) searchInput.addEventListener('input', applyFilters);

  // contadores nos botões de filtro
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    const key = btn.dataset.filter;
    if(key === 'todas'){ btn.dataset.count = TEAMS.length; }
    else { btn.dataset.count = TEAMS.filter(t => t.league === key).length; }
    btn.textContent = `${btn.textContent} (${btn.dataset.count})`;
  });
});
