/* My Library - phone companion for My Library Launcher.
   Data: collection-export.json + collection-thumbs.json in My Drive/MyLibrary (uploaded by the launcher),
   read with the Drive REST API as the signed-in user (scope drive.file), cached in IndexedDB for offline.
   v1.1: barcode scanning + adding / editing on the phone. Changes are queued on the phone and uploaded as
   NEW files MyLibrary/phone-changes-<stamp>.json (never editing the export); the launcher applies them and
   lists their ids in the next export (applied_changes), which clears them from the phone's queue. */
(() => {
"use strict";
const CFG = Object.assign({exportName: "collection-export.json", thumbsName: "collection-thumbs.json",
  folderName: "MyLibrary", clientId: "", loginHint: ""}, window.LIBRARY_CONFIG || {});
const APP_VERSION = "1.2.0";
const SCOPE_FILE = "https://www.googleapis.com/auth/drive.file";
const SCOPE_RO = "https://www.googleapis.com/auth/drive.readonly";
const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const STUB = LOCAL && new URLSearchParams(location.search).has("stub");   // local testing only
const PAGE = 120;
const ZXING_SRC = "vendor/zxing-library-0.23.0.min.js";
const SCAN_FORMATS = ["upc_a", "ean_13", "ean_8", "upc_e"];          // product codes only
const FORMAT_LEN = {upc_a: [12, 13], ean_13: [13], ean_8: [8], upc_e: [6, 7, 8]};
const NEED_READS = 3;      // the same valid code on 3 frames in a row (1 empty frame tolerated) before accepting
const FORMAT_NAME = {upc_a: "UPC-A", ean_13: "EAN-13", ean_8: "EAN-8", upc_e: "UPC-E"};

const CATS = {"Video Game": ["GAME", "#1e6fd9"], "Anime": ["ANIME", "#c2185b"], "Board Game": ["BOARD GAME", "#2e7d32"],
  "DC": ["DC", "#0d47a1"], "Cartoons": ["CARTOON", "#ef6c00"], "Books": ["BOOK", "#6d4c41"], "Marvel": ["MARVEL", "#d32f2f"]};
const CAT_SUGGEST = {   // same lists as the launcher's Add/Edit form
  "Video Game": ["NES", "SNES", "N64", "GameCube", "Wii", "Wii U", "Switch", "Switch 2", "Game Boy", "GBC", "GBA", "DS", "3DS",
    "Atari 2600", "Atari 7800", "Sega Master System", "Genesis/Mega Drive", "Sega CD", "Saturn", "Dreamcast", "Game Gear",
    "PS1", "PS2", "PS3", "PS4", "PS5", "PSP", "Vita", "Xbox", "Xbox 360", "Xbox One", "Xbox Series", "PC", "Steam Deck",
    "Playdate", "Arcade", "TurboGrafx-16", "Neo Geo", "C64", "ZX Spectrum", "Amiga", "Evercade", "Other"],
  "Anime": ["TV Series", "TV Mini Series", "Movie", "OVA", "ONA", "Special"],
  "Board Game": ["Board Game", "Card Game", "Dice Game", "Expansion", "Miniatures"],
  "DC": ["Comic", "Graphic Novel", "Movie", "TV Series", "Animated", "Video Game"],
  "Cartoons": ["TV Series", "TV Mini Series", "Movie", "Short", "Special"],
  "Books": ["Hardcover", "Paperback", "eBook", "Audiobook", "Graphic Novel"],
  "Marvel": ["Comic", "Graphic Novel", "Movie", "TV Series", "Animated", "Video Game"]};
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
const OWNED_LABEL = {yes: "Owned", rom: "Rom", wishlist: "Wishlist", sold: "Sold", borrowed: "Borrowed"};
const FORMATS = {cartridge: "Cartridge", disc: "Disc", digital: "Digital", other: "Other"};
const CONDITIONS = {sealed: "Sealed", cib: "CIB (complete in box)", boxed: "Boxed, no manual", loose: "Loose", digital: "Digital"};
const STATUSES = {not_started: "Not started", playing: "Playing", completed: "Completed", "100": "100%", dropped: "Dropped"};
const DONE = ["completed", "100"];

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const norm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/&/g, " and ").replace(/[^a-z0-9+]+/g, " ").trim();
const rid = () => Math.random().toString(36).slice(2, 8);
const stamp = () => new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);

const ui = {scope: "all", cat: "", plat: "", q: "", sort: "title", limit: PAGE};
let DATA = null;          // export document (from the PC)
let THUMBS = {};          // id -> data URL
let META = {};            // misc persisted state
let QUEUE = [];           // phone changes not yet confirmed by an export: {..., _state: queued|uploaded}
let SCANS = [];           // recent scans
let LOOKUPS = {};         // barcode -> product info found in the browser
let ITEMS = [];           // export items + local changes, with search keys
let BC = new Map();       // normalized barcode -> item
let DF = new Map();       // title word -> number of library titles containing it (for match weighting)
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
const saveQueue = () => DB.set("queue", QUEUE);
const saveScans = () => DB.set("scans", SCANS.slice(0, 40));

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
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function seasonInfo(it) {
  const total = parseInt(it.total_seasons || 0, 10); if (!total) return null;
  const w = (Array.isArray(it.seasons_watched) ? it.seasons_watched : String(it.seasons_watched || "").split(/[|,\s]+/))
    .map((x) => parseInt(x, 10)).filter((x) => x > 0 && x <= total);
  return {total, watched: [...new Set(w)].sort((a, b) => a - b), ongoing: !!it.series_ongoing};
}
const sortTitle = (t) => norm(t).replace(/^(the|a|an) /, "");
const isDone = (it) => DONE.includes(it.status) || (!it.status && !!it.done);

/* ------------------------------------------------------------------ barcodes (same rules as phone_sync.py) */
const digits = (c) => String(c || "").replace(/\D+/g, "");
function gtinOk(code) {
  const d = digits(code); if (![8, 12, 13, 14].includes(d.length)) return false;
  let tot = 0; const body = d.slice(0, -1);
  for (let i = 0; i < body.length; i++) tot += Number(body[body.length - 1 - i]) * (i % 2 === 0 ? 3 : 1);
  return (10 - (tot % 10)) % 10 === Number(d[d.length - 1]);
}
function upceToUpca(code) {
  const d = digits(code); if (d.length !== 8 || !"01".includes(d[0])) return null;
  const ns = d[0], m = d.slice(1, 7), chk = d[7], last = m[5]; let body;
  if ("012".includes(last)) body = m.slice(0, 2) + last + "0000" + m.slice(2, 5);
  else if (last === "3") body = m.slice(0, 3) + "00000" + m.slice(3, 5);
  else if (last === "4") body = m.slice(0, 4) + "00000" + m[4];
  else body = m.slice(0, 5) + "0000" + last;
  return ns + body + chk;
}
function normBarcode(code, fmt) {
  let d = digits(code); if (!d) return "";
  const f = String(fmt || "").toLowerCase().replace("-", "_");
  if (d.length === 8 && (f === "upc_e" || (f !== "ean_8" && !gtinOk(d) && upceToUpca(d)))) d = upceToUpca(d) || d;
  if (d.length === 12) d = "0" + d;
  if (d.length === 14 && d[0] === "0") d = d.slice(1);
  return d;
}
const prettyCode = (c) => (c.length === 13 && c[0] === "0") ? c.slice(1) : c;
const isIsbn = (c) => c.length === 13 && /^97[89]/.test(c);

