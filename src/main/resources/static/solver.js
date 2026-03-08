const API_BASE = 'http://localhost:8080/api';

let allChampNames = [];

async function loadAllChampions() {
    try {
        const res = await fetch(`${API_BASE}/champions`);
        const champs = await res.json();
        allChampNames = champs.map(c => c.name);
    } catch (e) {
        console.error('Fehler beim Laden der Champions:', e);
    }
}

loadAllChampions();

document.getElementById('champName').addEventListener('input', function () {
    const val = this.value.toLowerCase();
    const box = document.getElementById('suggestions');
    if (!val || val.length < 2) {
        box.innerHTML = '';
        return;
    }

    const matches = allChampNames
        .filter(n => n.toLowerCase().includes(val))
        .slice(0, 8);

    box.innerHTML = matches.map(n =>
        `<div class="suggestion-item" onclick="selectSuggestion('${n.replace(/'/g, "\\'")}')"> ${n}</div>`
    ).join('');
});

document.getElementById('champName').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') fetchChampion();
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('suggestions').innerHTML = '';
    }
});

function selectSuggestion(name) {
    document.getElementById('champName').value = name;
    document.getElementById('suggestions').innerHTML = '';
    fetchChampion();
}

async function fetchChampion() {
    const name = document.getElementById('champName').value.trim();
    const errEl = document.getElementById('errorMsg');
    errEl.textContent = '';

    if (!name) {
        errEl.textContent = 'Bitte einen Champion-Namen eingeben.';
        return;
    }

    const btn = document.getElementById('fetchBtn');
    btn.disabled = true;
    btn.textContent = '...';

    try {
        const res = await fetch(`${API_BASE}/game/load/${encodeURIComponent(name)}`, {method: 'POST'});
        if (!res.ok) {
            errEl.textContent = res.status === 409
                ? `"${name}" wurde bereits verwendet.`
                : `Champion "${name}" nicht gefunden.`;
            return;
        }
        const champ = await res.json();
        showChampionPanel(champ);
    } catch (e) {
        errEl.textContent = 'Fehler: Keine Verbindung zur API (localhost:8080).';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Laden';
    }
}

const FIELDS = ['gender', 'position', 'species', 'resource', 'rangeType', 'region', 'releaseYear'];
const FIELD_LABELS = ['Gender', 'Position', 'Species', 'Resource', 'Range', 'Region', 'Year'];

function showChampionPanel(champ) {
    document.getElementById('panelTitle').textContent = `— ${champ.name} —`;

    const grid = document.getElementById('attrGrid');
    grid.innerHTML = FIELDS.map((f, i) => `
        <div class="attr-item">
            <div class="attr-label">${FIELD_LABELS[i]}</div>
            <div class="attr-value">${champ[f] ?? '—'}</div>
        </div>
    `).join('');

    const pickers = document.getElementById('colorPickers');
    pickers.innerHTML = FIELDS.map((f, i) => {
        const isYear = f === 'releaseYear';
        return `
        <div class="color-row" id="row-${f}">
            <label>${FIELD_LABELS[i]}</label>
            <button class="color-btn" onclick="setColor('${f}','green',this)">🟩 Grün</button>
            <button class="color-btn" onclick="setColor('${f}','yellow',this)">🟨 Gelb</button>
            <button class="color-btn" onclick="setColor('${f}','red',this)">🟥 Rot</button>
            ${isYear ? `
            <span class="year-divider">|</span>
            <button class="color-btn year-btn" onclick="setYearDir('higher',this)">⬆ Höher</button>
            <button class="color-btn year-btn" onclick="setYearDir('lower',this)">⬇ Niedriger</button>
            ` : ''}
        </div>`;
    }).join('');

    document.getElementById('champPanel').style.display = 'block';
}

async function setColor(field, color, btn) {
    btn.closest('.color-row').querySelectorAll('.color-btn:not(.year-btn)').forEach(b => {
        b.classList.remove('selected-green', 'selected-yellow', 'selected-red');
    });
    btn.classList.add(`selected-${color}`);

    await fetch(`${API_BASE}/game/color`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({field, color})
    });
}

async function setYearDir(direction, btn) {
    const isActive = btn.classList.contains(`selected-${direction}`);
    document.querySelectorAll('.year-btn').forEach(b =>
        b.classList.remove('selected-higher', 'selected-lower')
    );

    await fetch(`${API_BASE}/game/yeardir`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({direction: isActive ? null : direction})
    });

    if (!isActive) btn.classList.add(`selected-${direction}`);
}

async function addGuess() {
    try {
        const res = await fetch(`${API_BASE}/game/guess`, {method: 'POST'});
        if (!res.ok) return;
        const result = await res.json();

        addGuessRow(result);
        document.getElementById('champPanel').style.display = 'none';
        document.getElementById('champName').value = '';
        document.getElementById('errorMsg').textContent = '';

        await loadPossibleChampions();
    } catch (e) {
        console.error('Fehler beim Guess:', e);
    }
}

function addGuessRow(result) {
    const tbody = document.getElementById('guessTable').querySelector('tbody');
    const emptyRow = tbody.querySelector('.empty-state');
    if (emptyRow) emptyRow.closest('tr').remove();

    const row = tbody.insertRow(0);

    const nameCell = row.insertCell();
    nameCell.textContent = result.name;
    nameCell.classList.add('name-cell');

    FIELDS.forEach(f => {
        const cell = row.insertCell();
        cell.textContent = result.values[f] ?? '—';
        cell.classList.add(result.colors[f] || 'none');
    });
}

async function loadPossibleChampions() {
    try {
        const res = await fetch(`${API_BASE}/game/possible`);
        const champions = await res.json();
        renderPossibleTable(champions);
    } catch (e) {
        console.error('Fehler beim Laden möglicher Champions:', e);
    }
}

function renderPossibleTable(champions) {
    document.getElementById('possibleWrapper').style.display = 'block';
    document.getElementById('possibleCount').textContent =
        `${champions.length} mögliche${champions.length !== 1 ? ' Champions' : ' Champion'}`;

    const tbody = document.getElementById('possibleTable').querySelector('tbody');
    tbody.innerHTML = '';

    if (champions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Keine Treffer — überprüfe deine Farbangaben</td></tr>';
        return;
    }

    champions.forEach(c => {
        const row = tbody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = c.name;
        nameCell.classList.add('name-cell');
        FIELDS.forEach(f => {
            const cell = row.insertCell();
            cell.textContent = c[f] ?? '—';
        });
    });
}