const CONFIG = {
  categories: [
    {
      label: "~/mail",
      links: [
        { name: "protonmail", url: "https://mail.proton.me" },
        { name: "gmail",      url: "https://mail.google.com" },
        { name: "outlook",    url: "https://outlook.live.com" },
      ]
    },
    {
      label: "~/chat",
      links: [
        { name: "whatsapp",   url: "https://web.whatsapp.com" },
        { name: "discord",    url: "https://discord.com/app" },
        { name: "meet",       url: "https://meet.google.com" },
        { name: "telegram",   url: "https://web.telegram.org" },
      ]
    },
    {
      label: "~/media",
      links: [
        { name: "youtube",    url: "https://youtube.com" },
        { name: "reddit",     url: "https://reddit.com" },
        { name: "lastfm",     url: "https://last.fm" },
        { name: "fmhy",       url: "https://fmhy.pages.dev/" },
      ]
    },
    {
      label: "~/news",
      links: [
        { name: "hacker news", url: "https://news.ycombinator.com" },
        { name: "google news", url: "https://news.google.com" },
        { name: "the verge",   url: "https://www.theverge.com" },
      ]
    },
    {
      label: "~/ai",
      links: [
        { name: "claude",      url: "https://claude.ai" },
        { name: "chatgpt",     url: "https://chat.openai.com" },
        { name: "gemini",      url: "https://gemini.google.com" },
        { name: "perplexity",  url: "https://www.perplexity.ai" },
        { name: "deepseek",    url: "https://chat.deepseek.com" },
      ]
    },
    {
      label: "~/social",
      links: [
        { name: "twitter",    url: "https://x.com" },
        { name: "instagram",  url: "https://instagram.com" },
        { name: "tiktok",     url: "https://tiktok.com" },
        { name: "pinterest",  url: "https://pinterest.com" },
      ]
    },
    {
      label: "~/tools",
      links: [
        { name: "google drive", url: "https://drive.google.com" },
        { name: "calendar",     url: "https://calendar.google.com" },
        { name: "maps",         url: "https://maps.google.com" },
        { name: "keep",         url: "https://keep.google.com" }
      ]
    },
    {
      label: "~/games",
      links: [
        { name: "ankergames", url: "https://ankergames.net" },
        { name: "steamrip",   url: "https://steamrip.com" },
        { name: "f95zone",    url: "https://f95zone.to" },
        { name: "gog",        url: "https://gog-games.to/" },
        { name: "fitgirl",    url: "https://fitgirl-repacks.site" },
      ]
    },
  ]
};

// ────────────────────────────────────────
//  Clock — updates every second
// ────────────────────────────────────────
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function updateDatetime() {
  const now = new Date();
  const day = DAYS[now.getDay()];
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  const dd  = now.getDate();
  const mo  = MONTHS[now.getMonth()];
  const yy  = now.getFullYear();

  const clockEl = document.getElementById('clock');
  if (clockEl) {
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }

  const dateEl = document.getElementById('datetime');
  if (dateEl) {
    dateEl.textContent = `${day}, ${dd} ${mo} ${yy}`;
  }

  document.title = `${hh}:${mm} | ${dd} ${mo} ${yy}`;
}

let clockInterval;

function startClock() {
  updateDatetime();
  clockInterval = setInterval(updateDatetime, 1000);
}

function stopClock() {
  clearInterval(clockInterval);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopClock();
  } else {
    startClock();
  }
});

startClock();

// ────────────────────────────────────────
//  Link editor — edit mode with add/remove
// ────────────────────────────────────────
const LS_KEY = 'startpage_links';

let categories;

function loadCategories() {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    try {
      categories = JSON.parse(stored);
      return;
    } catch (_) {}
  }
  categories = JSON.parse(JSON.stringify(CONFIG.categories));
}

function saveCategories() {
  localStorage.setItem(LS_KEY, JSON.stringify(categories));
}

function renderLinks() {
  const grid = document.getElementById('links-grid');
  if (!grid) return;
  grid.innerHTML = '';

  categories.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'link-group';

    const label = document.createElement('div');
    label.className = 'group-label';
    label.textContent = cat.label;
    group.appendChild(label);

    cat.links.forEach((link, idx) => {
      const row = document.createElement('div');
      row.className = 'link-row';

      const a = document.createElement('a');
      a.className = 'link-item';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.name;
      row.appendChild(a);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'link-remove';
      removeBtn.textContent = '✕';
      removeBtn.title = 'Remove link';
      removeBtn.addEventListener('click', () => removeLink(cat.label, idx));
      row.appendChild(removeBtn);

      group.appendChild(row);
    });

    const addArea = document.createElement('div');
    addArea.className = 'add-link-area';
    const addName = document.createElement('input');
    addName.type = 'text';
    addName.placeholder = 'name';
    addName.className = 'add-name';
    const addUrl = document.createElement('input');
    addUrl.type = 'text';
    addUrl.placeholder = 'url';
    addUrl.className = 'add-url';
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => doAddLink(cat.label, addName, addUrl));
    [addName, addUrl].forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') doAddLink(cat.label, addName, addUrl);
      });
    });
    addArea.appendChild(addName);
    addArea.appendChild(addUrl);
    addArea.appendChild(addBtn);
    group.appendChild(addArea);

    grid.appendChild(group);
  });

  const editFooter = document.createElement('div');
  editFooter.className = 'edit-footer';
  const resetBtn = document.createElement('button');
  resetBtn.id = 'reset-links';
  resetBtn.textContent = 'Reset to defaults';
  resetBtn.addEventListener('click', resetLinks);
  editFooter.appendChild(resetBtn);
  grid.appendChild(editFooter);
}

function doAddLink(catLabel, nameInput, urlInput) {
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  if (!name || !url) return;
  addLink(catLabel, name, url);
  nameInput.value = '';
  urlInput.value = '';
  nameInput.focus();
}

function addLink(catLabel, name, url) {
  const cat = categories.find(c => c.label === catLabel);
  if (!cat) return;
  cat.links.push({ name, url });
  saveCategories();
  renderLinks();
}

function removeLink(catLabel, idx) {
  const cat = categories.find(c => c.label === catLabel);
  if (!cat) return;
  cat.links.splice(idx, 1);
  saveCategories();
  renderLinks();
}

function resetLinks() {
  if (!confirm('Reset all links to defaults?')) return;
  localStorage.removeItem(LS_KEY);
  categories = JSON.parse(JSON.stringify(CONFIG.categories));
  renderLinks();
}

loadCategories();
renderLinks();

// ────────────────────────────────────────
//  Edit mode toggle
// ────────────────────────────────────────
const editToggle = document.getElementById('edit-toggle');
let isEditing = false;

editToggle.addEventListener('click', () => {
  isEditing = !isEditing;
  document.body.classList.toggle('editing', isEditing);
  editToggle.innerHTML = isEditing ? '&#x2715;' : '&#x2699;';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isEditing) {
    isEditing = false;
    document.body.classList.remove('editing');
    editToggle.innerHTML = '&#x2699;';
  }
});