/* ------------------------------------------------------------------ data: export + local changes */
function cloneItem(it) { return Object.assign({}, it, {barcodes: (it.barcodes || []).slice(), tags: (it.tags || []).slice()}); }
function visible(it) { if (!it.in_collection && !isDone(it)) it.in_collection = true; }
function applyLocal(items, byId, ch) {
  const d = ch.data || {}; const it = byId.get(ch.item_id);
  switch (ch.type) {
    case "add": {
      if (byId.has(ch.item_id)) return;
      const n = {id: ch.item_id, title: d.title, category: d.category || "Video Game", platform: d.platform || "", format: d.format || "",
        owned: d.owned || "yes", in_collection: !!d.in_collection, status: d.completed ? "completed" : "not_started",
        completion_date: d.completed ? (d.completion_date || today()) : "", notes: d.notes || "", added: ch.ts, updated: ch.ts,
        barcodes: d.barcode ? [normBarcode(d.barcode, d.format_code)] : [], tags: []};
      visible(n); n.done = isDone(n); n._pending = true; items.push(n); byId.set(n.id, n); return;
    }
    case "link_barcode": {
      if (!it) return; const c = normBarcode(d.barcode, d.format);
      for (const o of items) if (o !== it && (o.barcodes || []).includes(c)) { o.barcodes = o.barcodes.filter((x) => x !== c); }
      if (!it.barcodes.includes(c)) it.barcodes.push(c); break;
    }
    case "set_owned": if (!it) return; it.owned = d.owned; if (["yes", "rom"].includes(d.owned)) it.in_collection = true; visible(it); break;
    case "set_completed":
      if (!it) return;
      if (d.completed !== false) { if (!isDone(it)) { it.status = "completed"; it.completion_date = d.completion_date || today(); } }
      else if (isDone(it)) { it.status = "playing"; it.completion_date = ""; visible(it); }
      break;
    case "set_in_collection": if (!it) return; if (d.in_collection !== false) it.in_collection = true; else if (isDone(it)) it.in_collection = false; break;
    default: return;
  }
  if (it) { it.done = isDone(it); it._pending = true; }
}
function rebuild() {
  const items = ((DATA && DATA.items) || []).map(cloneItem);
  const byId = new Map(items.map((i) => [i.id, i]));
  for (const ch of QUEUE.slice().sort((a, b) => String(a.ts).localeCompare(String(b.ts)))) applyLocal(items, byId, ch);
  BC = new Map(); DF = new Map();
  for (const s of items) for (const w of new Set(sortTitle(s.title).split(" "))) DF.set(w, (DF.get(w) || 0) + 1);
  ITEMS = items.map((s) => {
    s.done = isDone(s);
    s._t = norm(s.title); s._st = sortTitle(s.title);
    s._k = norm([s.title, s.platform, s.category, catInfo(s.category)[0], FORMATS[s.format] || s.format,
      s.genre, (s.tags || []).join(" "), s.region, s.release_year, s.owned === "wishlist" ? "wishlist" : "",
      s.owned === "rom" ? "rom" : "", s.where_bought, (s.barcodes || []).join(" ")].join(" "));
    s._notes = norm(s.notes);
    for (const c of s.barcodes || []) BC.set(c, s);
    return s;
  });
}
function prepare(doc) { DATA = doc; rebuild(); }
function queueChange(type, item_id, data) {
  const ch = {id: `chg-${stamp()}-${rid()}`, ts: new Date().toISOString(), type, item_id: item_id || null, data: data || {}, _state: "queued"};
  QUEUE.push(ch); saveQueue(); rebuild(); render(); renderPill();
  scheduleUpload(2500);   // batch quick successive edits into one file
  return ch;
}
function scheduleUpload(ms) {
  clearTimeout(scheduleUpload._t);
  if (!QUEUE.some((c) => c._state !== "uploaded") || !navigator.onLine || !(STUB || savedToken())) return;
  scheduleUpload._t = setTimeout(() => sync(false), ms);
}
function dropApplied() {
  if (!DATA) return 0;
  const done = new Set(DATA.applied_changes || []), notes = DATA.change_notes || {};
  const msgs = QUEUE.filter((c) => done.has(c.id) && notes[c.id]).map((c) => notes[c.id]);
  const before = QUEUE.length; QUEUE = QUEUE.filter((c) => !done.has(c.id));
  if (msgs.length) setTimeout(() => toast("PC: " + msgs[0], 6000), 2800);
  return before - QUEUE.length;
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

/* ------------------------------------------------------------------ product name -> title / platform / matches */
const PLATFORM_RULES = [
  [/\bwii[\s-]*u\b/, "Wii U"], [/\bswitch\s*2\b/, "Switch 2"], [/\b(nintendo\s+)?switch\b/, "Switch"], [/\bwii\b/, "Wii"],
  [/\b(ps5|playstation\s*5)\b/, "PS5"], [/\b(ps4|playstation\s*4)\b/, "PS4"], [/\b(ps3|playstation\s*3)\b/, "PS3"],
  [/\b(ps2|playstation\s*2)\b/, "PS2"], [/\b(ps vita|playstation vita|vita)\b/, "Vita"], [/\bpsp\b/, "PSP"],
  [/\b(ps1|psx|playstation)\b/, "PS1"], [/\bxbox\s*series\b/, "Xbox Series"], [/\bxbox\s*one\b/, "Xbox One"],
  [/\bxbox\s*360\b/, "Xbox 360"], [/\bxbox\b/, "Xbox"], [/\b(nintendo\s*)?3ds\b/, "3DS"], [/\bgame\s*boy\s*advance\b|\bgba\b/, "GBA"],
  [/\bgame\s*boy\s*colou?r\b|\bgbc\b/, "GBC"], [/\bgame\s*boy\b/, "Game Boy"], [/\b(nintendo\s*ds|nds)\b/, "DS"],
  [/\bgame\s*cube\b|\bgamecube\b/, "GameCube"], [/\b(n64|nintendo\s*64)\b/, "N64"], [/\b(snes|super\s*nintendo)\b/, "SNES"],
  [/\bnes\b/, "NES"], [/\bsega\s*cd\b/, "Sega CD"], [/\b(genesis|mega\s*drive)\b/, "Genesis/Mega Drive"], [/\bsaturn\b/, "Saturn"],
  [/\bdreamcast\b/, "Dreamcast"], [/\bgame\s*gear\b/, "Game Gear"], [/\b(atari\s*)?2600\b/, "Atari 2600"],
  [/\bturbografx\b/, "TurboGrafx-16"], [/\bneo\s*geo\b/, "Neo Geo"], [/\b(pc|windows)\s*(dvd|cd|game)?\b/, "PC"],
  [/\bblu-?ray\b|\bdvd\b/, "Movie"]];
function guessPlatform(text) { const t = String(text || "").toLowerCase(); for (const [re, p] of PLATFORM_RULES) if (re.test(t)) return p; return ""; }
const JUNK = [/[\u00ae\u2122\u00a9\ufffd]/g, /\s\?(?=\s)/g, /\b(playstation\s*hits|xbox\s*classics|nintendo\s*selects|greatest\s*hits)\b/gi,
  /\((?:[^)]*)\)/g, /\[(?:[^\]]*)\]/g,
  /\b(playstation(\s*(vita|portable|[1-5]))?|nintendo\s*(switch\s*2|switch|wii[\s-]*u|wii|3ds|ds|64|gamecube)|sega\s*(genesis|saturn|dreamcast|cd)|xbox\s*(one|360|series\s*[xs](\s*\|\s*xbox\s*one)?))\b/gi,
  /\b(nintendo|sony|microsoft|sega|xbox)\b/gi,
  /\b(wii[\s-]*u|wii|switch\s*2|switch|ps[1-5]|psx|psp|ps\s*vita|vita|xbox\s*(one|360|series\s*[xs]?)|3ds|nds|ds|game\s*boy(\s*(advance|colou?r))?|gba|gbc|gamecube|game\s*cube|n64|snes|nes|genesis|mega\s*drive|sega\s*cd|saturn|dreamcast|game\s*gear)\b/gi,
  /\b(game\s+of\s+the\s+year(\s+edition)?|goty(\s+edition)?)\b/gi,
  /\b(video\s*games?|games?|for|standard\s*edition|nintendo\s*selects|greatest\s*hits|platinum\s*hits|players?'?\s*choice|brand\s*new|new|factory\s*sealed|sealed|pre-?owned|used|refurbished|complete|cib|disc|cartridge|ntsc(-u|-j)?|pal|usa|us|version|import|region\s*free|english|physical|w\/|with\s*manual|manual|case only|rated\s*[etm]|esrb|blu-?ray|dvd|4k\s*ultra\s*hd|digital\s*code)\b/gi,
  /\b0?\d{11,13}\b/g];
