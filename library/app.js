/* My Library - phone companion for My Library Launcher (view / search only).
   Data: collection-export.json + collection-thumbs.json in My Drive/MyLibrary (uploaded by the launcher),
   read with the Drive REST API as the signed-in user (scope drive.file), cached in IndexedDB for offline. */
(() => {
"use strict";
const CFG = Object.assign({exportName: "collection-export.json", thumbsName: "collection-thumbs.json",
  folderName: "MyLibrary", clientId: "", loginHint: ""}, window.LIBRARY_CONFIG || {});
const APP_VERSION = "1.0.0";
const SCOPE_FILE = "https://www.googleapis.com/auth/drive.file";
const SCOPE_RO = "https://www.googleapis.com/auth/drive.readonly";
const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const STUB = LOCAL && new URLSearchParams(location.search).has("stub");   // local testing only
const PAGE = 120;

const CATS = {"Video Game": ["GAME", "#1e6fd9"], "Anime": ["ANIME", "#c2185b"], "Board Game": ["BOARD GAME", "#2e7d32"],
  "DC": ["DC", "#0d47a1"], "Cartoons": ["CARTOON", "#ef6c00"], "Books": ["BOOK", "#6d4c41"], "Marvel": ["MARVEL", "#d32f2f"]};
const PLAT_COLORS = {"nes": "#b3262d", "snes": "#5b4b9b", "n64": "#1f7a3a", "gamecube": "#4b3c8f", "wii": "#5aa9d6",
  "wii u": "#1aa1c9", "switch": "#e60012", "switch 2": "#c4001a", "game boy": "#6b8e23", "gbc": "#8a2be2", "gba": "#3c3c9e",
  "ds": "#6e7b8b", "3ds": "#ce1126", "atari 2600": "#8b5a2b", "atari 7800": "#a0522d", "sega master system": "#1c4fb0",
  "genesis/mega drive": "#3a3a3a", "saturn": "#34495e", "dreamcast": "#e67e22", "game gear": "#2c3e50", "sega cd": "#3b3b6d",
  "ps1": "#7f8c8d", "ps2": "#1f3a93", "ps3": "#2c2c2c", "ps4": "#003791", "ps5": "#2e6bd9", "psp": "#3d3d3d", "vita": "#0a5fb4",
  "xbox": "#107c10", "xbox 360": "#5dc21e", "xbox one": "#0e7a0d", "xbox series": "#0b5d0b", "pc": "#455a64",
  "arcade": "#c0392b", "turbografx-16": "#e67e22", "neo geo": "#b7950b"};
const OWNED = {yes: ["OWNED", "owned", "\u2713 YOU OWN THIS"], rom: ["ROM", "rom", "ROM COPY"],
  wishlist: ["WISHLIST", "wishlist", "\u2605 ON YOUR WISHLIST"], sold: ["SOLD", "sold", "SOLD \u2014 NOT OWNED NOW"],
  borrowed: ["BORROWED", "borrowed", "BORROWED"]};
const FORMATS = {cartridge: "Cartridge", disc: "Disc", digital: "Digital", other: "Other"};
const CONDITIONS = {sealed: "Sealed", cib: "CIB (complete in box)", boxed: "Boxed, no manual", loose: "Loose", digital: "Digital"};
const STATUSES = {not_started: "Not started", playing: "Playing", completed: "Completed", "100": "100%", dropped: "Dropped"};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const norm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/&/g, " and ").replace(/[^a-z0-9+]+/g, " ").trim();

const ui = {scope: "all", cat: "", plat: "", q: "", sort: "title", limit: PAGE};
let DATA = null;          // export document
let THUMBS = {};          // id -> data URL
let META = {};            // misc persisted state
let ITEMS = [];           // items with search keys
let token = null;         // {access_token, exp, scope}
let busy = false;

/* ------------------------------------------------------------------ IndexedDB (tiny key/value) */
const DB = (() => {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open("mylibrary", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => {
    const t = db.transaction("kv", mode); const st = t.objectStore("kv"); const out = fn(st);
    t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }); };
  return {get: (k) => tx("readonly", (s) => s.get(k)), set: (k, v) => tx("readwrite", (s) => s.put(v, k)),
          clear: () => tx("readwrite", (s) => s.clear())};
})();

