/* Stage 6 audio. Web Audio only, original Retro Gaming Dad tones.
   The AudioContext is created after the first key, click, tap, or pad
   press so the browser autoplay policy stays quiet. One theme, four
   gear layers. Engine pitch follows gear and RPM. Volumes live under
   settings.audio on gearshift_v1 and merge with the rest of that save. */
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
    reducedFlash: false
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
      musicFilter.frequency.value = 520;
      musicFilter.Q.value = 0.55;
      musicBus = ctx.createGain();
      musicBus.gain.value = 0;
      musicBus.connect(musicFilter);
      musicFilter.connect(master);

      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0;
      sfxBus.connect(master);

      engineBus = ctx.createGain();
      engineBus.gain.value = 0;
      engineBus.connect(sfxBus);

      var i;
      for (i = 0; i < 4; i++) {
        layerGain[i] = ctx.createGain();
        layerGain[i].gain.value = 0;
        layerGain[i].connect(musicBus);
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

  // One theme in D minor. Layer 0 bass, 1 arp, 2 pad, 3 flip lead.
  var BASS = [146.83, 146.83, 110, 130.81, 146.83, 174.61, 110, 130.81];
  var ARP = [293.66, 349.23, 440, 349.23, 220, 293.66, 349.23, 392];
  var PAD = [146.83, 174.61, 220, 261.63];
  var LEAD = [440, 523.25, 659.25, 587.33, 440, 392, 349.23, 523.25];

  function beep(layer, type, freq, peak, dur, at) {
    if (!layerGain[layer] || peak <= 0.0002) return;
    var osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    var g = envGain(layerGain[layer], peak, 0.008, dur * 0.35, dur * 0.6, at);
    osc.connect(g);
    osc.start(at);
    osc.stop(at + dur + 0.03);
  }

  function scheduleMusic(now) {
    if (!ctx || !layerGain[0]) return;
    var sixteenth = 60 / bpm / 4;
    if (nextNote < now - 0.4) nextNote = now;
    while (nextNote < now + 0.16) {
      var s = step % 32;
      var bar = (step >> 3) % 4;
      if (s % 2 === 0) {
        beep(0, 'square', BASS[(s >> 2) % BASS.length], 0.11, sixteenth * 1.6, nextNote);
      }
      if (s % 2 === 0) {
        beep(1, 'square', ARP[s % ARP.length], 0.045, sixteenth * 0.9, nextNote);
      }
      if (s === 0) {
        beep(2, 'sawtooth', PAD[bar], 0.035, sixteenth * 7.2, nextNote);
        beep(2, 'sawtooth', PAD[bar] * 1.5, 0.02, sixteenth * 7.2, nextNote);
      }
      if (s % 4 === 0) {
        beep(3, 'square', LEAD[(s >> 2) % LEAD.length], 0.05, sixteenth * 1.8, nextNote);
      }
      if (s % 8 === 4) {
        beep(3, 'triangle', LEAD[(s >> 2) % LEAD.length] * 2, 0.03, sixteenth * 1.1, nextNote);
      }
      step += 1;
      nextNote += sixteenth;
    }
  }

  function setLayers(gear, now) {
    var g = clamp(gear | 0, 1, 4);
    var amounts = [
      [1, 0.12, 0.02, 0],
      [1, 0.85, 0.18, 0.05],
      [0.92, 1, 0.82, 0.28],
      [1, 0.7, 0.7, 1]
    ][g - 1];
    var cutoff = [480, 1100, 2400, 5200][g - 1];
    var i;
    for (i = 0; i < 4; i++) {
      if (layerGain[i]) layerGain[i].gain.setTargetAtTime(amounts[i], now, 0.08);
    }
    if (musicFilter) musicFilter.frequency.setTargetAtTime(cutoff, now, 0.1);
    lastGear = g;
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
    setLayers(menu ? 1 : gear, now);
    if (!settings.muted && (racing || menu) && !paused) scheduleMusic(now);
    else if (!settings.muted && paused) scheduleMusic(now);

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
    else if (name === 'quality' && (value === 'low' || value === 'mid' || value === 'high')) settings.quality = value;
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
        music: settings.music,
        sfx: settings.sfx,
        shake: settings.shake,
        reducedFlash: !!settings.reducedFlash,
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
        layer: lastGear
      };
    }
  };

  load();
})(window.GS = window.GS || {});