function cleanTitle(name, brand) {
  let s = String(name || ""); for (const re of JUNK) s = s.replace(re, " ");
  const br = String(brand || "").trim();        // UPCitemdb often appends the publisher: "... Wii U Warner Bros."
  if (br.length > 2) { const t = s.trimEnd(); if (t.toLowerCase().endsWith(br.toLowerCase()) && t.length > br.length + 3) s = t.slice(0, -br.length); }
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([:,])/g, "$1").replace(/[\s\-\u2013|:,;/]+$/g, "").replace(/^[\s\-\u2013|:,;/]+/g, "").trim();
  return s || String(name || "").trim();
}
function guessCategory(name, code) {
  if (code && isIsbn(code)) return "Books";
  const t = String(name || "").toLowerCase();
  if (/\b(board game|card game|tabletop|dice game)\b/.test(t)) return "Board Game";
  if (/\banime\b/.test(t)) return "Anime";
  if (/\b(blu-?ray|dvd)\b/.test(t) && /\bmarvel\b/.test(t)) return "Marvel";
  if (/\b(blu-?ray|dvd)\b/.test(t) && /\b(dc|batman|superman|justice league)\b/.test(t)) return "DC";
  if (/\b(novel|paperback|hardcover)\b/.test(t)) return "Books";
  return "Video Game";
}
const STOP = new Set(["the", "a", "an", "of", "and", "edition", "game", "games", "for", "to", "in", "on"]);
function bigrams(s) { const t = " " + s + " ", m = new Map(); for (let i = 0; i < t.length - 1; i++) { const b = t.substr(i, 2); m.set(b, (m.get(b) || 0) + 1); } return m; }
function dice(a, b) {
  if (!a || !b) return 0; const A = bigrams(a), B = bigrams(b); let inter = 0, tot = 0;
  for (const [k, v] of A) { tot += v; if (B.has(k)) inter += Math.min(v, B.get(k)); } for (const v of B.values()) tot += v;
  return 2 * inter / tot;
}
function similarity(a, b) {    // a = what was scanned / typed, b = a library title; 0..1
  const na = sortTitle(a), nb = sortTitle(b); if (!na || !nb) return 0; if (na === nb) return 1;
  const A = [...new Set(na.split(" ").filter((w) => !STOP.has(w)))], B = new Set(nb.split(" ").filter((w) => !STOP.has(w)));
  if (!A.length || !B.size) return dice(na, nb);
  // each typed word: best fuzzy match among the title words (prefix / typo tolerant), weighted by how rare the word
  // is in the library (so "super" / "bros" count less than "smash")
  const wt = (w) => Math.log(1 + (ITEMS.length || 1) / (1 + (DF.get(w) || 0)));
  let hit = 0, hitw = 0, totw = 0;
  for (const w of A) {
    let best = 0;
    for (const v of B) { const s = w === v ? 1 : ((v.startsWith(w) && w.length >= 3) || (w.startsWith(v) && v.length >= 3)) ? 0.9 : dice(w, v); if (s > best) best = s; }
    const ww = wt(w); totw += ww;
    if (best >= 0.7) { hit += best; hitw += best * ww; }
  }
  return Math.max(0.75 * hitw / totw + 0.25 * hit / B.size, 0.9 * dice(na, nb));
}
function findMatches(title, platform, limit = 5, category = "") {
  if (!title || title.trim().length < 2) return [];
  const out = [];
  for (const it of ITEMS) {
    let s = similarity(title, it.title);
    if (platform && it.platform) s += it.platform === platform ? 0.08 : -0.1;
    if (category && (it.category || "Video Game") !== category) s -= 0.15;
    if (s >= 0.48) out.push([it, s]);
  }
  return out.sort((a, b) => b[1] - a[1]).slice(0, limit).map((x) => x[0]);
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
  if (it._pending) b.push(`<span class="b pend">\u23f3 PENDING SYNC</span>`);
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
                   : `<span class="nope">NOT IN YOUR LIBRARY</span><p><button class="secondary" id="addThis" type="button">+ Add \u201c${esc(ui.q)}\u201d</button></p>`);
    } else empty.innerHTML = ui.scope === "wishlist" ? "<big>Wishlist is empty</big>Add items with Owned = Wishlist (tap + or scan)."
      : "<big>Nothing here yet</big>";
  } else empty.hidden = true;
}
function renderPill() {
  const p = $("#syncPill");
  if (!DATA) { p.textContent = "not synced"; p.className = "pill off"; return; }
  const exp = new Date(DATA.exported).getTime();
  const old = Date.now() - exp > 7 * 86400e3;
  const queued = QUEUE.filter((c) => c._state !== "uploaded").length, waiting = QUEUE.length - queued;
  const second = queued ? `${queued} change${queued > 1 ? "s" : ""} to upload` : waiting ? `${waiting} waiting for PC`
    : (navigator.onLine ? (META.checked ? "checked " + ago(META.checked) : "not checked") : "offline copy");
  p.innerHTML = `<b>Synced ${esc(fmtWhen(DATA.exported))}</b><span>${esc(second)}</span>`;
  p.className = "pill" + (old ? " stale" : "") + (navigator.onLine ? "" : " off") + (QUEUE.length ? " queue" : "");
  p.title = `Exported by My Library Launcher v${DATA.app_version || "?"} at ${new Date(DATA.exported).toLocaleString()}`;
}

/* ------------------------------------------------------------------ sheets / navigation */
const SHEETS = ["detail", "settings", "scanner", "scanResult", "editor"];
function closeSheets() { for (const s of SHEETS) $("#" + s).hidden = true; Scanner.stop(); }
function showSheet(id, state, push) {
  closeSheets(); $("#" + id).hidden = false; $("#" + id).scrollTop = 0;
  const b = $("#" + id).querySelector(".sheetbody"); if (b) b.scrollTop = 0;
  if (push === "replace") history.replaceState(state, ""); else if (push) history.pushState(state, "");
}

/* ------------------------------------------------------------------ detail (+ phone edits) */
function openDetail(id, push = true) {
  const it = ITEMS.find((x) => x.id === id); if (!it) return;
  const o = OWNED[it.owned], s = seasonInfo(it), rows = [];
  const add = (k, v) => { if (v !== undefined && v !== null && v !== "" && v !== false) rows.push(`<dt>${k}</dt><dd>${v}</dd>`); };
  add("Category", esc(it.category || "Video Game"));
  add("Platform", esc(it.platform));
  add("Media", esc(FORMATS[it.format] || it.format));
  add("Owned", o ? esc(OWNED_LABEL[it.owned]) : esc(it.owned));
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
  add("Barcode", esc((it.barcodes || []).map(prettyCode).join(", ")));
  if (it.rating) add("Rating", "\u2605".repeat(Math.max(1, Math.round(it.rating / 2))) + ` <span class="dim">${it.rating}/10</span>`);
  if (it.hours_played) add("Hours", esc(it.hours_played));
  if (it.price_paid != null) add("Paid", "$" + Number(it.price_paid).toFixed(2));
  if (it.est_value != null) add("Value", "$" + Number(it.est_value).toFixed(2));
  add("Bought", esc([it.purchase_date, it.where_bought].filter(Boolean).join(" \u00b7 ")));
  add("Added", esc(String(it.added || "").slice(0, 10)));
  const flags = [it._pending ? `<span class="b pend">\u23f3 PENDING SYNC TO PC</span>` : "",
    it.favorite ? `<span class="b" style="background:#e94560;color:#fff">\u2665 FAVORITE</span>` : "",
    it.in_collection ? `<span class="b coll">\u2605 IN COLLECTION</span>` : "",
    it.done ? `<span class="b done">\u2713 ${it.status === "100" ? "100%" : "PLAYED / WATCHED"}</span>` : ""].join("");
  const canUncoll = it.done;
  $("#dBody").innerHTML = `<div class="dhead">${THUMBS[it.id] ? `<img class="dcover" src="${THUMBS[it.id]}" alt="">` :
      `<div class="dcover ph" style="background:${itemColor(it)}">${esc(it.platform || catInfo(it.category)[0])}</div>`}
    <div><h2 class="dtitle" id="dTitle">${esc(it.title)}</h2><div class="dsub">${subline(it)}</div></div></div>
    ${o ? `<div class="banner ${o[1]}">${o[2]}</div>` : ""}<div class="flags">${flags}</div>
    <dl class="fields">${rows.join("")}</dl>${it.notes ? `<div class="notes">${esc(it.notes)}</div>` : ""}
    <div class="edit"><h3>Update from this phone</h3>
     <div class="seg" id="dOwned">${Object.keys(OWNED_LABEL).map((k) => `<button type="button" data-owned="${k}" aria-pressed="${it.owned === k}">${OWNED_LABEL[k]}</button>`).join("")}</div>
     <div class="toggles">
      <button type="button" id="dDone" class="${it.done ? "on" : ""}">${it.done ? "\u2713 Completed" : "Mark completed"}</button>
      <button type="button" id="dColl" class="${it.in_collection ? "on" : ""}" ${it.in_collection && !canUncoll ? "disabled title=\"Not completed - it has to stay in the Collection to be visible\"" : ""}>${it.in_collection ? "\u2605 In Collection" : "Add to Collection"}</button>
     </div>
     <div class="actions"><button type="button" class="secondary" id="dLink">\u2590\u258c Link a barcode (scan)</button></div>
     <p class="small dim">Changes show here right away and go to My Library Launcher on your PC at the next sync. Deleting is only done on the PC.</p></div>`;
  showSheet("detail", {sheet: "detail", id}, push);
  $("#dOwned").onclick = (e) => { const b = e.target.closest("button"); if (!b || b.dataset.owned === it.owned) return;
    const was = it.owned; queueChange("set_owned", it.id, {owned: b.dataset.owned});
    toast(was === "wishlist" && ["yes", "rom"].includes(b.dataset.owned) ? "Nice! Moved to your Collection" : `Owned: ${OWNED_LABEL[b.dataset.owned]}`);
    openDetail(it.id, false); };
  $("#dDone").onclick = () => { queueChange("set_completed", it.id, it.done ? {completed: false} : {completed: true, completion_date: today()});
    toast(it.done ? "Marked not completed" : "Marked completed \u2713"); openDetail(it.id, false); };
  $("#dColl").onclick = () => { if (it.in_collection && !canUncoll) return;
    queueChange("set_in_collection", it.id, {in_collection: !it.in_collection}); openDetail(it.id, false); };
  $("#dLink").onclick = () => openScanner({mode: "link", id: it.id});
}

