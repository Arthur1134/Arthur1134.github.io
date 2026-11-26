/* Gear Shift stage 5. Each gear sets the speed band, gravity, and palette.
   There is no separate dimension button. Gear numbers and the 0.32s punch
   match stage 2. Heading is state.yaw. Forward is the quaternion's -Z.
   A flip rolls 180° around that forward so the wheels meet the ceiling.
   Camera up uses the same forward, via GS.upRolledAroundForward.
   Fourth gear sticks only on a marked Flip surface. A downshift over a
   road drops onto it. Leaving a Flip surface over empty air stalls. */
(function (GS) {
  'use strict';

  var SHIFT_TIME = 0.32;

  GS.GEARS = {
    1: { name: 'DRIVE', top: 22, accel: 20, gravity: -30, grip: 1.18, slip: 0.06, air: 0.12, ride: 0 },
    2: { name: 'SURGE', top: 34, accel: 17, gravity: -20, grip: 1.0, slip: 0.08, air: 0.24, ride: 0.07 },
    3: { name: 'DRIFT', top: 46, accel: 14, gravity: -8.2, grip: 0.84, slip: 0.14, air: 0.62, ride: 0.22 },
    4: { name: 'FLIP', top: 58, accel: 12, gravity: -36, grip: 0.96, slip: 0.07, air: 0.42, ride: 0, flipG: 34 }
  };

  var PALETTE = {
    1: {
      sky: 0xf2b15c, fog: 0xe8a45a, near: 78, far: 250,
      ground: 0x6d4c34, shoulder: 0x8d6244, asphalt: 0x4e453c, lane: 0x2c2824,
      curb: 0xf0c14a, curbB: 0xd46a22, wall: 0x8a7564, lamp: 0xffb03a,
      chevron: 0xf0c14a, ramp: 0xffd27a, apron: 0x6a5344, landing: 0xf2d48a,
      ceiling: 0x5c6a72, ceilWarn: 0xe07a2f, gate: 0xffb03a, banner: 0xc46a28,
      water: 0x4e86a0, prop: 0x8d6244, propB: 0x6a5348,
      emit: 0xffb03a, emitI: 0.18,
      hemiSky: 0xfff1d2, hemiGround: 0x6a4030, sun: 0xffe2b8, sunI: 1.35, hemiI: 0.95,
      hud: 0xffb03a, flash: 0xffe6b0, grav: 'FULL G'
    },
    2: {
      sky: 0x120814, fog: 0x1a0c22, near: 46, far: 200,
      ground: 0x100e16, shoulder: 0x1a1224, asphalt: 0x16141f, lane: 0x2a2038,
      curb: 0xff2bd6, curbB: 0x3de0ff, wall: 0x24182e, lamp: 0x3de0ff,
      chevron: 0xff4ad8, ramp: 0xff2bd6, apron: 0x241028, landing: 0x3de0ff,
      ceiling: 0x2a1038, ceilWarn: 0xff2bd6, gate: 0x3de0ff, banner: 0xff4ad8,
      water: 0x123848, prop: 0x2a1434, propB: 0x1a2430,
      emit: 0xff2bd6, emitI: 0.95,
      hemiSky: 0x402060, hemiGround: 0x061820, sun: 0x7a5cff, sunI: 0.5, hemiI: 0.72,
      hud: 0xff4ad8, flash: 0xff8ae8, grav: 'LIGHT G'
    },
    3: {
      sky: 0x241848, fog: 0x2a2060, near: 64, far: 240,
      ground: 0x14242c, shoulder: 0x1a3038, asphalt: 0x1a2834, lane: 0x243040,
      curb: 0x9b6bff, curbB: 0x3dffe0, wall: 0x2a2448, lamp: 0x3dffe0,
      chevron: 0xb794ff, ramp: 0x9b6bff, apron: 0x1c2838, landing: 0x3dffe0,
      ceiling: 0x2a2050, ceilWarn: 0x3dffe0, gate: 0xb794ff, banner: 0x3dffe0,
      water: 0x1a4860, prop: 0x322858, propB: 0x1c3844,
      emit: 0x9b6bff, emitI: 0.72,
      hemiSky: 0x6a5cff, hemiGround: 0x103038, sun: 0xc0b0ff, sunI: 0.85, hemiI: 0.85,
      hud: 0xc9b6ff, flash: 0xe4d8ff, grav: 'LOW G'
    },
    4: {
      sky: 0x071820, fog: 0x062028, near: 52, far: 210,
      ground: 0x0c242c, shoulder: 0x103038, asphalt: 0x12343c, lane: 0x1a4450,
      curb: 0x7dfff2, curbB: 0xff5a3c, wall: 0x143840, lamp: 0xff5a3c,
      chevron: 0x7ef0ff, ramp: 0x7dfff2, apron: 0x0e3038, landing: 0xd8fff8,
      ceiling: 0x166070, ceilWarn: 0xff5a3c, gate: 0x7ef0ff, banner: 0xff5a3c,
      water: 0x063038, prop: 0x143840, propB: 0x102830,
      emit: 0x7ef0ff, emitI: 1.05,
      hemiSky: 0x8ef6ff, hemiGround: 0x1a1020, sun: 0xb8fff8, sunI: 0.72, hemiI: 0.8,
      hud: 0x7ef0ff, flash: 0xe8ffff, grav: 'HEAVY G'
    }
  };

  var GEAR_HUD_CSS = {
    1: '#ffb03a',
    2: '#ff4ad8',
    3: '#c9b6ff',
    4: '#7ef0ff'
  };
  var WIPE_DUR = 0.25;
  var FOV_DUR = 0.3;
  var CHROMA_DUR = 0.12;
  var SHIFT_FX_LIFE = 0.3;
  var shiftFx = {
    active: false,
    t: 0,
    count: 0,
    gear: 0,
    dir: 1,
    fovPunch: 0,
    peak: 0,
    mode: 'full',
    color: '#ffb03a',
    fired: false,
    needProj: false,
    drawn: false,
    skipTick: false
  };

  var FIXED = 1 / 120;
  var MAX_STEPS = 6;
  var AXLE = 1.15;
  var CAR_R = 0.92;
  var OFF_TIME = 1.05;
  var HOLD_TIME = 1.0;
  var wallRumbleAt = 0;

  var scene, camera, renderer, track, car, shadow, hemi, sun;
  var frameEl, speedEl, gearEl, gearNameEl, gravEl, lapEl, timeEl, trackNameEl, msgEl, promptEl, muteChip, pauseLayer, hintEl, portraitEl, flashEl, chromaEl, failEl, pickerEl, bloomEl;
  var wipeEl, wipeBandEl, shiftChromaEl;
  var screenLayer, screenKickerEl, screenCopyEl, screenActionsEl, screenHelpEl, placeEl, deltaEl, modeLineEl, hudEl;
  var coachEl, coachKickerEl, coachTitleEl, coachBodyEl, gearPipsEl;
  var reduceFlash = false;
  var speedFx = {
    fovAdd: 0,
    streaks: 0,
    camLag: 0,
    landShake: 0,
    mode: 'full',
    prevSp: 0,
    ready: false
  };
  var flipRun = { active: false, deep: false, done: false };
  var flipUi = { saved: null, popups: 0, t: 0, show: false };
  var flipPopEl = null;
  var mapEl = null;
  var mapReady = false;
  var soundNudgeEl = null;
  var screenArtEl = null;

  function calm() {
    if (reduceFlash) return true;
    var bag = GS.audioSettings || (GS.audio && GS.audio.settings);
    return !!(bag && bag.reducedFlash);
  }
  var speedLines = null;
  var speedLinePos = null;
  var LINE_N = 16;
  var promptKind = '';
  var lastPrompt = '';
  var TUTORIAL_KEY = 'gearshift_v1';
  var bank = 0;
  var camSnap = true;
  var wheelSpin = 0;
  var lastNow = 0;
  var display = null;
  var lastCountDigit = 4;
  var lastCheckpoint = 0;
  var nearAt = -2;
  var nearDist = 99;
  var exhaustAcc = 0;
  var smokeAcc = 0;
  var PART_N = 64;
  var particles = [];
  var particleMesh = null;
  var particleDummy = null;
  var _partColor = new THREE.Color();
  var _rear = new THREE.Vector3();

  var _fwd = new THREE.Vector3();
  var _right = new THREE.Vector3();
  var _desired = new THREE.Vector3();
  var _look = new THREE.Vector3();
  var _camUp = new THREE.Vector3();
  var _qYaw = new THREE.Quaternion();
  var _qRoll = new THREE.Quaternion();
  var _yAxis = new THREE.Vector3(0, 1, 0);
  var _zAxis = new THREE.Vector3(0, 0, 1);
  var _colorA = new THREE.Color();
  var _colorB = new THREE.Color();
  var _colorC = new THREE.Color();

  var state = {
    speed: 0,
    slide: 0,
    vy: 0,
    yaw: 0,
    gear: 1,
    gravity: -30,
    gFrom: -30,
    gTo: -30,
    shiftU: 1,
    ride: 0,
    paused: false,
    muted: false,
    heardInput: false,
    lapsDone: 0,
    armed: false,
    prevAlong: 0,
    along: 0,
    side: 0,
    mainSide: 0,
    onShortcut: false,
    checkpoint: 0,
    offTimer: 0,
    edgeHold: 0,
    hold: 0,
    grace: 0.4,
    recovered: 0,
    airborne: false,
    prevSlope: 0,
    airTime: 0,
    apex: 0,
    lastAir: 0,
    lastApex: 0,
    flipLatched: false,
    flipFromY: 0,
    upBlend: 0,
    badFlip: false,
    stallT: 0,
    kick: 0,
    flash: 0,
    chroma: 0,
    dip: 0,
    squash: 0,
    failFlash: 0,
    droppedFlip: false,
    palFrom: 1,
    palTo: 1,
    palU: 1,
    shake: 0,
    nearFlash: 0,
    sessionMinY: 0,
    countdown: 3.2,
    goBanner: 0,
    raceTime: 0,
    finished: false,
    flipY: 4,
    hints: { flip: false, down: false, up: false }
  };

  var coach = {
    enabled: false,
    step: 0,
    praise: 0,
    jumped: false,
    cleanLatch: false,
    flag: '',
    pending: ''
  };

  var field = null;
  var ghostActor = null;
  var targetActor = null;
  var lapClock = 0;
  var sessionRetries = 0;
  var splitUi = { last: null, delta: null, bestLap: null, show: 0 };
  var splitEl = null;
  var tauntEl = null;
  var tauntUi = { text: '', life: 0 };
  var demoTagEl = null;
  var attract = { on: false, track: '', t: 0, idle: 0, index: 0, guardUntil: 0, along: 0, mode: 'road', sDist: 0, flipTaken: false, armed: false };
  var bumpFx = { sparks: 0, hitPauses: 0, taunts: 0, hitLeft: 0, pauseAt: -9 };
  var autoQ = { drops: 0, lastDrop: '', slow: 0, forceLeft: 0, avg: 0 };
  var frameMs = [];
  var frameSum = 0;
  var MEDAL_TINT = { bronze: 0xe39b62, silver: 0xe7e9ef, gold: 0xffd35a, author: 0x7ef0ff };
  var TAUNT_LINE = { pete: 'NICE PAINT!', nan: 'BEEP BEEP!', cal: 'TOO SLOW!', fritz: 'EXCUSE ME!' };
  var flow = {
    screen: 'boot',
    focus: 0,
    actions: [],
    mode: 'trial',
    cupHeat: 0,
    points: null,
    heats: [],
    pending: null,
    place: 1,
    playerRank: 0,
    handled: false,
    ghostAcc: 0.1,
    ghostRows: [],
    lastMedal: '',
    lastTime: 0,
    improved: false,
    gap: null,
    ghostDelta: null,
    pickMode: 'trial',
    howFrom: 'title',
    howPage: 0,
    creditFrom: 'title',
    demo: false,
    card: null
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function analog01(v) {
    if (v === true) return 1;
    if (v === false || v == null) return 0;
    var n = Number(v);
    if (!isFinite(n)) return 0;
    return clamp(n, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smooth01(t) {
    var x = t < 0 ? 0 : (t > 1 ? 1 : t);
    return x * x * (3 - 2 * x);
  }

  function readSaveRoot() {
    try {
      var raw = localStorage.getItem(TUTORIAL_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
      return data;
    } catch (err) {
      return {};
    }
  }

  function loadCoachFlag() {
    var data = readSaveRoot();
    var flag = data.tutorial && data.tutorial.warmup;
    if (flag === 'done' || flag === 'skipped') coach.flag = flag;
  }

  function writeCoachFlag(flag) {
    coach.flag = flag;
    coach.enabled = false;
    coach.pending = '';
    var writer = GS.updateSave;
    if (!writer) {
      writer = function (mutator) {
        var data = readSaveRoot();
        mutator(data);
        try {
          localStorage.setItem(TUTORIAL_KEY, JSON.stringify(data));
          return true;
        } catch (err) {
          return false;
        }
      };
    }
    writer(function (data) {
      if (!data.tutorial || typeof data.tutorial !== 'object' || Array.isArray(data.tutorial)) {
        data.tutorial = {};
      }
      data.tutorial.warmup = flag;
    });
  }

  function syncCoach() {
    if (flow.demo) {
      coach.enabled = false;
      return;
    }
    if (coach.flag) {
      coach.enabled = false;
      return;
    }
    coach.enabled = !!(track && track.id === 'warmup');
  }

  function coachLive() {
    return !flow.demo && coach.enabled && track && track.id === 'warmup' && !coach.flag;
  }

  function skipCoach() {
    if (coach.flag) return;
    coach.step = 3;
    coach.praise = 0;
    coach.pending = '';
    writeCoachFlag('skipped');
    paintCoach();
  }

  function noteCoachShift(prev, next) {
    if (!coachLive() || coach.step !== 0 || coach.praise > 0) return;
    if (state.airborne || state.flipLatched || state.badFlip) return;
    if (next > prev) {
      coach.step = 1;
      coach.praise = 0.7;
    }
  }

  function noteCoachAir() {
    if (!coachLive() || coach.step !== 1 || !track || !track.zones) return;
    if (!state.airborne || state.gear !== 3) return;
    var zones = track.zones;
    if (zones.jump0 < 0) return;
    if (state.along >= zones.jump0 - 10 && state.along <= zones.jump1 + 46) coach.jumped = true;
  }

  function noteCoachLanded() {
    if (!coachLive() || coach.praise > 0) return;
    if (coach.step === 1 && coach.jumped && state.gear === 3 && !state.badFlip) {
      coach.jumped = false;
      coach.step = 2;
      coach.praise = 0.7;
      return;
    }
    if (coach.step === 2 && coach.cleanLatch && !state.flipLatched && !state.badFlip) {
      coach.cleanLatch = false;
      coach.step = 3;
      coach.praise = 0.9;
      coach.pending = 'done';
    }
  }

  function decayCoach(dt) {
    if (coach.praise <= 0) return;
    coach.praise = Math.max(0, coach.praise - dt);
    if (coach.praise <= 0 && coach.pending && !coach.flag) writeCoachFlag(coach.pending);
  }

  function coachCopy() {
    var up = GS.actionLabel ? GS.actionLabel('upshift') : 'E';
    var down = GS.actionLabel ? GS.actionLabel('downshift') : 'Q';
    if (coach.praise > 0 && coach.step >= 3) {
      return {
        kicker: 'WARM-UP',
        title: 'GOT IT',
        body: 'Shift, jump, and Flip: done. The coach stays off from now on. How to Play has the rest.'
      };
    }
    if (coach.praise > 0) {
      return {
        kicker: 'WARM-UP',
        title: 'GOT IT',
        body: 'Next mark is coming up. The big prompt leaves once you are in the right gear.'
      };
    }
    if (coach.step === 0) {
      return {
        kicker: 'WARM-UP  1 / 3',
        title: 'SHIFT ON THE GROUND',
        body: 'Gear 1 is planted. Press ' + up + ' once while the tires are down. The numeral, the camera, and the colors move together.'
      };
    }
    if (coach.step === 1) {
      return {
        kicker: 'WARM-UP  2 / 3',
        title: 'JUMP IN GEAR 3',
        body: 'Shift up to gear 3 before the ramp. Low gravity hangs the jump, so you float over the gap.'
      };
    }
    return {
      kicker: 'WARM-UP  3 / 3',
      title: 'FLIP, THEN LAND',
      body: 'When FLIP shows, press ' + up + ' for gear 4. The world turns over. Press ' + down + ' above the landing road to drop back down. A bad Flip respawns you.'
    };
  }

  function paintCoach() {
    if (!coachEl) return;
    var show = coachLive() && flow.screen === 'race' && !state.paused && (coach.step < 3 || coach.praise > 0);
    coachEl.hidden = !show;
    if (!show) return;
    var copy = coachCopy();
    if (coachKickerEl) coachKickerEl.textContent = copy.kicker;
    if (coachTitleEl) coachTitleEl.textContent = copy.title;
    if (coachBodyEl) coachBodyEl.textContent = copy.body;
  }

  function buildSpeedLines() {
    var geo = new THREE.BufferGeometry();
    speedLinePos = new Float32Array(LINE_N * 6);
    geo.setAttribute('position', new THREE.BufferAttribute(speedLinePos, 3));
    var mat = new THREE.LineBasicMaterial({
      color: 0xfff6e8,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false
    });
    mat.fog = false;
    speedLines = new THREE.LineSegments(geo, mat);
    speedLines.frustumCulled = false;
    speedLines.renderOrder = 20;
    camera.add(speedLines);
    scene.add(camera);
  }

  function updateSpeedLines() {
    if (!speedLines || !speedLinePos) return;
    var mode = fxMode();
    speedFx.mode = mode;
    var top = GS.GEARS[state.gear] ? GS.GEARS[state.gear].top : 22;
    var ratio = top > 1 ? Math.abs(state.speed) / top : 0;
    // Above about 75% of this gear's top speed. The centre stays empty.
    var streaks = clamp((ratio - 0.75) / 0.22, 0, 1);
    if (mode !== 'full') streaks = 0;
    if (flow.screen !== 'race' || state.paused || state.countdown > 0 || state.hold > 0) streaks = 0;
    speedFx.streaks = streaks;
    var alpha = streaks * (qualityHigh() ? 0.72 : 0.46);
    speedLines.material.opacity = alpha;
    if (streaks <= 0) return;
    if (display && display.hud) speedLines.material.color.set(display.hud);
    // Screen-space streaks in camera-local space, out at the edges. Not a second world yaw.
    var sp = Math.abs(state.speed);
    var scroll = (state.raceTime * (6 + sp * 0.22)) % 1;
    var i;
    for (i = 0; i < LINE_N; i++) {
      var ang = (i / LINE_N) * Math.PI * 2 + 0.35;
      var phase = (scroll + i * 0.137) % 1;
      var r0 = 2.15 + (i % 5) * 0.2 + phase * 0.5;
      var r1 = r0 + 0.55 + streaks * 1.25;
      var z0 = -3.6 - phase * 0.45;
      var z1 = -6.4 - streaks * 1.2 - phase * 0.35;
      var o = i * 6;
      var cx = Math.cos(ang);
      var sy = Math.sin(ang);
      speedLinePos[o] = cx * r0;
      speedLinePos[o + 1] = sy * r0 * 0.42;
      speedLinePos[o + 2] = z0;
      speedLinePos[o + 3] = cx * r1;
      speedLinePos[o + 4] = sy * r1 * 0.42;
      speedLinePos[o + 5] = z1;
    }
    speedLines.geometry.attributes.position.needsUpdate = true;
  }

  // v1.0.3: Big shift moment. A thin palette wipe, FOV punch, chromatic
  // flash, and HUD slam on a real player gear change during racing play.
  // DOM nodes are created once. Rapid shifts restart; they never stack.
  function fxMode() {
    if (calm()) return 'reduced';
    if (qualityLow()) return 'low';
    return 'full';
  }

  function racingPlay() {
    return flow.screen === 'race' && !state.paused && state.countdown <= 0 && !state.finished && state.hold <= 0;
  }

  function paintShiftFxOff() {
    if (wipeEl) wipeEl.style.opacity = '0';
    if (shiftChromaEl) shiftChromaEl.style.opacity = '0';
    shiftFx.drawn = false;
  }

  function paintShiftFx() {
    var t = shiftFx.t;
    var mode = shiftFx.mode;
    var onRace = flow.screen === 'race' && !state.paused;
    var wipeOn = shiftFx.fired && onRace && t < WIPE_DUR;
    if (wipeEl) {
      if (wipeOn) {
        var u = t / WIPE_DUR;
        var peakA = 0.22;
        if (mode === 'low') peakA = 0.12;
        else if (mode === 'reduced') peakA = 0.1;
        var a = peakA * 4 * u * (1 - u);
        if (a > 0.25) a = 0.25;
        var x = shiftFx.dir > 0 ? -18 + u * 118 : 100 - u * 118;
        if (wipeBandEl) wipeBandEl.style.left = x + '%';
        wipeEl.style.opacity = String(a);
        shiftFx.drawn = true;
      } else if (shiftFx.drawn) {
        wipeEl.style.opacity = '0';
      }
    }
    var chromaOn = shiftFx.fired && onRace && t < CHROMA_DUR && mode === 'full';
    if (shiftChromaEl) {
      if (chromaOn) {
        var cu = 1 - t / CHROMA_DUR;
        if (cu < 0) cu = 0;
        shiftChromaEl.style.opacity = String(0.3 * cu);
        shiftFx.drawn = true;
      } else if (shiftChromaEl.style.opacity !== '0') {
        shiftChromaEl.style.opacity = '0';
      }
    }
    if (!wipeOn && !chromaOn && t >= SHIFT_FX_LIFE) shiftFx.drawn = false;
  }

  function slamGear(soft) {
    if (!gearEl) return;
    gearEl.classList.remove('slam');
    gearEl.classList.remove('slamSoft');
    void gearEl.offsetWidth;
    gearEl.classList.add(soft ? 'slamSoft' : 'slam');
  }

  function triggerShiftFx(dir, gear) {
    if (!racingPlay()) return;
    var mode = fxMode();
    var reduced = mode === 'reduced';
    var css = GEAR_HUD_CSS[gear] || '#ffb03a';
    var peak = dir > 0 ? 7 : -4;
    if (reduced) peak = dir > 0 ? 2 : -1.5;
    shiftFx.mode = mode;
    shiftFx.dir = dir > 0 ? 1 : -1;
    shiftFx.gear = gear;
    shiftFx.t = 0;
    shiftFx.count += 1;
    shiftFx.fired = true;
    shiftFx.active = true;
    shiftFx.color = css;
    shiftFx.peak = peak;
    shiftFx.fovPunch = peak;
    shiftFx.needProj = true;
    shiftFx.skipTick = true;
    if (wipeBandEl) {
      wipeBandEl.style.background = 'linear-gradient(90deg, transparent 0%, ' + css + ' 50%, transparent 100%)';
      wipeBandEl.style.width = reduced ? '10%' : (mode === 'low' ? '13%' : '16%');
    }
    if (gearEl) gearEl.style.setProperty('--gear-glow', css);
    slamGear(reduced);
    paintShiftFx();
  }

  function updateShiftFx(dt) {
    shiftFx.mode = fxMode();
    if (!shiftFx.fired) return;
    if (flow.screen !== 'race') {
      if (shiftFx.fovPunch !== 0) shiftFx.needProj = true;
      shiftFx.fovPunch = 0;
      shiftFx.active = false;
      if (shiftFx.drawn) paintShiftFxOff();
      return;
    }
    if (shiftFx.skipTick) shiftFx.skipTick = false;
    else if (!state.paused && dt > 0) shiftFx.t += dt;
    var t = shiftFx.t;
    if (t >= FOV_DUR) {
      if (shiftFx.fovPunch !== 0) shiftFx.needProj = true;
      shiftFx.fovPunch = 0;
    } else {
      var s = 1 - t / FOV_DUR;
      shiftFx.fovPunch = shiftFx.peak * s * s;
    }
    shiftFx.active = t < SHIFT_FX_LIFE;
    paintShiftFx();
  }

  function resetShiftFx() {
    shiftFx.active = false;
    shiftFx.t = 0;
    shiftFx.count = 0;
    shiftFx.gear = 0;
    shiftFx.dir = 1;
    shiftFx.fovPunch = 0;
    shiftFx.peak = 0;
    shiftFx.fired = false;
    shiftFx.needProj = true;
    shiftFx.drawn = false;
    shiftFx.skipTick = false;
    if (gearEl) {
      gearEl.classList.remove('slam');
      gearEl.classList.remove('slamSoft');
    }
    paintShiftFxOff();
  }

  function paintOverlays() {
    if (flashEl) {
      var cap = calm() ? 0.08 : 0.2;
      flashEl.style.opacity = String(state.flash * cap);
    }
    if (chromaEl) {
      var fringe = calm() ? 0 : Math.min(0.4, state.chroma * 0.4);
      chromaEl.style.opacity = String(fringe);
    }
    if (failEl) {
      var veil = 0;
      if (state.badFlip) veil = calm() ? 0.2 : 0.38;
      else if (state.offTimer > 0.04) veil = Math.min(0.46, (state.offTimer / OFF_TIME) * 0.5);
      else veil = state.failFlash * (calm() ? 0.1 : 0.24);
      failEl.style.opacity = String(veil);
    }
    if (bloomEl) {
      var bloom = 0;
      if (GS.audio && GS.audio.bloomOn && GS.audio.bloomOn() && !calm() && flow.screen === 'race' && !state.paused) {
        bloom = clamp(Math.abs(state.speed) / 70, 0, 1) * 0.22 + state.kick * 0.12 + state.nearFlash * 0.16;
        if (GS.audio && GS.audio.quality && GS.audio.quality() === 'high') bloom *= 1.55;
        if (state.countdown > 0) bloom *= 0.35;
      }
      bloomEl.style.opacity = String(bloom);
    }
  }

  function showFallback(message) {
    var stage = document.getElementById('stage');
    var fallback = document.getElementById('fallback');
    if (stage) stage.hidden = true;
    if (fallback) fallback.hidden = false;
    var msg = document.getElementById('fallbackMsg');
    if (msg && message) msg.textContent = message;
  }

  function applyOrientation() {
    GS.orientYawRoll(car, state.yaw, state.upBlend);
  }

  function readBasis() {
    _fwd.set(0, 0, -1).applyQuaternion(car.quaternion);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-8) _fwd.set(0, 0, -1);
    else _fwd.normalize();
    GS.rightFromForwardXZ(_fwd.x, _fwd.z, _right);
  }

  function driveInput() {
    if (GS.debugDrive) return GS.debugDrive;
    return GS.input;
  }

  function targetGravity() {
    if (state.badFlip) return -32;
    if (state.flipLatched) return GS.GEARS[4].flipG;
    return GS.GEARS[state.gear].gravity;
  }

  function qualityName() {
    var q = GS.audio && GS.audio.quality ? GS.audio.quality() : 'mid';
    if (q === 'low' || q === 'high') return q;
    return 'mid';
  }

  function qualityLow() {
    return qualityName() === 'low';
  }

  function qualityHigh() {
    return qualityName() === 'high';
  }

  function particleBudget() {
    if (!particles.length || qualityLow()) return 0;
    if (qualityHigh()) return particles.length;
    return Math.min(18, particles.length);
  }

  function particlesOn() {
    return !!(GS.audio && GS.audio.particlesOn && GS.audio.particlesOn()) && !qualityLow();
  }

  function sfx(name, arg) {
    if (GS.audio && GS.audio.play) GS.audio.play(name, arg);
  }

  function bumpShake(amount) {
    if (!(GS.audio && GS.audio.shakeOn && GS.audio.shakeOn())) return;
    if (calm()) amount *= 0.35;
    state.shake = Math.max(state.shake, amount);
  }

  function buildParticles() {
    var i;
    try {
    particles = [];
    for (i = 0; i < PART_N; i++) {
      particles.push({
        alive: false, life: 0, max: 1, kind: '', x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0, size: 0.12, r: 1, g: 1, b: 1
      });
    }
    var geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    var mat = new THREE.MeshBasicMaterial({
      color: 0xffc070,
      transparent: true,
      opacity: 0.62,
      depthWrite: false
    });
    particleMesh = new THREE.InstancedMesh(geo, mat, PART_N);
    particleMesh.frustumCulled = false;
    if (THREE.DynamicDrawUsage) particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(particleMesh);
    particleDummy = new THREE.Object3D();
    for (i = 0; i < PART_N; i++) {
      particleDummy.scale.set(0, 0, 0);
      particleDummy.updateMatrix();
      particleMesh.setMatrixAt(i, particleDummy.matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    } catch (err) {
      particleMesh = null;
      particles = [];
    }
  }

  function spawnParticle(kind, x, y, z, vx, vy, vz, size) {
    var spark = kind === 'spark';
    if (!particles.length) return false;
    if (!spark && !particlesOn()) return false;
    var i;
    var slot = null;
    var budget = spark ? particles.length : particleBudget();
    for (i = 0; i < budget; i++) {
      if (!particles[i].alive) {
        slot = particles[i];
        break;
      }
    }
    if (!slot) return false;
    slot.alive = true;
    slot.kind = kind;
    slot.life = 0;
    slot.max = spark ? 0.34 : (kind === 'dust' ? 0.55 : (kind === 'smoke' ? 0.7 : 0.38));
    slot.x = x;
    slot.y = y;
    slot.z = z;
    slot.vx = vx;
    slot.vy = vy;
    slot.vz = vz;
    slot.size = size || (kind === 'dust' ? 0.28 : 0.12);
    if (kind === 'spark') {
      slot.r = 1; slot.g = 0.86; slot.b = 0.32;
    } else if (kind === 'smoke') {
      slot.r = 0.55; slot.g = 0.52; slot.b = 0.48;
    } else if (kind === 'dust') {
      slot.r = 0.82; slot.g = 0.68; slot.b = 0.42;
    } else {
      var emit = display && display.hud ? display.hud : '#ffb03a';
      _partColor.set(emit);
      slot.r = _partColor.r;
      slot.g = _partColor.g * 0.7;
      slot.b = _partColor.b * 0.35;
    }
    return true;
  }

  function burstSparks(x, y, z, impact) {
    if (!particles.length) return;
    var n = impact > 10 ? 12 : (impact > 5 ? 8 : 5);
    if (qualityLow() || calm()) n = Math.min(n, 3);
    var i;
    for (i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2 + Math.random() * 0.35;
      var sp = 2.4 + Math.min(8, impact) * 0.38;
      var ok = spawnParticle(
        'spark',
        x,
        y,
        z,
        Math.cos(ang) * sp,
        1.4 + Math.random() * 2.2,
        Math.sin(ang) * sp,
        0.08 + Math.min(0.14, impact * 0.01)
      );
      if (ok) bumpFx.sparks += 1;
    }
  }

  function burstDust(impact) {
    if (!particlesOn()) return;
    var n = impact > 10 ? 10 : 6;
    var i;
    for (i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2;
      spawnParticle(
        'dust',
        car.position.x + Math.cos(ang) * 0.4,
        car.position.y + 0.12,
        car.position.z + Math.sin(ang) * 0.4,
        Math.cos(ang) * 2.4,
        1.6 + Math.random() * 1.4,
        Math.sin(ang) * 2.4,
        0.22 + Math.random() * 0.16
      );
    }
  }

  function updateParticles(dt) {
    if (!particleMesh || !particleDummy) return;
    var sparkLive = false;
    var si;
    for (si = 0; si < particles.length; si++) {
      if (particles[si].alive && particles[si].kind === 'spark') sparkLive = true;
    }
    var show = flow.screen === 'race' && !state.paused && (particlesOn() || sparkLive);
    particleMesh.visible = show;
    if (!show) return;
    readBasis();
    if (state.countdown <= 0 && state.hold <= 0 && !state.finished && !state.badFlip) {
      var accelAmt = analog01(driveInput().accel);
      exhaustAcc += dt;
      if (accelAmt > 0.25 && exhaustAcc > 0.07) {
        exhaustAcc = 0;
        _rear.copy(car.position).addScaledVector(_fwd, -1.7);
        spawnParticle(
          'exhaust',
          _rear.x + (Math.random() - 0.5) * 0.3,
          _rear.y + 0.38,
          _rear.z + (Math.random() - 0.5) * 0.3,
          -_fwd.x * 2.2 + (Math.random() - 0.5),
          0.4 + Math.random() * 0.6,
          -_fwd.z * 2.2 + (Math.random() - 0.5),
          0.1 + Math.random() * 0.06
        );
      }
      var sliding = Math.abs(state.slide) > 4.2 || (!!driveInput().handbrake && Math.abs(state.speed) > 8);
      smokeAcc += dt;
      if (sliding && !state.airborne && smokeAcc > 0.05) {
        smokeAcc = 0;
        spawnParticle(
          'smoke',
          car.position.x - _fwd.x * 0.8 + (Math.random() - 0.5) * 0.8,
          car.position.y + 0.16,
          car.position.z - _fwd.z * 0.8 + (Math.random() - 0.5) * 0.8,
          -_fwd.x * 0.6 + (Math.random() - 0.5) * 1.4,
          0.8 + Math.random(),
          -_fwd.z * 0.6 + (Math.random() - 0.5) * 1.4,
          0.2
        );
      }
    }
    var budget = particleBudget();
    var i;
    var live = 0;
    for (i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (p.kind !== 'spark' && i >= budget) p.alive = false;
      if (!p.alive) {
        particleDummy.scale.set(0, 0, 0);
        particleDummy.position.set(0, -40, 0);
        particleDummy.updateMatrix();
        particleMesh.setMatrixAt(i, particleDummy.matrix);
        continue;
      }
      p.life += dt;
      if (p.life >= p.max) {
        p.alive = false;
        particleDummy.scale.set(0, 0, 0);
        particleDummy.position.set(0, -40, 0);
        particleDummy.updateMatrix();
        particleMesh.setMatrixAt(i, particleDummy.matrix);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy += 1.4 * dt;
      p.vx *= 0.96;
      p.vz *= 0.96;
      var u = 1 - p.life / p.max;
      var sc = p.size * (0.55 + 0.8 * u);
      particleDummy.position.set(p.x, p.y, p.z);
      particleDummy.scale.set(sc, sc, sc);
      particleDummy.updateMatrix();
      particleMesh.setMatrixAt(i, particleDummy.matrix);
      live += 1;
    }
    particleMesh.instanceMatrix.needsUpdate = true;
  }

  // v1.0.1: rivals are solid. Each car is two circles (front / rear axle).
  // Equal-mass arcade bump: separate, trade speed along the contact normal,
  // no yaw change (no spin-outs). Time Trial ghosts are never in this list.
  var BUMP_R = 1.0;
  var bump = { count: 0, releases: 0, last: null, at: -9, laneSign: 0, laneTrack: '' };
  var _rf = new THREE.Vector3();
  var _rr = new THREE.Vector3();

  function trackLaneSign() {
    if (bump.laneTrack === track.id && bump.laneSign) return bump.laneSign;
    var d = track.spawnDist + 20;
    var a = track.poseOnRail(d, 1, { kind: 'road' });
    var b = track.poseOnRail(d, -1, { kind: 'road' });
    var s = track.sample(d);
    GS.rightFromForwardXZ(s.tx || 1, s.tz || 0, _rr);
    var dot = (a.x - b.x) * _rr.x + (a.z - b.z) * _rr.z;
    bump.laneSign = dot >= 0 ? 1 : -1;
    bump.laneTrack = track.id;
    return bump.laneSign;
  }

  function collideRivals(dt) {
    if (!field || !field.list || flow.screen !== 'race') return false;
    if (state.badFlip || state.hold > 0 || state.grace > 0 || state.finished) return false;
    var moved = false;
    var i;
    for (i = 0; i < field.list.length; i++) {
      var rival = field.list[i];
      if (!rival.root || rival.finished) continue;
      var rp = rival.root.position;
      if (rival.passT > 0) { rival.passT = Math.max(0, rival.passT - dt); rival.overlapT = 0; continue; }
      var cdx = car.position.x - rp.x;
      var cdz = car.position.z - rp.z;
      if (cdx * cdx + cdz * cdz > 49 || Math.abs(rp.y - car.position.y) > 1.6 ||
          Math.abs((rival.up || 0) - state.upBlend) > 0.5) {
        rival.overlapT = 0;
        continue;
      }
      readBasis();
      _rf.set(0, 0, -1).applyQuaternion(rival.root.quaternion);
      _rf.y = 0;
      if (_rf.lengthSq() < 1e-8) _rf.set(0, 0, -1); else _rf.normalize();
      var best = null;
      var a;
      var b;
      for (a = -1; a <= 1; a += 2) {
        var px = car.position.x + _fwd.x * AXLE * a;
        var pz = car.position.z + _fwd.z * AXLE * a;
        for (b = -1; b <= 1; b += 2) {
          var qx = rp.x + _rf.x * AXLE * b;
          var qz = rp.z + _rf.z * AXLE * b;
          var ex = px - qx;
          var ez = pz - qz;
          var d = Math.sqrt(ex * ex + ez * ez);
          if (d < BUMP_R * 2 && (!best || d < best.d)) best = { d: d, ex: ex, ez: ez };
        }
      }
      if (!best) { rival.overlapT = 0; rival.touching = false; continue; }
      var nx;
      var nz;
      if (best.d > 1e-4) { nx = best.ex / best.d; nz = best.ez / best.d; }
      else { nx = cdx; nz = cdz; var nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl; }
      var pen = BUMP_R * 2 - best.d;
      // Player takes most of the separation; the rival is shoved sideways on its rail.
      car.position.x += nx * pen * 0.7;
      car.position.z += nz * pen * 0.7;
      moved = true;
      GS.rightFromForwardXZ(_rf.x, _rf.z, _rr);
      var laneSign = trackLaneSign();
      var lat = -(nx * _rr.x + nz * _rr.z);
      rival.bumpLane = clamp((rival.bumpLane || 0) + lat * pen * 0.3 * laneSign, -2.4, 2.4);
      // Velocity exchange along the normal (equal mass, a little bounce).
      var vpx = _fwd.x * state.speed + _right.x * state.slide;
      var vpz = _fwd.z * state.speed + _right.z * state.slide;
      var rs = rival.speed || 0;
      var vrx = _rf.x * rs;
      var vrz = _rf.z * rs;
      var rel = (vpx - vrx) * nx + (vpz - vrz) * nz;
      var j = 0;
      if (rel < 0) {
        j = -1.3 * rel / 2;
        vpx += nx * j;
        vpz += nz * j;
        vrx -= nx * j;
        vrz -= nz * j;
        state.speed = vpx * _fwd.x + vpz * _fwd.z;
        state.slide = clamp(vpx * _right.x + vpz * _right.z, -7, 7);
        rival.speed = Math.max(0, vrx * _rf.x + vrz * _rf.z);
        rival.bumpLane = clamp(rival.bumpLane - (nx * _rr.x + nz * _rr.z) * j * 0.05 * laneSign, -2.4, 2.4);
      }
      // Only a deep, slow tangle counts toward the release; bumper-to-bumper
      // pushing at speed is normal racing contact.
      if (pen > 0.7 || (Math.abs(state.speed) < 3 && (rival.speed || 0) < 3)) rival.overlapT = (rival.overlapT || 0) + dt;
      else rival.overlapT = Math.max(0, (rival.overlapT || 0) - dt);
      if (rival.overlapT > 1.5) {
        // Safety valve: never let two cars stay locked together.
        rival.passT = 1.0;
        rival.overlapT = 0;
        bump.releases += 1;
      }
      var fresh = !rival.touching;
      rival.touching = true;
      if (fresh && state.countdown <= 0 && !state.paused && !flow.demo) {
        burstSparks(
          (car.position.x + rp.x) * 0.5,
          (car.position.y + rp.y) * 0.5 + 0.35,
          (car.position.z + rp.z) * 0.5,
          Math.max(j, pen * 3, 1.2)
        );
        showBumpTaunt(rival);
      }
      if (j > 7 && !calm() && !flow.demo && state.countdown <= 0 && state.raceTime - bumpFx.pauseAt > 0.6) {
        bumpFx.pauseAt = state.raceTime;
        bumpFx.hitLeft = 0.05;
        bumpFx.hitPauses += 1;
      }
      if (j > 0.8 && (fresh || j > 5) && state.raceTime - bump.at > 0.3) {
        bump.at = state.raceTime;
        bump.count += 1;
        bump.last = { t: state.raceTime, name: rival.profile ? rival.profile.name : '', j: j, gear: state.gear, flipped: state.upBlend > 0.5 };
        sfx(j > 7 ? 'crash' : 'land');
        bumpShake(Math.min(0.5, 0.16 + j / 24));
        if (GS.rumble) GS.rumble('wall', Math.min(1, 0.3 + j / 14));
        if (!calm()) state.chroma = Math.max(state.chroma, Math.min(0.35, j / 30));
      }
    }
    return moved;
  }

  function checkNearMiss() {
    nearDist = 99;
    if (!field || !field.list || flow.screen !== 'race') return;
    if (state.countdown > 0 || state.finished || state.hold > 0 || state.paused) return;
    var i;
    for (i = 0; i < field.list.length; i++) {
      var rival = field.list[i];
      if (!rival.root || rival.finished) continue;
      var dx = rival.root.position.x - car.position.x;
      var dy = rival.root.position.y - car.position.y;
      var dz = rival.root.position.z - car.position.z;
      var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < nearDist) nearDist = dist;
      if (dist < 3.5 && Math.abs((rival.speed || 0) - state.speed) > 3.5 && state.raceTime - nearAt > 1.05) {
        nearAt = state.raceTime;
        sfx('near');
        bumpShake(0.32);
        state.nearFlash = 1;
        if (!calm()) state.chroma = Math.max(state.chroma, 0.4);
      }
    }
  }

  function updateAudio(dt) {
    if (!GS.audio || !GS.audio.tick) return;
    var demo = !!flow.demo;
    GS.audio.tick({
      racing: flow.screen === 'race' && !demo,
      menu: flow.screen !== 'race' || demo,
      paused: state.paused,
      gear: state.gear,
      speed: state.speed,
      top: GS.GEARS[state.gear].top,
      countdown: state.countdown,
      hold: state.hold,
      finished: state.finished,
      flipLatched: state.flipLatched,
      dt: dt
    });
  }

  function softenFlipEdge(q, steerRaw, dt) {
    if (!q || !q.flip || !(dt > 0)) return;
    // Only the Skyway ceiling straight. A corner cut needs full lock, and
    // this assist would wash the car out of that turn.
    var align = Math.abs((q.flip.tx || 0) * q.tx + (q.flip.tz || 0) * q.tz);
    if (track.id !== 'skyway' || align < 0.9) {
      state.edgeHold = 0;
      return;
    }
    var half = q.flip.half || 8;
    var lat = q.side;
    if (!isFinite(lat)) return;
    var margin = half * 0.58;
    var over = Math.abs(lat) - margin;
    var worldSteer = state.upBlend > 0.5 ? -steerRaw : steerRaw;
    var pushingOut = (lat > 0.35 && worldSteer > 0.82) || (lat < -0.35 && worldSteer < -0.82);
    if (pushingOut) state.edgeHold += dt;
    else state.edgeHold = Math.max(0, (state.edgeHold || 0) - dt * 2.4);
    if (over <= 0 || state.edgeHold >= 0.24) return;
    var strength = Math.min(1.05, over * 0.4);
    if (lat > 0) state.yaw += strength * dt;
    else state.yaw -= strength * dt;
    var pull = Math.min(6.5, over * 3.1);
    if (lat > 0) state.slide -= pull * dt;
    else state.slide += pull * dt;
  }

  function beginLatch(surfaceY) {
    if (state.flipLatched || state.badFlip) return;
    state.flipLatched = true;
    state.flipFromY = car.position.y;
    state.flipY = surfaceY;
    state.airborne = false;
    if (GS.rumble) GS.rumble('flip', 1);
    sfx('whoosh', true);
    bumpShake(0.55);
    state.gFrom = state.gravity;
    state.gTo = GS.GEARS[4].flipG;
    state.shiftU = 0;
    flipRun.active = true;
    flipRun.deep = false;
    flipRun.done = false;
    if (!flow.demo && !state.paused && flow.screen === 'race' && state.countdown <= 0 && GS.audio && GS.audio.stinger) {
      GS.audio.stinger('flip');
    }
  }

  function roadUnder(x, z, fromFlip) {
    var main = track.project(x, z);
    var limit = track.driveHalf(main.dist, main.side);
    // Leaving a ceiling still over the asphalt should drop, not respawn.
    // The extra margin matches the widened Skyway deck.
    var bonus = fromFlip ? 3.6 : 1.35;
    return Math.abs(main.side) <= limit + bonus;
  }

  function estimateFlipSave() {
    var line = track && track.line;
    if (!line || !track.length) return null;
    var road = 0;
    var driven = 0;
    if (line.kind === 'shortcut') {
      road = line.main1 - line.main0;
      if (road < 0) road += track.length;
      driven = line.length || 0;
      if (!(road > driven) && line.airEnd) {
        var credit = line.main1 - line.main0;
        if (credit < 0) credit += track.length;
        road = credit;
        driven = line.airEnd;
      }
    } else {
      return null;
    }
    var sp = Math.abs(state.speed);
    if (!(sp >= 8)) sp = (GS.GEARS[state.gear] ? GS.GEARS[state.gear].top : 30) * 0.72;
    if (!(road > 5) || !(driven > 1) || !(sp > 1)) return null;
    var saved = (road - driven) / sp;
    if (!isFinite(saved) || saved <= 0) return null;
    if (saved < 0.1) saved = 0.1;
    if (saved > 15) saved = 15;
    return Math.round(saved * 10) / 10;
  }

  function showFlipSaved() {
    var saved = estimateFlipSave();
    if (saved == null) return;
    flipUi.saved = saved;
    flipUi.popups += 1;
    flipUi.t = 0;
    flipUi.show = true;
    if (!flipPopEl) return;
    flipPopEl.hidden = false;
    flipPopEl.textContent = 'FLIP +' + saved.toFixed(1) + ' s saved';
    flipPopEl.classList.toggle('calm', calm());
  }

  function updateFlipPop(dt) {
    if (!flipPopEl || !flipUi.show) return;
    if (state.paused) return;
    flipUi.t += dt;
    var IN = 0.18;
    var HOLD = 1.5;
    var OUT = 0.32;
    var soft = calm();
    if (flipUi.t < IN) {
      var u = flipUi.t / IN;
      flipPopEl.style.opacity = String(u);
      flipPopEl.style.transform = soft ? 'none' : ('translateY(' + ((1 - u) * 10) + 'px)');
    } else if (flipUi.t < IN + HOLD) {
      flipPopEl.style.opacity = '1';
      flipPopEl.style.transform = 'none';
    } else if (flipUi.t < IN + HOLD + OUT) {
      var f = 1 - (flipUi.t - IN - HOLD) / OUT;
      if (f < 0) f = 0;
      flipPopEl.style.opacity = String(f);
      flipPopEl.style.transform = 'none';
    } else {
      flipPopEl.style.opacity = '0';
      flipPopEl.hidden = true;
      flipUi.show = false;
    }
  }

  function resetFlipUi() {
    flipRun.active = false;
    flipRun.deep = false;
    flipRun.done = false;
    flipUi.saved = null;
    flipUi.popups = 0;
    flipUi.t = 0;
    flipUi.show = false;
    if (flipPopEl) {
      flipPopEl.hidden = true;
      flipPopEl.style.opacity = '0';
      flipPopEl.style.transform = 'none';
      flipPopEl.textContent = '';
    }
  }

  function pulseFlipSigns() {
    if (!track || !track.flipSignMats) return;
    var t = state.raceTime;
    if (flow.screen !== 'race') t = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
    var w = 0.85 + Math.sin(t * 3.1) * 0.35;
    var mats = track.flipSignMats;
    var i;
    for (i = 0; i < mats.length; i++) mats[i].emissiveIntensity = w + 0.7;
  }

  function releaseFlip() {
    var supported = roadUnder(car.position.x, car.position.z, true);
    var finishedCut = flipRun.active && (flipRun.done || flipRun.deep);
    state.flipLatched = false;
    flipRun.active = false;
    if (!supported) {
      beginBadFlip();
      return;
    }
    if (finishedCut) showFlipSaved();
    state.droppedFlip = true;
    state.airborne = true;
    state.vy = Math.min(state.vy, -1.2);
    state.airTime = 0;
    state.apex = car.position.y;
    state.prevSlope = 0;
  }

  function beginBadFlip() {
    if (state.badFlip) return;
    state.badFlip = true;
    state.flipLatched = false;
    flipRun.active = false;
    flipRun.deep = false;
    flipRun.done = false;
    state.airborne = true;
    state.stallT = 1.2;
    state.speed *= 0.35;
    state.slide = 0;
    state.gravity = -32;
    state.gFrom = -32;
    state.gTo = -32;
    state.shiftU = 1;
    if (state.vy > 1) state.vy = 1;
    state.droppedFlip = false;
    coach.cleanLatch = false;
    state.failFlash = 1;
    if (GS.rumble) GS.rumble('wall', 0.9);
    sfx('crash');
    bumpShake(0.85);
  }

  function shift(dir) {
    if (state.shiftU < 1 || state.hold > 0 || state.countdown > 0 || state.finished) return;
    var next = clamp(state.gear + dir, 1, 4);
    if (next === state.gear) return;
    var prev = state.gear;
    state.gear = next;
    state.shiftU = 0;
    state.gFrom = state.gravity;
    state.palFrom = state.palTo;
    state.palTo = next;
    state.palU = 0;
    state.kick = 1;
    state.flash = calm() ? 0.35 : 1;
    state.chroma = calm() ? 0 : 1;
    sfx('shunk');
    sfx('whoosh', next === 4 || prev === 4);
    sfx('snap');
    bumpShake(0.28 + 0.18 * (next === 4 || prev === 4 ? 1 : 0));
    if (next === 4 && prev !== 4) {
      var q = track.query(car.position.x, car.position.z, false);
      if (q.flip) beginLatch(q.flip.y);
      else if (state.airborne) beginBadFlip();
      else state.gTo = GS.GEARS[4].gravity;
    } else if (prev === 4 && state.flipLatched) {
      state.gTo = GS.GEARS[next].gravity;
      state.gravity = GS.GEARS[next].gravity;
      state.shiftU = 1;
      releaseFlip();
    } else {
      state.gTo = GS.GEARS[next].gravity;
    }
    var punch = clamp(Math.abs(state.speed) / 58, 0, 1);
    if (GS.rumble) GS.rumble('shift', 0.42 + 0.58 * punch);
    noteCoachShift(prev, next);
    triggerShiftFx(dir, next);
  }

  function inputGuarded() {
    return attract.guardUntil && performance.now() < attract.guardUntil;
  }

  function applyEdges() {
    var edges = GS.consumeEdges();
    if (flow.demo) {
      if (edges.length) exitAttract();
      return;
    }
    if (inputGuarded()) return;
    if (cardUi.open) {
      handleCardEdges(edges);
      return;
    }
    var settingsOpen = GS.controller && GS.controller.isSettingsOpen && GS.controller.isSettingsOpen();
    if (flow.screen !== 'race' && !settingsOpen) {
      handleMenuEdges(edges);
      return;
    }
    if (GS.controller && GS.controller.filterEdges) edges = GS.controller.filterEdges(edges);
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      if (edge === 'pause') {
        state.paused = !state.paused;
        sfx('ui');
      } else if (edge === 'mute') {
        if (GS.toggleMute) state.muted = GS.toggleMute();
        else state.muted = !state.muted;
      }
      else if (edge === 'restart') instantRetry();
      else if (edge.indexOf('track:') === 0) selectTrack(edge.slice(6));
      else if (!state.paused && edge === 'up') shift(1);
      else if (!state.paused && edge === 'down') shift(-1);
    }
  }

  function killInto(nx, nz) {
    readBasis();
    var vx = _fwd.x * state.speed + _right.x * state.slide;
    var vz = _fwd.z * state.speed + _right.z * state.slide;
    var vn = vx * nx + vz * nz;
    if (vn < 0) {
      vx -= vn * nx;
      vz -= vn * nz;
      state.speed = vx * _fwd.x + vz * _fwd.z;
      state.slide = vx * _right.x + vz * _right.z;
      if (vn < -6 && GS.rumble) {
        var nowMs = performance.now();
        if (nowMs - wallRumbleAt > 160) {
          wallRumbleAt = nowMs;
          GS.rumble('wall', Math.min(1, -vn / 22));
          sfx('land');
          bumpShake(Math.min(0.55, -vn / 28));
        }
      }
    }
  }

  function pushCircle(px, pz) {
    var x = px;
    var z = pz;
    var hitN = null;
    var segs = track.segments;
    for (var iter = 0; iter < 2; iter++) {
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i];
        var abx = s.bx - s.ax;
        var abz = s.bz - s.az;
        var apx = x - s.ax;
        var apz = z - s.az;
        var ab2 = abx * abx + abz * abz;
        if (ab2 < 1e-8) continue;
        var t = (apx * abx + apz * abz) / ab2;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        var cx = s.ax + abx * t;
        var cz = s.az + abz * t;
        var dx = x - cx;
        var dz = z - cz;
        var d = Math.sqrt(dx * dx + dz * dz);
        if (d < CAR_R) {
          var nx;
          var nz;
          var pen;
          if (d > 1e-5) {
            nx = dx / d;
            nz = dz / d;
            if (nx * s.nx + nz * s.nz < 0) {
              nx = s.nx;
              nz = s.nz;
            }
            pen = CAR_R - d;
          } else {
            nx = s.nx;
            nz = s.nz;
            pen = CAR_R;
          }
          x += nx * pen;
          z += nz * pen;
          hitN = { nx: nx, nz: nz };
        } else if (d < CAR_R + 1.6 && d > 1e-5 && (dx * s.nx + dz * s.nz) < 0) {
          x += s.nx * (d + CAR_R);
          z += s.nz * (d + CAR_R);
          hitN = { nx: s.nx, nz: s.nz };
        }
      }
    }
    return { x: x, z: z, hitN: hitN };
  }

  function resolveBody() {
    for (var pass = 0; pass < 2; pass++) {
      readBasis();
      var points = [
        { x: car.position.x + _fwd.x * AXLE, z: car.position.z + _fwd.z * AXLE },
        { x: car.position.x - _fwd.x * AXLE, z: car.position.z - _fwd.z * AXLE }
      ];
      for (var p = 0; p < points.length; p++) {
        var hit = pushCircle(points[p].x, points[p].z);
        car.position.x += hit.x - points[p].x;
        car.position.z += hit.z - points[p].z;
        if (hit.hitN) killInto(hit.hitN.nx, hit.hitN.nz);
      }
    }
  }

  function respawn(reason) {
    var spot = track.sample(state.checkpoint);
    state.flipLatched = false;
    flipRun.active = false;
    flipRun.deep = false;
    flipRun.done = false;
    state.upBlend = 0;
    state.airborne = false;
    state.badFlip = false;
    state.stallT = 0;
    state.vy = 0;
    state.prevSlope = 0;
    state.speed = 0;
    state.slide = 0;
    state.hold = HOLD_TIME;
    state.grace = 0.9;
    state.offTimer = 0;
    state.edgeHold = 0;
    state.airTime = 0;
    state.droppedFlip = false;
    state.squash = 0;
    state.kick = 0;
    state.dip = 0.4;
    coach.cleanLatch = false;
    coach.jumped = false;
    if (car) car.scale.set(1, 1, 1);
    car.position.set(spot.x, track.roadHeight(spot.dist), spot.z);
    state.yaw = GS.yawFromForwardXZ(spot.tx, spot.tz);
    applyOrientation();
    state.prevAlong = spot.dist;
    state.along = spot.dist;
    state.side = 0;
    state.mainSide = 0;
    state.onShortcut = false;
    state.recovered += 1;
    camSnap = true;
    state.gravity = GS.GEARS[state.gear].gravity;
    state.gTo = state.gravity;
    state.shiftU = 1;
    if (reason !== 'bad') {
      state.failFlash = Math.max(state.failFlash, 0.7);
      if (GS.rumble) GS.rumble('wall', reason === 'off' ? 0.7 : 0.5);
      sfx('crash');
      bumpShake(0.62);
    }
  }

  function crossedForward(prev, next, mark, length) {
    var delta = next - prev;
    if (delta < -length * 0.5) delta += length;
    if (delta <= 0.2) return false;
    if (next >= prev) return mark > prev && mark <= next;
    return mark > prev || mark <= next;
  }

  function noteProgress(prev, next) {
    var marks = track.checkpoints;
    var i;
    for (i = 0; i < marks.length; i++) {
      if (crossedForward(prev, next, marks[i], track.length)) {
        if (marks[i] !== state.checkpoint && marks[i] !== lastCheckpoint) sfx('checkpoint');
        state.checkpoint = marks[i];
        lastCheckpoint = marks[i];
      }
    }
  }

  function stepPhysics(dt) {
    decayCoach(dt);
    if (state.kick > 0) state.kick = Math.max(0, state.kick - dt * 3.4);
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt * 4.2);
    if (state.chroma > 0) state.chroma = Math.max(0, state.chroma - dt * 3.5);
    if (state.dip > 0) state.dip = Math.max(0, state.dip - dt * 2.5);
    if (state.squash > 0) state.squash = Math.max(0, state.squash - dt * 3.6);
    if (state.failFlash > 0) state.failFlash = Math.max(0, state.failFlash - dt * 1.5);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 4.2);
    if (speedFx.landShake > 0) speedFx.landShake = Math.max(0, speedFx.landShake - dt * 1.6);
    if (state.nearFlash > 0) state.nearFlash = Math.max(0, state.nearFlash - dt * 2.4);

    var blendTarget = state.flipLatched ? 1 : 0;
    var blendStep = dt / SHIFT_TIME;
    if (state.upBlend < blendTarget) state.upBlend = Math.min(blendTarget, state.upBlend + blendStep);
    else if (state.upBlend > blendTarget) state.upBlend = Math.max(blendTarget, state.upBlend - blendStep);

    if (state.shiftU < 1) {
      state.shiftU = Math.min(1, state.shiftU + dt / SHIFT_TIME);
      state.gravity = lerp(state.gFrom, state.gTo, state.shiftU);
    } else {
      state.gravity = targetGravity();
    }
    if (state.palU < 1) state.palU = Math.min(1, state.palU + dt / SHIFT_TIME);

    if (state.countdown > 0) {
      state.countdown -= dt;
      var digit = state.countdown > 2 ? 3 : state.countdown > 1 ? 2 : state.countdown > 0 ? 1 : 0;
      if (digit !== lastCountDigit) {
        if (digit === 0) sfx('go');
        else sfx('countdown', digit);
      }
      lastCountDigit = digit;
      if (state.countdown <= 0) {
        state.countdown = 0;
        state.goBanner = 0.75;
      }
      applyOrientation();
      return;
    }
    if (state.goBanner > 0) state.goBanner = Math.max(0, state.goBanner - dt);
    if (state.finished) {
      applyOrientation();
      return;
    }
    state.raceTime += dt;
    if (field && flow.screen === 'race') {
      field.update(dt, {
        lapsDone: state.lapsDone,
        along: state.along,
        finished: false,
        length: track.length
      });
    }
    if (flow.mode === 'trial') recordGhostSample(false);

    if (state.hold > 0) {
      state.hold -= dt;
      if (state.hold <= 0) {
        state.hold = 0;
        state.speed = 11;
        state.grace = 0.85;
      }
      applyOrientation();
      return;
    }

    if (state.grace > 0) state.grace = Math.max(0, state.grace - dt);

    var input = driveInput();
    var gear = GS.GEARS[state.gear];
    var sp = Math.abs(state.speed);
    var brakeAmt = analog01(input.brake);
    var accelAmt = analog01(input.accel);
    var hb = !!input.handbrake && sp > 6 && !state.badFlip;

    if (!state.badFlip) {
      if (hb && state.speed > 0) state.speed = Math.max(0, state.speed - 6.5 * dt);
      if (brakeAmt > 0) {
        if (state.speed > 0.6) state.speed -= 34 * brakeAmt * dt;
        else state.speed -= 16 * brakeAmt * dt;
        if (state.speed < -9) state.speed = -9;
      } else if (accelAmt > 0 && !state.stallT) {
        var accel = gear.accel * accelAmt * (input.handbrake ? 0.45 : 1);
        if (state.airborne) accel *= 0.35;
        if (state.speed < gear.top) state.speed = Math.min(gear.top, state.speed + accel * dt);
      } else {
        var drag = state.airborne ? 1.4 : 4.2;
        if (state.speed > 0) state.speed = Math.max(0, state.speed - drag * dt);
        else if (state.speed < 0) state.speed = Math.min(0, state.speed + drag * dt);
      }
      if (state.speed > gear.top) state.speed = Math.max(gear.top, state.speed - 22 * dt);
    } else {
      state.speed *= Math.exp(-0.6 * dt);
    }

    sp = Math.abs(state.speed);
    var crawl = clamp(sp / 6, 0, 1);
    var pace = clamp(sp / 58, 0, 1);
    var yawMag = (2.05 + 0.7 * crawl) * (1 - 0.3 * pace);
    if (hb) yawMag *= 1.28;
    if (state.airborne && !state.flipLatched) yawMag *= gear.air;
    var steerRaw = Number(input.steer);
    if (!isFinite(steerRaw)) steerRaw = 0;
    steerRaw = clamp(steerRaw, -1, 1);
    var steer = steerRaw;
    if (state.upBlend > 0.5) steer = -steer;
    if (!state.badFlip) state.yaw += -steer * yawMag * dt;

    var grip = (hb ? 2.15 : 12.2) * gear.grip;
    var slip = hb ? 0.78 : gear.slip;
    if (!state.badFlip && !state.airborne) {
      state.slide += steer * state.speed * slip * dt;
    }
    state.slide *= Math.exp(-grip * dt);
    state.slide = clamp(state.slide, -16, 16);

    applyOrientation();
    readBasis();
    car.position.x += (_fwd.x * state.speed + _right.x * state.slide) * dt;
    car.position.z += (_fwd.z * state.speed + _right.z * state.slide) * dt;

    if (!state.badFlip) resolveBody();
    if (collideRivals(dt) && !state.badFlip) resolveBody();

    var q = track.query(car.position.x, car.position.z, state.flipLatched);
    if (state.gear === 4 && !state.flipLatched && !state.badFlip && q.flip) {
      beginLatch(q.flip.y);
      q = track.query(car.position.x, car.position.z, true);
    }
    state.hints = q.hints;
    state.along = q.progress;
    state.mainSide = q.mainSide;
    var markedShortcut = !!(q.flip && track.line && track.line.kind === 'shortcut');
    state.onShortcut = markedShortcut;
    // Ignore the bay-road offset while Flip-latched or on the marked shortcut.
    // That deck leaves the centerline on purpose.
    if (state.flipLatched || markedShortcut) state.side = q.side;
    else state.side = q.mainSide;
    var h = q.roadY;
    var ahead = track.roadHeight(q.dist + 0.8);
    var slope = (ahead - h) / 0.8;
    state.ride = lerp(state.ride, state.flipLatched ? 0 : gear.ride, 1 - Math.exp(-8 * dt));

    if (state.badFlip) {
      state.stallT -= dt;
      state.vy += state.gravity * dt;
      car.position.y += state.vy * dt;
      if (state.stallT <= 0 || car.position.y < h - 8) {
        respawn('bad');
        return;
      }
    } else if (state.flipLatched) {
      if (q.flip) {
        if (coachLive() && coach.step === 2) coach.cleanLatch = true;
        if (q.flip.down || (q.flip.sDist != null && q.flip.sDist > 12)) flipRun.deep = true;
        if (q.flip.down) flipRun.done = true;
        state.flipY = q.flip.y;
        var k = state.upBlend;
        var sBlend = k * k * (3 - 2 * k);
        if (k < 1) car.position.y = lerp(state.flipFromY, state.flipY, sBlend);
        else car.position.y = state.flipY;
        state.vy = 0;
        state.airborne = false;
        softenFlipEdge(q, steerRaw, dt);
      } else {
        state.edgeHold = 0;
        releaseFlip();
      }
    } else {
      state.edgeHold = 0;
    }
    if (!state.badFlip && !state.flipLatched && state.airborne) {
      noteCoachAir();
      state.vy += state.gravity * dt;
      car.position.y += state.vy * dt;
      state.airTime += dt;
      if (car.position.y > state.apex) state.apex = car.position.y;
      var groundY = h + state.ride;
      if (car.position.y <= groundY && state.vy <= 0) {
        var impact = -state.vy;
        var hung = state.airTime;
        var fromFlip = state.droppedFlip;
        // Gear 1's yard hop is a short plant (about 0.04 s at full gravity).
        // Longer air in the other gears still uses the 0.16 s gate.
        var strong = state.gear === 1 && (hung > 0.03 || fromFlip);
        var notable = strong || hung > 0.16 || fromFlip;
        car.position.y = groundY;
        state.vy = 0;
        state.airborne = false;
        state.lastAir = state.airTime;
        state.lastApex = state.apex;
        state.prevSlope = slope;
        state.airTime = 0;
        state.droppedFlip = false;
        if (notable || impact > 6) {
          var landAmt = clamp((impact || 0) / 16, 0.06, 0.8);
          var landMode = fxMode();
          if (landMode === 'reduced') landAmt = Math.min(0.05, landAmt * 0.18);
          else if (landMode === 'low') landAmt *= 0.5;
          if (!(GS.audio && GS.audio.shakeOn && GS.audio.shakeOn())) landAmt = 0;
          speedFx.landShake = landAmt;
          bumpShake(landAmt);
        }
        if (notable) {
          state.dip = strong ? 1 : 0.42;
          state.squash = strong ? 1 : 0.3;
          if (GS.rumble && (strong || impact > 2)) {
            var rumbleAmt = strong ? Math.max(0.75, Math.min(1, impact / 12)) : Math.min(1, impact / 16);
            GS.rumble('land', rumbleAmt);
          }
          sfx('land');
          burstDust(impact);
        }
        noteCoachLanded();
      }
    } else if (!state.badFlip && !state.flipLatched) {
      // The lip is a kink. A 0.8 m forward slope eases off over several
      // frames, so watch for the climb collapsing, not a one-frame cliff.
      if (state.prevSlope > 0.045 && slope < state.prevSlope * 0.5 && state.speed > 14 && h > 0.9) {
        state.airborne = true;
        state.vy = state.prevSlope * state.speed;
        state.airTime = 0;
        state.apex = car.position.y;
      } else {
        car.position.y = h + state.ride;
        state.vy = slope * state.speed;
      }
      state.prevSlope = slope;
    }

    if (car.position.y < state.sessionMinY) state.sessionMinY = car.position.y;

    if (!state.badFlip && !state.flipLatched && (car.position.y < h - 2.4 || car.position.y > h + 42)) {
      respawn('fall');
      return;
    }

    var off = !state.flipLatched && !markedShortcut && Math.abs(q.mainSide) > q.half + 0.35;
    if (!state.badFlip && state.grace <= 0 && off) {
      state.offTimer += dt;
      if (state.offTimer >= OFF_TIME) {
        respawn('off');
        return;
      }
    } else if (!off && !state.badFlip) {
      state.offTimer = 0;
      if (state.grace <= 0) noteProgress(state.prevAlong, state.along);
    }

    if (!state.finished) {
      if (state.along > track.length * 0.55) state.armed = true;
      if (state.armed && state.prevAlong > track.length * 0.72 && state.along < track.length * 0.22) {
        state.lapsDone += 1;
        state.armed = false;
        noteSplit(state.raceTime - lapClock);
        lapClock = state.raceTime;
        if (state.lapsDone >= track.laps) {
          state.finished = true;
          sfx('finish');
          bumpShake(0.7);
          state.kick = 1;
        } else {
          sfx('lap');
          if (!flow.demo && state.lapsDone === track.laps - 1 && !state.paused && GS.audio && GS.audio.stinger) {
            GS.audio.stinger('finalLap');
          }
        }
      }
    }
    state.prevAlong = state.along;
  }

  function updateCamera(dt) {
    readBasis();
    GS.upRolledAroundForward(_fwd.x, _fwd.z, state.upBlend * Math.PI, _camUp);
    var spAbs = Math.abs(state.speed);
    var sp = clamp(spAbs / 58, 0, 1);
    var punch = state.kick * (0.4 + 0.6 * sp);
    var dip = state.dip;
    var camMode = fxMode();
    speedFx.mode = camMode;
    var accel = 0;
    if (speedFx.ready && dt > 0) accel = (spAbs - speedFx.prevSp) / dt;
    speedFx.prevSp = spAbs;
    speedFx.ready = true;
    var lagWant = 0;
    if (camMode !== 'reduced' && flow.screen === 'race' && !state.paused && state.countdown <= 0) {
      if (accel > 12) lagWant = clamp((accel - 12) / 34, 0, 1);
      if (state.kick > 0.35) lagWant = Math.max(lagWant, state.kick * 0.8);
      if (camMode === 'low') lagWant *= 0.45;
    }
    var maxLag = camMode === 'low' ? 0.55 : 1.15;
    var lagTarget = lagWant * maxLag;
    if (camMode === 'reduced') {
      lagTarget = 0;
      speedFx.camLag = 0;
    }
    var lagFollow = lagTarget > speedFx.camLag ? 8 : 1.8;
    speedFx.camLag += (lagTarget - speedFx.camLag) * (1 - Math.exp(-lagFollow * Math.max(dt, 0.001)));
    if (speedFx.camLag < 0.012) speedFx.camLag = 0;
    var dist = 6.45 + sp * 1.55 + punch * 0.9 + speedFx.camLag;
    var height = (state.upBlend > 0.5 ? 1.9 : 2.6) + sp * 0.32 + punch * 0.18 - dip * 0.72;
    var ahead = 3.5 + sp * 2.0;
    _desired.copy(car.position).addScaledVector(_fwd, -dist).addScaledVector(_camUp, height);
    if (camSnap) {
      camera.position.copy(_desired);
      camSnap = false;
    } else {
      var rolling = state.upBlend > 0.03 && state.upBlend < 0.97;
      var follow = rolling ? 15 : 6.2;
      var k = 1 - Math.exp(-follow * Math.max(dt, 0.001));
      camera.position.lerp(_desired, k);
    }
    _look.copy(car.position).addScaledVector(_fwd, ahead).addScaledVector(_camUp, 0.72 - dip * 0.55);
    camera.up.copy(_camUp);
    camera.lookAt(_look);
    if (GS.audio && GS.audio.shakeOn && GS.audio.shakeOn() && state.shake > 0.01) {
      var t = (state.raceTime + state.countdown) * 41;
      camera.position.x += Math.sin(t) * state.shake * 0.2;
      camera.position.y += Math.cos(t * 1.27) * state.shake * 0.12;
    }
    if (flow.screen === 'menu' || flow.screen === 'tracks' || flow.screen === 'title' || flow.screen === 'howto' || flow.screen === 'credits') {
      var idle = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
      camera.position.x += Math.sin(idle * 0.35) * 0.18;
      camera.position.y += Math.cos(idle * 0.27) * 0.08;
    }
    var fovCoef = 16;
    if (camMode === 'reduced') fovCoef = 16 / 3;
    else if (camMode === 'low') fovCoef = 9;
    var fovAdd = sp * fovCoef;
    speedFx.fovAdd = fovAdd;
    var fov = 56 + fovAdd + punch * 9 + shiftFx.fovPunch;
    if (fov > 80) fov = 80;
    if (shiftFx.needProj || Math.abs(camera.fov - fov) > 0.04) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
      shiftFx.needProj = false;
    }
  }

  function paintColor(hex) {
    _colorC.setHex(hex);
    return _colorC;
  }

  function mixHex(a, b, t) {
    _colorA.setHex(a);
    _colorB.setHex(b);
    _colorC.copy(_colorA).lerp(_colorB, t);
    return _colorC;
  }

  function applyPalette() {
    var a = PALETTE[state.palFrom];
    var b = PALETTE[state.palTo];
    var t = smooth01(state.palU);
    function mix(key) {
      return mixHex(a[key], b[key], t);
    }
    scene.background.copy(mix('sky'));
    scene.fog.color.copy(mix('fog'));
    scene.fog.near = lerp(a.near, b.near, t);
    scene.fog.far = lerp(a.far, b.far, t);
    hemi.color.copy(mix('hemiSky'));
    hemi.groundColor.copy(mix('hemiGround'));
    hemi.intensity = lerp(a.hemiI, b.hemiI, t);
    sun.color.copy(mix('sun'));
    sun.intensity = lerp(a.sunI, b.sunI, t);
    var look = track.look;
    var slots = ['ground', 'shoulder', 'asphalt', 'lane', 'curb', 'curbB', 'wall', 'lamp', 'chevron', 'ramp', 'apron', 'landing', 'ceiling', 'ceilWarn', 'gate', 'banner', 'water', 'prop', 'propB'];
    for (var i = 0; i < slots.length; i++) {
      var key = slots[i];
      if (!look[key]) continue;
      look[key].color.copy(mix(key));
      if (look[key].userData.glow) {
        look[key].emissive.copy(mix('emit'));
        look[key].emissiveIntensity = lerp(a.emitI, b.emitI, t);
      }
    }
    // Gear 1's grade is dim. Gates, chevrons, and the landing stripe stay readable.
    var markers = ['gate', 'chevron', 'banner', 'ceilWarn', 'landing', 'lamp'];
    for (var mi = 0; mi < markers.length; mi++) {
      var marker = look[markers[mi]];
      if (marker && marker.userData.glow && marker.emissiveIntensity < 0.95) marker.emissiveIntensity = 0.95;
    }
    var body = car.userData.bodyMat;
    if (body) {
      _colorA.setHex(0xe15b22);
      body.color.copy(_colorA).lerp(mix('emit'), 0.28);
      body.emissive.copy(mix('emit'));
      body.emissiveIntensity = lerp(a.emitI, b.emitI, t) * 0.22;
    }
    var hints = state.hints || {};
    var teachEarly = coachLive() && coach.step < 2;
    var wantFlip = !teachEarly && !state.flipLatched && state.gear < 4 && hints.flip && state.countdown <= 0 && !state.badFlip && !state.finished;
    var wantDown = state.flipLatched && !!hints.down && state.gear === 4 && state.countdown <= 0 && !state.badFlip;
    var wantUp = !state.flipLatched && state.gear < 3 && hints.up && !state.airborne && state.countdown <= 0 && !state.badFlip && !state.finished;
    var pulse = calm() ? 1 : (0.72 + 0.28 * Math.sin(state.raceTime * 5.2));
    function boost(mat, hot) {
      if (!mat || !mat.userData.glow) return;
      var base = lerp(a.emitI, b.emitI, t);
      mat.emissiveIntensity = hot ? base * (calm() ? 1.45 : 0.9 + pulse) : base;
    }
    boost(look.gate, wantFlip);
    boost(look.banner, wantUp);
    boost(look.ceilWarn, wantDown);
    boost(look.landing, wantDown);
    var hudCss = '#' + mix('hud').getHexString();
    frameEl.style.setProperty('--accent', hudCss);
    if (gearEl) gearEl.style.color = hudCss;
    if (flashEl) flashEl.style.background = '#' + mix('flash').getHexString();
    display = { hud: hudCss, grav: state.flipLatched ? 'INVERT' : b.grav, name: GS.GEARS[state.gear].name };
  }

  function updatePresentation(dt) {
    var sq = state.squash;
    if (sq > 0.02 && !state.flipLatched) {
      var sy = 1 - 0.2 * sq;
      var wide = 1 + 0.07 * sq;
      car.scale.set(wide, sy, wide);
    } else if (car.scale.y !== 1) {
      car.scale.set(1, 1, 1);
    }
    if (!state.paused && state.hold <= 0) {
      var spinDir = state.upBlend > 0.5 ? -1 : 1;
      wheelSpin -= spinDir * state.speed * dt / 0.36;
    }
    var steerVis = state.paused ? 0 : -(driveInput().steer || 0) * 0.38;
    if (state.upBlend > 0.5) steerVis = -steerVis;
    for (var i = 0; i < car.userData.wheels.length; i++) {
      var wheel = car.userData.wheels[i];
      wheel.spinner.rotation.y = wheelSpin;
      wheel.mount.rotation.y = wheel.steer ? steerVis : 0;
    }
    var shadowY = state.flipLatched ? state.flipY - 0.05 : track.roadHeight(state.along) + 0.09;
    shadow.visible = !qualityLow();
    shadow.position.set(car.position.x, shadowY, car.position.z);
    shadow.rotation.x = state.upBlend > 0.5 ? Math.PI / 2 : -Math.PI / 2;
    applyPalette();
    updateSpeedLines();
    updateGhost();
    presentPlates();
    if (flow.screen === 'race' && !state.paused) checkNearMiss();
    updateParticles(dt);
  }

  function presentPlates() {
    var grid = flow.screen !== 'race' || state.countdown > 0;
    if (field && field.list && GS.presentPlate) {
      var i;
      for (i = 0; i < field.list.length; i++) {
        GS.presentPlate(field.list[i].plate, camera, { hide: grid });
      }
    }
    if (ghostActor && ghostActor.plate && GS.presentPlate) {
      var showGhost = flow.mode === 'trial' && flow.screen === 'race' && !flow.demo;
      GS.presentPlate(ghostActor.plate, camera, { hide: grid || !showGhost, ghost: true });
    }
    if (targetActor && targetActor.plate && GS.presentPlate) {
      var showTarget = flow.mode === 'trial' && flow.screen === 'race' && !flow.demo;
      GS.presentPlate(targetActor.plate, camera, { hide: grid || !showTarget, ghost: true });
    }
  }

  function formatTime(t) {
    var safe = t > 0 ? t : 0;
    var mins = Math.floor(safe / 60);
    var secs = Math.floor(safe % 60);
    var cs = Math.floor((safe - Math.floor(safe)) * 100);
    return mins + ':' + (secs < 10 ? '0' : '') + secs + '.' + (cs < 10 ? '0' : '') + cs;
  }

  function liveErrors() {
    var list = GS.bootErrors ? GS.bootErrors.slice() : [];
    if (track && track.errors) {
      var i;
      for (i = 0; i < track.errors.length; i++) list.push(track.errors[i]);
    }
    return list;
  }

  function cue(action) {
    if (!GS.actionLabel) return '';
    var label = GS.actionLabel(action);
    return label ? label + '  ' : '';
  }

  function promptText() {
    promptKind = '';
    if (state.finished || state.countdown > 0 || state.hold > 0 || state.badFlip || state.paused) return '';
    var hints = state.hints || { flip: false, down: false, up: false };
    var teachEarly = coachLive() && coach.step < 2;
    if (state.flipLatched && hints.down && state.gear === 4) {
      promptKind = 'down';
      return '▼  ' + cue('downshift') + 'SHIFT DOWN';
    }
    if (!teachEarly && !state.flipLatched && !state.airborne && state.gear < 4 && hints.flip) {
      promptKind = 'flip';
      return '▲  ' + cue('upshift') + 'FLIP';
    }
    if (!state.flipLatched && state.gear < 3 && hints.up && !state.airborne) {
      promptKind = 'up';
      return '▲  ' + cue('upshift') + 'SHIFT UP';
    }
    return '';
  }

  function paintMap() {
    if (!mapEl || !track || !track.samples || !track.samples.length) return;
    var wide = frameEl && frameEl.clientWidth >= 880;
    var touchPortrait = frameEl && frameEl.classList.contains('touch-portrait');
    var show = flow.screen === 'race' && !state.paused && wide && !touchPortrait;
    mapEl.hidden = !show;
    if (!show) return;
    var ctx = mapEl.getContext('2d');
    if (!ctx) return;
    var w = mapEl.width;
    var h = mapEl.height;
    var samples = track.samples;
    var minX = samples[0].x;
    var maxX = minX;
    var minZ = samples[0].z;
    var maxZ = minZ;
    var i;
    for (i = 1; i < samples.length; i++) {
      if (samples[i].x < minX) minX = samples[i].x;
      if (samples[i].x > maxX) maxX = samples[i].x;
      if (samples[i].z < minZ) minZ = samples[i].z;
      if (samples[i].z > maxZ) maxZ = samples[i].z;
    }
    var span = Math.max(maxX - minX, maxZ - minZ, 1);
    var pad = 10;
    function px(x, z) {
      return {
        x: pad + ((x - minX) / span) * (w - pad * 2),
        y: pad + ((z - minZ) / span) * (h - pad * 2)
      };
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(12, 10, 8, 0.2)';
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    var p0 = px(samples[0].x, samples[0].z);
    ctx.moveTo(p0.x, p0.y);
    for (i = 1; i < samples.length; i += 2) {
      var p = px(samples[i].x, samples[i].z);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(246, 241, 231, 0.85)';
    ctx.lineWidth = 3;
    ctx.stroke();
    if (car) {
      var you = px(car.position.x, car.position.z);
      ctx.fillStyle = '#ffb03a';
      ctx.fillRect(you.x - 3, you.y - 3, 6, 6);
    }
    if (field && field.list) {
      ctx.fillStyle = '#7ef0ff';
      for (i = 0; i < field.list.length; i++) {
        var rp = px(field.list[i].root.position.x, field.list[i].root.position.z);
        ctx.fillRect(rp.x - 2, rp.y - 2, 4, 4);
      }
    }
    mapReady = true;
  }

  function updateHUD() {
    var kmh = Math.round(Math.abs(state.speed) * 3.6);
    var digits = String(Math.abs(kmh)).padStart(3, '0');
    speedEl.textContent = (state.speed < -0.4 ? '-' : '') + digits;
    var gearText = String(state.gear);
    if (gearEl.textContent !== gearText) gearEl.textContent = gearText;
    if (gearPipsEl) {
      var pips = gearPipsEl.children;
      var pi;
      for (pi = 0; pi < pips.length; pi++) pips[pi].classList.toggle('on', pi < state.gear);
    }
    if (display) {
      gearNameEl.textContent = display.name;
      gravEl.textContent = display.grav + (state.flipLatched ? ' ↑' : ' ↓');
    }
    var showLap = state.lapsDone + (state.finished ? 0 : 1);
    if (showLap < 1) showLap = 1;
    if (showLap > track.laps) showLap = track.laps;
    lapEl.textContent = 'LAP ' + showLap + '/' + track.laps;
    if (timeEl) timeEl.textContent = formatTime(state.raceTime);
    if (trackNameEl) trackNameEl.textContent = track.name;
    if (modeLineEl) modeLineEl.textContent = modeLabel();
    paintPlace();
    if (GS.audio) state.muted = !!GS.audio.settings.muted;
    muteChip.hidden = !state.muted;
    pauseLayer.classList.toggle('show', flow.screen === 'race' && state.paused && !(GS.controller && GS.controller.isOpen && GS.controller.isOpen()));
    if (hudEl) {
      var browsing = flow.screen === 'menu' || flow.screen === 'tracks' || flow.screen === 'title' || flow.screen === 'howto' || flow.screen === 'credits';
      hudEl.classList.toggle('menu', browsing);
      hudEl.classList.toggle('quiet', flow.screen === 'results' || flow.screen === 'cup');
    }
    if (soundNudgeEl && GS.audio && GS.audio.waiting) soundNudgeEl.hidden = !GS.audio.waiting();
    paintMap();
    var msg = '';
    var racing = flow.screen === 'race';
    if (liveErrors().length) msg = 'FRAME CHECK FAILED';
    else if (racing && !state.paused && state.countdown > 2) msg = '3';
    else if (racing && !state.paused && state.countdown > 1) msg = '2';
    else if (racing && !state.paused && state.countdown > 0) msg = '1';
    else if (racing && !state.paused && state.goBanner > 0) msg = 'GO';
    else if (racing && !state.paused && state.finished) msg = 'FINISH';
    else if (racing && !state.paused && state.badFlip) msg = 'BAD FLIP';
    else if (racing && !state.paused && state.hold > 0) msg = 'RECOVERED';
    else if (racing && !state.paused && state.offTimer > 0.05) msg = 'OFF TRACK';
    msgEl.textContent = msg;
    msgEl.classList.toggle('finish', msg === 'FINISH');
    msgEl.classList.toggle('warn', !state.paused && (state.badFlip || state.offTimer > 0.05));
    var nextPrompt = (!racing || state.paused) ? '' : promptText();
    if (nextPrompt !== lastPrompt) {
      lastPrompt = nextPrompt;
      promptEl.textContent = nextPrompt;
      promptEl.classList.remove('live');
      promptEl.classList.remove('up');
      promptEl.classList.remove('down');
      promptEl.classList.remove('flip');
      if (nextPrompt) {
        void promptEl.offsetWidth;
        promptEl.classList.add('live');
        if (promptKind) promptEl.classList.add(promptKind);
      }
    }
    paintOverlays();
    paintCoach();
    if (hintEl && flow.screen !== 'race') hintEl.classList.add('hide');
    // Stage 8 polish: the controls line is for the first seconds of a race, then it clears the HUD.
    else if (hintEl) hintEl.classList.toggle('hide', (state.raceTime || 0) > 12);
    if (hintEl && GS.hintLine && flow.screen === 'race' && !flow.demo) hintEl.textContent = GS.hintLine(hintEl.classList.contains('compact'));
    paintSplit();
    paintTaunt();
    if (demoTagEl) demoTagEl.hidden = !flow.demo;
  }

  function hexCss(hex) {
    var s = (hex >>> 0).toString(16);
    while (s.length < 6) s = '0' + s;
    return '#' + s.slice(-6);
  }

  function targetGhostEnabled() {
    var bag = GS.audioSettings || (GS.audio && GS.audio.settings) || {};
    return bag.targetGhost !== false;
  }

  function refreshTargetGhost() {
    if (!track || !scene || flow.screen !== 'race' || flow.mode !== 'trial' || flow.demo) return;
    var medal = targetGhostEnabled() && GS.save && GS.save.nextMedal ? GS.save.nextMedal(track.id) : null;
    var have = !!(targetActor && targetActor.root);
    var haveKey = targetActor && targetActor.medal ? targetActor.medal : '';
    var wantKey = medal ? medal.key : '';
    if (!!medal !== have || wantKey !== haveKey) rebuildActors();
  }

  function noteSplit(lapTime) {
    if (flow.demo || !track || !GS.save || !(lapTime > 0.2) || !isFinite(lapTime)) return;
    var prev = GS.save.bestLap(track.id);
    var delta = prev ? lapTime - prev : null;
    GS.save.noteLap(track.id, lapTime);
    splitUi.last = lapTime;
    splitUi.delta = delta;
    splitUi.bestLap = GS.save.bestLap(track.id);
    splitUi.show = 2;
  }

  function paintSplit() {
    if (!splitEl) return;
    var show = splitUi.show > 0 && flow.screen === 'race' && !state.paused && !flow.demo && splitUi.last != null;
    splitEl.hidden = !show;
    if (!show) return;
    var text = formatTime(splitUi.last);
    if (splitUi.delta != null && isFinite(splitUi.delta)) {
      var neg = splitUi.delta < -0.005;
      var pos = splitUi.delta > 0.005;
      var gap = (neg ? '-' : '+') + Math.abs(splitUi.delta).toFixed(2);
      text += '  ' + gap;
      splitEl.classList.toggle('ahead', !pos);
      splitEl.classList.toggle('behind', pos);
    } else {
      splitEl.classList.remove('ahead');
      splitEl.classList.remove('behind');
    }
    if (splitEl.textContent !== text) splitEl.textContent = text;
  }

  function showBumpTaunt(rival) {
    if (!rival || flow.demo) return;
    var now = state.raceTime;
    if (rival.tauntAt && now - rival.tauntAt < 5) return;
    rival.tauntAt = now;
    var id = rival.profile && rival.profile.id;
    var name = rival.profile && rival.profile.name ? rival.profile.name : 'RIVAL';
    var line = TAUNT_LINE[id] || 'BEEP BEEP!';
    tauntUi.text = name + ': ' + line;
    tauntUi.life = 1.25;
    bumpFx.taunts += 1;
  }

  function paintTaunt() {
    if (!tauntEl) return;
    var show = tauntUi.life > 0 && flow.screen === 'race' && !flow.demo;
    tauntEl.hidden = !show;
    if (show && tauntEl.textContent !== tauntUi.text) tauntEl.textContent = tauntUi.text;
  }

  function noteFrameTime(dt) {
    var forced = autoQ.forceLeft > 0;
    if (forced) autoQ.forceLeft = Math.max(0, autoQ.forceLeft - Math.max(dt, 0));
    var bag = GS.audioSettings || (GS.audio && GS.audio.settings) || {};
    var enabled = bag.autoQuality !== false;
    if (!enabled) {
      autoQ.slow = 0;
      return;
    }
    if (!forced && GS.manualStep) return;
    if (document.hidden) {
      autoQ.slow = 0;
      frameMs.length = 0;
      frameSum = 0;
      return;
    }
    var racing = flow.screen === 'race' && !flow.demo && !state.paused && state.countdown <= 0 && !state.finished;
    if (!racing) {
      autoQ.slow = 0;
      frameMs.length = 0;
      frameSum = 0;
      return;
    }
    var ms = forced ? 40 : Math.min(100, Math.max(0, dt) * 1000);
    frameMs.push(ms);
    frameSum += ms;
    if (frameMs.length > 60) frameSum -= frameMs.shift();
    autoQ.avg = frameMs.length ? frameSum / frameMs.length : 0;
    if (!forced && frameMs.length < 30) return;
    if (autoQ.avg > 25) autoQ.slow += Math.max(dt, 0);
    else autoQ.slow = 0;
    if (autoQ.slow >= 3) {
      autoQ.slow = 0;
      frameMs.length = 0;
      frameSum = 0;
      dropQuality();
    }
  }

  function dropQuality() {
    var cur = qualityName();
    if (cur === 'low') return;
    var next = cur === 'high' ? 'mid' : 'low';
    if (GS.setAudioFlag) GS.setAudioFlag('quality', next);
    autoQ.drops += 1;
    autoQ.lastDrop = next;
    var word = next === 'mid' ? 'Mid' : 'Low';
    if (GS.toast) GS.toast('Quality lowered to ' + word + ' for smoother play');
  }

  function tickAttractIdle(dt) {
    if (flow.demo) return;
    if (document.hidden) {
      attract.idle = 0;
      return;
    }
    var settingsOpen = GS.controller && GS.controller.isOpen && GS.controller.isOpen();
    if (flow.screen === 'title' && !settingsOpen) {
      attract.idle += dt;
      if (attract.idle >= 8) startAttract();
    } else attract.idle = 0;
  }

  function applyDemoGear(next) {
    if (!GS.GEARS[next] || next === state.gear) return;
    var dir = next > state.gear ? 1 : -1;
    state.gear = next;
    state.palFrom = state.palTo;
    state.palTo = next;
    state.palU = 0;
    state.shiftU = 0;
    state.gFrom = state.gravity;
    state.gTo = GS.GEARS[next].gravity;
    triggerShiftFx(dir, next);
  }

  function placeAttract(pose) {
    if (!pose) return;
    var tx = pose.tx || 1;
    var tz = pose.tz || 0;
    state.yaw = GS.yawFromForwardXZ(tx, tz);
    state.upBlend = pose.up || 0;
    if (!isFinite(state.upBlend)) state.upBlend = 0;
    state.flipLatched = state.upBlend > 0.45;
    var y = pose.y;
    if (!isFinite(y)) y = track.roadHeight(attract.along);
    car.position.set(pose.x, y, pose.z);
    applyOrientation();
  }

  function driveAttract(dt) {
    if (!track || !car || !(dt > 0)) return;
    if (document.hidden) {
      exitAttract();
      return;
    }
    attract.t += dt;
    attract.on = true;
    state.raceTime += dt;
    var line = track.line || { kind: 'none' };
    var speed = (GS.GEARS[state.gear] ? GS.GEARS[state.gear].top : 22) * 0.9;
    if (attract.mode === 'shortcut') speed = 42;
    state.speed = speed;
    if (attract.mode === 'shortcut' && line.kind === 'shortcut') {
      attract.sDist += speed * dt;
      placeAttract(track.poseOnRail(0, 0, { kind: 'shortcut', sDist: attract.sDist }));
      if (attract.sDist >= (line.length || 1) - 0.35) {
        attract.mode = 'road';
        attract.flipTaken = true;
        attract.along = line.main1 || attract.along;
        state.shiftU = 1;
        applyDemoGear(2);
        placeAttract(track.poseOnRail(attract.along, 0, { kind: 'road' }));
        state.along = attract.along;
      }
      return;
    }
    var prev = attract.along;
    attract.along += speed * dt;
    if (attract.along >= track.length) attract.along -= track.length;
    if (!attract.flipTaken && line.kind === 'shortcut' && line.length > 1 &&
        crossedForward(prev, attract.along, line.main0, track.length)) {
      attract.mode = 'shortcut';
      attract.sDist = 1.5;
      state.shiftU = 1;
      applyDemoGear(4);
      placeAttract(track.poseOnRail(0, 0, { kind: 'shortcut', sDist: attract.sDist }));
      return;
    }
    if (attract.along > track.length * 0.55) attract.armed = true;
    if (attract.armed && prev > track.length * 0.72 && attract.along < track.length * 0.22) {
      startAttract();
      return;
    }
    var frac = attract.along / (track.length || 1);
    var want = 2;
    if (frac < 0.16) want = 1;
    else if (frac < 0.38) want = 2;
    else if (frac < 0.62) want = 3;
    else want = 2;
    if (line.kind === 'shelf' && attract.along >= line.d0 && attract.along <= line.d1) want = 4;
    applyDemoGear(want);
    var spec = { kind: 'road' };
    if (line.kind === 'shelf' && state.gear === 4 && attract.along >= line.d0 && attract.along <= line.d1) {
      spec = { kind: 'shelf' };
    }
    placeAttract(track.poseOnRail(attract.along, 0, spec));
    state.along = attract.along;
  }

  function startAttract() {
    var ids = GS.TRACK_IDS && GS.TRACK_IDS.length ? GS.TRACK_IDS : ['warmup'];
    var id = ids[attract.index % ids.length];
    attract.index += 1;
    flow.demo = true;
    flow.mode = 'demo';
    attract.on = true;
    attract.idle = 0;
    attract.mode = 'road';
    attract.sDist = 0;
    attract.flipTaken = false;
    attract.armed = false;
    if (!track || track.id !== id) swapTrack(id);
    attract.track = track ? track.id : id;
    beginRace();
    flow.demo = true;
    flow.mode = 'demo';
    attract.on = true;
    attract.t = 0;
    attract.track = track.id;
    state.countdown = 0;
    state.goBanner = 0;
    lastCountDigit = 0;
    coach.enabled = false;
    if (coachEl) coachEl.hidden = true;
    attract.along = track.spawnDist;
    state.along = attract.along;
    placeAttract(track.poseOnRail(attract.along, 0, { kind: 'road' }));
    camSnap = true;
    if (demoTagEl) demoTagEl.hidden = false;
  }

  function exitAttract() {
    if (!flow.demo && !attract.on) return;
    attract.guardUntil = performance.now() + 450;
    attract.idle = 0;
    attract.t = 0;
    attract.on = false;
    attract.mode = 'road';
    flow.demo = false;
    if (demoTagEl) demoTagEl.hidden = true;
    state.speed = 0;
    openTitle();
  }

  function frame(dt) {
    if (GS.audio && GS.audio.hold) GS.audio.hold(state.paused || flow.screen !== 'race' || !!flow.demo);
    if (GS.pollInput) GS.pollInput();
    applyEdges();
    if (GS.controller && GS.controller.tick) GS.controller.tick();
    noteFrameTime(dt);
    if (bumpFx.hitLeft > 0) bumpFx.hitLeft = Math.max(0, bumpFx.hitLeft - dt);
    if (flow.demo) {
      if (!state.paused && !document.hidden) driveAttract(dt);
    } else if (state.paused || flow.screen !== 'race') {
      bank = 0;
    } else {
      var simDt = dt;
      if (bumpFx.hitLeft > 0) simDt = dt * 0.22;
      bank += Math.min(Math.max(simDt, 0), 0.05);
      var steps = 0;
      while (bank >= FIXED && steps < MAX_STEPS) {
        stepPhysics(FIXED);
        bank -= FIXED;
        steps += 1;
      }
      if (steps === MAX_STEPS) bank = 0;
    }
    if (splitUi.show > 0) splitUi.show = Math.max(0, splitUi.show - dt);
    if (tauntUi.life > 0) tauntUi.life = Math.max(0, tauntUi.life - dt);
    if (!flow.demo) tickAttractIdle(dt);
    else if (document.hidden) exitAttract();
    updateShiftFx(dt);
    updateCamera(dt);
    updateOverpass(dt);
    updatePresentation(dt);
    updateFlipPop(dt);
    pulseFlipSigns();
    if (flow.screen === 'race' && state.finished && !flow.handled) onFinish();
    updateHUD();
    updateAudio(dt);
    if (GS.touch && GS.touch.sync) GS.touch.sync();
    if (!GS.skipRender) renderer.render(scene, camera);
  }

  function pixelCap() {
    var q = GS.audio && GS.audio.quality ? GS.audio.quality() : 'mid';
    // Mid is the laptop default: about 60 fps. High spends pixels on a sharper picture.
    if (q === 'low') return 1;
    if (q === 'high') return 2;
    return 1.15;
  }

  function layout() {
    var vv = window.visualViewport;
    var ww = vv ? vv.width : window.innerWidth;
    var wh = vv ? vv.height : window.innerHeight;
    var originX = vv ? vv.offsetLeft : 0;
    var originY = vv ? vv.offsetTop : 0;
    var portrait = wh > ww * 1.05;
    var w;
    var h;
    if (portrait) {
      w = Math.max(2, Math.floor(ww));
      h = Math.max(2, Math.floor(wh));
    } else {
      w = ww;
      h = ww * 9 / 16;
      if (h > wh) {
        h = wh;
        w = wh * 16 / 9;
      }
      w = Math.max(2, Math.floor(w));
      h = Math.max(2, Math.floor(h));
    }
    frameEl.style.transform = 'none';
    frameEl.style.left = (originX + (ww - w) / 2) + 'px';
    frameEl.style.top = (originY + (wh - h) / 2) + 'px';
    frameEl.style.width = w + 'px';
    frameEl.style.height = h + 'px';
    if (portraitEl) portraitEl.classList.remove('show');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelCap()));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (GS.touch && GS.touch.sync) GS.touch.sync();
  }

  function bootCarHeading(bootErrors) {
    var spawn = track.sample(track.spawnDist);
    state.yaw = GS.yawFromForwardXZ(spawn.tx, spawn.tz);
    state.upBlend = 0;
    car.position.set(spawn.x, track.roadHeight(spawn.dist), spawn.z);
    applyOrientation();
    car.updateMatrixWorld(true);
    state.prevAlong = spawn.dist;
    state.along = spawn.dist;
    state.checkpoint = 0;
    readBasis();
    if (spawn.tx < 0.98) bootErrors.push('spawn tangent is not +X');
    if (_fwd.x < 0.97 || Math.abs(_fwd.z) > 0.05) {
      bootErrors.push('car heading at spawn is ' + _fwd.x.toFixed(2) + ',' + _fwd.z.toFixed(2));
    }
    var head = new THREE.Vector3();
    var tail = new THREE.Vector3();
    car.userData.headlamps[0].getWorldPosition(head);
    car.userData.taillamps[0].getWorldPosition(tail);
    var noseDir = head.sub(tail);
    noseDir.y = 0;
    noseDir.normalize();
    if (noseDir.dot(_fwd) < 0.9) bootErrors.push('headlamps do not lead the tail along the car forward');
  }

  function getState() {
    car.updateMatrixWorld(true);
    var fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(car.quaternion);
    fwd.y = 0;
    if (fwd.lengthSq() > 1e-8) fwd.normalize();
    var rel = new THREE.Vector3().copy(camera.position).sub(car.position);
    var flat = rel.clone();
    flat.y = 0;
    var behind = 0;
    if (flat.lengthSq() > 1e-6) behind = flat.normalize().dot(fwd);
    var view = new THREE.Vector3();
    camera.getWorldDirection(view);
    var head = new THREE.Vector3();
    var tail = new THREE.Vector3();
    car.userData.headlamps[0].getWorldPosition(head);
    car.userData.taillamps[0].getWorldPosition(tail);
    var lampDir = head.sub(tail);
    lampDir.y = 0;
    lampDir.normalize();
    var camUpDot = camera.up.y;
    return {
      x: car.position.x,
      y: car.position.y,
      z: car.position.z,
      speed: state.speed,
      slide: state.slide,
      vy: state.vy,
      gear: state.gear,
      top: GS.GEARS[state.gear].top,
      gravity: state.gravity,
      yaw: state.yaw,
      fwdX: fwd.x,
      fwdZ: fwd.z,
      along: state.along,
      side: state.side,
      mainSide: state.mainSide,
      onShortcut: state.onShortcut,
      targetYaw: GS.yawFromForwardXZ(
        track.sample(state.along).tx,
        track.sample(state.along).tz
      ),
      lapsDone: state.lapsDone,
      paused: state.paused,
      muted: state.muted,
      recovered: state.recovered,
      offTimer: state.offTimer,
      hold: state.hold,
      grace: state.grace,
      airborne: state.airborne,
      airTime: state.airTime,
      apex: state.apex,
      lastAir: state.lastAir,
      lastApex: state.lastApex,
      flipLatched: state.flipLatched,
      upBlend: state.upBlend,
      badFlip: state.badFlip,
      stallT: state.stallT,
      shiftU: state.shiftU,
      ride: state.ride,
      fov: camera.fov,
      kick: state.kick,
      flash: state.flash,
      chroma: state.chroma,
      dip: state.dip,
      squash: state.squash,
      palU: state.palU,
      palFrom: state.palFrom,
      palTo: state.palTo,
      speedLines: speedLines ? speedLines.material.opacity : 0,
      gearClass: gearEl ? gearEl.className : '',
      failVeil: failEl ? failEl.style.opacity : '0',
      hints: state.hints,
      coach: {
        enabled: coach.enabled,
        step: coach.step,
        praise: coach.praise,
        flag: coach.flag,
        visible: !!(coachEl && !coachEl.hidden),
        title: coachTitleEl ? coachTitleEl.textContent : '',
        body: coachBodyEl ? coachBodyEl.textContent : ''
      },
      sessionMinY: state.sessionMinY,
      sky: scene.background.getHex(),
      behind: behind,
      viewDot: view.dot(fwd),
      camAbove: (camera.position.y - car.position.y) * (camUpDot >= 0 ? 1 : -1),
      camUpY: camUpDot,
      lampDot: lampDir.dot(fwd),
      audio: GS.audio && GS.audio.settings ? (GS.audio.settings.muted ? 0 : GS.audio.settings.master / 100) : -1,
      shake: state.shake,
      nearDist: nearDist,
      bumps: bump.count,
      bumpReleases: bump.releases,
      lastBump: bump.last,
      nearFlash: state.nearFlash,
      overpassFade: overpass.fade,
      overpassBlock: overpass.block,
      overpassCount: overpass.list.length,
      quality: GS.audio ? GS.audio.quality() : 'mid',
      particles: particlesOn(),
      bloom: !!(GS.audio && GS.audio.bloomOn && GS.audio.bloomOn()),
      asphaltHalf: track.asphaltHalf,
      length: track.length,
      checkpoint: state.checkpoint,
      trackId: track.id,
      trackName: track.name,
      lapsTarget: track.laps,
      raceTime: state.raceTime,
      finished: state.finished,
      input: {
        accel: GS.input ? GS.input.accel : 0,
        brake: GS.input ? GS.input.brake : 0,
        steer: GS.input ? GS.input.steer : 0,
        handbrake: GS.input ? !!GS.input.handbrake : false
      },
      countdown: state.countdown,
      flipKind: track.flipKind,
      minRadius: track.minRadius,
      bootErrors: liveErrors(),
      hud: {
        brand: document.getElementById('brand').textContent,
        credit: document.getElementById('credit').textContent,
        pauseBrand: document.getElementById('pauseBrand').textContent,
        pauseCredit: document.getElementById('pauseCredit').textContent,
        speed: speedEl.textContent,
        gear: gearEl.textContent,
        gearName: gearNameEl.textContent,
        grav: gravEl.textContent,
        lap: lapEl.textContent,
        pause: pauseLayer.classList.contains('show'),
        mute: !muteChip.hidden,
        msg: msgEl.textContent,
        prompt: promptEl.textContent,
        place: placeEl ? placeEl.textContent : '',
        delta: deltaEl ? deltaEl.textContent : '',
        mode: modeLineEl ? modeLineEl.textContent : ''
      },
      mode: flow.mode,
      screen: flow.screen,
      shiftFx: {
        active: !!shiftFx.active,
        t: shiftFx.t,
        count: shiftFx.count,
        gear: shiftFx.gear,
        fovPunch: shiftFx.fovPunch,
        mode: shiftFx.mode
      },
      speedFx: {
        fovAdd: speedFx.fovAdd,
        streaks: speedFx.streaks,
        camLag: speedFx.camLag,
        landShake: speedFx.landShake,
        mode: speedFx.mode
      },
      flipSigns: track && track.flipSignCount ? track.flipSignCount : 0,
      lastFlipSaved: flipUi.saved,
      flipPopups: flipUi.popups,
      targetGhost: {
        on: !!(targetActor && targetActor.root && targetActor.root.visible),
        medal: targetActor ? targetActor.medal : '',
        time: targetActor ? targetActor.time : 0
      },
      splits: {
        last: splitUi.last,
        delta: splitUi.delta,
        bestLap: splitUi.bestLap
      },
      retries: sessionRetries,
      attract: {
        on: !!flow.demo,
        track: attract.track || '',
        t: attract.t
      },
      autoQuality: {
        enabled: !((GS.audioSettings || (GS.audio && GS.audio.settings) || {}).autoQuality === false),
        drops: autoQ.drops,
        lastDrop: autoQ.lastDrop
      },
      bumpFx: {
        sparks: bumpFx.sparks,
        hitPauses: bumpFx.hitPauses,
        taunts: bumpFx.taunts
      },
      menuFocus: currentMenuFocus(),
      dadCardUi: {
        open: cardUi.open,
        focus: cardUi.focus,
        actions: cardUi.actions.map(function (a) { return a.label; }),
        opens: cardUi.opens,
        saves: cardUi.saves,
        copies: cardUi.copies,
        shares: cardUi.shares,
        lastAction: cardUi.lastAction,
        toast: cardUi.toast,
        filename: cardUi.filename,
        fallback: cardUi.fallback,
        imgWidth: cardImgEl ? cardImgEl.naturalWidth : 0
      },
      reducedFlash: calm(),
      place: flow.screen === 'race' ? currentPlace() : flow.place,
      medal: flow.lastMedal,
      results: flow.screen === 'results' || flow.screen === 'cup' ? screenCopyText() : '',
      rivals: rivalSnapshot(),
      difficulty: GS.rivalDifficulty ? GS.rivalDifficulty() : 'normal',
      ghostOn: !!(ghostActor && ghostActor.root && ghostActor.root.visible),
      ghostPlate: ghostActor && ghostActor.plate ? {
        visible: ghostActor.plate.visible,
        opacity: ghostActor.plate.material ? ghostActor.plate.material.opacity : 0,
        sx: ghostActor.plate.scale.x,
        sy: ghostActor.plate.scale.y,
        dist: ghostActor.plate.userData.dist || 0,
        screenH: ghostActor.plate.userData.screenH || 0
      } : null,
      unlocks: GS.save ? GS.save.unlocks() : {},
      best: GS.save && track ? GS.save.best(track.id) : null,
      cup: {
        heat: flow.cupHeat,
        points: flow.points,
        heats: flow.heats,
        pending: flow.pending
      },
      canvas: {
        cssW: frameEl.clientWidth,
        cssH: frameEl.clientHeight
      }
    };
  }

  function sampleAhead(dist) {
    var s = track.sample(dist);
    return {
      dist: s.dist,
      x: s.x,
      z: s.z,
      tx: s.tx,
      tz: s.tz,
      yaw: GS.yawFromForwardXZ(s.tx, s.tz),
      y: track.roadHeight(dist)
    };
  }

  function trackIdFromLocation() {
    var query = '';
    try {
      query = new URLSearchParams(window.location.search).get('track') || '';
    } catch (err) {
      query = '';
    }
    var hash = (window.location.hash || '').replace('#', '');
    return GS.normalizeTrackId(query || hash || 'warmup');
  }

  function dropRoot(root) {
    if (!root) return;
    var geos = [];
    var mats = [];
    root.traverse(function (obj) {
      if (obj.geometry && geos.indexOf(obj.geometry) < 0) geos.push(obj.geometry);
      var material = obj.material;
      if (!material) return;
      if (Object.prototype.toString.call(material) === '[object Array]') {
        var m;
        for (m = 0; m < material.length; m++) {
          if (mats.indexOf(material[m]) < 0) mats.push(material[m]);
        }
      } else if (mats.indexOf(material) < 0) mats.push(material);
    });
    var i;
    for (i = 0; i < geos.length; i++) geos[i].dispose();
    for (i = 0; i < mats.length; i++) mats[i].dispose();
    if (scene) scene.remove(root);
  }

  function markPicker() {
    if (!pickerEl) return;
    var buttons = pickerEl.querySelectorAll('button');
    var i;
    for (i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('on', buttons[i].getAttribute('data-track') === track.id);
    }
  }

  function resetRace() {
    var spawn = track.sample(track.spawnDist);
    state.speed = 0;
    state.slide = 0;
    state.vy = 0;
    state.yaw = GS.yawFromForwardXZ(spawn.tx, spawn.tz);
    state.gear = 1;
    state.gravity = GS.GEARS[1].gravity;
    state.gFrom = state.gravity;
    state.gTo = state.gravity;
    state.shiftU = 1;
    state.ride = 0;
    state.paused = false;
    state.lapsDone = 0;
    state.armed = false;
    state.prevAlong = spawn.dist;
    state.along = spawn.dist;
    state.side = 0;
    state.mainSide = 0;
    state.onShortcut = false;
    state.checkpoint = 0;
    state.offTimer = 0;
    state.edgeHold = 0;
    state.hold = 0;
    state.grace = 0.35;
    state.recovered = 0;
    state.airborne = false;
    state.prevSlope = 0;
    state.airTime = 0;
    state.apex = 0;
    state.lastAir = 0;
    state.lastApex = 0;
    state.flipLatched = false;
    state.flipFromY = spawn.y || 0;
    state.upBlend = 0;
    state.badFlip = false;
    state.stallT = 0;
    state.kick = 0;
    state.flash = 0;
    state.chroma = 0;
    state.dip = 0;
    state.squash = 0;
    state.failFlash = 0;
    state.shake = 0;
    state.nearFlash = 0;
    state.droppedFlip = false;
    state.palFrom = 1;
    state.palTo = 1;
    state.palU = 1;
    state.countdown = 3.2;
    resetShiftFx();
    resetFlipUi();
    speedFx.camLag = 0;
    speedFx.landShake = 0;
    speedFx.streaks = 0;
    speedFx.fovAdd = 0;
    speedFx.prevSp = 0;
    speedFx.ready = false;
    if (GS.audio && GS.audio.beginRace) GS.audio.beginRace();
    lastCountDigit = 4;
    lastCheckpoint = 0;
    nearAt = -2;
    nearDist = 99;
    bump.count = 0;
    bump.releases = 0;
    bump.last = null;
    bump.at = -9;
    exhaustAcc = 0;
    smokeAcc = 0;
    state.goBanner = 0;
    state.raceTime = 0;
    state.finished = false;
    lapClock = 0;
    splitUi.last = null;
    splitUi.delta = null;
    splitUi.show = 0;
    splitUi.bestLap = (!flow.demo && GS.save && track) ? GS.save.bestLap(track.id) : null;
    bumpFx.hitLeft = 0;
    tauntUi.life = 0;
    state.flipY = track.roadHeight(spawn.dist);
    state.hints = { flip: false, down: false, up: false };
    car.position.set(spawn.x, track.roadHeight(spawn.dist), spawn.z);
    car.scale.set(1, 1, 1);
    applyOrientation();
    state.sessionMinY = car.position.y;
    camSnap = true;
    lastPrompt = '';
    if (promptEl) {
      promptEl.textContent = '';
      promptEl.classList.remove('live');
      promptEl.classList.remove('up');
      promptEl.classList.remove('down');
      promptEl.classList.remove('flip');
    }
    if (trackNameEl) trackNameEl.textContent = track.name;
    markPicker();
  }

  function modeLabel() {
    if (flow.mode === 'cup') return 'CUP  ' + (flow.cupHeat + 1) + '/3';
    if (flow.mode === 'quick') return 'QUICK RACE';
    return 'TIME TRIAL';
  }

  function blankPoints() {
    var points = { YOU: 0 };
    var rivals = GS.RIVALS || [];
    var i;
    for (i = 0; i < rivals.length; i++) points[rivals[i].name] = 0;
    return points;
  }

  function menuHelp() {
    var ps = GS.resolvedLayout && GS.resolvedLayout() === 'playstation';
    var south = ps ? 'Cross' : 'A';
    var east = ps ? 'Circle' : 'B';
    var bumpers = ps ? 'L1 / R1' : 'LB / RB';
    return 'Arrows or stick · Enter / ' + south + ' confirms · Esc / ' + east + ' back · ' + bumpers + ' pages';
  }

  function hideScreen() {
    if (screenLayer) screenLayer.classList.remove('show');
  }

  function screenCopyText() {
    return screenCopyEl ? screenCopyEl.textContent : '';
  }

  function paintScreenFocus() {
    if (!screenActionsEl) return;
    var buttons = screenActionsEl.querySelectorAll('button');
    if (buttons.length && (flow.focus < 0 || flow.focus >= buttons.length)) flow.focus = 0;
    var i;
    for (i = 0; i < buttons.length; i++) buttons[i].classList.toggle('focus', i === flow.focus);
  }

  function showScreen(kind, kicker, lines, actions) {
    if (cardUi.open) closeDadCard();
    flow.screen = kind;
    flow.focus = 0;
    flow.actions = actions || [];
    if (!screenLayer) return;
    screenLayer.classList.add('show', 'alive');
    screenLayer.classList.toggle('is-results', kind === 'results');
    screenLayer.classList.toggle('is-cup', kind === 'cup');
    screenLayer.classList.toggle('is-title', kind === 'title');
    screenLayer.classList.toggle('is-howto', kind === 'howto');
    screenLayer.classList.toggle('is-credits', kind === 'credits');
    if (screenArtEl && kind !== 'howto') screenArtEl.innerHTML = '';
    if (screenKickerEl) screenKickerEl.textContent = kicker;
    if (screenCopyEl) {
      screenCopyEl.textContent = '';
      var i;
      for (i = 0; i < lines.length; i++) {
        var line = document.createElement('div');
        line.className = lines[i].cls || 'screenLine';
        line.textContent = lines[i].text;
        screenCopyEl.appendChild(line);
      }
    }
    if (screenActionsEl) {
      screenActionsEl.textContent = '';
      for (i = 0; i < flow.actions.length; i++) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = flow.actions[i].label;
        button.setAttribute('data-i', String(i));
        if (flow.actions[i].disabled) button.classList.add('locked');
        screenActionsEl.appendChild(button);
      }
    }
    if (screenHelpEl) screenHelpEl.textContent = menuHelp();
    paintScreenFocus();
  }

  function moveScreen(dir) {
    var n = flow.actions.length;
    if (!n) return;
    flow.focus = (flow.focus + dir + n) % n;
    paintScreenFocus();
  }

  function activateScreen() {
    if (flow.demo || inputGuarded()) return;
    var action = flow.actions[flow.focus];
    if (!action) return;
    if (action.disabled) {
      if (action.reason && GS.toast) GS.toast(action.reason);
      return;
    }
    action.run();
  }

  function clearField() {
    if (!field) return;
    field.dispose();
    field = null;
  }

  function dropActor(actor) {
    if (!actor) return;
    dropRoot(actor.root);
    if (actor.plate) {
      if (scene) scene.remove(actor.plate);
      if (actor.plate.material) {
        if (actor.plate.material.map) actor.plate.material.map.dispose();
        actor.plate.material.dispose();
      }
    }
  }

  function clearGhost() {
    dropActor(ghostActor);
    dropActor(targetActor);
    ghostActor = null;
    targetActor = null;
  }

  function makeGhost(pack, label, color) {
    if (!pack || !GS.buildCar || !GS.makePlate) return null;
    var built = GS.buildCar({ color: color, ghost: true });
    var actor = {
      root: built.root,
      plate: GS.makePlate(label, hexCss(color)),
      pack: pack
    };
    scene.add(actor.root);
    scene.add(actor.plate);
    return actor;
  }

  function rebuildActors() {
    clearField();
    clearGhost();
    if (!track || !scene || flow.demo) return;
    if ((flow.mode === 'cup' || flow.mode === 'quick') && GS.spawnRivals) {
      field = GS.spawnRivals(track, scene);
    }
    if (flow.mode === 'trial' && GS.save) {
      var pack = GS.save.ghost(track.id);
      if (pack) ghostActor = makeGhost(pack, 'GHOST', 0xb7fff6);
      if (targetGhostEnabled() && GS.save.nextMedal && GS.synthesizeRoadGhost) {
        var medal = GS.save.nextMedal(track.id);
        if (medal) {
          var synth = GS.synthesizeRoadGhost(track, medal.time);
          var tint = MEDAL_TINT[medal.key] || 0xffd35a;
          targetActor = makeGhost(synth, medal.label + ' ' + Number(medal.time).toFixed(1), tint);
          if (targetActor) {
            targetActor.medal = medal.key;
            targetActor.time = medal.time;
          }
        }
      }
    }
  }

  function placeGhost(actor, show) {
    if (!actor || !actor.root) return;
    actor.root.visible = !!show;
    if (actor.plate) actor.plate.visible = !!show;
    if (!show || !GS.ghostPose) return;
    var pose = GS.ghostPose(actor.pack, state.countdown > 0 ? 0 : state.raceTime);
    if (!pose) return;
    actor.root.position.set(pose.x, pose.y, pose.z);
    GS.orientYawRoll(actor.root, pose.yaw, pose.up);
    if (actor.plate) {
      actor.plate.position.set(pose.x, pose.y + (pose.up > 0.5 ? -1.65 : 1.7), pose.z);
    }
  }

  function updateGhost() {
    var show = flow.mode === 'trial' && flow.screen === 'race' && !flow.demo;
    placeGhost(ghostActor, show);
    placeGhost(targetActor, show && targetGhostEnabled());
  }

  function recordGhostSample(force) {
    if (flow.mode !== 'trial' || !car || !track || !GS.packGhostRow) return;
    if (flow.ghostRows.length >= 4000) return;
    if (!force) {
      if (state.countdown > 0) return;
      flow.ghostAcc += FIXED;
      if (flow.ghostRows.length && flow.ghostAcc < 0.1) return;
      flow.ghostAcc = 0;
    }
    flow.ghostRows.push(GS.packGhostRow(
      state.raceTime,
      car.position.x,
      car.position.y,
      car.position.z,
      state.yaw,
      state.upBlend,
      state.gear,
      state.lapsDone,
      state.along,
      track.length
    ));
  }

  function currentRows(asFinished) {
    if (!field) {
      return [{
        name: 'YOU',
        you: true,
        place: 1,
        points: GS.save.pointsFor(1, 1),
        finished: true,
        finishRank: flow.playerRank,
        lapsDone: state.lapsDone,
        along: state.along
      }];
    }
    return field.standings({
      lapsDone: state.lapsDone,
      along: state.along,
      finished: !!asFinished,
      finishRank: asFinished ? flow.playerRank : 0,
      gear: state.gear
    });
  }

  function currentPlace() {
    if (state.finished && flow.handled) return flow.place;
    if (!field) return 1;
    var rows = currentRows(false);
    var i;
    for (i = 0; i < rows.length; i++) if (rows[i].you) return rows[i].place;
    return 1;
  }

  function paintPlace() {
    if (placeEl) {
      if (flow.screen !== 'race') placeEl.hidden = true;
      else {
        placeEl.hidden = false;
        placeEl.textContent = GS.ordinal ? GS.ordinal(currentPlace()) : String(currentPlace());
      }
    }
    if (!deltaEl) return;
    var showDelta = flow.screen === 'race' && flow.mode === 'trial' && ghostActor && state.countdown <= 0;
    if (!showDelta || !GS.ghostDelta) {
      deltaEl.hidden = true;
      return;
    }
    var delta = GS.ghostDelta(ghostActor.pack, state.raceTime, state.lapsDone, state.along, track.length);
    if (delta == null || !isFinite(delta)) {
      deltaEl.hidden = true;
      return;
    }
    deltaEl.hidden = false;
    deltaEl.textContent = (delta <= 0 ? '−' : '+') + Math.abs(delta).toFixed(2);
    deltaEl.classList.toggle('ahead', delta <= 0);
    deltaEl.classList.toggle('behind', delta > 0);
  }

  function rivalSnapshot() {
    if (!field) return [];
    var out = [];
    var i;
    for (i = 0; i < field.list.length; i++) {
      var rival = field.list[i];
      out.push({
        name: rival.profile.name,
        gear: rival.gear,
        mode: rival.mode,
        y: rival.root.position.y,
        minY: rival.minY,
        lapsDone: rival.lapsDone,
        along: rival.along,
        finished: rival.finished,
        speed: rival.speed,
        x: rival.root.position.x,
        z: rival.root.position.z,
        sDist: rival.sDist,
        flipTaken: rival.flipTaken,
        shortcuts: rival.shortcuts,
        shortcutMin: rival.shortcutMin,
        plate: rival.plate ? {
          visible: rival.plate.visible,
          opacity: rival.plate.material ? rival.plate.material.opacity : 0,
          sx: rival.plate.scale.x,
          sy: rival.plate.scale.y,
          dist: rival.plate.userData.dist || 0,
          screenH: rival.plate.userData.screenH || 0
        } : null,
        up: rival.up,
        upY: rival.upY,
        settles: rival.settles || 0,
        bumpLane: rival.bumpLane || 0,
        personality: rival.personality || (rival.profile && rival.profile.personality) || '',
        pace: rival.pace || 0,
        band: rival.band == null ? 1 : rival.band,
        lapTimes: rival.lapTimes || [],
        bestLap: rival.bestLap || 0,
        finishTime: rival.finishTime || 0,
        lane: rival.lane || 0
      });
    }
    return out;
  }

  function pointsForYou(rows) {
    var i;
    for (i = 0; i < rows.length; i++) if (rows[i].you) return rows[i].points;
    return 0;
  }

  function commitPending() {
    if (!flow.pending) return;
    if (!flow.points) flow.points = blankPoints();
    var rows = flow.pending.rows;
    var i;
    for (i = 0; i < rows.length; i++) {
      var name = rows[i].name;
      if (flow.points[name] == null) flow.points[name] = 0;
      flow.points[name] += rows[i].points;
    }
    flow.heats.push({
      track: flow.pending.track,
      name: flow.pending.name,
      place: flow.pending.place,
      points: pointsForYou(rows),
      order: rows.map(function (row) { return row.name; })
    });
    flow.pending = null;
  }

  function pointsTable() {
    var source = flow.points || blankPoints();
    var names = Object.keys(source);
    var rows = [];
    var i;
    for (i = 0; i < names.length; i++) rows.push({ name: names[i], points: source[names[i]] });
    rows.sort(function (a, b) {
      if (b.points !== a.points) return b.points - a.points;
      if (a.name === 'YOU') return -1;
      if (b.name === 'YOU') return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return rows;
  }

  function medalClass(medal) {
    if (medal === 'gold') return 'screenMedal medal-gold';
    if (medal === 'silver') return 'screenMedal medal-silver';
    if (medal === 'bronze') return 'screenMedal medal-bronze';
    return 'screenMedal medal-none';
  }

  // v1.0.2: overpass fade. Flip decks (shortcuts and the Skyway shelf) fade to
  // about 20% while they sit between the camera and the car, or just above the
  // car, then fade back. Each deck gets its own material copy so the fade never
  // touches the gate board or anything else that shares the palette slot.
  var OVERPASS_MIN = 0.2;
  var overpass = { list: [], meshes: [], fade: 1, block: false, ray: null, owner: null };
  var _ovA = null;
  var _ovB = null;
  var _ovC = null;

  function collectOverpass() {
    overpass.list = [];
    overpass.meshes = [];
    overpass.fade = 1;
    overpass.block = false;
    overpass.owner = track;
    if (!track || !track.root) return;
    if (!overpass.ray) {
      overpass.ray = new THREE.Raycaster();
      _ovA = new THREE.Vector3();
      _ovB = new THREE.Vector3();
      _ovC = new THREE.Vector3();
    }
    track.root.traverse(function (o) {
      if (!o.userData || !o.userData.overpass || !o.material) return;
      var src = o.material;
      var mat = src.clone();
      o.material = mat;
      o.renderOrder = 2;
      if (o.geometry && !o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      if (o.computeBoundingSphere) o.computeBoundingSphere();
      overpass.list.push({ mesh: o, src: src, mat: mat, transparent: false });
      overpass.meshes.push(o);
    });
  }

  function rayHits(from, to) {
    _ovB.copy(to).sub(from);
    var len = _ovB.length();
    if (len < 0.05) return false;
    _ovB.multiplyScalar(1 / len);
    overpass.ray.set(from, _ovB);
    overpass.ray.near = 0;
    overpass.ray.far = len;
    return overpass.ray.intersectObjects(overpass.meshes, false).length > 0;
  }

  function overpassBlocks() {
    if (flow.screen !== 'race' && flow.screen !== 'pause') return false;
    // Driving the deck itself (latched or rolling onto it) never fades it.
    if (state.flipLatched || state.upBlend > 0.3) return false;
    _ovA.copy(car.position);
    _ovA.y += 0.6;
    if (rayHits(camera.position, _ovA)) return true;
    readBasis();
    _ovA.copy(car.position).addScaledVector(_fwd, 9);
    _ovA.y += 0.8;
    if (rayHits(camera.position, _ovA)) return true;
    // A deck just above the roof (or a camera inside the slab) also counts.
    _ovA.copy(car.position);
    _ovA.y += 0.4;
    _ovC.copy(car.position);
    _ovC.y += 7.5;
    return rayHits(_ovA, _ovC);
  }

  function updateOverpass(dt) {
    if (overpass.owner !== track) collectOverpass();
    if (!overpass.list.length) return;
    overpass.block = overpassBlocks();
    var target = overpass.block ? OVERPASS_MIN : 1;
    var rate = overpass.block ? 9 : 3.5;
    overpass.fade += (target - overpass.fade) * (1 - Math.exp(-rate * Math.max(dt, 0.001)));
    if (Math.abs(overpass.fade - target) < 0.004) overpass.fade = target;
    var i;
    for (i = 0; i < overpass.list.length; i++) {
      var row = overpass.list[i];
      var mat = row.mat;
      var src = row.src;
      if (src.color) mat.color.copy(src.color);
      if (src.emissive && mat.emissive) mat.emissive.copy(src.emissive);
      // Glow fades with the deck, or a bright warn stripe still reads as a wall.
      if (typeof src.emissiveIntensity === 'number') mat.emissiveIntensity = src.emissiveIntensity * overpass.fade;
      var see = overpass.fade < 0.995;
      if (see !== row.transparent) {
        row.transparent = see;
        mat.transparent = see;
        mat.depthWrite = !see;
        mat.needsUpdate = true;
      }
      mat.opacity = see ? overpass.fade : 1;
    }
  }

  function swapTrack(id) {
    var next = GS.buildTrack(id);
    if (track && track.root) dropRoot(track.root);
    track = next;
    if (scene) scene.add(track.root);
    if (window.__gearshift) {
      window.__gearshift.zones = track.zones;
      window.__gearshift.line = track.line;
    }
  }

  function beginRace() {
    flow.screen = 'race';
    flow.handled = false;
    flow.playerRank = 0;
    flow.place = 1;
    flow.ghostAcc = 0;
    flow.ghostRows = [];
    flow.lastMedal = '';
    flow.gap = null;
    flow.ghostDelta = null;
    state.paused = false;
    hideScreen();
    resetRace();
    rebuildActors();
    syncCoach();
    camSnap = true;
  }

  function startTrial(id) {
    var nid = GS.normalizeTrackId(id);
    if (!GS.save.isOpen(nid)) {
      if (GS.toast) GS.toast(GS.save.lockReason(nid));
      return;
    }
    flow.mode = 'trial';
    flow.pickMode = 'trial';
    flow.cupHeat = 0;
    flow.points = null;
    flow.heats = [];
    flow.pending = null;
    swapTrack(nid);
    beginRace();
  }

  function startQuick(id) {
    var nid = GS.normalizeTrackId(id);
    if (!GS.save.isOpen(nid)) {
      if (GS.toast) GS.toast(GS.save.lockReason(nid));
      return;
    }
    flow.mode = 'quick';
    flow.pickMode = 'quick';
    flow.cupHeat = 0;
    flow.points = null;
    flow.heats = [];
    flow.pending = null;
    swapTrack(nid);
    beginRace();
  }

  function startCup() {
    flow.mode = 'cup';
    flow.pickMode = 'cup';
    flow.cupHeat = 0;
    flow.points = blankPoints();
    flow.heats = [];
    flow.pending = null;
    swapTrack('warmup');
    beginRace();
  }

  function nextHeat() {
    commitPending();
    flow.cupHeat += 1;
    if (flow.cupHeat >= GS.TRACK_IDS.length) {
      finishCup();
      return;
    }
    swapTrack(GS.TRACK_IDS[flow.cupHeat]);
    beginRace();
  }

  function finishCup() {
    commitPending();
    var table = pointsTable();
    var place = 1;
    var i;
    for (i = 0; i < table.length; i++) if (table[i].name === 'YOU') place = i + 1;
    var total = 0;
    var lines = [{ text: place === 1 ? 'YOU WON THE CUP' : 'YOU FINISHED ' + GS.ordinal(place), cls: 'screenBig' }];
    for (i = 0; i < table.length; i++) {
      total += table[i].points;
      lines.push({ text: GS.ordinal(i + 1) + '  ' + table[i].name + '  ' + table[i].points, cls: 'screenLine' });
    }
    lines.push({ text: total + ' POINTS IN THE FIELD', cls: 'screenSub' });
    var h;
    for (h = 0; h < flow.heats.length; h++) {
      lines.push({
        text: 'HEAT ' + (h + 1) + '  ' + flow.heats[h].name + '  ' + GS.ordinal(flow.heats[h].place) + '  +' + flow.heats[h].points,
        cls: 'screenSub'
      });
    }
    rememberCard({
      medal: '',
      place: place,
      trackId: 'cup',
      trackName: 'ARCADE CUP',
      timeLabel: total + ' PTS'
    });
    GS.save.recordCup({
      heats: flow.heats.map(function (heat) {
        return { track: heat.track, name: heat.name, place: heat.place, points: heat.points, order: heat.order };
      }),
      standings: table,
      place: place,
      total: total
    });
    showScreen('cup', 'ARCADE CUP', lines, [
      { label: 'RETRY', run: retryCurrent },
      { label: 'NEXT', disabled: true, reason: 'The cup is finished.' },
      { label: 'MENU', run: openModeMenu },
      { label: 'DAD CARD', run: shareDadCard }
    ]);
    sfx('cup');
  }

  function nextCircuitAction(startFn) {
    var ids = GS.TRACK_IDS;
    var index = ids.indexOf(track.id);
    var nid = index >= 0 && index < ids.length - 1 ? ids[index + 1] : null;
    if (!nid) {
      return { label: 'NEXT', disabled: true, reason: 'This is the last circuit.' };
    }
    var open = GS.save.isOpen(nid);
    return {
      label: 'NEXT',
      disabled: !open,
      reason: open ? '' : GS.save.lockReason(nid),
      run: function () { startFn(nid); }
    };
  }

  function showTrialResults(saved) {
    var medal = saved.medal;
    var lines = [
      { text: track.name, cls: 'screenSub' },
      { text: formatTime(state.raceTime), cls: 'screenBig' },
      { text: medal ? medal.toUpperCase() : 'NO MEDAL', cls: medalClass(medal) }
    ];
    var gap = flow.gap;
    if (gap && gap.beat) lines.push({ text: 'DAD TIME BEATEN', cls: 'screenLine' });
    else if (gap && gap.name) lines.push({ text: gap.need.toFixed(2) + ' s TO ' + gap.name, cls: 'screenLine' });
    if (saved.best) lines.push({ text: 'BEST ' + formatTime(saved.best.time), cls: 'screenSub' });
    if (flow.ghostDelta != null) {
      var sign = flow.ghostDelta <= 0 ? '−' : '+';
      lines.push({ text: 'GHOST ' + sign + Math.abs(flow.ghostDelta).toFixed(2), cls: 'screenSub' });
    }
    if (saved.improved) lines.push({ text: 'NEW BEST — GHOST SAVED', cls: 'screenSub' });
    if (splitUi.bestLap) lines.push({ text: 'BEST LAP ' + formatTime(splitUi.bestLap), cls: 'screenSub' });
    rememberCard({ medal: medal, place: 1 });
    showScreen('results', 'FINISH', lines, [
      { label: 'RETRY', run: retryCurrent },
      nextCircuitAction(startTrial),
      { label: 'MENU', run: openModeMenu },
      { label: 'DAD CARD', run: shareDadCard }
    ]);
    if (medal) sfx('medal');
  }

  function showHeatResults() {
    var rows = flow.pending.rows;
    var lines = [
      { text: track.name, cls: 'screenSub' },
      { text: GS.ordinal(flow.place), cls: 'screenBig' },
      { text: '+' + pointsForYou(rows) + ' THIS HEAT', cls: 'screenLine' }
    ];
    var i;
    for (i = 0; i < rows.length; i++) {
      lines.push({ text: GS.ordinal(rows[i].place) + '  ' + rows[i].name + '  ' + rows[i].points, cls: 'screenSub' });
    }
    rememberCard({ medal: '', place: flow.place });
    showScreen('results', 'HEAT ' + (flow.cupHeat + 1) + ' / 3', lines, [
      { label: 'RETRY', run: retryCurrent },
      { label: 'NEXT', run: nextHeat },
      { label: 'MENU', run: openModeMenu },
      { label: 'DAD CARD', run: shareDadCard }
    ]);
  }

  function showQuickResults() {
    var rows = flow.pending.rows;
    var lines = [
      { text: track.name, cls: 'screenSub' },
      { text: GS.ordinal(flow.place), cls: 'screenBig' },
      { text: '+' + pointsForYou(rows) + ' POINTS', cls: 'screenLine' }
    ];
    var i;
    for (i = 0; i < rows.length; i++) {
      lines.push({ text: GS.ordinal(rows[i].place) + '  ' + rows[i].name, cls: 'screenSub' });
    }
    rememberCard({ medal: '', place: flow.place });
    showScreen('results', 'QUICK RACE', lines, [
      { label: 'RETRY', run: retryCurrent },
      nextCircuitAction(startQuick),
      { label: 'MENU', run: openModeMenu },
      { label: 'DAD CARD', run: shareDadCard }
    ]);
  }

  function onFinish() {
    if (flow.handled) return;
    if (flow.demo) {
      flow.handled = true;
      return;
    }
    flow.handled = true;
    recordGhostSample(true);
    if (field) flow.playerRank = field.claimRank();
    else flow.playerRank = 1;
    var rows = currentRows(true);
    flow.place = 1;
    var i;
    for (i = 0; i < rows.length; i++) if (rows[i].you) flow.place = rows[i].place;
    if (flow.mode === 'trial') {
      var previous = GS.save.ghost(track.id);
      flow.ghostDelta = previous ? state.raceTime - previous.time : null;
      var saved = GS.save.recordTrial(track.id, state.raceTime, flow.ghostRows);
      flow.lastMedal = saved.medal;
      flow.lastTime = state.raceTime;
      flow.improved = saved.improved;
      flow.gap = GS.save.nextGap(state.raceTime, track.id);
      showTrialResults(saved);
      return;
    }
    if (flow.mode === 'quick') {
      GS.save.noteFinish(track.id);
      flow.pending = { track: track.id, name: track.name, rows: rows, place: flow.place };
      showQuickResults();
      return;
    }
    GS.save.noteHeat(flow.cupHeat + 1);
    flow.pending = { track: track.id, name: track.name, rows: rows, place: flow.place };
    if (flow.cupHeat >= 2) finishCup();
    else showHeatResults();
  }

  var HOWTO = [
    {
      kicker: 'STEER',
      body: 'W or the right pedal is gas. S or the brake pedal slows you. A and D, or the left stick, or the left-side wheel, turn the car. Space is the handbrake.',
      art: '<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg"><rect x="110" y="28" width="120" height="64" rx="8" fill="#e15b22"/><rect x="128" y="38" width="84" height="28" fill="#1b2126"/><polygon points="30,60 70,40 70,80" fill="#ffb03a"/><polygon points="270,40 310,60 270,80" fill="#ffb03a"/><rect x="336" y="22" width="70" height="76" rx="8" fill="#ffb03a"/><text x="352" y="68" font-family="Impact,sans-serif" font-size="22" fill="#1a120c">GAS</text></svg>'
    },
    {
      kicker: 'FOUR GEARS',
      body: 'Each gear changes speed, gravity, and color together. 1 Drive is planted. 2 Surge is the night. 3 Drift hangs in the air. 4 Flip is the fast gear, and it can turn gravity over.',
      art: '<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="24" width="90" height="72" fill="#c9842a"/><rect x="116" y="24" width="90" height="72" fill="#ff4ad8"/><rect x="216" y="24" width="90" height="72" fill="#b794ff"/><rect x="316" y="24" width="90" height="72" fill="#7ef0ff"/><text x="38" y="68" font-family="Impact,sans-serif" font-size="28" fill="#1a120c">1</text><text x="138" y="68" font-family="Impact,sans-serif" font-size="28" fill="#1a120c">2</text><text x="238" y="68" font-family="Impact,sans-serif" font-size="28" fill="#1a120c">3</text><text x="338" y="68" font-family="Impact,sans-serif" font-size="28" fill="#041014">4</text></svg>'
    },
    {
      kicker: 'GATES',
      body: 'A chevron gate is a shift prompt. SHIFT UP before the yard jump if you are still in 1 or 2. The prompt leaves once you are through it, or already in the right gear.',
      art: '<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="16" width="16" height="88" fill="#ffb03a"/><rect x="364" y="16" width="16" height="88" fill="#ffb03a"/><rect x="40" y="16" width="340" height="14" fill="#ffb03a"/><polygon points="168,70 210,46 210,62 252,62 252,78 210,78 210,94" fill="#f6f1e7"/></svg>'
    },
    {
      kicker: 'FLIP',
      body: 'Shift to 4 where the FLIP prompt shows and gravity inverts. Every track has a Flip shortcut. Shift down over a road to drop onto it. A Flip in empty air stalls and respawns you.',
      art: '<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="18" width="380" height="16" fill="#7ef0ff"/><rect x="20" y="86" width="380" height="16" fill="#5a4636"/><rect x="176" y="40" width="68" height="28" fill="#e15b22"/><polygon points="150,54 176,40 176,68" fill="#ffb03a"/></svg>'
    },
    {
      kicker: 'MEDALS',
      body: 'Time Trial keeps a ghost of your best finish and pays Bronze, Silver, and Gold. Beat the Dad time for bragging rights. The cup is Warm-Up, then the coast, then the skyway. Points are 9, 6, 4, 3, and 2.',
      art: '<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="58" r="28" fill="#e39b62"/><circle cx="150" cy="58" r="28" fill="#e7e9ef"/><circle cx="230" cy="58" r="28" fill="#ffd35a"/><text x="280" y="52" font-family="Impact,sans-serif" font-size="22" fill="#ffb03a">9 6 4</text><text x="280" y="80" font-family="Impact,sans-serif" font-size="22" fill="#d9c7a4">3 2</text></svg>'
    }
  ];

  function openTitle() {
    flow.demo = false;
    attract.on = false;
    attract.idle = 0;
    state.paused = false;
    if (GS.controller && GS.controller.isOpen && GS.controller.isOpen()) GS.controller.close();
    showScreen('title', 'GEAR SHIFT', [
      { text: 'Shift the gear. Shift the world.', cls: 'screenSub' }
    ], [
      { label: 'PLAY', run: openModeMenu },
      { label: 'HOW TO PLAY', run: function () { openHowTo(); } },
      { label: 'SETTINGS', run: function () { if (GS.controller) GS.controller.open('audio'); } },
      { label: 'CREDITS', run: openCredits }
    ]);
    if (screenHelpEl) {
      screenHelpEl.textContent = 'Click or tap so keys and sound reach the game. ' + menuHelp();
    }
  }

  function closeHowTo() {
    if (flow.howFrom === 'race') {
      flow.screen = 'race';
      state.paused = true;
      hideScreen();
      return;
    }
    if (flow.howFrom === 'menu') openModeMenu();
    else openTitle();
  }

  function showHow(page) {
    if (page < 0) page = 0;
    if (page > HOWTO.length - 1) page = HOWTO.length - 1;
    flow.howPage = page;
    var item = HOWTO[page];
    var last = page >= HOWTO.length - 1;
    showScreen('howto', item.kicker, [
      { text: item.body, cls: 'screenLine' }
    ], [
      { label: page === 0 ? 'BACK' : 'PREV', run: function () {
        if (page === 0) closeHowTo();
        else showHow(page - 1);
      } },
      { label: last ? 'DONE' : 'NEXT', run: function () {
        if (last) closeHowTo();
        else showHow(page + 1);
      } }
    ]);
    if (screenArtEl) screenArtEl.innerHTML = item.art;
    if (screenHelpEl) screenHelpEl.textContent = 'Page ' + (page + 1) + ' / ' + HOWTO.length + '  ·  ' + menuHelp();
    flow.focus = 1;
    paintScreenFocus();
  }

  function openHowTo() {
    flow.howFrom = flow.screen === 'race' ? 'race' : (flow.screen === 'menu' ? 'menu' : 'title');
    showHow(0);
  }

  function closeCredits() {
    if (flow.creditFrom === 'race') {
      flow.screen = 'race';
      state.paused = true;
      hideScreen();
      return;
    }
    if (flow.creditFrom === 'menu') openModeMenu();
    else openTitle();
  }

  function openCredits() {
    flow.creditFrom = flow.screen === 'race' ? 'race' : (flow.screen === 'menu' ? 'menu' : 'title');
    showScreen('credits', 'CREDITS', [
      { text: 'Retro Gaming Dad', cls: 'screenBig' },
      { text: 'Design, direction, testing, and audio', cls: 'screenSub' },
      { text: 'Three.js 0.160.1, MIT, in vendor/.', cls: 'screenLine' },
      { text: 'The car, the three tracks, and the HUD are original code.', cls: 'screenLine' },
      { text: 'Audio: engine, SHUNK, stingers, and the four-layer theme are original Web Audio.', cls: 'screenLine' },
      { text: 'The Gear Shift logo is an original Retro Gaming Dad mark.', cls: 'screenLine' },
      { text: 'AI disclosure: code written with Grok Build and AI assistance, then directed and tested by hand.', cls: 'screenLine' },
      { text: 'Made for Game Off 2026. Theme: Shift.  v' + (GS.VERSION || '1.0.7'), cls: 'screenSub' }
    ], [
      { label: 'BACK', run: closeCredits }
    ]);
  }

  function currentScreenName() {
    if (!renderer) return 'webgl-missing';
    if (GS.controller && GS.controller.isOpen && GS.controller.isOpen()) {
      var which = GS.controller.tab ? GS.controller.tab() : 'controls';
      return 'settings-' + which;
    }
    if (flow.screen === 'race' && state.paused) return 'pause';
    return flow.screen;
  }

  function goScreen(name) {
    var n = String(name || '').toLowerCase();
    if (n === 'title') openTitle();
    else if (n === 'howto' || n === 'how') openHowTo();
    else if (n === 'credits') openCredits();
    else if (n === 'menu' || n === 'modes' || n === 'play') openModeMenu();
    else if (n === 'tracks' || n === 'trial-tracks') openTrackMenu('trial');
    else if (n === 'quick-tracks') openTrackMenu('quick');
    else if (n === 'settings' || n === 'audio' || n === 'video' || n === 'controls') {
      if (GS.controller) GS.controller.open(n === 'settings' ? 'audio' : n);
    } else if (n === 'pause') {
      if (flow.screen === 'race') state.paused = true;
    } else if (n === 'race' || n === 'trial') startTrial(track ? track.id : 'warmup');
    else if (n === 'quick') startQuick(track ? track.id : 'warmup');
    else if (n === 'cup') startCup();
    return currentScreenName();
  }

  function openTrackMenu(mode) {
    flow.pickMode = mode;
    var lines = [];
    var actions = [];
    var ids = GS.TRACK_IDS;
    var i;
    for (i = 0; i < ids.length; i++) {
      (function (id) {
        var info = GS.TRACK_INFO[id];
        var open = GS.save.isOpen(id);
        var best = GS.save.best(id);
        var sub = open ? (info.laps + ' LAPS') : GS.save.lockReason(id);
        if (open && best) {
          sub += ' · BEST ' + formatTime(best.time);
          if (best.medal) sub += ' ' + best.medal.toUpperCase();
        }
        lines.push({ text: info.name + ' — ' + sub, cls: 'screenSub' });
        actions.push({
          label: info.name + (open ? '' : '  LOCKED'),
          disabled: !open,
          reason: GS.save.lockReason(id),
          run: function () {
            if (mode === 'quick') startQuick(id);
            else startTrial(id);
          }
        });
      })(ids[i]);
    }
    actions.push({ label: 'BACK', run: openModeMenu });
    showScreen('tracks', mode === 'quick' ? 'QUICK RACE' : 'TIME TRIAL', lines, actions);
  }

  function openModeMenu() {
    state.paused = false;
    var lines = [{ text: 'Time Trial, Arcade Cup, or one Quick Race.', cls: 'screenSub' }];
    var last = GS.save.lastCup();
    if (last && last.place) lines.push({ text: 'Last cup: ' + GS.ordinal(last.place), cls: 'screenSub' });
    var unlocks = GS.save.unlocks();
    if (!unlocks.coastal) lines.push({ text: 'The coast opens when you finish Warm-Up.', cls: 'screenSub' });
    else if (!unlocks.skyway) lines.push({ text: 'The skyway opens after the coast, or cup heat 2.', cls: 'screenSub' });
    showScreen('menu', 'PLAY', lines, [
      { label: 'TIME TRIAL', run: function () { openTrackMenu('trial'); } },
      { label: 'ARCADE CUP', run: startCup },
      { label: 'QUICK RACE', run: function () { openTrackMenu('quick'); } },
      { label: 'BACK', run: openTitle }
    ]);
  }

  function currentMenuFocus() {
    if (cardUi.open) {
      var cardAction = cardUi.actions[cardUi.focus];
      return cardAction ? 'card:' + cardAction.label : 'card';
    }
    if (GS.controller && GS.controller.focusLabel) {
      var fromUi = GS.controller.focusLabel();
      if (fromUi) return fromUi;
    }
    if (GS.wantsMenuNav && GS.wantsMenuNav()) {
      var action = flow.actions[flow.focus];
      if (action && action.label) return action.label;
    }
    return '';
  }

  function rememberCard(extra) {
    extra = extra || {};
    var when = new Date();
    flow.card = {
      trackId: extra.trackId || (track ? track.id : 'warmup'),
      trackName: extra.trackName || (track ? track.name : 'WARM-UP YARD'),
      time: state.raceTime || 0,
      timeLabel: extra.timeLabel || formatTime(state.raceTime || 0),
      medal: extra.medal || '',
      place: extra.place || flow.place || 1,
      bestLap: splitUi.bestLap || (GS.save && track ? GS.save.bestLap(track.id) : null),
      mode: flow.mode,
      when: when
    };
  }

  function cardSnapshot() {
    if (flow.card) return flow.card;
    return {
      trackId: track ? track.id : 'warmup',
      trackName: track ? track.name : 'WARM-UP YARD',
      time: state.raceTime || 0,
      timeLabel: formatTime(state.raceTime || 0),
      medal: flow.lastMedal || '',
      place: flow.place || 1,
      bestLap: GS.save && track ? GS.save.bestLap(track.id) : null,
      mode: flow.mode || 'trial',
      when: new Date()
    };
  }

  function cardDate(d) {
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    function two(n) { return (n < 10 ? '0' : '') + n; }
    return y + '-' + two(m) + '-' + two(day);
  }

  function cardFileName(card) {
    var id = String(card.trackId || 'gear').toLowerCase().replace(/[^a-z0-9]+/g, '');
    var time = String(card.timeLabel || '0').replace(/[^0-9.]+/g, '-').replace(/^-+|-+$/g, '');
    if (!id) id = 'gear';
    if (!time) time = '0';
    return 'gear-shift-dad-card-' + id + '-' + time + '.png';
  }

  // v1.0.7: the card is drawn only with canvas shapes and text, never with an
  // <img>. Opened from file:// (the launcher), Chrome treats every local file as
  // a separate origin, so drawing the logo SVG "tainted" the canvas and
  // toDataURL threw, leaving the overlay with an empty picture.
  function drawCardLogo(ctx, x, y, w, h) {
    var sx = w / 760;
    var sy = h / 168;
    function poly(pts, color) {
      ctx.beginPath();
      var i;
      for (i = 0; i < pts.length; i += 2) {
        var px = x + pts[i] * sx;
        var py = y + pts[i + 1] * sy;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    poly([10, 16, 52, 84, 10, 152, 32, 152, 74, 84, 32, 16], '#ffb03a');
    poly([46, 16, 88, 84, 46, 152, 68, 152, 110, 84, 68, 16], '#7ef0ff');
    ctx.fillStyle = '#f6f1e7';
    ctx.font = Math.round(104 * sy) + 'px Impact, "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('GEAR SHIFT', x + 132 * sx, y + 116 * sy, 620 * sx);
  }

  function cardCanvasUrl(canvas) {
    try {
      var url = canvas.toDataURL('image/png');
      if (url && url.indexOf('data:image/png') === 0 && url.length > 2000) return url;
    } catch (err) {}
    return '';
  }

  // Last-resort card: plain colours and text on a fresh canvas.
  function paintFallbackCard(card) {
    var canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff4ad8';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#140e0a';
    ctx.fillRect(46, 46, 1108, 538);
    ctx.fillStyle = '#f6f1e7';
    ctx.textAlign = 'left';
    ctx.font = '800 84px sans-serif';
    ctx.fillText('GEAR SHIFT', 88, 168);
    ctx.fillStyle = '#ffb03a';
    ctx.font = '800 28px sans-serif';
    ctx.fillText('Retro Gaming Dad', 88, 230);
    ctx.fillStyle = '#f6f1e7';
    ctx.font = '800 42px sans-serif';
    ctx.fillText(String(card.trackName || ''), 88, 310);
    ctx.fillStyle = '#7ef0ff';
    ctx.font = '800 92px sans-serif';
    ctx.fillText(String(card.timeLabel || ''), 88, 420);
    return cardCanvasUrl(canvas);
  }

  function paintDadCard() {
    var card = cardSnapshot();
    var url = '';
    try {
      url = paintDadCardFull(card);
    } catch (err) {
      url = '';
    }
    cardUi.fallback = !url;
    if (!url) url = paintFallbackCard(card);
    return url;
  }

  function paintDadCardFull(card) {
    var canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    var ctx = canvas.getContext('2d');
    var grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#ffb03a');
    grad.addColorStop(0.34, '#ff4ad8');
    grad.addColorStop(0.67, '#c9b6ff');
    grad.addColorStop(1, '#7ef0ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = 'rgba(12, 10, 8, 0.84)';
    ctx.fillRect(46, 46, 1108, 538);
    ctx.fillStyle = '#ffb03a';
    ctx.fillRect(46, 46, 1108, 10);
    drawCardLogo(ctx, 78, 78, 520, 115);
    ctx.fillStyle = '#ffb03a';
    ctx.font = '800 28px Trebuchet MS, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Retro Gaming Dad', 88, 230);
    ctx.fillStyle = '#f6f1e7';
    ctx.font = '800 42px Impact, Arial Black, sans-serif';
    ctx.fillText(card.trackName, 88, 310);
    ctx.fillStyle = '#7ef0ff';
    ctx.font = '800 92px Impact, Arial Black, sans-serif';
    ctx.fillText(card.timeLabel, 88, 420);
    var medal = card.medal ? String(card.medal).toUpperCase() : '';
    if (medal === 'AUTHOR') medal = 'DAD';
    var placeWord = card.place ? (GS.ordinal ? GS.ordinal(card.place) : String(card.place)) : '';
    var badge = medal || placeWord;
    ctx.fillStyle = medal === 'GOLD' ? '#ffd35a' : (medal === 'SILVER' ? '#e7e9ef' : (medal === 'BRONZE' ? '#e39b62' : '#f6f1e7'));
    ctx.font = '800 36px Trebuchet MS, Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(badge, 1100, 400);
    var lapLine = 'BEST LAP  —';
    if (card.bestLap) lapLine = 'BEST LAP  ' + formatTime(card.bestLap);
    ctx.fillStyle = '#d9c7a4';
    ctx.font = '800 24px Trebuchet MS, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(lapLine, 88, 490);
    ctx.fillText(cardDate(card.when || new Date()), 88, 530);
    ctx.textAlign = 'right';
    ctx.font = '700 18px Trebuchet MS, Segoe UI, sans-serif';
    ctx.fillText('Game Off 2026', 1100, 530);
    return cardCanvasUrl(canvas);
  }

  function downloadCard(dataUrl, filename) {
    // Save through a Blob URL (works on file:// and http); fall back to the data URL.
    var href = dataUrl;
    var objectUrl = '';
    try {
      if (window.URL && URL.createObjectURL) {
        objectUrl = URL.createObjectURL(dataUrlToBlob(dataUrl));
        href = objectUrl;
      }
    } catch (err) {
      objectUrl = '';
      href = dataUrl;
    }
    var link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (objectUrl) {
      setTimeout(function () {
        try { URL.revokeObjectURL(objectUrl); } catch (err) {}
      }, 30000);
    }
  }

  // v1.0.6: DAD CARD opens an in-game overlay (preview, SAVE PNG, COPY IMAGE,
  // SHARE on touch devices only, CLOSE). Saving is always a direct download,
  // so desktop share sheets can never swallow it. Input to the menu below is
  // paused while the overlay is open.
  var cardUi = {
    open: false, focus: 0, actions: [], dataUrl: '', filename: '',
    opens: 0, saves: 0, copies: 0, shares: 0, lastAction: '', toast: '', toastTimer: 0, fallback: false
  };
  var cardLayerEl = null, cardImgEl = null, cardActionsEl = null, cardToastEl = null;

  function cardCanCopy() {
    try {
      return !!(window.isSecureContext && navigator.clipboard && navigator.clipboard.write && window.ClipboardItem);
    } catch (err) {
      return false;
    }
  }

  function cardIsTouch() {
    try {
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
    } catch (err) {}
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  }

  function cardCanShare() {
    var nav = navigator;
    if (!nav.share || !nav.canShare || !cardIsTouch()) return false;
    try {
      var file = new File([new Blob([''], { type: 'image/png' })], 'card.png', { type: 'image/png' });
      return !!nav.canShare({ files: [file] });
    } catch (err) {
      return false;
    }
  }

  function cardToast(message) {
    cardUi.toast = message;
    if (cardToastEl) {
      cardToastEl.textContent = message;
      cardToastEl.hidden = false;
    }
    if (cardUi.toastTimer) clearTimeout(cardUi.toastTimer);
    cardUi.toastTimer = setTimeout(function () {
      if (cardToastEl) cardToastEl.hidden = true;
      cardUi.toastTimer = 0;
    }, 2600);
    if (!cardUi.open && GS.toast) GS.toast(message);
  }

  function paintCardFocus() {
    if (!cardActionsEl) return;
    var buttons = cardActionsEl.querySelectorAll('button');
    if (cardUi.focus < 0 || cardUi.focus >= buttons.length) cardUi.focus = 0;
    var i;
    for (i = 0; i < buttons.length; i++) buttons[i].classList.toggle('focus', i === cardUi.focus);
  }

  function saveCardPng() {
    if (!cardUi.dataUrl) cardUi.dataUrl = paintDadCard();
    if (!cardUi.dataUrl) {
      cardToast('Could not make the card');
      return;
    }
    downloadCard(cardUi.dataUrl, cardUi.filename || 'gear-shift-dad-card.png');
    cardUi.saves += 1;
    cardUi.lastAction = 'save';
    cardToast('Saved to Downloads');
  }

  function copyCardImage() {
    cardUi.lastAction = 'copy';
    if (!cardCanCopy() || !cardUi.dataUrl) {
      cardToast('Copy is not available here. Use SAVE PNG.');
      return;
    }
    try {
      var blob = dataUrlToBlob(cardUi.dataUrl);
      navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]).then(function () {
        cardUi.copies += 1;
        cardToast('Copied to clipboard');
      }, function () {
        cardToast('Copy was blocked. Use SAVE PNG.');
      });
    } catch (err) {
      cardToast('Copy was blocked. Use SAVE PNG.');
    }
  }

  function shareCardFile() {
    cardUi.lastAction = 'share';
    if (!cardUi.dataUrl) return;
    try {
      var file = new File([dataUrlToBlob(cardUi.dataUrl)], cardUi.filename || 'gear-shift-dad-card.png', { type: 'image/png' });
      navigator.share({ files: [file], title: 'Gear Shift', text: 'Dad Card' }).then(function () {
        cardUi.shares += 1;
      }, function () {
        cardToast('Share cancelled. SAVE PNG still works.');
      });
    } catch (err) {
      cardToast('Share is not available. Use SAVE PNG.');
    }
  }

  function buildCardActions() {
    var list = [{ id: 'save', label: 'SAVE PNG', run: saveCardPng }];
    if (cardCanCopy()) list.push({ id: 'copy', label: 'COPY IMAGE', run: copyCardImage });
    if (cardCanShare()) list.push({ id: 'share', label: 'SHARE', run: shareCardFile });
    list.push({ id: 'close', label: 'CLOSE', run: closeDadCard });
    cardUi.actions = list;
    if (!cardActionsEl) return;
    cardActionsEl.textContent = '';
    var i;
    for (i = 0; i < list.length; i++) {
      var button = document.createElement('button');
      button.type = 'button';
      button.tabIndex = -1;
      button.textContent = list[i].label;
      button.setAttribute('data-i', String(i));
      button.setAttribute('data-id', list[i].id);
      cardActionsEl.appendChild(button);
    }
  }

  function openDadCard() {
    if (cardUi.open) return;
    var dataUrl = paintDadCard();
    cardUi.dataUrl = dataUrl;
    cardUi.filename = cardFileName(cardSnapshot());
    buildCardActions();
    cardUi.focus = 0;
    cardUi.open = true;
    cardUi.opens += 1;
    cardUi.lastAction = 'open';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    if (cardImgEl) cardImgEl.src = dataUrl || '';
    if (cardToastEl) cardToastEl.hidden = true;
    if (cardLayerEl) {
      cardLayerEl.classList.add('show');
      cardLayerEl.setAttribute('aria-hidden', 'false');
    }
    paintCardFocus();
    if (!dataUrl) cardToast('Could not make the card');
  }

  function closeDadCard() {
    if (!cardUi.open) return;
    cardUi.open = false;
    cardUi.lastAction = 'close';
    if (cardLayerEl) {
      cardLayerEl.classList.remove('show');
      cardLayerEl.setAttribute('aria-hidden', 'true');
    }
    if (cardImgEl) cardImgEl.removeAttribute('src');
    paintScreenFocus();
  }

  function activateCard() {
    var action = cardUi.actions[cardUi.focus];
    if (action) action.run();
  }

  function handleCardEdges(edges) {
    var i;
    for (i = 0; i < edges.length; i++) {
      var edge = edges[i];
      if (!cardUi.open) return;
      if (edge === 'ui-left' || edge === 'ui-up') {
        cardUi.focus = (cardUi.focus - 1 + cardUi.actions.length) % cardUi.actions.length;
        paintCardFocus();
        sfx('ui');
      } else if (edge === 'ui-right' || edge === 'ui-down') {
        cardUi.focus = (cardUi.focus + 1) % cardUi.actions.length;
        paintCardFocus();
        sfx('ui');
      } else if (edge === 'ui-confirm') {
        sfx('ui');
        activateCard();
      } else if (edge === 'ui-back' || edge === 'pause') {
        sfx('ui');
        closeDadCard();
      } else if (edge === 'mute') {
        if (GS.toggleMute) state.muted = GS.toggleMute();
      }
      // Everything else (restart, track keys, settings, pages) is ignored
      // so the menu underneath cannot move while the card is open.
    }
  }

  function shareDadCard() {
    openDadCard();
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl).split(',');
    var mime = 'image/png';
    var head = parts[0] || '';
    var match = head.match(/data:([^;]+)/);
    if (match) mime = match[1];
    var bin = atob(parts[1] || '');
    var len = bin.length;
    var bytes = new Uint8Array(len);
    var i;
    for (i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function noteRetry() {
    sessionRetries += 1;
  }

  function instantRetry() {
    if (flow.demo) {
      exitAttract();
      return;
    }
    if (flow.screen === 'results' || flow.screen === 'cup') {
      retryCurrent();
      return;
    }
    if (flow.screen !== 'race' || !track) return;
    noteRetry();
    beginRace();
  }

  function screenBack() {
    if (flow.screen === 'howto') closeHowTo();
    else if (flow.screen === 'credits') closeCredits();
    else if (flow.screen === 'tracks') openModeMenu();
    else if (flow.screen === 'menu') openTitle();
    else if (flow.screen === 'results' || flow.screen === 'cup') openModeMenu();
  }

  function retryCurrent() {
    noteRetry();
    if (flow.mode === 'cup' && flow.screen === 'cup') startCup();
    else if (flow.mode === 'cup') beginRace();
    else if (flow.mode === 'quick') beginRace();
    else beginRace();
  }

  function pickTrackEdge(id) {
    var nid = GS.normalizeTrackId(id);
    if (flow.screen === 'cup' || (flow.screen === 'results' && flow.mode === 'cup')) {
      if (GS.toast) GS.toast('The cup stays in order. Use Next, Retry, or Menu.');
      return;
    }
    if (!GS.save.isOpen(nid)) {
      if (GS.toast) GS.toast(GS.save.lockReason(nid));
      return;
    }
    if (flow.pickMode === 'quick' && (flow.screen === 'tracks' || flow.screen === 'results')) startQuick(nid);
    else startTrial(nid);
  }

  function pageScreen(dir) {
    if (flow.screen === 'howto') {
      var next = flow.howPage + dir;
      if (next < 0) next = 0;
      if (next > HOWTO.length - 1) next = HOWTO.length - 1;
      if (next !== flow.howPage) showHow(next);
      return;
    }
    moveScreen(dir);
  }

  function handleMenuEdges(edges) {
    if (flow.demo) {
      exitAttract();
      return;
    }
    if (inputGuarded()) return;
    if (cardUi.open) {
      handleCardEdges(edges);
      return;
    }
    var i;
    for (i = 0; i < edges.length; i++) {
      var edge = edges[i];
      if (edge === 'mute') {
        if (GS.toggleMute) state.muted = GS.toggleMute();
        else state.muted = !state.muted;
      } else if (edge === 'ui-settings') {
        if (GS.controller && GS.controller.open) GS.controller.open();
      } else if (edge === 'ui-up') {
        moveScreen(-1);
        sfx('ui');
      } else if (edge === 'ui-down') {
        moveScreen(1);
        sfx('ui');
      } else if (edge === 'ui-left') {
        if (flow.screen === 'howto') pageScreen(-1);
        else moveScreen(-1);
        sfx('ui');
      } else if (edge === 'ui-right') {
        if (flow.screen === 'howto') pageScreen(1);
        else moveScreen(1);
        sfx('ui');
      } else if (edge === 'ui-page-prev') {
        pageScreen(-1);
        sfx('ui');
      } else if (edge === 'ui-page-next') {
        pageScreen(1);
        sfx('ui');
      } else if (edge === 'ui-confirm') {
        sfx('ui');
        activateScreen();
      } else if (edge === 'ui-back' || edge === 'pause') {
        sfx('ui');
        screenBack();
      }
      else if (edge === 'restart' && (flow.screen === 'results' || flow.screen === 'cup')) retryCurrent();
      else if (edge.indexOf('track:') === 0) pickTrackEdge(edge.slice(6));
    }
  }

  GS.wantsMenuNav = function () {
    return flow.screen === 'title' || flow.screen === 'howto' || flow.screen === 'credits' || flow.screen === 'menu' || flow.screen === 'tracks' || flow.screen === 'results' || flow.screen === 'cup';
  };

  function selectTrack(id) {
    var nid = GS.normalizeTrackId(id);
    var same = !!(track && track.id === nid);
    if (flow.mode === 'cup' && flow.screen === 'race' && !same) {
      if (GS.toast) GS.toast('Finish this heat. The cup stays in order.');
      return;
    }
    if (!same && !GS.save.isOpen(nid)) {
      if (GS.toast) GS.toast(GS.save.lockReason(nid));
      return;
    }
    if (flow.mode === 'cup' && flow.screen === 'race' && same) {
      beginRace();
      return;
    }
    if (flow.mode === 'quick' && (flow.screen === 'race' || flow.screen === 'results')) {
      startQuick(nid);
      return;
    }
    startTrial(nid);
  }

  function blockWebGL() {
    try {
      return new URLSearchParams(window.location.search).get('nowebgl') === '1';
    } catch (err) {
      return false;
    }
  }

  function start() {
    if (blockWebGL()) {
      showFallback('This game needs WebGL, and this browser does not have it.');
      window.__gearshift = {
        webgl: false,
        screen: function () { return 'webgl-missing'; },
        go: function () { return 'webgl-missing'; }
      };
      return;
    }
    if (typeof THREE === 'undefined') {
      showFallback('Three.js did not load. Check that vendor/three.min.js is next to this page.');
      window.__gearshift = {
        webgl: false,
        screen: function () { return 'webgl-missing'; },
        go: function () { return 'webgl-missing'; }
      };
      return;
    }
    var probe = document.createElement('canvas');
    var gl = null;
    try {
      gl = probe.getContext('webgl2') || probe.getContext('webgl');
    } catch (err) {
      gl = null;
    }
    if (!gl) {
      showFallback('This game needs WebGL, and this browser does not have it.');
      window.__gearshift = {
        webgl: false,
        screen: function () { return 'webgl-missing'; },
        go: function () { return 'webgl-missing'; }
      };
      return;
    }

    GS.bootErrors = GS.checkFrame();
    frameEl = document.getElementById('frame');
    speedEl = document.getElementById('speed');
    gearEl = document.getElementById('gear');
    gearNameEl = document.getElementById('gearName');
    gravEl = document.getElementById('gravLine');
    lapEl = document.getElementById('lap');
    timeEl = document.getElementById('time');
    trackNameEl = document.getElementById('trackName');
    pickerEl = document.getElementById('picker');
    msgEl = document.getElementById('msg');
    promptEl = document.getElementById('prompt');
    muteChip = document.getElementById('muteChip');
    pauseLayer = document.getElementById('pauseLayer');
    hintEl = document.getElementById('hint');
    portraitEl = document.getElementById('portrait');
    flashEl = document.getElementById('flash');
    chromaEl = document.getElementById('chroma');
    flipPopEl = document.getElementById('flipPop');
    if (!flipPopEl && frameEl) {
      flipPopEl = document.createElement('div');
      flipPopEl.id = 'flipPop';
      flipPopEl.hidden = true;
      frameEl.appendChild(flipPopEl);
    }
    wipeEl = document.getElementById('wipe');
    wipeBandEl = document.getElementById('wipeBand');
    shiftChromaEl = document.getElementById('shiftChroma');
    if (!wipeEl && frameEl) {
      wipeEl = document.createElement('div');
      wipeEl.id = 'wipe';
      wipeBandEl = document.createElement('div');
      wipeBandEl.id = 'wipeBand';
      wipeEl.appendChild(wipeBandEl);
      frameEl.appendChild(wipeEl);
    }
    if (!shiftChromaEl && frameEl) {
      shiftChromaEl = document.createElement('div');
      shiftChromaEl.id = 'shiftChroma';
      frameEl.appendChild(shiftChromaEl);
    }
    bloomEl = document.getElementById('bloom');
    failEl = document.getElementById('failVeil');
    coachEl = document.getElementById('coach');
    coachKickerEl = document.getElementById('coachKicker');
    coachTitleEl = document.getElementById('coachTitle');
    coachBodyEl = document.getElementById('coachBody');
    gearPipsEl = document.getElementById('gearPips');
    hudEl = document.getElementById('hud');
    splitEl = document.getElementById('split');
    tauntEl = document.getElementById('taunt');
    demoTagEl = document.getElementById('demoTag');
    if (!splitEl && hudEl) {
      splitEl = document.createElement('div');
      splitEl.id = 'split';
      splitEl.hidden = true;
      hudEl.appendChild(splitEl);
    }
    if (!tauntEl && hudEl) {
      tauntEl = document.createElement('div');
      tauntEl.id = 'taunt';
      tauntEl.hidden = true;
      hudEl.appendChild(tauntEl);
    }
    if (!demoTagEl && hudEl) {
      demoTagEl = document.createElement('div');
      demoTagEl.id = 'demoTag';
      demoTagEl.hidden = true;
      demoTagEl.textContent = 'DEMO — press any key';
      hudEl.appendChild(demoTagEl);
    }
    if (demoTagEl && !demoTagEl.textContent) demoTagEl.textContent = 'DEMO — press any key';
    screenLayer = document.getElementById('screenLayer');
    screenKickerEl = document.getElementById('screenKicker');
    screenCopyEl = document.getElementById('screenCopy');
    screenActionsEl = document.getElementById('screenActions');
    cardLayerEl = document.getElementById('cardLayer');
    cardImgEl = document.getElementById('cardImg');
    cardActionsEl = document.getElementById('cardActions');
    cardToastEl = document.getElementById('cardToast');
    if (cardImgEl) {
      cardImgEl.addEventListener('error', function () {
        if (!cardUi.open || cardUi.fallback) return;
        var url = paintFallbackCard(cardSnapshot());
        cardUi.fallback = true;
        if (url) {
          cardUi.dataUrl = url;
          cardImgEl.src = url;
        } else {
          cardToast('Could not make the card');
        }
      });
    }
    if (cardActionsEl) {
      cardActionsEl.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('button') : null;
        if (!button || !cardUi.open) return;
        event.preventDefault();
        event.stopPropagation();
        if (button.blur) button.blur();
        cardUi.focus = Number(button.getAttribute('data-i')) || 0;
        paintCardFocus();
        activateCard();
      });
    }
    if (cardLayerEl) {
      cardLayerEl.addEventListener('click', function (event) {
        if (event.target === cardLayerEl) closeDadCard();
        event.stopPropagation();
      });
    }
    screenHelpEl = document.getElementById('screenHelp');
    screenArtEl = document.getElementById('screenArt');
    mapEl = document.getElementById('minimap');
    soundNudgeEl = document.getElementById('soundNudge');
    GS.openCredits = openCredits;
    GS.touchRace = function () {
      return flow.screen === 'race' && !state.paused && !(GS.controller && GS.controller.isOpen && GS.controller.isOpen());
    };
    placeEl = document.getElementById('place');
    deltaEl = document.getElementById('delta');
    modeLineEl = document.getElementById('modeLine');
    var coachSkipEl = document.getElementById('coachSkip');
    if (coachSkipEl) {
      coachSkipEl.addEventListener('click', function (event) {
        event.stopPropagation();
        skipCoach();
        if (GS.onInteract) GS.onInteract();
      });
    }
    loadCoachFlag();
    if (GS.audio) state.muted = !!GS.audio.settings.muted;
    try {
      var motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
      reduceFlash = !!motionMq.matches;
      var onMotion = function (ev) { reduceFlash = !!(ev && ev.matches); };
      if (motionMq.addEventListener) motionMq.addEventListener('change', onMotion);
      else if (motionMq.addListener) motionMq.addListener(onMotion);
    } catch (err) {
      reduceFlash = false;
    }

    GS.onInteract = function () {
      if (flow.demo) {
        exitAttract();
        return;
      }
      attract.idle = 0;
      state.heardInput = true;
      if (hintEl) hintEl.classList.add('compact');
      if (GS.audio && GS.audio.ensure) GS.audio.ensure();
    };

    GS.onAudioChanged = function () {
      if (GS.audio) state.muted = !!GS.audio.settings.muted;
      if (renderer) layout();
      refreshTargetGhost();
    };

    GS.onPadLost = function () {
      if (flow.screen === 'race' && !state.paused) state.paused = true;
    };

    if (GS.controller && GS.controller.attach) {
      GS.controller.attach({
        isPaused: function () { return flow.screen === 'race' && state.paused; },
        setPaused: function (value) {
          if (flow.screen === 'race') state.paused = !!value;
        },
        restart: function () { selectTrack(track.id); },
        menu: function () { openTitle(); },
        howto: function () { openHowTo(); }
      });
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE[1].sky);
    scene.fog = new THREE.Fog(PALETTE[1].fog, PALETTE[1].near, PALETTE[1].far);
    camera = new THREE.PerspectiveCamera(57, 16 / 9, 0.12, 600);
    camera.position.set(0, 4, 10);
    buildSpeedLines();
    buildParticles();

    var canvas = document.getElementById('c');
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    } catch (err) {
      showFallback('This game needs WebGL, and this browser does not have it.');
      window.__gearshift = {
        webgl: false,
        screen: function () { return 'webgl-missing'; },
        go: function () { return 'webgl-missing'; }
      };
      return;
    }
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(PALETTE[1].sky, 1);

    hemi = new THREE.HemisphereLight(PALETTE[1].hemiSky, PALETTE[1].hemiGround, PALETTE[1].hemiI);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(PALETTE[1].sun, PALETTE[1].sunI);
    sun.position.set(48, 90, 26);
    scene.add(sun);

    var built = GS.buildCar();
    car = built.root;
    car.userData.wheels = built.wheels;
    car.userData.headlamps = built.headlamps;
    car.userData.taillamps = built.taillamps;
    car.userData.bodyMat = built.bodyMat;
    scene.add(car);
    var bootId = trackIdFromLocation();
    swapTrack(bootId);
    resetRace();
    bootCarHeading(GS.bootErrors);
    state.sessionMinY = car.position.y;
    if (pickerEl) {
      pickerEl.addEventListener('click', function (event) {
        if (flow.demo || inputGuarded()) return;
        var button = event.target.closest ? event.target.closest('button') : null;
        if (!button) return;
        selectTrack(button.getAttribute('data-track'));
        if (GS.onInteract) GS.onInteract();
      });
    }
    if (screenActionsEl) {
      screenActionsEl.addEventListener('click', function (event) {
        if (flow.demo || inputGuarded() || cardUi.open) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        var button = event.target.closest ? event.target.closest('button') : null;
        if (!button) return;
        flow.focus = Number(button.getAttribute('data-i')) || 0;
        activateScreen();
        if (GS.onInteract) GS.onInteract();
      });
    }

    shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.7, 18),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    state.palFrom = 1;
    state.palTo = 1;
    state.palU = 1;
    applyPalette();
    if (liveErrors().length) msgEl.textContent = 'FRAME CHECK FAILED';

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && flow.demo) exitAttract();
    });
    window.addEventListener('resize', layout);
    layout();
    var play = '';
    try {
      play = new URLSearchParams(window.location.search).get('play') || '';
    } catch (err) {
      play = '';
    }
    if (play === 'cup') startCup();
    else if (play === 'quick' && GS.save.isOpen(bootId)) startQuick(bootId);
    else if (play === 'trial' && GS.save.isOpen(bootId)) startTrial(bootId);
    else openTitle();
    frame(1 / 60);
    lastNow = performance.now();

    window.__gearshift = {
      getState: getState,
      sample: sampleAhead,
      shift: shift,
      selectTrack: selectTrack,
      guide: function (mode) {
        return track.guide(mode || 'center', car.position.x, car.position.z, state.flipLatched);
      },
      markFloor: function () { state.sessionMinY = car.position.y; },
      forgetAir: function () { state.lastAir = 0; state.lastApex = 0; },
      bootErrors: GS.bootErrors,
      zones: track.zones,
      line: track.line,
      skipTutorial: skipCoach,
      startTrial: startTrial,
      startQuick: startQuick,
      startCup: startCup,
      openMenu: openModeMenu,
      screen: currentScreenName,
      go: goScreen,
      webgl: true,
      press: function (edge) { handleMenuEdges([edge]); },
      audio: function () {
        return GS.audio ? GS.audio.snapshot() : { created: false, state: 'closed' };
      },
      minSep: function () { return field ? field.minSep() : null; },
      signAudit: function () {
        var report = {
          groups: 0, chevrons: 0, arrows: 0, overpassTagged: 0,
          arrowDot: null, chevronDot: null, minAbsSide: null, chevronMinSide: null
        };
        if (!track || !track.root || !track.line) return report;
        var entry = track.line.kind === 'shelf' ? track.line.d0 : track.line.main0;
        var samp = track.sample(entry);
        var arrow = null;
        track.root.updateMatrixWorld(true);
        track.root.traverse(function (obj) {
          if (obj.userData && obj.userData.overpass && (obj.userData.flipSign || obj.name === 'flip-signs' || obj.name === 'flip-chevron' || obj.name === 'flip-arrow')) {
            report.overpassTagged += 1;
          }
          if (obj.name === 'flip-signs') report.groups += 1;
          if (obj.name === 'flip-chevron') {
            report.chevrons += 1;
            var f = new THREE.Vector3(0, 0, -1).applyQuaternion(obj.quaternion);
            var p = new THREE.Vector3();
            obj.getWorldPosition(p);
            var dx = samp.x - p.x;
            var dz = samp.z - p.z;
            var dl = Math.hypot(dx, dz) || 1;
            var dot = f.x * (dx / dl) + f.z * (dz / dl);
            if (report.chevronDot == null || dot < report.chevronDot) report.chevronDot = dot;
            var hit = track.project(p.x, p.z);
            var side = Math.abs(hit.side);
            if (report.chevronMinSide == null || side < report.chevronMinSide) report.chevronMinSide = side;
          }
          if (obj.name === 'flip-arrow') {
            report.arrows += 1;
            arrow = obj;
          }
        });
        if (arrow) {
          var tip = new THREE.Vector3();
          var tail = new THREE.Vector3();
          if (arrow.children[1]) arrow.children[1].getWorldPosition(tip);
          if (arrow.children[0]) arrow.children[0].getWorldPosition(tail);
          var ax = tip.x - tail.x;
          var az = tip.z - tail.z;
          var alen = Math.hypot(ax, az) || 1;
          report.arrowDot = (ax / alen) * samp.tx + (az / alen) * samp.tz;
        }
        return report;
      },
      dadCard: function () { return paintDadCard(); },
      forceSlowFrames: function (seconds) {
        autoQ.forceLeft = Math.max(0, Number(seconds) || 0);
      },
      rollField: function (seconds) {
        if (!field || !track) return 0;
        var left = Math.max(0, Number(seconds) || 0);
        var guard = 0;
        var player = {
          lapsDone: state.lapsDone,
          along: state.along,
          finished: true,
          length: track.length
        };
        while (left > 1e-4 && guard < 400000) {
          var pending = false;
          var i;
          for (i = 0; i < field.list.length; i++) {
            if (!field.list[i].finished) pending = true;
          }
          if (!pending) break;
          var slice = left > (1 / 120) ? (1 / 120) : left;
          field.update(slice, player);
          left -= slice;
          guard += 1;
        }
        return left;
      },
      step: function (seconds) {
        var left = seconds;
        var guard = 0;
        while (left > 1e-6 && guard < 200000) {
          var slice = left > 0.05 ? 0.05 : left;
          frame(slice);
          left -= slice;
          guard += 1;
        }
      }
    };
    GS.selectTrack = selectTrack;

    function loop(now) {
      if (!GS.manualStep) {
        var dt = Math.min(0.05, (now - lastNow) / 1000);
        lastNow = now;
        frame(dt);
      } else {
        lastNow = now;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.GS = window.GS || {});