/* ------------------------------------------------------------------ helpers */
function toast(msg, ms = 2600) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, ms);
}
function catInfo(c) { return CATS[c] || [String(c || "OTHER").toUpperCase().slice(0, 12), "#607d8b"]; }
function itemColor(it) {
  if ((it.category || "Video Game") === "Video Game") return PLAT_COLORS[(it.platform || "").toLowerCase()] || "#607d8b";
  return catInfo(it.category)[1];
}
function fmtWhen(iso) {
  if (!iso) return "never";
  const d = new Date(iso); if (isNaN(d)) return iso;
  const now = new Date(), t = d.toLocaleTimeString([], {hour: "numeric", minute: "2-digit"});
  if (d.toDateString() === now.toDateString()) return t;
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "yesterday " + t;
  return d.toLocaleDateString([], {month: "short", day: "numeric"}) + " " + t;
}
function ago(ms) {
  const s = Math.max(0, (Date.now() - ms) / 1000);
  if (s < 60) return "just now"; if (s < 3600) return Math.round(s / 60) + "m ago";
  if (s < 86400) return Math.round(s / 3600) + "h ago"; return Math.round(s / 86400) + "d ago";
}
function seasonInfo(it) {
  const total = parseInt(it.total_seasons || 0, 10); if (!total) return null;
  const w = (Array.isArray(it.seasons_watched) ? it.seasons_watched : String(it.seasons_watched || "").split(/[|,\s]+/))
    .map((x) => parseInt(x, 10)).filter((x) => x > 0 && x <= total);
  return {total, watched: [...new Set(w)].sort((a, b) => a - b), ongoing: !!it.series_ongoing};
}
const sortTitle = (t) => norm(t).replace(/^(the|a|an) /, "");

/* ------------------------------------------------------------------ data */
function prepare(doc) {
  DATA = doc;
  ITEMS = (doc.items || []).map((it) => {
    const s = Object.assign({}, it);
    s._t = norm(it.title); s._st = sortTitle(it.title);
    s._k = norm([it.title, it.platform, it.category, catInfo(it.category)[0], FORMATS[it.format] || it.format,
      it.genre, (it.tags || []).join(" "), it.region, it.release_year, it.owned === "wishlist" ? "wishlist" : "",
      it.owned === "rom" ? "rom" : "", it.where_bought].join(" "));
    s._notes = norm(it.notes);
    return s;
  });
}
function inScope(it, scope) {
  if (scope === "collection") return !!it.in_collection;
  if (scope === "watched") return !!it.done;
  if (scope === "wishlist") return it.owned === "wishlist";
  return true;
}
function search(list, q) {
  const qn = norm(q); if (!qn) return list.map((it) => [it, 0]);
  const words = qn.split(" ");
  const out = [];
  for (const it of list) {
    let score = 0, ok = true;
    for (const w of words) {
      if (it._t.startsWith(w)) score += 6;
      else if ((" " + it._t).includes(" " + w)) score += 4;
      else if (it._t.includes(w)) score += 3;
      else if (it._k.includes(w)) score += 1;
      else if (w.length > 2 && it._notes.includes(w)) score += 0.5;
      else { ok = false; break; }
    }
    if (it._t === qn) score += 10;
    if (ok) out.push([it, score]);
  }
  return out;
}
function currentResults() {
  const base = ITEMS.filter((it) => inScope(it, ui.scope));
  let r = search(base, ui.q);
  if (ui.cat) r = r.filter(([it]) => (it.category || "Video Game") === ui.cat);
  if (ui.plat) r = r.filter(([it]) => (it.platform || "") === ui.plat);
  const byTitle = (a, b) => a[0]._st.localeCompare(b[0]._st);
  if (ui.sort === "recent") r.sort((a, b) => String(b[0].updated || b[0].added || "").localeCompare(String(a[0].updated || a[0].added || "")));
  else if (ui.q) r.sort((a, b) => (b[1] - a[1]) || byTitle(a, b));
  else r.sort(byTitle);
  return {base, results: r.map((x) => x[0])};
}

