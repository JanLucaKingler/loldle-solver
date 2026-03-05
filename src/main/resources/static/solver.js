const API_BASE = 'http://localhost:8080/api';

const FIELDS = ['gender', 'position', 'species', 'resource', 'rangeType', 'region', 'releaseYear'];
const FIELD_LABELS = ['Gender', 'Position', 'Species', 'Resource', 'Range', 'Region', 'Year'];

let currentChamp = null;
let selectedColors = {};
let allChampNames = [];
const usedChampNames = new Set();

async function loadAllNames() {
    try {
        const res = await fetch(`${API_BASE}/champions`);
        const data = await res.json();
        allChampNames = data.map(c => c.name);
    } catch (e) {
    }
}

loadAllNames();

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
    pickers.innerHTML = FIELDS.map((f, i) => `
        <div class="color-row">
            <label>${FIELD_LABELS[i]}</label>
            <button class="color-btn" onclick="setColor('${f}','green',this)">🟩 Grün</button>
            <button class="color-btn" onclick="setColor('${f}','yellow',this)">🟨 Gelb</button>
            <button class="color-btn" onclick="setColor('${f}','red',this)">🟥 Rot</button>
        </div>
    `).join('');

    document.getElementById('champPanel').style.display = 'block';
}

function hidePanel() {
    document.getElementById('champPanel').style.display = 'none';
    currentChamp = null;
}

function setColor(field, color, btn) {
    btn.closest('.color-row').querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('selected-green', 'selected-yellow', 'selected-red');
    });
    btn.classList.add(`selected-${color}`);
    selectedColors[field] = color;
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
        addCell(row, currentChamp[f] ?? '—', color);
    });

    usedChampNames.add(currentChamp.name.toLowerCase());
    hidePanel();
    document.getElementById('champName').value = '';
    document.getElementById('errorMsg').textContent = '';
}

function addCell(row, text, colorClass, isName = false) {
    const cell = row.insertCell();
    cell.textContent = text;
    if (isName) {
        cell.classList.add('name-cell');
    } else {
        cell.classList.add(colorClass || 'none');
    }
}