/* ------------------------------------------------------------------ add / edit form */
function fillPlatList(cat) {
  const plats = new Set(CAT_SUGGEST[cat] || []);
  for (const it of ITEMS) if ((it.category || "Video Game") === cat && it.platform) plats.add(it.platform);
  $("#platList").innerHTML = [...plats].map((p) => `<option value="${esc(p)}">`).join("");
}
function openEditor(pre = {}, push = true) {
  const f = $("#edForm");
  f.category.innerHTML = Object.keys(CATS).map((c) => `<option>${esc(c)}</option>`).join("");
  f.reset();
  f.title.value = pre.title || ""; f.category.value = CATS[pre.category] ? pre.category : "Video Game";
  f.platform.value = pre.platform || ""; f.format.value = pre.format || ""; f.owned.value = pre.owned || "yes";
  f.in_collection.checked = pre.in_collection !== undefined ? !!pre.in_collection : true;
  f.completed.checked = !!pre.completed; f.barcode.value = pre.barcode ? prettyCode(pre.barcode) : ""; f.notes.value = pre.notes || "";
  f.dataset.fmt = pre.barcode_format || "";
  fillPlatList(f.category.value); edMatches();
  $("#editor .sheettitle").textContent = pre.owned === "wishlist" ? "Add to Wishlist" : "Add item";
  showSheet("editor", {sheet: "editor", pre}, push);
  setTimeout(() => { if (!f.title.value) f.title.focus(); }, 60);
}
function edMatches() {
  const f = $("#edForm"), m = findMatches(f.title.value, f.platform.value, 3, f.category.value);
  $("#edMatches").innerHTML = m.map((it) => `<div class="match" data-id="${esc(it.id)}">${thumbHTML(it)}<div class="rmain"><div class="rtitle">${esc(it.title)}</div>
    <div class="rsub">${subline(it)}</div><div class="badges">${badgesHTML(it)}</div></div>
    <button type="button" class="secondary" data-open="${esc(it.id)}">${f.barcode.value ? "Link" : "Open"}</button></div>`).join("");
}
function saveEditor(e) {
  e.preventDefault();
  const f = $("#edForm"), title = f.title.value.trim(); if (!title) { f.title.focus(); return; }
  let bc = "";
  if (f.barcode.value.trim()) {
    bc = normBarcode(f.barcode.value, f.dataset.fmt);
    if (!gtinOk(bc)) { toast("That barcode doesn't look right (check digit) \u2014 fix it or clear it"); f.barcode.focus(); return; }
  }
  const owned = f.owned.value, completed = f.completed.checked;
  const data = {title, category: f.category.value, platform: f.platform.value.trim(), format: f.format.value, owned,
    in_collection: f.in_collection.checked, completed, notes: f.notes.value.trim()};
  if (completed) data.completion_date = today();
  if (!data.in_collection && !completed) data.in_collection = true;   // launcher rule: must show somewhere
  if (bc) data.barcode = bc;
  const id = `ph-${stamp()}-${rid()}`;
  queueChange("add", id, data);
  if (bc) rememberScan(bc, "added", title);
  toast(`Added \u201c${title}\u201d${owned === "wishlist" ? " to your Wishlist" : ""} \u2014 will sync to the PC`);
  history.replaceState({sheet: "detail", id}, ""); openDetail(id, false);
}

/* ------------------------------------------------------------------ settings */
function openSettings(push = true) {
  const c = DATA && DATA.counts || {};
  const typeTxt = {add: "Add", link_barcode: "Barcode", set_owned: "Owned", set_completed: "Completed", set_in_collection: "Collection", lookup: "Look up"};
  const descr = (ch) => {
    const it = ITEMS.find((x) => x.id === ch.item_id), d = ch.data || {};
    const name = ch.type === "add" ? d.title : ch.type === "lookup" ? prettyCode(d.barcode || "") : (it ? it.title : ch.item_id);
    const extra = ch.type === "set_owned" ? " \u2192 " + (OWNED_LABEL[d.owned] || d.owned) : ch.type === "link_barcode" ? " \u2190 " + prettyCode(d.barcode || "")
      : ch.type === "set_completed" ? (d.completed === false ? " \u2192 not done" : " \u2192 done") : ch.type === "set_in_collection" ? (d.in_collection === false ? " \u2192 out" : " \u2192 in") : "";
    return `<div class="scanrow"><span>${esc(typeTxt[ch.type] || ch.type)}: <b>${esc(name)}</b>${esc(extra)}</span><span class="st ${ch._state === "uploaded" ? "id" : "q"}">${ch._state === "uploaded" ? "ON DRIVE" : "ON PHONE"}</span></div>`;
  };
  $("#sBody").innerHTML = `
   <div class="setgroup"><h3>Data</h3>
    <p>${DATA ? `<b>${ITEMS.length}</b> items \u00b7 ${c.collection ?? "?"} collection \u00b7 ${c.watched ?? "?"} played \u00b7 ${c.wishlist ?? "?"} wishlist` : "No data yet."}</p>
    <p class="small dim">${DATA ? `Exported by My Library Launcher v${esc(DATA.app_version)} on ${esc(new Date(DATA.exported).toLocaleString())}.` : ""}
     ${META.checked ? `Last checked Drive ${esc(new Date(META.checked).toLocaleString())}.` : ""} Thumbnails: ${Object.keys(THUMBS).length}.</p>
    <button class="primary" style="height:48px;padding:0 18px" id="sSync" type="button">\u27f3 Refresh from Drive</button></div>
   <div class="setgroup"><h3>Changes from this phone</h3>
    ${QUEUE.length ? QUEUE.map(descr).join("") + `<p class="small dim">\u201cOn phone\u201d = not uploaded yet (offline or not signed in). \u201cOn Drive\u201d = waiting for My Library Launcher on the PC (it checks every few minutes while running).</p>`
      : `<p class="small dim">None waiting \u2014 everything you changed here is on the PC.</p>`}
    ${META.uploaded ? `<p class="small dim">Last upload ${esc(new Date(META.uploaded).toLocaleString())}.</p>` : ""}</div>
   <div class="setgroup"><h3>Google account</h3>
    <p>${META.email ? esc(META.email) : (STUB ? "Test mode (local sample data)" : "Not signed in")}</p>
    <p class="small dim">Access: ${META.readonly ? "read-only access to your Drive (fallback - phone changes can't be uploaded)" : "only files this app and its launcher created (drive.file)"}.</p>
    ${META.readonly ? `<button class="secondary" id="sRW" type="button">Use normal (drive.file) access again</button>` : `<button class="secondary" id="sRO" type="button">Use read-only Drive access instead</button>`}
    <button class="secondary" id="sOut" type="button">Sign out &amp; delete data on this phone</button></div>
   <div class="setgroup"><h3>About</h3><p class="small dim">My Library phone app v${APP_VERSION} \u00b7 search, scan barcodes, add and update items (deletes only on the PC).
    Your data never goes to this website \u2014 it is read from and written to your own Google Drive and kept on this phone.
    Barcode scanning uses the phone's built-in detector or ZXing (Apache-2.0, see vendor/ZXING-LICENSE.txt). Product names come from your own lookup server (UPCitemdb), Open Library / Open Products Facts, or your PC as a last resort. Only the barcode number is sent for a lookup.</p></div>`;
  showSheet("settings", {sheet: "settings"}, push);
  $("#sSync").onclick = () => { history.back(); sync(true); };
  const ro = $("#sRO"); if (ro) ro.onclick = async () => { META.readonly = true; await DB.set("meta", META); token = null; history.back(); sync(true); };
  const rw = $("#sRW"); if (rw) rw.onclick = async () => { META.readonly = false; await DB.set("meta", META); token = null; history.back(); sync(true); };
  $("#sOut").onclick = signOut;
}
async function signOut() {
  const n = QUEUE.filter((c) => c._state !== "uploaded").length;
  if (!confirm(n ? `${n} change(s) on this phone are not uploaded yet and will be lost. Sign out anyway?` : "Sign out and remove the cached library from this phone?")) return;
  try { if (token && window.google && google.accounts) google.accounts.oauth2.revoke(token.access_token, () => {}); } catch (e) {}
  token = null; sessionStorage.removeItem("ml_token"); await DB.clear();
  DATA = null; THUMBS = {}; META = {}; ITEMS = []; QUEUE = []; SCANS = []; LOOKUPS = {}; BC = new Map();
  closeSheets(); history.replaceState(null, ""); showWelcome(""); renderPill();
}