/* ------------------------------------------------------------------ render */
function highlight(title, q) {
  const words = norm(q).split(" ").filter((w) => w.length > 0);
  if (!words.length) return esc(title);
  // highlight on a per-character normalized map so accents / punctuation still line up
  const chars = [...String(title)], map = [], flat = [];
  chars.forEach((c, i) => { const n = norm(c) || (c === " " ? " " : ""); for (const ch of n) { flat.push(ch); map.push(i); } });
  const hay = flat.join(""), mark = new Array(chars.length).fill(false);
  for (const w of words) { let p = hay.indexOf(w); while (p >= 0) { for (let j = p; j < p + w.length; j++) mark[map[j]] = true; p = hay.indexOf(w, p + w.length); } }
  let out = "", open = false;
  chars.forEach((c, i) => { if (mark[i] && !open) { out += "<mark>"; open = true; } if (!mark[i] && open) { out += "</mark>"; open = false; } out += esc(c); });
  return out + (open ? "</mark>" : "");
}
function thumbHTML(it, cls = "thumb") {
  const src = THUMBS[it.id];
  if (src) return `<img class="${cls}" src="${src}" alt="" loading="lazy" decoding="async">`;
  const label = (it.category || "Video Game") === "Video Game" ? (it.platform || "GAME") : catInfo(it.category)[0];
  return `<div class="${cls} ph" style="background:${itemColor(it)}">${esc(label)}</div>`;
}
function badgesHTML(it) {
  const b = [], o = OWNED[it.owned];
  if (o) b.push(`<span class="b ${o[1]}">${o[0]}</span>`);
  if (it.in_collection) b.push(`<span class="b coll">\u2605 COLLECTION</span>`);
  if (it.done) b.push(`<span class="b done">\u2713 ${it.status === "100" ? "100%" : "PLAYED"}</span>`);
  else if (it.status === "playing") b.push(`<span class="b">PLAYING</span>`);
  const s = seasonInfo(it);
  if (s) b.push(`<span class="b seas ${s.watched.length >= s.total ? "full" : ""}">S ${s.watched.length}/${s.total}${s.ongoing ? " \u00b7 ONGOING" : ""}</span>`);
  if (it.format && FORMATS[it.format]) b.push(`<span class="b">${FORMATS[it.format].toUpperCase()}</span>`);
  return b.join("");
}
function subline(it) {
  const parts = [];
  if (it.platform) parts.push(it.platform);
  parts.push(CATS[it.category] ? it.category : (it.category || "Video Game"));
  if (it.release_year) parts.push(it.release_year);
  return esc(parts.join(" \u00b7 "));
}
function renderTabs() {
  const c = {all: ITEMS.length, collection: 0, watched: 0, wishlist: 0};
  for (const it of ITEMS) { if (it.in_collection) c.collection++; if (it.done) c.watched++; if (it.owned === "wishlist") c.wishlist++; }
  document.querySelectorAll("#tabs button").forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.scope === ui.scope)); b.querySelector("b").textContent = c[b.dataset.scope];
  });
}
function renderChips(base) {
  const cats = {}, plats = {};
  for (const it of base) {
    const c = it.category || "Video Game"; cats[c] = (cats[c] || 0) + 1;
    if (!ui.cat || c === ui.cat) { if (it.platform) plats[it.platform] = (plats[it.platform] || 0) + 1; }
  }
  if (ui.cat && !cats[ui.cat]) ui.cat = "";
  if (ui.plat && !plats[ui.plat]) ui.plat = "";
  const order = Object.keys(CATS).filter((k) => cats[k]).concat(Object.keys(cats).filter((k) => !CATS[k]).sort());
  $("#catChips").innerHTML = order.length > 1 || ui.cat ? `<button class="chip" data-cat="" aria-pressed="${!ui.cat}">All types</button>` +
    order.map((k) => `<button class="chip" data-cat="${esc(k)}" aria-pressed="${ui.cat === k}"><i style="background:${catInfo(k)[1]}"></i>${esc(k)} <small>${cats[k]}</small></button>`).join("") : "";
  const pk = Object.keys(plats).sort((a, b) => plats[b] - plats[a] || a.localeCompare(b));
  $("#platChips").innerHTML = pk.length > 1 || ui.plat ? `<button class="chip" data-plat="" aria-pressed="${!ui.plat}">All platforms</button>` +
    pk.map((k) => `<button class="chip" data-plat="${esc(k)}" aria-pressed="${ui.plat === k}">${esc(k)} <small>${plats[k]}</small></button>`).join("") : "";
}
function render() {
  if (!DATA) return;
  renderTabs();
  const {base, results} = currentResults();
  renderChips(base);
  const shown = results.slice(0, ui.limit);
  $("#list").innerHTML = shown.map((it) => `<li class="row" data-id="${esc(it.id)}" style="--c:${itemColor(it)}">${thumbHTML(it)}
    <div class="rmain"><div class="rtitle">${highlight(it.title, ui.q)}</div><div class="rsub">${subline(it)}</div>
    <div class="badges">${badgesHTML(it)}</div></div></li>`).join("");
  $("#more").hidden = results.length <= ui.limit;
  const scopeName = {all: "items", collection: "in Collection", watched: "played / watched", wishlist: "on Wishlist"}[ui.scope];
  $("#count").textContent = `${results.length} ${scopeName}` + (ui.q ? ` matching \u201c${ui.q}\u201d` : "");
  $("#sortBtn").textContent = ui.sort === "recent" ? "Recent first" : (ui.q ? "Best match" : "A\u2013Z");
  const empty = $("#empty");
  if (!results.length) {
    empty.hidden = false;
    if (ui.q) {
      const elsewhere = ui.scope !== "all" || ui.cat || ui.plat ? search(ITEMS, ui.q).length : 0;
      empty.innerHTML = `<div style="font-size:40px">\ud83d\udd0d\ufe0e</div><big>No \u201c${esc(ui.q)}\u201d here</big>` +
        (elsewhere ? `<p>${elsewhere} match${elsewhere > 1 ? "es" : ""} in other lists.</p><button class="secondary" id="showAll" type="button">Search everything</button>`
                   : `<span class="nope">NOT IN YOUR LIBRARY</span>`);
    } else empty.innerHTML = ui.scope === "wishlist" ? "<big>Wishlist is empty</big>Add items with Owned = Wishlist in the launcher."
      : "<big>Nothing here yet</big>";
  } else empty.hidden = true;
}
function renderPill() {
  const p = $("#syncPill");
  if (!DATA) { p.textContent = "not synced"; p.className = "pill off"; return; }
  const exp = new Date(DATA.exported).getTime();
  const old = Date.now() - exp > 7 * 86400e3;
  p.innerHTML = `<b>Synced ${esc(fmtWhen(DATA.exported))}</b><span>${navigator.onLine ? (META.checked ? "checked " + ago(META.checked) : "not checked") : "offline copy"}</span>`;
  p.className = "pill" + (old ? " stale" : "") + (navigator.onLine ? "" : " off");
  p.title = `Exported by My Library Launcher v${DATA.app_version || "?"} at ${new Date(DATA.exported).toLocaleString()}`;
}

