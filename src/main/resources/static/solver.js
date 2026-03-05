const API_BASE = 'http://localhost:8080/api';

const FIELDS = ['gender', 'position', 'species', 'resource', 'rangeType', 'region', 'releaseYear'];
const FIELD_LABELS = ['Gender', 'Position', 'Species', 'Resource', 'Range', 'Region', 'Year'];

let currentChamp = null;
let selectedColors = {};
let yearDirection = null;
let allChampNames = [];
let allChampions = [];
const usedChampNames = new Set();

const constraints = {
    green:  {},
    yellow: {},
    red:    {},
    yearMin: null,
    yearMax: null
};

async function loadAllChampions() {
    try {
        const res = await fetch(`${API_BASE}/champions`);
        allChampions = await res.json();
        allChampNames = allChampions.map(c => c.name);
    } catch (e) {}
}

loadAllChampions();

document.getElementById('champName').addEventListener('input', function () {
    const val = this.value.toLowerCase();
    const box = document.getElementById('suggestions');
    if (!val || val.length < 2) { box.innerHTML = ''; return; }

    const matches = allChampNames
        .filter(n => n.toLowerCase().includes(val) && !usedChampNames.has(n.toLowerCase()))
        .slice(0, 8);
    box.innerHTML = matches.map(n =>
        `<div class="suggestion-item" onclick="selectSuggestion('${n.replace(/'/g, "\\'")}')"> ${n}</div>`
    ).join('');
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

    if (!name) { errEl.textContent = 'Bitte einen Champion-Namen eingeben.'; return; }

    if (usedChampNames.has(name.toLowerCase())) {
        errEl.textContent = `"${name}" wurde bereits verwendet.`;
        return;
    }

    const btn = document.getElementById('fetchBtn');
    btn.disabled = true;
    btn.textContent = '...';

    try {
        const res = await fetch(`${API_BASE}/champions/${encodeURIComponent(name)}`);
        if (!res.ok) {
            errEl.textContent = `Champion "${name}" nicht gefunden.`;
            hidePanel();
            return;
        }
        currentChamp = await res.json();
        showChampionPanel(currentChamp);
    } catch (e) {
        errEl.textContent = 'Fehler: Keine Verbindung zur API (localhost:8080).';
        hidePanel();
    } finally {
        btn.disabled = false;
        btn.textContent = 'Laden';
    }
}

function showChampionPanel(champ) {
    selectedColors = {};
    yearDirection = null;
    FIELDS.forEach(f => selectedColors[f] = 'none');

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
            <button class="color-btn year-btn" id="btn-higher" onclick="setYearDir('higher',this)">⬆ Höher</button>
            <button class="color-btn year-btn" id="btn-lower"  onclick="setYearDir('lower',this)">⬇ Niedriger</button>
            ` : ''}
        </div>`;
    }).join('');

    document.getElementById('champPanel').style.display = 'block';
}

function hidePanel() {
    document.getElementById('champPanel').style.display = 'none';
    currentChamp = null;
    yearDirection = null;
}

function setColor(field, color, btn) {
    btn.closest('.color-row').querySelectorAll('.color-btn:not(.year-btn)').forEach(b => {
        b.classList.remove('selected-green', 'selected-yellow', 'selected-red');
    });
    btn.classList.add(`selected-${color}`);
    selectedColors[field] = color;
}

function setYearDir(dir, btn) {
    document.querySelectorAll('.year-btn').forEach(b =>
        b.classList.remove('selected-higher', 'selected-lower')
    );
    if (yearDirection === dir) {
        yearDirection = null;
    } else {
        yearDirection = dir;
        btn.classList.add(`selected-${dir}`);
    }
}

function addGuess() {
    if (!currentChamp) return;

    const tbody = document.getElementById('guessTable').querySelector('tbody');
    const emptyRow = tbody.querySelector('.empty-state');
    if (emptyRow) emptyRow.closest('tr').remove();

    const row = tbody.insertRow(0);
    addCell(row, currentChamp.name, '', true);
    FIELDS.forEach(f => {
        const color = selectedColors[f] || 'none';
        let displayVal = currentChamp[f] ?? '—';
        if (f === 'releaseYear' && yearDirection) {
            displayVal = `${displayVal} ${yearDirection === 'higher' ? '⬆' : '⬇'}`;
        }
        addCell(row, displayVal, color);
    });

    FIELDS.forEach(f => {
        const color = selectedColors[f];
        const rawValue = String(currentChamp[f] ?? '');
        const tokens = rawValue.split(',').map(t => t.trim()).filter(Boolean);

        if (color === 'green') {
            constraints.green[f] = rawValue;
        } else if (color === 'yellow') {
            if (!constraints.yellow[f]) constraints.yellow[f] = [];
            tokens.forEach(t => {
                if (!constraints.yellow[f].includes(t)) constraints.yellow[f].push(t);
            });
        } else if (color === 'red') {
            if (!constraints.red[f]) constraints.red[f] = [];
            tokens.forEach(t => {
                if (!constraints.red[f].includes(t)) constraints.red[f].push(t);
            });
        }

        if (f === 'releaseYear' && yearDirection) {
            const year = parseInt(currentChamp.releaseYear);
            if (yearDirection === 'higher') {
                constraints.yearMin = constraints.yearMin === null
                    ? year : Math.max(constraints.yearMin, year);
            } else {
                constraints.yearMax = constraints.yearMax === null
                    ? year : Math.min(constraints.yearMax, year);
            }
        }
    });

    usedChampNames.add(currentChamp.name.toLowerCase());

    hidePanel();
    document.getElementById('champName').value = '';
    document.getElementById('errorMsg').textContent = '';

    updatePossibleResults();
}

function addCell(row, text, colorClass, isName = false) {
    const cell = row.insertCell();
    cell.textContent = text;
    cell.classList.add(isName ? 'name-cell' : (colorClass || 'none'));
}

function champMatchesConstraints(champ) {
    for (const f of FIELDS) {
        const rawValue = String(champ[f] ?? '');
        const tokens = rawValue.split(',').map(t => t.trim()).filter(Boolean);

        if (constraints.green[f] !== undefined) {
            if (rawValue !== constraints.green[f]) return false;
            continue;
        }

        if (constraints.yellow[f]?.length) {
            const hasMatch = constraints.yellow[f].some(t => tokens.includes(t));
            if (!hasMatch) return false;
        }

        if (constraints.red[f]?.length) {
            const hasRed = constraints.red[f].some(t => tokens.includes(t));
            if (hasRed) return false;
        }
    }

    const year = parseInt(champ.releaseYear);
    if (constraints.yearMin !== null && year <= constraints.yearMin) return false;
    if (constraints.yearMax !== null && year >= constraints.yearMax) return false;

    return true;
}

function updatePossibleResults() {
    const possible = allChampions.filter(c =>
        !usedChampNames.has(c.name.toLowerCase()) && champMatchesConstraints(c)
    );
    renderPossibleTable(possible);
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