/* ------------------------------------------------------------------ scanner (camera + BarcodeDetector / ZXing) */
function validRead(raw, fmt) {
  /* digits only, length right for the symbology, check digit OK -> normalized code; else "" (misread / partial) */
  const d = String(raw || "");
  if (!/^\d+$/.test(d)) return "";
  const lens = FORMAT_LEN[fmt]; if (!lens || !lens.includes(d.length)) return "";
  let x = d;
  if (fmt === "upc_e") { if (d.length === 6) x = "0" + d; if (x.length === 7) return ""; }   // 6-digit UPC-E has no check digit to test
  const c = normBarcode(x, fmt);
  return c && gtinOk(c) ? c : "";
}
function codeLabel(code, fmt) {
  const f = FORMAT_NAME[fmt] || (code.length === 8 ? "EAN-8" : code[0] === "0" ? "UPC-A" : "EAN-13");
  let d = prettyCode(code);
  if (d.length === 12) d = `${d[0]} ${d.slice(1, 6)} ${d.slice(6, 11)} ${d[11]}`;
  else if (d.length === 13) d = `${d[0]} ${d.slice(1, 7)} ${d.slice(7)}`;
  else if (d.length === 8) d = `${d.slice(0, 4)} ${d.slice(4)}`;
  return `<div class="codeline"><span class="fmt">${esc(f)}</span> <span class="digits">${esc(d)}</span>
    <button type="button" class="link rescan" data-rescan="1">Wrong number? Rescan</button></div>`;
}
const Scanner = {
  stream: null, track: null, timer: null, detector: null, zx: null, canvas: null, last: "", hits: 0, misses: 0, onCode: null, torchOn: false, engine: "",
  audio: null, rejected: 0,
  async start(onCode) {
    this.stop(); this.onCode = onCode; this.last = ""; this.hits = 0; this.misses = 0; this.rejected = 0;
    const st = $("#scStatus"); st.textContent = "Starting camera\u2026"; $("#scTorch").hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { st.textContent = "No camera access in this browser \u2014 type the number below."; return false; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({audio: false,
        video: {facingMode: {ideal: "environment"}, width: {ideal: 1280}, height: {ideal: 720}}});
    } catch (e) {
      st.textContent = e && e.name === "NotAllowedError" ? "Camera permission was blocked. Allow it in Chrome \u2192 site settings, or type the number below."
        : "Couldn't open the camera \u2014 type the number below."; return false;
    }
    if ($("#scanner").hidden) { this.stop(); return false; }
    const v = $("#scVideo"); v.srcObject = this.stream; try { await v.play(); } catch (e) {}
    this.track = this.stream.getVideoTracks()[0];
    try { const caps = this.track.getCapabilities ? this.track.getCapabilities() : {}; $("#scTorch").hidden = !caps.torch; } catch (e) {}
    try {
      if ("BarcodeDetector" in window) {
        const want = SCAN_FORMATS;
        let fm = want; try { const sup = await BarcodeDetector.getSupportedFormats(); fm = want.filter((f) => sup.includes(f)); } catch (e) {}
        if (fm.length) { this.detector = new BarcodeDetector({formats: fm}); this.engine = "native"; }
      }
      if (!this.detector) { st.textContent = "Loading scanner\u2026"; await this.loadZxing(); this.engine = "zxing"; }
    } catch (e) { console.warn("scanner", e); st.textContent = "Scanner unavailable \u2014 type the number below."; return false; }
    st.textContent = "Fit the barcode inside the box";
    this.loop(); return true;
  },
  loadZxing() {
    if (window.ZXing) return Promise.resolve(this.makeZx());
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = ZXING_SRC;
      s.onload = () => { try { res(this.makeZx()); } catch (e) { rej(e); } }; s.onerror = () => rej(new Error("ZXing failed to load")); document.head.appendChild(s); });
  },
  makeZx() {
    const Z = window.ZXing, hints = new Map();
    hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_E]);
    hints.set(Z.DecodeHintType.TRY_HARDER, true);
    this.zx = new Z.MultiFormatReader(); this.zx.setHints(hints); this.canvas = document.createElement("canvas");
  },
  async detectOnce() {
    const v = $("#scVideo"); if (!v.videoWidth) return null;
    if (this.detector) {
      const r = await this.detector.detect(v);
      const b = (r || []).find((x) => x.rawValue && SCAN_FORMATS.includes(x.format));   // ignore QR / Code 128 / ...
      return b ? {code: b.rawValue, format: b.format} : null;
    }
    const Z = window.ZXing, w = v.videoWidth, h = v.videoHeight, cw = Math.round(w * 0.9), ch = Math.round(h * 0.5);
    const c = this.canvas; c.width = cw; c.height = ch;
    const ctx = c.getContext("2d", {willReadFrequently: true}); ctx.drawImage(v, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, cw, ch);
    try {
      const src = new Z.HTMLCanvasElementLuminanceSource(c), bmp = new Z.BinaryBitmap(new Z.HybridBinarizer(src));
      const r = this.zx.decodeWithState(bmp); const fm = String(Z.BarcodeFormat[r.getBarcodeFormat()] || "").toLowerCase();
      return SCAN_FORMATS.includes(fm) ? {code: r.getText(), format: fm} : null;
    } catch (e) { return null; }   // NotFoundException on most frames
  },
  loop() {
    const st = $("#scStatus");
    const tick = async () => {
      if (!this.stream) return;
      let hit = null; try { hit = await this.detectOnce(); } catch (e) {}
      const c = hit ? validRead(hit.code, hit.format) : "";
      if (c) {
        this.hits = c === this.last ? this.hits + 1 : 1; this.last = c; this.misses = 0;
        if (this.hits >= NEED_READS) {
          this.feedback();
          const cb = this.onCode; this.stop(); cb && cb(c, hit.format); return;
        }
        st.textContent = "Reading\u2026 hold steady"; $("#camwrap").classList.add("reading");
      } else {
        if (hit) this.rejected++;                       // a misread / partial code: never accepted, restarts the count
        if (++this.misses > 1 || hit) {
          this.hits = 0; this.last = ""; $("#camwrap").classList.remove("reading");
          const msg = this.misses >= 6 && this.rejected > 3 ? "Can't read it cleanly \u2014 try more light (\ud83d\udd26) or type the number" : "Fit the barcode inside the box";
          if (st.textContent !== msg) st.textContent = msg;
        }
      }
      this.timer = setTimeout(tick, this.engine === "native" ? 90 : 140);
    };
    tick();
  },
  unlockAudio() {      // must run inside a tap (the Scan button) so the beep may play later
    try { if (!this.audio) this.audio = new (window.AudioContext || window.webkitAudioContext)(); if (this.audio.state === "suspended") this.audio.resume(); } catch (e) {}
  },
  feedback() {
    try { navigator.vibrate && navigator.vibrate(70); } catch (e) {}
    try {
      const a = this.audio; if (!a || a.state !== "running") return;
      const o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = 1760;
      g.gain.setValueAtTime(0.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(0.25, a.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.12);
      o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.13);
    } catch (e) {}
  },
  async torch() {
    if (!this.track) return; this.torchOn = !this.torchOn;
    try { await this.track.applyConstraints({advanced: [{torch: this.torchOn}]}); $("#scTorch").classList.toggle("on", this.torchOn); }
    catch (e) { this.torchOn = false; toast("Flashlight not available"); }
  },
  stop() {
    clearTimeout(this.timer); this.timer = null;
    if (this.stream) for (const t of this.stream.getTracks()) t.stop();
    this.stream = null; this.track = null; this.detector = null; this.torchOn = false;
    const cw = document.getElementById("camwrap"); if (cw) cw.classList.remove("reading");
    const v = document.getElementById("scVideo"); if (v) v.srcObject = null;
  }
};
let scanCtx = {mode: "find"};
function openScanner(ctx = {mode: "find"}, push = true) {
  scanCtx = ctx;
  const it = ctx.mode === "link" ? ITEMS.find((x) => x.id === ctx.id) : null;
  $("#scTitle").textContent = it ? `Link barcode: ${it.title}` : "Scan a barcode";
  $("#manualCode").value = ""; renderRecent(); Scanner.unlockAudio();
  showSheet("scanner", {sheet: "scanner", ctx}, push);
  Scanner.start((code, fmt) => handleCode(code, fmt));
}
function renderRecent() {
  const rows = SCANS.slice(0, 8).map((s) => {
    const it = BC.get(s.code);
    const [cls, txt] = it ? (it.owned === "wishlist" ? ["wish", "WISHLIST"] : ["own", it.in_collection || ["yes", "rom"].includes(it.owned) ? "OWN" : "IN LIBRARY"])
      : s.state === "queued" ? ["q", "LOOKUP QUEUED"] : ["", "NOT OWNED"];
    return `<div class="scanrow" data-code="${esc(s.code)}"><span><code>${esc(prettyCode(s.code))}</code> ${esc(it ? it.title : (s.title || ""))}</span><span class="st ${cls}">${txt}</span></div>`;
  }).join("");
  $("#recentScans").innerHTML = rows ? `<h4>Recent scans</h4>${rows}` : "";
}
function rememberScan(code, state, title) {
  SCANS = SCANS.filter((s) => s.code !== code); SCANS.unshift({code, ts: Date.now(), state, title: title || ""}); saveScans();
}