/* ------------------------------------------------------------------ detail */
function openDetail(id, push = true) {
  const it = ITEMS.find((x) => x.id === id); if (!it) return;
  const o = OWNED[it.owned], s = seasonInfo(it), rows = [];
  const add = (k, v) => { if (v !== undefined && v !== null && v !== "" && v !== false) rows.push(`<dt>${k}</dt><dd>${v}</dd>`); };
  add("Category", esc(it.category || "Video Game"));
  add("Platform", esc(it.platform));
  add("Media", esc(FORMATS[it.format] || it.format));
  add("Owned", o ? esc(o[0][0] + o[0].slice(1).toLowerCase()) : esc(it.owned));
  add("In Collection", it.in_collection ? "Yes" : "No");
  add("Status", esc(STATUSES[it.status] || it.status));
  add("Completed", esc(it.completion_date));
  if (s) add("Seasons", `<div class="seasons">${Array.from({length: s.total}, (_, i) => `<span class="${s.watched.includes(i + 1) ? "w" : ""}">S${i + 1}${s.watched.includes(i + 1) ? " \u2713" : ""}</span>`).join("")}</div>
     <div class="small dim" style="margin-top:6px">${s.watched.length} of ${s.total} watched${s.ongoing ? " \u00b7 ongoing / still airing" : ""}</div>`);
  add("Region", esc(it.region));
  add("Condition", esc(CONDITIONS[it.condition] || it.condition));
  if (it.has_box || it.has_manual) add("Box / manual", [it.has_box ? "Box" : "", it.has_manual ? "Manual" : ""].filter(Boolean).join(" + "));
  add("Year", esc(it.release_year));
  add("Genre", esc(it.genre));
  add("Tags", esc((it.tags || []).join(", ")));
  if (it.rating) add("Rating", "\u2605".repeat(Math.max(1, Math.round(it.rating / 2))) + ` <span class="dim">${it.rating}/10</span>`);
  if (it.hours_played) add("Hours", esc(it.hours_played));
  if (it.price_paid != null) add("Paid", "$" + Number(it.price_paid).toFixed(2));
  if (it.est_value != null) add("Value", "$" + Number(it.est_value).toFixed(2));
  add("Bought", esc([it.purchase_date, it.where_bought].filter(Boolean).join(" \u00b7 ")));
  add("Added", esc(String(it.added || "").slice(0, 10)));
  const flags = [it.favorite ? `<span class="b" style="background:#e94560;color:#fff">\u2665 FAVORITE</span>` : "",
    it.in_collection ? `<span class="b coll">\u2605 IN COLLECTION</span>` : "",
    it.done ? `<span class="b done">\u2713 ${it.status === "100" ? "100%" : "PLAYED / WATCHED"}</span>` : ""].join("");
  $("#dBody").innerHTML = `<div class="dhead">${THUMBS[it.id] ? `<img class="dcover" src="${THUMBS[it.id]}" alt="">` :
      `<div class="dcover ph" style="background:${itemColor(it)}">${esc(it.platform || catInfo(it.category)[0])}</div>`}
    <div><h2 class="dtitle" id="dTitle">${esc(it.title)}</h2><div class="dsub">${subline(it)}</div></div></div>
    ${o ? `<div class="banner ${o[1]}">${o[2]}</div>` : ""}<div class="flags">${flags}</div>
    <dl class="fields">${rows.join("")}</dl>${it.notes ? `<div class="notes">${esc(it.notes)}</div>` : ""}`;
  $("#detail").hidden = false; $("#detail").scrollTop = 0;
  if (push) history.pushState({sheet: "detail", id}, "");
}
function closeSheets() { $("#detail").hidden = true; $("#settings").hidden = true; }

