/* Stage 6 audio, v1.0.4 arrangement. Web Audio only, original Retro Gaming Dad
   tones. The AudioContext is created after the first key, click, tap, or pad
   press so the browser autoplay policy stays quiet. One theme: gear 1 drums,
   gear 2 adds bass, gear 3 adds the lead, gear 4 adds a brighter flip line.
   Layers crossfade on the beat. Flip entry and the final lap each play one
   one-bar stinger through the music bus. Engine pitch follows gear and RPM.
   Volumes live under settings.audio on gearshift_v1 and merge with the rest
   of that save. The game never loads the WAV renders of these parts. */
(function (GS) {
  'use strict';

  var SAVE_KEY = 'gearshift_v1';
  var HEARD_MAX = 64;

  var settings = {
    master: 80,
    music: 60,
    sfx: 90,
    muted: false,
    shake: true,
    quality: 'mid',
    reducedFlash: false,
    autoQuality: true,
    targetGhost: true,
    difficulty: 'normal'
  };
  var asked = false;

  var ctx = null;
  var master = null;
  var musicBus = null;
  var sfxBus = null;
  var engineBus = null;
  var musicFilter = null;
  var compressor = null;
  var engineOscA = null;
  var engineOscB = null;
  var engineFilter = null;
  var engineLfo = null;
  var noiseBuf = null;
  var layerGain = [null, null, null, null];
  var nextNote = 0;
  var step = 0;
  var bpm = 116;
  var primed = false;
  var lastGear = 1;
  var lastRpm = 0;
  var lastHz = 0;
  var heard = [];
  var lastEvent = '';
  var lastEventAt = 0;
  var duck = 1;
  var wantDuck = 1;
  var layerSum = null;
  var musicClock = 0;
  var lastAudioNow = -1;
  var nextGrid = 0;
  var gridLive = false;
  var shown = [1, 0, 0, 0];
  var targetMix = [1, 0, 0, 0];
  var queuedMix = [1, 0, 0, 0];
  var fadeFrom = [1, 0, 0, 0];
  var fadeClock = -1;
  var liveShots = [];
  var stingerCount = 0;
  var lastStinger = null;
  var finalLapFired = false;
  var duckLeft = 0;
  var pausedNow = false;
  var FADE_S = 0.22;
  var SHOT_CAP = 96;

  GS.audioSettings = settings;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function num(value, fallback, min, max) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return clamp(n, min, max);
  }

  function snap5(value, fallback) {
    var n = num(value, fallback, 0, 100);
    return clamp(Math.round(n / 5) * 5, 0, 100);
  }

  function takeVol(raw, fallback) {
    if (raw == null || raw === '') return { value: snap5(fallback, fallback), dirty: false };
    var snapped = snap5(raw, fallback);
    return { value: snapped, dirty: Math.abs(snapped - Number(raw)) > 0.01 };
  }

  function readSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
      return data;
    } catch (err) {
      return {};
    }
  }

  function load() {
    var data = readSave();
    var block = data.settings && data.settings.audio;
    if (!block || typeof block !== 'object' || Array.isArray(block)) return;
    var master = takeVol(block.master, settings.master);
    var music = takeVol(block.music, settings.music);
    var sfx = takeVol(block.sfx, settings.sfx);
    settings.master = master.value;
    settings.music = music.value;
    settings.sfx = sfx.value;
    if (typeof block.muted === 'boolean') settings.muted = block.muted;
    if (typeof block.shake === 'boolean') settings.shake = block.shake;
    if (block.quality === 'low' || block.quality === 'mid' || block.quality === 'high') settings.quality = block.quality;
    if (typeof block.reducedFlash === 'boolean') settings.reducedFlash = block.reducedFlash;
    if (typeof block.autoQuality === 'boolean') settings.autoQuality = block.autoQuality;
    if (typeof block.targetGhost === 'boolean') settings.targetGhost = block.targetGhost;
    if (block.difficulty === 'easy' || block.difficulty === 'normal') settings.difficulty = block.difficulty;
    if (typeof block.particles === 'boolean' && !block.quality) {
      settings.quality = block.particles ? 'mid' : 'low';
    }
    if (master.dirty || music.dirty || sfx.dirty) save();
  }

  function save() {
    var writer = GS.updateSave;
    if (!writer) {
      writer = function (mutator) {
        var data = readSave();
        mutator(data);
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(data));
          return true;
        } catch (err) {
          return false;
        }
      };
    }
    writer(function (data) {
      if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
        data.settings = {};
      }
      var prev = data.settings.audio && typeof data.settings.audio === 'object' ? data.settings.audio : {};
      prev.master = settings.master;
      prev.music = settings.music;
      prev.sfx = settings.sfx;
      prev.muted = settings.muted;
      prev.shake = settings.shake;
      prev.quality = settings.quality;
      prev.reducedFlash = !!settings.reducedFlash;
      prev.autoQuality = settings.autoQuality !== false;
      prev.targetGhost = settings.targetGhost !== false;
      prev.difficulty = settings.difficulty === 'easy' ? 'easy' : 'normal';
      prev.particles = settings.quality !== 'low';
      data.settings.audio = prev;
    });
  }

  function notify() {
    if (GS.onAudioChanged) GS.onAudioChanged();
    if (GS.onBindingsChanged) GS.onBindingsChanged();
  }

  function noteHeard(name) {
    lastEvent = name;
    lastEventAt = ctx ? ctx.currentTime : 0;
    heard.push(name);
    if (heard.length > HEARD_MAX) heard.shift();
  }

  function busLevel() {
    if (settings.muted) return 0;
    return settings.master / 100;
  }

  function applyGains() {
    if (!master || !ctx) return;
    var now = ctx.currentTime;
    master.gain.setTargetAtTime(busLevel(), now, 0.04);
    musicBus.gain.setTargetAtTime((settings.music / 100) * duck, now, 0.06);
    sfxBus.gain.setTargetAtTime(settings.sfx / 100, now, 0.04);
  }

  function makeNoise(seconds) {
    var count = Math.floor(ctx.sampleRate * seconds);
    var buffer = ctx.createBuffer(1, count, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < count; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function connectEngine() {
    engineFilter = ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 420;
    engineFilter.Q.value = 0.7;
    engineFilter.connect(engineBus);

    engineOscA = ctx.createOscillator();
    engineOscA.type = 'sawtooth';
    engineOscA.frequency.value = 52;
    engineOscA.connect(engineFilter);

    engineOscB = ctx.createOscillator();
    engineOscB.type = 'square';
    engineOscB.frequency.value = 52.6;
    engineOscB.connect(engineFilter);

    engineLfo = ctx.createOscillator();
    engineLfo.type = 'sine';
    engineLfo.frequency.value = 18;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = 4;
    engineLfo.connect(lfoGain);
    lfoGain.connect(engineOscA.frequency);
    engineOscA.start();
    engineOscB.start();
    engineLfo.start();
  }

  function resumeQuiet() {
    if (!ctx || ctx.state !== 'suspended') return;
    try { ctx.resume(); } catch (err) {}
  }

  function ensure() {
    asked = true;
    if (primed && ctx) {
      resumeQuiet();
      return ctx;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.knee.value = 10;
      compressor.ratio.value = 3.2;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.12;
      compressor.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(compressor);

      musicFilter = ctx.createBiquadFilter();
      musicFilter.type = 'lowpass';
      // Hats need the top end in gear 1. The arrangement is the layers, not a mute filter.
      musicFilter.frequency.value = 14000;
      musicFilter.Q.value = 0.4;
      musicBus = ctx.createGain();
      musicBus.gain.value = 0;
      musicBus.connect(musicFilter);
      musicFilter.connect(master);
      layerSum = ctx.createGain();
      layerSum.gain.value = 1;
      layerSum.connect(musicBus);

      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0;
      sfxBus.connect(master);

      engineBus = ctx.createGain();
      engineBus.gain.value = 0;
      engineBus.connect(sfxBus);

      var i;
      for (i = 0; i < 4; i++) {
        layerGain[i] = ctx.createGain();
        layerGain[i].gain.value = i === 0 ? 1 : 0;
        layerGain[i].connect(layerSum);
      }

      noiseBuf = makeNoise(1.2);
      connectEngine();
      nextNote = ctx.currentTime + 0.08;
      step = 0;
      primed = true;
      applyGains();
      resumeQuiet();
    } catch (err) {
      ctx = null;
      primed = false;
      return null;
    }
    return ctx;
  }

  function envGain(dest, peak, attack, hold, release, at) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), at + attack);
    g.gain.setValueAtTime(Math.max(0.0002, peak), at + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
    g.connect(dest);
    return g;
  }

  function tone(type, freq, endFreq, peak, attack, hold, release, dest, at) {
    if (!ctx) return;
    var now = at == null ? ctx.currentTime : at;
    var osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), now);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + attack + hold + release);
    }
    var g = envGain(dest || sfxBus, peak, attack, hold, release, now);
    osc.connect(g);
    osc.start(now);
    osc.stop(now + attack + hold + release + 0.02);
  }

  function noiseBurst(peak, seconds, freq, q, type, dest, at) {
    if (!ctx || !noiseBuf) return;
    var now = at == null ? ctx.currentTime : at;
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var filter = ctx.createBiquadFilter();
    filter.type = type || 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.value = q == null ? 0.8 : q;
    var g = envGain(dest || sfxBus, peak, 0.008, 0.02, seconds, now);
    src.connect(filter);
    filter.connect(g);
    src.start(now);
    src.stop(now + seconds + 0.04);
  }

  function shunk() {
    noiseBurst(0.22, 0.16, 240, 0.9, 'bandpass');
    tone('square', 92, 46, 0.16, 0.004, 0.03, 0.11);
    tone('square', 210, 90, 0.05, 0.002, 0.01, 0.07);
    tone('triangle', 1800, 900, 0.03, 0.001, 0.01, 0.04);
  }

  function whoosh(heavy) {
    if (!ctx || !noiseBuf) return;
    var now = ctx.currentTime;
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(heavy ? 280 : 420, now);
    filter.frequency.exponentialRampToValueAtTime(heavy ? 1600 : 2400, now + 0.28);
    filter.Q.value = 0.6;
    var g = envGain(sfxBus, heavy ? 0.16 : 0.11, 0.02, 0.08, 0.28, now);
    src.connect(filter);
    filter.connect(g);
    src.start(now);
    src.stop(now + 0.42);
    tone('sine', heavy ? 110 : 160, 48, 0.05, 0.02, 0.05, 0.22);
  }

  function snap() {
    tone('triangle', 980, 420, 0.07, 0.002, 0.02, 0.1);
    noiseBurst(0.05, 0.06, 1800, 1.4, 'highpass');
  }

  function countdown(n) {
    var freq = n >= 3 ? 392 : n === 2 ? 440 : 494;
    tone('square', freq, freq, 0.1, 0.004, 0.06, 0.1);
    tone('triangle', freq * 2, freq * 2, 0.04, 0.004, 0.05, 0.08);
  }

  function go() {
    tone('square', 784, 784, 0.12, 0.004, 0.08, 0.12);
    tone('triangle', 1175, 1175, 0.07, 0.004, 0.1, 0.14);
    tone('sine', 392, 392, 0.06, 0.01, 0.12, 0.16);
  }

  function lap() {
    tone('square', 660, 660, 0.08, 0.004, 0.05, 0.08);
    tone('square', 880, 880, 0.07, 0.004, 0.06, 0.1, sfxBus, ctx.currentTime + 0.09);
  }

  function checkpoint() {
    tone('triangle', 740, 740, 0.045, 0.003, 0.03, 0.06);
  }

  function near() {
    whoosh(false);
    tone('sine', 240, 90, 0.05, 0.01, 0.04, 0.16);
  }

  function crash() {
    noiseBurst(0.28, 0.32, 180, 0.5, 'lowpass');
    tone('sawtooth', 180, 42, 0.12, 0.004, 0.04, 0.28);
    tone('square', 70, 32, 0.1, 0.006, 0.05, 0.22);
  }

  function land() {
    noiseBurst(0.12, 0.14, 160, 0.7, 'lowpass');
    tone('sine', 70, 40, 0.08, 0.004, 0.03, 0.12);
  }

  function ui() {
    tone('square', 1240, 1240, 0.035, 0.001, 0.02, 0.04);
  }

  function medal() {
    var t = ctx.currentTime;
    tone('triangle', 587, 587, 0.09, 0.004, 0.08, 0.12, sfxBus, t);
    tone('triangle', 740, 740, 0.09, 0.004, 0.08, 0.14, sfxBus, t + 0.1);
    tone('triangle', 880, 880, 0.1, 0.004, 0.1, 0.18, sfxBus, t + 0.2);
    tone('triangle', 1175, 1175, 0.11, 0.004, 0.16, 0.28, sfxBus, t + 0.32);
  }

  function cup() {
    var t = ctx.currentTime;
    tone('square', 392, 392, 0.1, 0.006, 0.1, 0.14, sfxBus, t);
    tone('square', 523, 523, 0.1, 0.006, 0.1, 0.16, sfxBus, t + 0.14);
    tone('square', 659, 659, 0.11, 0.006, 0.12, 0.18, sfxBus, t + 0.28);
    tone('triangle', 784, 784, 0.12, 0.008, 0.22, 0.4, sfxBus, t + 0.44);
    tone('triangle', 1047, 1047, 0.08, 0.008, 0.28, 0.42, sfxBus, t + 0.44);
  }

  function finish() {
    tone('sawtooth', 196, 98, 0.1, 0.004, 0.08, 0.22);
    tone('square', 392, 392, 0.09, 0.004, 0.1, 0.18);
    tone('triangle', 784, 523, 0.08, 0.006, 0.16, 0.28);
    noiseBurst(0.08, 0.18, 400, 0.6, 'bandpass');
  }

  var PLAY = {
    shunk: shunk,
    whoosh: whoosh,
    snap: snap,
    countdown: countdown,
    go: go,
    lap: lap,
    checkpoint: checkpoint,
    near: near,
    crash: crash,
    land: land,
    ui: ui,
    medal: medal,
    cup: cup,
    finish: finish
  };

  function play(name, arg) {
    if (!name) return false;
    if (!ctx) return false;
    if (settings.muted) {
      noteHeard(name);
      return true;
    }
    var fn = PLAY[name];
    if (!fn) return false;
    try {
      if (name === 'whoosh') fn(!!arg);
      else if (name === 'countdown') fn(arg == null ? 3 : arg);
      else fn();
      noteHeard(name);
      return true;
    } catch (err) {
      return false;
    }
  }

  // One theme in D minor. Layers: 0 drums, 1 bass, 2 lead, 3 flip (brighter lead).
  var GEAR_MIX = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 0.85, 1]
  ];
  var MENU_MIX = [0.48, 0.18, 0, 0];
  var BASS_HZ = [146.83, 146.83, 110, 130.81, 146.83, 174.61, 110, 98];
  var LEAD_HZ = [293.66, 349.23, 440, 349.23, 392, 349.23, 293.66, 261.63];
  var FLIP_HZ = [587.33, 698.46, 880, 698.46, 784, 698.46, 587.33, 523.25];

  function noiseBuffer(ac, seconds) {
    var count = Math.floor(ac.sampleRate * seconds);
    var buffer = ac.createBuffer(1, Math.max(1, count), ac.sampleRate);
    var data = buffer.getChannelData(0);
    var i;
    for (i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function dropNodes(nodes) {
    var i;
    for (i = 0; i < nodes.length; i++) {
      try { nodes[i].disconnect(); } catch (err) {}
    }
  }

  function trackShot(nodes, endAt, live) {
    if (!live) return;
    if (liveShots.length >= SHOT_CAP) {
      dropNodes(liveShots[0].nodes);
      liveShots.shift();
    }
    liveShots.push({ nodes: nodes, endAt: endAt });
  }

  function reapShots(now) {
    var i = 0;
    while (i < liveShots.length) {
      if (liveShots[i].endAt <= now + 0.001) {
        dropNodes(liveShots[i].nodes);
        liveShots[i] = liveShots[liveShots.length - 1];
        liveShots.pop();
      } else {
        i += 1;
      }
    }
  }

  function envHit(ac, dest, peak, attack, hold, release, at, live) {
    var g = ac.createGain();
    var end = at + attack + hold + release;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    g.connect(dest);
    return { gain: g, end: end, nodes: [g] };
  }

  function hitTone(ac, dest, type, freq, endFreq, peak, dur, at, noise, live) {
    if (!dest || peak <= 0.0002) return;
    var osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), at);
    var env = envHit(ac, dest, peak, 0.008, dur * 0.42, dur * 0.5, at, live);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), env.end);
    }
    osc.connect(env.gain);
    osc.start(at);
    osc.stop(env.end + 0.02);
    env.nodes.push(osc);
    trackShot(env.nodes, env.end + 0.03, live);
  }

  function hitKick(ac, dest, at, noise, live) {
    if (!dest) return;
    var osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(172, at);
    osc.frequency.exponentialRampToValueAtTime(48, at + 0.1);
    var env = envHit(ac, dest, 0.46, 0.004, 0.02, 0.12, at, live);
    osc.connect(env.gain);
    osc.start(at);
    osc.stop(at + 0.18);
    var nodes = env.nodes;
    nodes.push(osc);
    if (noise) {
      var src = ac.createBufferSource();
      src.buffer = noise;
      var filter = ac.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, at);
      var ng = ac.createGain();
      ng.gain.setValueAtTime(0.11, at);
      ng.gain.exponentialRampToValueAtTime(0.0001, at + 0.028);
      src.connect(filter);
      filter.connect(ng);
      ng.connect(dest);
      src.start(at);
      src.stop(at + 0.04);
      nodes.push(src);
      nodes.push(filter);
      nodes.push(ng);
    }
    trackShot(nodes, at + 0.2, live);
  }

  function hitHat(ac, dest, at, open, noise, live) {
    if (!dest || !noise) return;
    var src = ac.createBufferSource();
    src.buffer = noise;
    var filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(open ? 6200 : 7600, at);
    var g = ac.createGain();
    var dur = open ? 0.09 : 0.032;
    var peak = open ? 0.055 : 0.04;
    g.gain.setValueAtTime(peak, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(at);
    src.stop(at + dur + 0.02);
    trackShot([src, filter, g], at + dur + 0.03, live);
  }

  function layerHot(i) {
    return shown[i] > 0.02 || targetMix[i] > 0.02 || queuedMix[i] > 0.02;
  }

  // only: null plays every hot layer, or 'drums' | 'bass' | 'lead' | 'flip' for a stem.
  function playStepInto(ac, dests, at, s, only, noise, live) {
    var q = s >> 2;
    var drums = dests[0];
    var bass = dests[1];
    var lead = dests[2];
    var flip = dests[3];
    var sixteenth = 60 / bpm / 4;
    if ((!only || only === 'drums') && (only || layerHot(0))) {
      if (s % 4 === 0) hitKick(ac, drums, at, noise, live);
      if (s % 2 === 0) hitHat(ac, drums, at, s % 8 === 4, noise, live);
    }
    if ((!only || only === 'bass') && (only || layerHot(1)) && s % 4 === 0) {
      hitTone(ac, bass, 'square', BASS_HZ[q % BASS_HZ.length], 0, 0.13, sixteenth * 1.7, at, noise, live);
    }
    if ((!only || only === 'lead') && (only || layerHot(2)) && s % 4 === 0) {
      hitTone(ac, lead, 'square', LEAD_HZ[q % LEAD_HZ.length], 0, 0.055, sixteenth * 1.55, at, noise, live);
    }
    if ((!only || only === 'flip') && (only || layerHot(3))) {
      if (s % 4 === 0) {
        hitTone(ac, flip, 'triangle', FLIP_HZ[q % FLIP_HZ.length], 0, 0.05, sixteenth * 1.45, at, noise, live);
      }
      if (s % 8 === 4) {
        hitTone(ac, flip, 'square', FLIP_HZ[q % FLIP_HZ.length] * 0.5, 0, 0.028, sixteenth * 0.9, at, noise, live);
      }
    }
  }

  function playStingerInto(ac, dest, kind, at, noise, live) {
    var sixteenth = 60 / bpm / 4;
    var rising = kind === 'finalLap'
      ? [329.63, 392, 493.88, 659.25]
      : [440, 554.37, 659.25, 880];
    var i;
    for (i = 0; i < 16; i++) {
      var t = at + i * sixteenth;
      if (kind === 'finalLap') {
        if (i % 4 === 0) hitKick(ac, dest, t, noise, live);
      } else if (i === 0 || i === 8) {
        hitKick(ac, dest, t, noise, live);
      }
      if (i % 2 === 0) hitHat(ac, dest, t, i === 14, noise, live);
      if (i % 4 === 0) {
        hitTone(ac, dest, 'triangle', rising[i >> 2], rising[Math.min(3, (i >> 2) + 1)], 0.09, sixteenth * 1.6, t, noise, live);
      }
    }
  }

  function scheduleMusic(now) {
    if (!ctx || !layerGain[0] || !noiseBuf) return;
    var sixteenth = 60 / bpm / 4;
    if (nextNote < now - 0.4) nextNote = now;
    var dests = layerGain;
    while (nextNote < now + 0.16) {
      playStepInto(ctx, dests, nextNote, step % 32, null, noiseBuf, true);
      step += 1;
      nextNote += sixteenth;
    }
  }

  function sampleShown() {
    var u = 1;
    if (fadeClock >= 0) {
      u = (musicClock - fadeClock) / FADE_S;
      if (u < 0) u = 0;
      if (u > 1) u = 1;
    }
    var i;
    for (i = 0; i < 4; i++) shown[i] = fadeFrom[i] + (targetMix[i] - fadeFrom[i]) * u;
  }

  function commitMix() {
    var i;
    var same = true;
    for (i = 0; i < 4; i++) {
      if (Math.abs(queuedMix[i] - targetMix[i]) > 0.001) same = false;
    }
    if (same) return;
    sampleShown();
    for (i = 0; i < 4; i++) {
      fadeFrom[i] = shown[i];
      targetMix[i] = queuedMix[i];
    }
    fadeClock = musicClock;
  }

  function queueMix(arr) {
    var i;
    for (i = 0; i < 4; i++) queuedMix[i] = arr[i];
  }

  function advanceGrid() {
    var beat = 60 / bpm;
    if (!gridLive) {
      commitMix();
      gridLive = true;
      nextGrid = musicClock + beat;
      return;
    }
    var guard = 0;
    while (musicClock >= nextGrid - 1e-4 && guard < 4) {
      commitMix();
      nextGrid += beat;
      guard += 1;
    }
  }

  function applyLayerGains(now) {
    var i;
    for (i = 0; i < 4; i++) {
      if (!layerGain[i]) continue;
      // Stepped on the game clock. A 0.22 s lerp is a crossfade, not a click.
      layerGain[i].gain.value = Math.max(0, shown[i]);
    }
    if (layerSum) layerSum.gain.setTargetAtTime(duckLeft > 0 ? 0.72 : 1, now, 0.035);
  }

  function mixFor(gear, menu) {
    if (menu) return MENU_MIX;
    return GEAR_MIX[clamp(gear | 0, 1, 4) - 1];
  }

  function advanceClock(now, gameDt) {
    var audioDelta = 0;
    if (lastAudioNow < 0) lastAudioNow = now;
    else {
      audioDelta = now - lastAudioNow;
      if (audioDelta < 0) audioDelta = 0;
      if (audioDelta > 0.25) audioDelta = 0.25;
    }
    lastAudioNow = now;
    var adv = audioDelta;
    if (gameDt > audioDelta + 0.001) adv = gameDt;
    if (adv > 0.08) adv = 0.08;
    if (adv < 0) adv = 0;
    musicClock += adv;
    if (duckLeft > 0) duckLeft = Math.max(0, duckLeft - adv);
  }

  function encodeWav(buffer) {
    var ch = buffer.getChannelData(0);
    var n = ch.length;
    var rate = buffer.sampleRate || 44100;
    var out = new ArrayBuffer(44 + n * 2);
    var view = new DataView(out);
    function writeStr(off, text) {
      var c;
      for (c = 0; c < text.length; c++) view.setUint8(off + c, text.charCodeAt(c));
    }
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + n * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, n * 2, true);
    var o = 44;
    var i;
    for (i = 0; i < n; i++) {
      var s = ch[i];
      if (s < -1) s = -1;
      else if (s > 1) s = 1;
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      o += 2;
    }
    return new Uint8Array(out);
  }

  function renderStem(part) {
    var Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Offline) return Promise.reject(new Error('OfflineAudioContext missing'));
    var stingerPart = part === 'stinger-flip' || part === 'stinger-finallap';
    var bars = stingerPart ? 1 : 4;
    var beat = 60 / bpm;
    var dur = beat * 4 * bars + 0.45;
    var rate = 44100;
    var ac = new Offline(1, Math.ceil(rate * dur), rate);
    var dest = ac.createGain();
    dest.gain.value = 0.86;
    dest.connect(ac.destination);
    var noise = noiseBuffer(ac, 1.4);
    var t0 = 0.04;
    var stepT = beat / 4;
    if (part === 'stinger-flip') playStingerInto(ac, dest, 'flip', t0, noise, false);
    else if (part === 'stinger-finallap') playStingerInto(ac, dest, 'finalLap', t0, noise, false);
    else {
      var steps = bars * 16;
      var s;
      var dests = [dest, dest, dest, dest];
      for (s = 0; s < steps; s++) playStepInto(ac, dests, t0 + s * stepT, s, part, noise, false);
    }
    return ac.startRendering();
  }

  function tick(snap) {
    snap = snap || {};
    if (!ctx || !primed) return;
    try {
    resumeQuiet();
    var now = ctx.currentTime;
    var racing = !!snap.racing;
    var paused = !!snap.paused;
    var menu = !!snap.menu;
    wantDuck = paused ? 0.42 : (menu ? 0.7 : 1);
    duck += (wantDuck - duck) * 0.08;
    applyGains();

    var gear = clamp(snap.gear || 1, 1, 4);
    pausedNow = paused || !racing;
    advanceClock(now, Number(snap.dt) || 0);
    queueMix(mixFor(gear, menu));
    advanceGrid();
    sampleShown();
    applyLayerGains(now);
    reapShots(now);
    lastGear = gear;
    if (!settings.muted && settings.music > 0 && (racing || menu)) scheduleMusic(now);

    if (!engineOscA || !engineFilter || !engineBus) return;
    var speed = Math.abs(Number(snap.speed) || 0);
    var top = Number(snap.top) || 22;
    var rpm = top > 1 ? clamp(speed / top, 0, 1.2) : 0;
    if (snap.countdown > 0) rpm = 0.1 + Math.max(0, 0.08 * (3.2 - snap.countdown));
    if (!racing || paused || snap.hold > 0) rpm = menu ? 0 : Math.min(rpm, 0.08);
    if (snap.finished) rpm *= 0.35;
    lastRpm = rpm;
    var hz = 46 + gear * 13 + rpm * (68 + gear * 30);
    if (snap.flipLatched) hz += 14;
    lastHz = hz;
    engineOscA.frequency.setTargetAtTime(hz, now, 0.05);
    engineOscB.frequency.setTargetAtTime(hz * 1.005 + 0.4, now, 0.05);
    engineFilter.frequency.setTargetAtTime(320 + rpm * 1400 + gear * 90, now, 0.07);
    var engineAmp = 0;
    if (racing && !paused && !settings.muted) {
      engineAmp = 0.03 + rpm * 0.055;
      if (snap.countdown > 0) engineAmp *= 0.45;
    }
    engineBus.gain.setTargetAtTime(engineAmp, now, 0.06);
    } catch (err) {}
  }

  GS.setAudioNumber = function (name, value) {
    if (name === 'master') settings.master = snap5(value, settings.master);
    else if (name === 'music') settings.music = snap5(value, settings.music);
    else if (name === 'sfx') settings.sfx = snap5(value, settings.sfx);
    else return;
    save();
    applyGains();
    notify();
  };

  GS.setAudioFlag = function (name, value) {
    if (name === 'muted') settings.muted = !!value;
    else if (name === 'shake') settings.shake = !!value;
    else if (name === 'reducedFlash') settings.reducedFlash = !!value;
    else if (name === 'autoQuality') settings.autoQuality = !!value;
    else if (name === 'targetGhost') settings.targetGhost = !!value;
    else if (name === 'quality' && (value === 'low' || value === 'mid' || value === 'high')) settings.quality = value;
    else if (name === 'difficulty' && (value === 'easy' || value === 'normal')) settings.difficulty = value;
    else if (name === 'particles') settings.quality = value ? 'mid' : 'low';
    else return;
    save();
    applyGains();
    notify();
  };

  GS.toggleMute = function () {
    settings.muted = !settings.muted;
    save();
    applyGains();
    notify();
    return settings.muted;
  };

  GS.audio = {
    settings: settings,
    ensure: ensure,
    play: play,
    tick: tick,
    save: save,
    particlesOn: function () { return settings.quality !== 'low'; },
    bloomOn: function () { return settings.quality !== 'low'; },
    shakeOn: function () { return !!settings.shake; },
    quality: function () { return settings.quality; },
    muted: function () { return !!settings.muted; },
    waiting: function () {
      if (!asked || settings.muted) return false;
      return !ctx || ctx.state !== 'running';
    },
    snapshot: function () {
      return {
        created: !!ctx,
        state: ctx ? ctx.state : 'closed',
        waiting: !!(asked && !settings.muted && (!ctx || ctx.state !== 'running')),
        muted: settings.muted,
        master: settings.master,
        musicVol: settings.music,
        sfx: settings.sfx,
        shake: settings.shake,
        reducedFlash: !!settings.reducedFlash,
        autoQuality: settings.autoQuality !== false,
        targetGhost: settings.targetGhost !== false,
        difficulty: settings.difficulty === 'easy' ? 'easy' : 'normal',
        quality: settings.quality,
        particles: settings.quality !== 'low',
        bloom: settings.quality !== 'low',
        gear: lastGear,
        rpm: lastRpm,
        engineHz: lastHz,
        duck: duck,
        last: lastEvent,
        lastAt: lastEventAt,
        heard: heard.slice(),
        layer: lastGear,
        music: {
          layers: {
            drums: shown[0],
            bass: shown[1],
            lead: shown[2],
            flip: shown[3]
          },
          targetLayers: {
            drums: targetMix[0],
            bass: targetMix[1],
            lead: targetMix[2],
            flip: targetMix[3]
          },
          stingers: stingerCount,
          lastStinger: lastStinger,
          activeNodes: liveShots.length
        }
      };
    },
    beginRace: function () {
      stingerCount = 0;
      lastStinger = null;
      finalLapFired = false;
      duckLeft = 0;
    },
    hold: function (paused) {
      pausedNow = !!paused;
    },
    stinger: function (kind) {
      if (pausedNow) return false;
      if (kind !== 'flip' && kind !== 'finalLap') return false;
      if (kind === 'finalLap') {
        if (finalLapFired) return false;
        finalLapFired = true;
      }
      stingerCount += 1;
      lastStinger = kind;
      duckLeft = (60 / bpm) * 4;
      // Always the music bus. Mute and music volume 0 silence it there.
      if (ctx && primed && musicBus && noiseBuf) {
        try { playStingerInto(ctx, musicBus, kind, ctx.currentTime, noiseBuf, true); } catch (err) {}
      }
      return true;
    },
    renderStem: renderStem,
    encodeWav: encodeWav
  };

  load();
})(window.GS = window.GS || {});