/* ------------------------------------------------------------------ scan result: own data -> lookup -> match / add */
function itemCard(it, btn) {
  return `<div class="match" data-id="${esc(it.id)}">${thumbHTML(it)}<div class="rmain"><div class="rtitle">${esc(it.title)}</div>
    <div class="rsub">${subline(it)}</div><div class="badges">${badgesHTML(it)}</div></div>${btn || ""}</div>`;
}
function showResult(html, code, push) {
  $("#srBody").innerHTML = html;
  showSheet("scanResult", {sheet: "scanResult", code}, push);
}
function handleCode(raw, fmt, push = "replace") {
  const code = normBarcode(raw, fmt);
  if (!code || !gtinOk(code)) { toast(`\u201c${raw}\u201d isn't a valid UPC / EAN barcode (check the numbers)`); return null; }
  if (scanCtx.mode === "link") {
    const it = ITEMS.find((x) => x.id === scanCtx.id); scanCtx = {mode: "find"};
    if (it) {
      const other = BC.get(code);
      if (other && other.id === it.id) toast("That barcode is already linked to this item");
      else { queueChange("link_barcode", it.id, {barcode: code, format: fmt || ""}); rememberScan(code, "linked", it.title);
        toast(other ? `Barcode moved from \u201c${other.title}\u201d to \u201c${it.title}\u201d` : `Barcode linked to \u201c${it.title}\u201d`); }
      if (history.state && history.state.sheet === "scanner" && !$("#scanner").hidden) history.back();   // back to the detail sheet
      else { history.replaceState({sheet: "detail", id: it.id}, ""); openDetail(it.id, false); }
      return "linked";
    }
  }
  const it = BC.get(code);
  if (it) {
    rememberScan(code, "own", it.title);
    const o = OWNED[it.owned] || OWNED.yes;
    const banner = it.owned === "wishlist" ? `<div class="banner wishlist">\u2605 ON YOUR WISHLIST</div>`
      : `<div class="banner ${o[1]}">${o[2]}</div>`;
    showResult(`${codeLabel(code, fmt)}${banner}
      ${it.done ? `<div class="banner done" style="background:var(--ok)">\u2713 ${it.status === "100" ? "100% COMPLETE" : "PLAYED / WATCHED"}</div>` : ""}
      ${itemCard(it, `<button type="button" class="secondary" data-open="${esc(it.id)}">Open</button>`)}
      ${it.owned === "wishlist" ? `<div class="actions"><button type="button" class="primary" id="srBought">\u2713 I bought it \u2014 add to Collection</button></div>` : ""}`, code, push);
    const b = $("#srBought"); if (b) b.onclick = () => { queueChange("set_owned", it.id, {owned: "yes"}); toast("Moved to your Collection \u2014 enjoy!"); handleCode(code, fmt, "replace"); };
    return "own";
  }
  showResult(`${codeLabel(code, fmt)}<div class="looking"><i class="spin"></i><div><b>Looking up\u2026</b><div class="small dim" id="lookStep">Checking product databases</div></div></div>`,
    code, push);
  const still = () => !$("#scanResult").hidden && history.state && history.state.code === code;
  lookupProduct(code, (step) => { const el = $("#lookStep"); if (el && still()) el.textContent = step; })
    .then((info) => { if (still()) renderLookupResult(code, fmt, info); });
  return "lookup";
}
function withTimeout(p, ms) { return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]); }
async function fetchJson(url, ms = 7000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(url, {signal: ctl.signal, headers: {Accept: "application/json"}}); if (!r.ok) return {_status: r.status}; return await r.json(); }
  finally { clearTimeout(t); }
}
function relayBase() {
  const u = (DATA && DATA.upc_relay) || CFG.upcRelay || "";
  return /^https:\/\//.test(u) ? u.replace(/\/+$/, "") : "";
}
async function lookupProduct(code, step = () => {}) {
  /* order: PC-resolved names in the export -> names found before on this phone -> UPC relay (UPCitemdb + Open Library +
     Open Products Facts, cached on Arthur's server) -> Open Library / Open Products Facts directly -> give up (PC queue) */
  const pc = DATA && DATA.barcode_lookups && DATA.barcode_lookups[code];
  if (pc && pc.found) return Object.assign({}, pc, {source: (pc.source || "UPCitemdb") + " (via PC)"});
  if (LOOKUPS[code] && LOOKUPS[code].found) return LOOKUPS[code];
  if (!navigator.onLine) return {found: false, offline: true};
  let info = null, relayAnswered = false;
  const relay = relayBase();
  if (relay) {
    step("Checking UPC database\u2026");
    try {
      const j = await fetchJson(`${relay}/upc/${code}`, 15000);
      if (j && j.ok && j.found && j.title) info = {found: true, source: j.source || "UPC relay", title: j.title, brand: j.brand || "", category: j.category || "", kind: j.kind || ""};
      else if (j && j.ok && j.found === false && !j.incomplete) relayAnswered = true;   // every source said no
    } catch (e) { console.warn("relay", e && e.name); }
  }
  if (!info && !relayAnswered) {
    try {
      if (isIsbn(code)) {   // Open Library search API: CORS *, no key, always 200 (numFound 0 when unknown)
        step("Checking Open Library\u2026");
        const j = await fetchJson(`https://openlibrary.org/search.json?isbn=${code}&fields=title,subtitle,author_name&limit=1`);
        const d = j && j.docs && j.docs[0];
        if (d && d.title) info = {found: true, source: "Open Library", title: d.title + (d.subtitle ? ": " + d.subtitle : ""),
          brand: (d.author_name || []).slice(0, 2).join(", "), category: "Books", kind: "book"};
      }
      if (!info) {          // Open Products Facts search-by-code: CORS *, no key, 200 with products [] when unknown
        step("Checking Open Products Facts\u2026");
        const j = await fetchJson(`https://world.openproductsfacts.org/api/v2/search?code=${code}&fields=code,product_name,product_name_en,brands,categories&page_size=1`);
        const p = j && j.products && j.products.find((x) => normBarcode(x.code) === code);
        if (p && (p.product_name_en || p.product_name)) info = {found: true, source: "Open Products Facts", title: p.product_name_en || p.product_name, brand: p.brands || "", category: p.categories || ""};
      }
    } catch (e) { console.warn("lookup", e && e.name); }
  }
  info = info || {found: false, definitive: relayAnswered};
  info.code = code; info.looked_up = Date.now();
  if (info.found) { LOOKUPS[code] = info; DB.set("lookups", LOOKUPS); }
  return info;
}
function queuePcLookup(code, fmt) {
  if (QUEUE.some((c) => c.type === "lookup" && c.data && c.data.barcode === code)) return false;
  const pc = DATA && DATA.barcode_lookups && DATA.barcode_lookups[code];
  if (pc && !pc.found && !pc.error) return false;      // the PC already tried and UPCitemdb doesn't know it
  queueChange("lookup", null, {barcode: code, format: fmt || ""}); return true;
}
function renderLookupResult(code, fmt, info) {
  const name = info.found ? info.title : "";
  const title = name ? cleanTitle(name, info.brand) : "";
  const platform = info.kind === "book" ? "" : guessPlatform([name, info.category].join(" "));
  const category = info.kind === "book" ? "Books" : guessCategory([name, info.category].join(" "), code);
  const pcTried = DATA && DATA.barcode_lookups && DATA.barcode_lookups[code];
  let queued = false;
  if (!info.found && !info.definitive) queued = queuePcLookup(code, fmt);   // last resort: the PC tries UPCitemdb later
  rememberScan(code, info.found ? "found" : (queued || QUEUE.some((c) => c.type === "lookup" && c.data.barcode === code) ? "queued" : "unknown"), title);
  const why = info.offline ? "You're offline \u2014 saved; the name will be looked up when you're back online (or type the title)."
    : info.found ? "" : (info.definitive || (pcTried && !pcTried.found)) ? "None of the product databases know this barcode. Type the title below, or add it."
      : "Couldn't reach the UPC database right now. Your PC will look it up at its next sync \u2014 or type the title below.";
  $("#srBody").innerHTML = `${codeLabel(code, fmt)}
    ${info.found ? `<div class="product"><div class="small dim">Found on ${esc(info.source)}</div><b>${esc(name)}</b>${info.brand ? `<div class="dim">${esc(info.brand)}</div>` : ""}</div>`
      : `<div class="product"><b>Unknown product</b><div class="small dim">${esc(why)}</div></div>`}
    <div class="form"><label>Title<input id="srTitle" value="${esc(title)}" placeholder="Type the title on the box" autocapitalize="words"></label></div>
    <div id="srMatches"></div>
    <div id="srNot"></div>`;
  const upd = () => {
    const t = $("#srTitle").value.trim(), m = findMatches(t, platform, 5, category);
    $("#srMatches").innerHTML = m.length ? `<h3 style="margin:8px 0">Is it one of these?</h3>` +
      m.map((it) => itemCard(it, `<button type="button" class="primary" data-link="${esc(it.id)}">Yes \u2713</button>`)).join("") : "";
    $("#srNot").innerHTML = (t || !info.found) ? `${m.length ? "" : `<div class="banner sold" style="background:#5a2230">\u2715 NOT IN YOUR LIBRARY</div>`}
      <div class="actions"><button type="button" class="primary" id="srAddC">+ Add to Collection</button><button type="button" class="primary wish-btn" id="srAddW">\u2605 Add to Wishlist</button></div>
      <p class="small dim">${m.length ? "None of these? " : ""}Opens the add form ${t ? `prefilled (${esc([category, platform].filter(Boolean).join(", "))})` : "with this barcode"} so you can fix anything first.</p>` : "";
    const pre = (owned) => ({title: t, category, platform, owned, in_collection: true, barcode: code, barcode_format: fmt || "",
      format: category === "Video Game" && /^(ps[1-5]|xbox.*|wii|wii u|gamecube|pc|saturn|dreamcast|sega cd)$/i.test(platform) ? "disc" : (category === "Video Game" && platform ? "cartridge" : "")});
    const c = $("#srAddC"); if (c) c.onclick = () => openEditor(pre("yes"), "replace");
    const w = $("#srAddW"); if (w) w.onclick = () => openEditor(pre("wishlist"), "replace");
  };
  $("#srTitle").addEventListener("input", upd); upd();
  $("#srMatches").onclick = (e) => {
    const b = e.target.closest("[data-link]"); if (!b) return;
    const it = ITEMS.find((x) => x.id === b.dataset.link); if (!it) return;
    queueChange("link_barcode", it.id, {barcode: code, format: fmt || ""});
    rememberScan(code, "linked", it.title); toast(`Linked \u2014 next time this barcode shows \u201c${it.title}\u201d`);
    handleCode(code, fmt, "replace");
  };
}
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
async function gfetch(url, at, asJson = true, init = {}) {
  const r = await fetch(url, Object.assign({}, init, {headers: Object.assign({Authorization: "Bearer " + at}, init.headers || {})}));
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
  email: async (at) => ((await gfetch("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)", at)).user || {}).emailAddress || "",
  async create(at, name, obj, folderId) {   // new file in MyLibrary (multipart upload); never touches the export
    const b = "mlb" + rid() + rid(), meta = {name, mimeType: "application/json", parents: folderId ? [folderId] : undefined};
    const body = `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
      `--${b}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(obj)}\r\n--${b}--`;
    return gfetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name", at, true,
      {method: "POST", headers: {"Content-Type": `multipart/related; boundary=${b}`}, body});
  }
};
const Stub = {   // local test double: serves ./stub/ files from the test server, same shape as Drive
  async find(_at, name) { const r = await fetch(`/stub/${name}`, {method: "HEAD", cache: "no-store"});
    if (!r.ok) return null; return {id: name, md5Checksum: r.headers.get("etag") || String(r.headers.get("last-modified")), modifiedTime: r.headers.get("last-modified"), parents: ["stub-folder"]}; },
  async get(_at, id) { const r = await fetch(`/stub/${id}`, {cache: "no-store"}); if (!r.ok) throw new Error("stub " + r.status); return r.json(); },
  email: async () => "stub@localhost",
  async create(_at, name, obj) { const r = await fetch(`/stub-upload/${name}`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(obj)});
    if (!r.ok) throw new Error("stub upload " + r.status); return r.json(); }
};
async function uploadQueue(src, at) {
  const todo = QUEUE.filter((c) => c._state !== "uploaded"); if (!todo.length) return 0;
  if (META.readonly) { META.uploadNote = "read-only access"; return 0; }
  if (!META.folderId && !STUB) throw new Error("Can't find the MyLibrary folder to upload changes to");
  const name = `phone-changes-${stamp()}-${rid()}.json`;
  const doc = {format: "mylibrary-phone-changes", version: 1, app_version: APP_VERSION, created: new Date().toISOString(),
    device: (navigator.userAgentData && navigator.userAgentData.platform) || "phone",
    changes: todo.map(({_state, _file, ...c}) => c)};
  const r = await src.create(at, name, doc, META.folderId);
  for (const c of todo) { c._state = "uploaded"; c._file = (r && r.id) || name; }
  META.uploaded = Date.now(); await saveQueue(); return todo.length;
}
function refreshScansFromExport() {
  const looks = (DATA && DATA.barcode_lookups) || {}; let n = 0;
  let changed = false;
  for (const s of SCANS) if (s.state === "queued" && looks[s.code]) {
    changed = true; s.state = looks[s.code].found ? "found" : "unknown";
    if (looks[s.code].found) { s.title = cleanTitle(looks[s.code].title, looks[s.code].brand); n++; }
  }
  if (changed) saveScans();
  if (n) { setTimeout(() => toast(`Your PC identified ${n} scanned barcode${n > 1 ? "s" : ""} \u2014 see Scan \u2192 Recent`, 5000), 1500); }
}

async function sync(interactive) {
  if (busy) { sync.again = sync.again || interactive || "silent"; return; }
  if (!navigator.onLine) { if (interactive) toast("Offline \u2014 showing the copy saved on this phone" + (QUEUE.length ? "; your changes are saved and will upload later" : "")); return; }
  busy = true; $("#syncBtn").classList.add("spin"); $("#welcomeMsg").textContent = "";
  try {
    const src = STUB ? Stub : Drive;
    const at = STUB ? "stub" : await getToken(interactive);
    if (!at) { if (interactive !== false) toast("Tap \u27f3 to refresh from Google Drive"); return; }
    if (!STUB && !META.email) { META.email = await Drive.email(at).catch(() => ""); }
    META.consented = true;
    const fe = await src.find(at, CFG.exportName);
    if (!fe) {
      const m = META.readonly ? `No ${CFG.exportName} found in your Drive. Click \u201cSync to phone\u201d in My Library Launcher first.`
        : `Can't see ${CFG.exportName} yet. In My Library Launcher click \u201c\u2601 Sync to phone\u201d (same Google account), then refresh. ` +
          `If it is already in My Drive/MyLibrary, use Settings \u2192 \u201cread-only Drive access\u201d.`;
      throw new Error(m);
    }
    if (fe.parents && fe.parents[0]) META.folderId = fe.parents[0];
    let up = 0, upErr = null;
    try { up = await uploadQueue(src, at); } catch (e) { if (e.auth) throw e; upErr = e; console.warn("upload", e.message); }
    let changed = false;
    if (!DATA || fe.md5Checksum !== META.exportMd5 || interactive) {
      const doc = await src.get(at, fe.id);
      if (!doc || doc.format !== "mylibrary-phone-export") throw new Error("That file is not a My Library export");
      changed = !DATA || doc.exported !== DATA.exported;
      await DB.set("export", doc); META.exportMd5 = fe.md5Checksum; DATA = doc;
      if (dropApplied()) await saveQueue();
      prepare(doc); refreshScansFromExport();
      if (doc.thumbs_rev && doc.thumbs_rev !== META.thumbsRev) {
        const ft = await src.find(at, CFG.thumbsName);
        if (ft) { const td = await src.get(at, ft.id); THUMBS = td.thumbs || {}; await DB.set("thumbs", THUMBS); META.thumbsRev = td.thumbs_rev || doc.thumbs_rev; }
      }
    }
    META.checked = Date.now(); await DB.set("meta", META);
    $("#welcome").hidden = true; render(); renderPill();
    if (upErr) toast("Couldn't upload your changes yet (" + upErr.message + ") \u2014 they're saved on this phone", 5000);
    else if (META.readonly && QUEUE.some((c) => c._state !== "uploaded")) toast("Read-only access: switch back in Settings to send your changes to the PC", 5000);
    else if (up) toast(`\u2713 Sent ${up} change${up > 1 ? "s" : ""} to your Drive for the PC`);
    else if (interactive) toast(changed ? `Updated \u2014 ${ITEMS.length} items (PC sync ${fmtWhen(DATA.exported)})` : "Up to date");
    else if (changed) toast(`Updated from your PC \u2014 ${ITEMS.length} items`);
  } catch (e) {
    console.warn(e.message);
    if (!DATA) { showWelcome(e.message); } else if (interactive !== false || e.auth) toast(e.message, 5000);
  } finally {
    busy = false; $("#syncBtn").classList.remove("spin");
    const again = sync.again; sync.again = null; if (again) setTimeout(() => sync(again === true), 30);
  }
}
function showWelcome(msg) { $("#welcome").hidden = false; $("#welcomeMsg").textContent = msg || ""; }