/* ------------------------------------------------------------------ settings */
function openSettings(push = true) {
  const c = DATA && DATA.counts || {};
  $("#sBody").innerHTML = `
   <div class="setgroup"><h3>Data</h3>
    <p>${DATA ? `<b>${ITEMS.length}</b> items \u00b7 ${c.collection ?? "?"} collection \u00b7 ${c.watched ?? "?"} played \u00b7 ${c.wishlist ?? "?"} wishlist` : "No data yet."}</p>
    <p class="small dim">${DATA ? `Exported by My Library Launcher v${esc(DATA.app_version)} on ${esc(new Date(DATA.exported).toLocaleString())}.` : ""}
     ${META.checked ? `Last checked Drive ${esc(new Date(META.checked).toLocaleString())}.` : ""} Thumbnails: ${Object.keys(THUMBS).length}.</p>
    <button class="primary" style="height:48px;padding:0 18px" id="sSync" type="button">\u27f3 Refresh from Drive</button></div>
   <div class="setgroup"><h3>Google account</h3>
    <p>${META.email ? esc(META.email) : (STUB ? "Test mode (local sample data)" : "Not signed in")}</p>
    <p class="small dim">Access: ${META.readonly ? "read-only access to your Drive (fallback)" : "only files this app's launcher created (drive.file)"}.</p>
    ${META.readonly ? "" : `<button class="secondary" id="sRO" type="button">Use read-only Drive access instead</button>`}
    <button class="secondary" id="sOut" type="button">Sign out &amp; delete data on this phone</button></div>
   <div class="setgroup"><h3>About</h3><p class="small dim">My Library phone app v${APP_VERSION} \u00b7 view / search only (edit in the launcher on the PC).
    Your data never goes to this website \u2014 it is read straight from your Google Drive and kept on this phone.</p></div>`;
  $("#settings").hidden = false;
  if (push) history.pushState({sheet: "settings"}, "");
  $("#sSync").onclick = () => { history.back(); sync(true); };
  const ro = $("#sRO"); if (ro) ro.onclick = async () => { META.readonly = true; await DB.set("meta", META); token = null; history.back(); sync(true); };
  $("#sOut").onclick = signOut;
}
async function signOut() {
  if (!confirm("Sign out and remove the cached library from this phone?")) return;
  try { if (token && window.google && google.accounts) google.accounts.oauth2.revoke(token.access_token, () => {}); } catch (e) {}
  token = null; sessionStorage.removeItem("ml_token"); await DB.clear();
  DATA = null; THUMBS = {}; META = {}; ITEMS = [];
  closeSheets(); history.replaceState(null, ""); showWelcome(""); renderPill();
}

