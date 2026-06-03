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

const LS_USERNAME_KEY = 'startpage_username';

// ────────────────────────────────────────
//  Clock — updates every second
// ────────────────────────────────────────
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function updateDatetime() {
  const now = new Date();
  const day = DAYS[now.getDay()];
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  const dd  = String(now.getDate()).padStart(2, '0');
  const mo  = String(now.getMonth() + 1).padStart(2, '0');
  const yy  = String(now.getFullYear()).slice(2);

  const clockEl = document.getElementById('clock');
  if (clockEl) {
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }

  const dateEl = document.getElementById('datetime');
  if (dateEl) {
    dateEl.textContent = `${day}, ${dd}/${mo}/${yy}`;
  }

  document.title = `${hh}:${mm} | ${dd}/${mo}/${yy}`;
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
//  Render link groups
// ────────────────────────────────────────
const grid = document.getElementById('links-grid');
if (!grid) throw new Error('Missing links-grid element');

CONFIG.categories.forEach(cat => {
  const group = document.createElement('div');
  group.className = 'link-group';

  const label = document.createElement('div');
  label.className = 'group-label';
  label.textContent = cat.label;
  group.appendChild(label);

  cat.links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'link-item';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.name;
    group.appendChild(a);
  });

  grid.appendChild(group);
});

// ────────────────────────────────────────
//  Dynamic greeting with auto-detect (localStorage)
// ────────────────────────────────────────
function setUsername(name) {
  if (name && name.trim()) {
    localStorage.setItem(LS_USERNAME_KEY, name.trim());
  }
}

function getUsername() {
  return localStorage.getItem(LS_USERNAME_KEY) || "guest";
}

function promptForUsername() {
  if (localStorage.getItem(LS_USERNAME_KEY)) return;

  const dialog = document.createElement('dialog');
  dialog.innerHTML = `
    <form method="dialog">
      <p>Welcome to your start page!</p>
      <label>
        Enter your name:
        <input type="text" id="name-input" value="alif" autofocus>
      </label>
      <button type="submit">Save</button>
    </form>
  `;
  document.body.appendChild(dialog);
  dialog.addEventListener('close', () => {
    const input = document.getElementById('name-input');
    if (input && input.value) {
      setUsername(input.value);
      updateGreeting();
    }
    dialog.remove();
  });
  dialog.showModal();
}

const MORNING_START = 5;
const AFTERNOON_START = 12;
const EVENING_START = 17;
const NIGHT_START = 21;

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour >= MORNING_START && hour < AFTERNOON_START) {
    greeting = "good morning";
  } else if (hour >= AFTERNOON_START && hour < EVENING_START) {
    greeting = "good afternoon";
  } else if (hour >= EVENING_START && hour < NIGHT_START) {
    greeting = "good evening";
  } else {
    greeting = "good night";
  }

  const username = getUsername();
  const welcomeElement = document.querySelector('.welcome');
  if (welcomeElement) {
    welcomeElement.textContent = `${greeting}, ${username}.`;
  }
}

updateGreeting();
promptForUsername();