/* ------------------------------------------------------------------ events */
function openItemFromCard(id) {
  const f = $("#edForm");
  if (!$("#editor").hidden && f.barcode.value.trim()) {     // editor: "Link" the typed / scanned barcode to an existing item
    const bc = normBarcode(f.barcode.value, f.dataset.fmt);
    if (gtinOk(bc)) { queueChange("link_barcode", id, {barcode: bc, format: f.dataset.fmt || ""}); rememberScan(bc, "linked", (ITEMS.find((x) => x.id === id) || {}).title); toast("Barcode linked"); }
  }
  history.replaceState({sheet: "detail", id}, ""); openDetail(id, false);
}
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
  $("#empty").onclick = (e) => {
    if (e.target.id === "showAll") { ui.scope = "all"; ui.cat = ""; ui.plat = ""; render(); }
    if (e.target.id === "addThis") openEditor({title: ui.q, owned: ui.scope === "wishlist" ? "wishlist" : "yes"});
  };
  $("#more").onclick = () => { ui.limit += PAGE; render(); };
  $("#sortBtn").onclick = () => { ui.sort = ui.sort === "recent" ? "title" : "recent"; render(); };
  $("#syncBtn").onclick = () => sync(true);
  $("#syncPill").onclick = () => sync(true);
  $("#signinBtn").onclick = () => sync(true);
  $("#menuBtn").onclick = () => openSettings();
  $("#scanFab").onclick = () => { if (!DATA) return toast("Sign in first so the app knows your library"); openScanner(); };
  $("#addFab").onclick = () => { if (!DATA) return toast("Sign in first"); openEditor({title: ui.q || "", owned: ui.scope === "wishlist" ? "wishlist" : "yes"}); };
  for (const id of ["dBack", "sBack", "scBack", "srBack", "edBack"]) $("#" + id).onclick = () => history.back();
  $("#srAgain").onclick = () => { Scanner.unlockAudio(); openScanner({mode: "find"}, "replace"); };
  $("#scTorch").onclick = () => Scanner.torch();
  $("#manualForm").onsubmit = (e) => { e.preventDefault(); const v = $("#manualCode").value; if (!digits(v)) return;
    if (!gtinOk(normBarcode(v))) { toast(`\u201c${v}\u201d isn't a valid UPC / EAN barcode \u2014 check the numbers`); return; }
    Scanner.stop(); handleCode(v, ""); };
  $("#recentScans").onclick = (e) => { const r = e.target.closest("[data-code]"); if (r) { Scanner.stop(); handleCode(r.dataset.code, ""); } };
  $("#srBody").addEventListener("click", (e) => {
    if (e.target.closest("[data-rescan]")) { Scanner.unlockAudio(); openScanner({mode: "find"}, "replace"); return; }
    const b = e.target.closest("[data-open]"); if (b) openItemFromCard(b.dataset.open); });
  $("#edMatches").onclick = (e) => { const b = e.target.closest("[data-open]"); if (b) openItemFromCard(b.dataset.open); };
  const f = $("#edForm");
  f.addEventListener("submit", saveEditor);
  f.title.addEventListener("input", () => { clearTimeout(f._t); f._t = setTimeout(edMatches, 120); });
  f.platform.addEventListener("change", edMatches);
  f.category.addEventListener("change", () => { fillPlatList(f.category.value); edMatches(); });
  f.owned.addEventListener("change", () => { if (["yes", "rom"].includes(f.owned.value)) f.in_collection.checked = true; });
  window.addEventListener("popstate", (e) => {
    const st = e.state; closeSheets();
    if (!st) return;
    if (st.sheet === "detail") openDetail(st.id, false);
    else if (st.sheet === "settings") openSettings(false);
    else if (st.sheet === "scanner") openScanner(st.ctx || {mode: "find"}, false);
    else if (st.sheet === "scanResult") handleCode(st.code, "", false);
    else if (st.sheet === "editor") openEditor(st.pre || {}, false);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { Scanner.stop(); scheduleUpload(0); }   // flush pending edits when the app is put away
    else if (!$("#scanner").hidden) Scanner.start((code, fmt) => handleCode(code, fmt));
  });
  window.addEventListener("online", () => { renderPill(); scheduleUpload(300); });
  window.addEventListener("offline", renderPill);
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
    QUEUE = (await DB.get("queue")) || []; SCANS = (await DB.get("scans")) || []; LOOKUPS = (await DB.get("lookups")) || {};
    const doc = await DB.get("export");
    if (doc) { prepare(doc); THUMBS = (await DB.get("thumbs")) || {}; render(); }
  } catch (e) { console.warn("cache", e); }
  renderPill();
  if (!DATA) { showWelcome(STUB ? "Test mode: tap Sign in to load the local sample export." : ""); return; }
  if (navigator.onLine && (STUB || savedToken())) sync(false);
  if (sp.get("scan") === "1") openScanner();     // home-screen shortcut
}
window.__ml = {ui, render, sync, handleCode, validRead, relayBase, cleanTitle, guessPlatform, guessCategory, findMatches, normBarcode, gtinOk, Scanner, lookupProduct,
  state: () => ({items: ITEMS.length, thumbs: Object.keys(THUMBS).length, exported: DATA && DATA.exported, meta: META,
    queue: QUEUE.map((c) => ({id: c.id, type: c.type, item_id: c.item_id, data: c.data, state: c._state})), scans: SCANS.slice(),
    pending: ITEMS.filter((i) => i._pending).map((i) => i.id), item: (id) => ITEMS.find((i) => i.id === id)})};
start();
})();