/* ------------------------------------------------------------------ Google auth + Drive */
function loadGis() {
  if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
  if (loadGis._p) return loadGis._p;
  return (loadGis._p = new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true;
    s.onload = () => res(); s.onerror = () => { loadGis._p = null; rej(new Error("Could not load Google sign-in (offline?)")); };
    document.head.appendChild(s);
  }));
}
function savedToken() {
  try { const t = JSON.parse(sessionStorage.getItem("ml_token") || "null"); if (t && t.exp > Date.now() + 60e3) return t; } catch (e) {}
  return null;
}
async function getToken(interactive) {
  const scope = META.readonly ? SCOPE_RO : SCOPE_FILE;
  if (token && token.exp > Date.now() + 60e3 && token.scope === scope) return token.access_token;
  const st = savedToken(); if (st && st.scope === scope) { token = st; return st.access_token; }
  if (!interactive) return null;
  if (!CFG.clientId || CFG.clientId.startsWith("REPLACE")) throw new Error("OAuth client ID not set in config.js yet");
  await loadGis();
  return new Promise((res, rej) => {
    const tc = google.accounts.oauth2.initTokenClient({
      client_id: CFG.clientId, scope, login_hint: META.email || CFG.loginHint || undefined,
      callback: (r) => {
        if (r.error) return rej(new Error(r.error_description || r.error));
        if (!google.accounts.oauth2.hasGrantedAllScopes(r, scope)) return rej(new Error("Drive access was not allowed"));
        token = {access_token: r.access_token, exp: Date.now() + (r.expires_in || 3600) * 1000, scope};
        sessionStorage.setItem("ml_token", JSON.stringify(token)); res(token.access_token);
      },
      error_callback: (e) => rej(new Error(e && e.type === "popup_closed" ? "Sign-in window was closed" : (e && e.message) || "Sign-in failed"))
    });
    tc.requestAccessToken({prompt: META.consented ? "" : "consent"});
  });
}
async function gfetch(url, at, asJson = true) {
  const r = await fetch(url, {headers: {Authorization: "Bearer " + at}});
  if (r.status === 401) { token = null; sessionStorage.removeItem("ml_token"); throw Object.assign(new Error("Google sign-in expired"), {auth: true}); }
  if (!r.ok) throw new Error(`Drive error ${r.status}`);
  return asJson ? r.json() : r.text();
}
const Drive = {
  async find(at, name) {
    const q = `name = '${name}' and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
    const u = "https://www.googleapis.com/drive/v3/files?" + new URLSearchParams({q, spaces: "drive", orderBy: "modifiedTime desc",
      pageSize: "10", fields: "files(id,name,modifiedTime,md5Checksum,size,parents)"});
    const files = (await gfetch(u, at)).files || [];
    return files[0] || null;
  },
  get: (at, id) => gfetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, at),
  email: async (at) => ((await gfetch("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)", at)).user || {}).emailAddress || ""
};
const Stub = {   // local test double: serves ./stub/ files from the test server, same shape as Drive
  async find(_at, name) { const r = await fetch(`/stub/${name}`, {method: "HEAD", cache: "no-store"});
    if (!r.ok) return null; return {id: name, md5Checksum: r.headers.get("etag") || String(r.headers.get("last-modified")), modifiedTime: r.headers.get("last-modified")}; },
  async get(_at, id) { const r = await fetch(`/stub/${id}`, {cache: "no-store"}); if (!r.ok) throw new Error("stub " + r.status); return r.json(); },
  email: async () => "stub@localhost"
};

async function sync(interactive) {
  if (busy) return; if (!navigator.onLine) { toast("Offline \u2014 showing the copy saved on this phone"); return; }
  busy = true; $("#syncBtn").classList.add("spin"); $("#welcomeMsg").textContent = "";
  try {
    const src = STUB ? Stub : Drive;
    const at = STUB ? "stub" : await getToken(interactive);
    if (!at) { toast("Tap \u27f3 to refresh from Google Drive"); return; }
    if (!STUB && !META.email) { META.email = await Drive.email(at).catch(() => ""); }
    META.consented = true;
    const fe = await src.find(at, CFG.exportName);
    if (!fe) {
      const m = META.readonly ? `No ${CFG.exportName} found in your Drive. Click \u201cSync to phone\u201d in My Library Launcher first.`
        : `Can't see ${CFG.exportName} yet. In My Library Launcher click \u201c\u2601 Sync to phone\u201d (same Google account), then refresh. ` +
          `If it is already in My Drive/MyLibrary, use Settings \u2192 \u201cread-only Drive access\u201d.`;
      throw new Error(m);
    }
    let changed = false;
    if (!DATA || fe.md5Checksum !== META.exportMd5 || interactive) {
      const doc = await src.get(at, fe.id);
      if (!doc || doc.format !== "mylibrary-phone-export") throw new Error("That file is not a My Library export");
      changed = !DATA || doc.exported !== DATA.exported;
      await DB.set("export", doc); META.exportMd5 = fe.md5Checksum; prepare(doc);
      if (doc.thumbs_rev && doc.thumbs_rev !== META.thumbsRev) {
        const ft = await src.find(at, CFG.thumbsName);
        if (ft) { const td = await src.get(at, ft.id); THUMBS = td.thumbs || {}; await DB.set("thumbs", THUMBS); META.thumbsRev = td.thumbs_rev || doc.thumbs_rev; }
      }
    }
    META.checked = Date.now(); await DB.set("meta", META);
    $("#welcome").hidden = true; render(); renderPill();
    toast(changed ? `Updated \u2014 ${ITEMS.length} items (PC sync ${fmtWhen(DATA.exported)})` : "Up to date");
  } catch (e) {
    console.warn(e);
    if (!DATA) { showWelcome(e.message); } else toast(e.message, 5000);
  } finally { busy = false; $("#syncBtn").classList.remove("spin"); }
}
function showWelcome(msg) { $("#welcome").hidden = false; $("#welcomeMsg").textContent = msg || ""; }

/* ------------------------------------------------------------------ events */
function bind() {
  let qt = null;
  $("#q").addEventListener("input", (e) => {
    $("#clearQ").hidden = !e.target.value; clearTimeout(qt);
    qt = setTimeout(() => { ui.q = e.target.value.trim(); ui.limit = PAGE; render(); window.scrollTo({top: 0}); }, 60);
  });
  $("#q").addEventListener("keydown", (e) => { if (e.key === "Enter") e.target.blur(); });
  $("#clearQ").onclick = () => { $("#q").value = ""; ui.q = ""; $("#clearQ").hidden = true; render(); $("#q").focus(); };
  $("#tabs").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; ui.scope = b.dataset.scope; ui.limit = PAGE;
    localStorage.setItem("ml_scope", ui.scope); render(); window.scrollTo({top: 0}); };
  $("#catChips").onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; ui.cat = b.dataset.cat; ui.plat = ""; ui.limit = PAGE; render(); };
  $("#platChips").onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; ui.plat = b.dataset.plat; ui.limit = PAGE; render(); };
  $("#list").onclick = (e) => { const r = e.target.closest(".row"); if (r) openDetail(r.dataset.id); };
  $("#empty").onclick = (e) => { if (e.target.id === "showAll") { ui.scope = "all"; ui.cat = ""; ui.plat = ""; render(); } };
  $("#more").onclick = () => { ui.limit += PAGE; render(); };
  $("#sortBtn").onclick = () => { ui.sort = ui.sort === "recent" ? "title" : "recent"; render(); };
  $("#syncBtn").onclick = () => sync(true);
  $("#syncPill").onclick = () => sync(true);
  $("#signinBtn").onclick = () => sync(true);
  $("#menuBtn").onclick = () => openSettings();
  $("#dBack").onclick = () => history.back();
  $("#sBack").onclick = () => history.back();
  window.addEventListener("popstate", (e) => {
    const st = e.state; closeSheets();
    if (st && st.sheet === "detail") openDetail(st.id, false); else if (st && st.sheet === "settings") openSettings(false);
  });
  window.addEventListener("online", renderPill); window.addEventListener("offline", renderPill);
  setInterval(renderPill, 60e3);
}

async function start() {
  const sp = new URLSearchParams(location.search);
  ui.scope = sp.get("scope") || localStorage.getItem("ml_scope") || "all";
  if (!["all", "collection", "watched", "wishlist"].includes(ui.scope)) ui.scope = "all";
  bind();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW", e));
  try {
    META = (await DB.get("meta")) || {};
    const doc = await DB.get("export");
    if (doc) { prepare(doc); THUMBS = (await DB.get("thumbs")) || {}; render(); }
  } catch (e) { console.warn("cache", e); }
  renderPill();
  if (!DATA) { showWelcome(STUB ? "Test mode: tap Sign in to load the local sample export." : ""); return; }
  // refresh silently when a token from this session is still valid (no popup); else wait for a tap
  if (navigator.onLine && (STUB || savedToken())) sync(false);
}
window.__ml = {ui, render, sync, state: () => ({items: ITEMS.length, thumbs: Object.keys(THUMBS).length, exported: DATA && DATA.exported, meta: META})};
start();
})();
