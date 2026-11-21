/* Keyboard defaults stay as in the design doc. The gamepad uses the
   Standard Gamepad map: RT accel, LT brake, left stick steer, RB upshift,
   LB downshift, South handbrake, Start pause, Back restart. D-pad steers
   too, unless those buttons are already bound. Poll reads navigator.getGamepads
   every frame so a test can stand in for a physical pad. */
(function (GS) {
  'use strict';

  var SAVE_KEY = 'gearshift_v1';

  var PAD_DEFAULTS = {
    accelerate: { kind: 'button', index: 7 },
    brake: { kind: 'button', index: 6 },
    steerLeft: { kind: 'axis', index: 0, sign: -1 },
    steerRight: { kind: 'axis', index: 0, sign: 1 },
    upshift: { kind: 'button', index: 5 },
    downshift: { kind: 'button', index: 4 },
    handbrake: { kind: 'button', index: 0 },
    pause: { kind: 'button', index: 9 },
    restart: { kind: 'button', index: 8 }
  };

  var KEY_DEFAULTS = {
    accelerate: ['KeyW', 'ArrowUp'],
    brake: ['KeyS', 'ArrowDown'],
    steerLeft: ['KeyA', 'ArrowLeft'],
    steerRight: ['KeyD', 'ArrowRight'],
    upshift: ['ShiftRight', 'KeyE', 'KeyX'],
    downshift: ['ShiftLeft', 'KeyQ', 'KeyZ'],
    handbrake: ['Space'],
    pause: ['KeyP', 'Escape'],
    restart: ['KeyR']
  };

  var ACTIONS = [
    'accelerate', 'brake', 'steerLeft', 'steerRight',
    'upshift', 'downshift', 'handbrake', 'pause', 'restart'
  ];

  var EDGE_ACTIONS = ['upshift', 'downshift', 'pause', 'restart'];

  var XBOX_BUTTONS = [
    'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
    'Back', 'Start', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right'
  ];
  var PS_BUTTONS = [
    'Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2',
    'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right'
  ];

  var KEY_NAMES = {
    Space: 'Space',
    Escape: 'Esc',
    Enter: 'Enter',
    ShiftLeft: 'L-Shift',
    ShiftRight: 'R-Shift',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    KeyP: 'P'
  };

  var PROMPT_KEY = {
    accelerate: 'KeyW',
    brake: 'KeyS',
    steerLeft: 'KeyA',
    steerRight: 'KeyD',
    upshift: 'KeyE',
    downshift: 'KeyQ',
    handbrake: 'Space',
    pause: 'KeyP',
    restart: 'KeyR'
  };

  var RESERVED_KEYS = {
    Escape: 1,
    F2: 1,
    KeyM: 1,
    Digit1: 1,
    Digit2: 1,
    Digit3: 1,
    Numpad1: 1,
    Numpad2: 1,
    Numpad3: 1
  };

  function clonePad(src) {
    var out = {};
    var i;
    for (i = 0; i < ACTIONS.length; i++) {
      var name = ACTIONS[i];
      var item = src[name];
      out[name] = { kind: item.kind, index: item.index, sign: item.sign < 0 ? -1 : 1 };
    }
    return out;
  }

  function cloneKeys(src) {
    var out = {};
    var i;
    for (i = 0; i < ACTIONS.length; i++) out[ACTIONS[i]] = src[ACTIONS[i]].slice();
    return out;
  }

  var settings = {
    pad: clonePad(PAD_DEFAULTS),
    keys: cloneKeys(KEY_DEFAULTS),
    steerDeadzone: 0.14,
    steerCurve: 1.25,
    triggerDeadzone: 0.08,
    invertPaddles: false,
    rumble: true,
    rumbleStrength: 0.7,
    layout: 'auto'
  };

  var down = new Set();
  var edges = [];
  var seenPads = {};
  var hadAnyPad = false;
  var activeIndex = -1;
  var prevButtons = [];
  var prevAxes = [];
  var prevAction = {};
  var navNext = { up: 0, down: 0, left: 0, right: 0 };
  var navArmed = false;
  var skipNav = false;
  var toastQueue = [];
  var warnedActuator = false;

  GS.input = { accel: 0, brake: 0, steer: 0, handbrake: false };
  GS.controllerSettings = settings;
  GS.capture = null;
  GS.bindingMessage = '';

  GS.padMonitor = {
    connected: false,
    name: '',
    id: '',
    detected: 'xbox',
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    lt: 0,
    rt: 0,
    steerOut: 0,
    pressed: [],
    lastDevice: 'keyboard'
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function pushEdge(name) {
    edges.push(name);
  }

  GS.consumeEdges = function () {
    var out = edges.slice();
    edges.length = 0;
    return out;
  };

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

  function num(value, fallback, min, max) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return clamp(n, min, max);
  }

  function validPadBinding(item) {
    if (!item || (item.kind !== 'button' && item.kind !== 'axis')) return null;
    var index = Number(item.index);
    if (!isFinite(index) || index < 0 || index > 31) return null;
    return {
      kind: item.kind,
      index: Math.floor(index),
      sign: Number(item.sign) < 0 ? -1 : 1
    };
  }

  function validKeyList(list, fallback) {
    if (!Array.isArray(list) || !list.length) return fallback.slice();
    var out = [];
    var i;
    for (i = 0; i < list.length && out.length < 4; i++) {
      if (typeof list[i] === 'string' && list[i] && !RESERVED_KEYS[list[i]]) out.push(list[i]);
    }
    return out.length ? out : fallback.slice();
  }

  function loadSettings() {
    var data = readSave();
    var block = data.settings && data.settings.controller;
    if (!block || typeof block !== 'object' || Array.isArray(block)) return;
    settings.steerDeadzone = num(block.steerDeadzone, settings.steerDeadzone, 0, 0.45);
    settings.steerCurve = num(block.steerCurve, settings.steerCurve, 0.55, 2.4);
    settings.triggerDeadzone = num(block.triggerDeadzone, settings.triggerDeadzone, 0, 0.4);
    settings.invertPaddles = !!block.invertPaddles;
    if (typeof block.rumble === 'boolean') settings.rumble = block.rumble;
    settings.rumbleStrength = num(block.rumbleStrength, settings.rumbleStrength, 0, 1);
    if (block.layout === 'xbox' || block.layout === 'playstation' || block.layout === 'auto') {
      settings.layout = block.layout;
    }
    var i;
    if (block.pad && typeof block.pad === 'object') {
      for (i = 0; i < ACTIONS.length; i++) {
        var padItem = validPadBinding(block.pad[ACTIONS[i]]);
        if (padItem) settings.pad[ACTIONS[i]] = padItem;
      }
    }
    if (block.keys && typeof block.keys === 'object') {
      for (i = 0; i < ACTIONS.length; i++) {
        settings.keys[ACTIONS[i]] = validKeyList(block.keys[ACTIONS[i]], KEY_DEFAULTS[ACTIONS[i]]);
      }
    }
  }

  function exportBlock(prev) {
    var block = prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {};
    block.steerDeadzone = settings.steerDeadzone;
    block.steerCurve = settings.steerCurve;
    block.triggerDeadzone = settings.triggerDeadzone;
    block.invertPaddles = settings.invertPaddles;
    block.rumble = settings.rumble;
    block.rumbleStrength = settings.rumbleStrength;
    block.layout = settings.layout;
    block.pad = clonePad(settings.pad);
    block.keys = cloneKeys(settings.keys);
    return block;
  }

  function saveSettings() {
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
    var ok = writer(function (data) {
      if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
        data.settings = {};
      }
      data.settings.controller = exportBlock(data.settings.controller);
    });
    if (ok === false) GS.bindingMessage = 'Could not save settings in this browser.';
  }

  GS.saveControllerSettings = saveSettings;

  function notify() {
    if (GS.onBindingsChanged) GS.onBindingsChanged();
  }

  function setMessage(text) {
    GS.bindingMessage = text || '';
    notify();
  }

  GS.setControllerNumber = function (name, value) {
    if (name === 'steerDeadzone') settings.steerDeadzone = num(value, settings.steerDeadzone, 0, 0.45);
    else if (name === 'steerCurve') settings.steerCurve = num(value, settings.steerCurve, 0.55, 2.4);
    else if (name === 'triggerDeadzone') settings.triggerDeadzone = num(value, settings.triggerDeadzone, 0, 0.4);
    else if (name === 'rumbleStrength') settings.rumbleStrength = num(value, settings.rumbleStrength, 0, 1);
    else return;
    saveSettings();
  };

  GS.setControllerFlag = function (name, value) {
    if (name === 'invertPaddles') settings.invertPaddles = !!value;
    else if (name === 'rumble') settings.rumble = !!value;
    else if (name === 'layout' && (value === 'auto' || value === 'xbox' || value === 'playstation')) {
      settings.layout = value;
    } else return;
    saveSettings();
    notify();
  };

  GS.resetControllerSettings = function () {
    settings.pad = clonePad(PAD_DEFAULTS);
    settings.keys = cloneKeys(KEY_DEFAULTS);
    settings.steerDeadzone = 0.14;
    settings.steerCurve = 1.25;
    settings.triggerDeadzone = 0.08;
    settings.invertPaddles = false;
    settings.rumble = true;
    settings.rumbleStrength = 0.7;
    settings.layout = 'auto';
    GS.capture = null;
    saveSettings();
    setMessage('Defaults restored.');
  };

  function samePadBinding(a, b) {
    if (!a || !b || a.kind !== b.kind || a.index !== b.index) return false;
    if (a.kind === 'axis' && (a.sign || 1) !== (b.sign || 1)) return false;
    return true;
  }

  function padOwner(binding, except) {
    var i;
    for (i = 0; i < ACTIONS.length; i++) {
      if (ACTIONS[i] === except) continue;
      if (samePadBinding(settings.pad[ACTIONS[i]], binding)) return ACTIONS[i];
    }
    return '';
  }

  function keyOwner(code, except) {
    var i;
    var j;
    for (i = 0; i < ACTIONS.length; i++) {
      if (ACTIONS[i] === except) continue;
      var list = settings.keys[ACTIONS[i]];
      for (j = 0; j < list.length; j++) {
        if (list[j] === code) return ACTIONS[i];
      }
    }
    return '';
  }

  GS.startCapture = function (device, action) {
    if (ACTIONS.indexOf(action) < 0) return;
    if (device !== 'pad' && device !== 'key') return;
    GS.capture = { device: device, action: action, primed: false };
    setMessage(device === 'key' ? 'Press a key.' : 'Press a button or move a stick.');
  };

  GS.cancelCapture = function () {
    if (!GS.capture) return;
    GS.capture = null;
    setMessage('Remap cancelled.');
  };

  function finishCapture(device, binding) {
    if (!GS.capture || GS.capture.device !== device) return;
    var action = GS.capture.action;
    if (device === 'key') {
      if (RESERVED_KEYS[binding.code]) {
        setMessage(prettyKey(binding.code) + ' stays reserved.');
        return;
      }
      var keyHit = keyOwner(binding.code, action);
      if (keyHit) {
        setMessage(prettyKey(binding.code) + ' is already ' + actionTitle(keyHit) + '.');
        return;
      }
      settings.keys[action] = [binding.code];
    } else {
      var padHit = padOwner(binding, action);
      if (padHit) {
        setMessage(describePad(binding) + ' is already ' + actionTitle(padHit) + '.');
        return;
      }
      settings.pad[action] = {
        kind: binding.kind,
        index: binding.index,
        sign: binding.sign || 1
      };
    }
    GS.capture = null;
    navArmed = false;
    saveSettings();
    setMessage(actionTitle(action) + ' updated.');
  }

  function actionTitle(action) {
    var names = {
      accelerate: 'Accelerate',
      brake: 'Brake',
      steerLeft: 'Steer left',
      steerRight: 'Steer right',
      upshift: 'Upshift',
      downshift: 'Downshift',
      handbrake: 'Handbrake',
      pause: 'Pause',
      restart: 'Restart'
    };
    return names[action] || action;
  }

  GS.actionTitle = actionTitle;

  function detectLayout(id) {
    var text = String(id || '').toLowerCase();
    if (/playstation|dualshock|dualsense|sony|vendor:\s*054c/.test(text)) return 'playstation';
    return 'xbox';
  }

  GS.resolvedLayout = function () {
    if (settings.layout === 'xbox' || settings.layout === 'playstation') return settings.layout;
    return GS.padMonitor.detected || 'xbox';
  };

  function buttonNames() {
    return GS.resolvedLayout() === 'playstation' ? PS_BUTTONS : XBOX_BUTTONS;
  }

  function prettyKey(code) {
    if (!code) return '';
    if (KEY_NAMES[code]) return KEY_NAMES[code];
    if (code.indexOf('Key') === 0 && code.length === 4) return code.slice(3);
    if (code.indexOf('Digit') === 0) return code.slice(5);
    if (code.indexOf('Numpad') === 0) return 'Num ' + code.slice(6);
    return code;
  }

  GS.prettyKey = prettyKey;

  function describePad(binding) {
    if (!binding) return '—';
    var names = buttonNames();
    var stick = GS.resolvedLayout() === 'playstation' ? ['L', 'L', 'R', 'R'] : ['LS', 'LS', 'RS', 'RS'];
    if (binding.kind === 'button') {
      if (names[binding.index]) return names[binding.index];
      return 'Button ' + binding.index;
    }
    var axis = binding.index;
    var sign = binding.sign < 0 ? -1 : 1;
    if (axis === 0) return stick[0] + (sign < 0 ? ' Left' : ' Right');
    if (axis === 1) return stick[1] + (sign < 0 ? ' Up' : ' Down');
    if (axis === 2) return stick[2] + (sign < 0 ? ' Left' : ' Right');
    if (axis === 3) return stick[3] + (sign < 0 ? ' Up' : ' Down');
    if (axis === 4 || axis === 5) {
      var trigger = GS.resolvedLayout() === 'playstation'
        ? ['L2', 'R2']
        : ['LT', 'RT'];
      return trigger[axis === 4 ? 0 : 1];
    }
    return 'Axis ' + axis;
  }

  GS.describePad = function (action) {
    return describePad(settings.pad[action]);
  };

  function labelSource(action) {
    if (settings.invertPaddles && action === 'upshift') return 'downshift';
    if (settings.invertPaddles && action === 'downshift') return 'upshift';
    return action;
  }

  GS.describeKeys = function (action) {
    var list = settings.keys[action] || [];
    if (!list.length) return '—';
    var parts = [];
    var i;
    for (i = 0; i < list.length; i++) parts.push(prettyKey(list[i]));
    return parts.join(' / ');
  };

  function promptKey(action) {
    var list = settings.keys[action] || [];
    var prefer = PROMPT_KEY[action];
    if (prefer && list.indexOf(prefer) >= 0) return prettyKey(prefer);
    return list.length ? prettyKey(list[0]) : '';
  }

  GS.actionLabel = function (action) {
    var source = labelSource(action);
    if (GS.padMonitor.lastDevice === 'gamepad' && GS.padMonitor.connected) {
      return describePad(settings.pad[source]);
    }
    return promptKey(source);
  };

  function steerWords() {
    var left = settings.pad.steerLeft;
    var right = settings.pad.steerRight;
    if (left && right && left.kind === 'axis' && right.kind === 'axis' && left.index === right.index && left.index === 0) {
      return GS.resolvedLayout() === 'playstation' ? 'L-stick' : 'LS';
    }
    return GS.describePad('steerLeft') + ' ' + GS.describePad('steerRight');
  }

  GS.hintLine = function (compact) {
    var accel = GS.actionLabel('accelerate');
    var brake = GS.actionLabel('brake');
    var hand = GS.actionLabel('handbrake');
    var pause = GS.actionLabel('pause');
    var restart = GS.actionLabel('restart');
    var line;
    if (GS.padMonitor.lastDevice === 'gamepad' && GS.padMonitor.connected) {
      line = accel + ' accel · ' + brake + ' brake · ' + steerWords() + ' steer · ' +
        GS.actionLabel('downshift') + ' / ' + GS.actionLabel('upshift') + ' shift · ' +
        hand + ' handbrake · ' + pause + ' pause · ' + restart + ' restart';
    } else {
      line = accel + ' accel · ' + brake + ' brake · ' +
        GS.actionLabel('steerLeft') + ' ' + GS.actionLabel('steerRight') + ' steer · ' +
        GS.actionLabel('downshift') + ' ' + GS.actionLabel('upshift') + ' shift · ' +
        hand + ' handbrake · ' + pause + ' pause · ' + restart + ' restart';
    }
    if (compact) return line + ' · F2 settings';
    return 'Click the game so the keys reach it. ' + line +
      '. Tracks: 1 Warm-Up Yard · 2 Coastal Switchback · 3 Skyway Split. F2 opens settings.';
  };

  function effectivePad(action) {
    var name = action;
    if (settings.invertPaddles) {
      if (action === 'upshift') name = 'downshift';
      else if (action === 'downshift') name = 'upshift';
    }
    return settings.pad[name];
  }

  function padUsesButton(index) {
    var i;
    for (i = 0; i < ACTIONS.length; i++) {
      var stored = settings.pad[ACTIONS[i]];
      var used = effectivePad(ACTIONS[i]);
      if (stored && stored.kind === 'button' && stored.index === index) return true;
      if (used && used.kind === 'button' && used.index === index) return true;
    }
    return false;
  }

  function toast(message) {
    if (GS.toast) GS.toast(message);
    else toastQueue.push(message);
  }

  GS.flushToasts = function () {
    if (!GS.toast) return;
    var i;
    for (i = 0; i < toastQueue.length; i++) GS.toast(toastQueue[i]);
    toastQueue.length = 0;
  };

  function friendlyName(pad) {
    var id = pad && pad.id ? String(pad.id) : '';
    var cut = id.replace(/\s*\(.*$/, '').trim();
    var layout = detectLayout(id);
    if (!cut) return layout === 'playstation' ? 'PlayStation Controller' : 'Gamepad';
    if (/^wireless controller$/i.test(cut) && layout === 'playstation') return 'PlayStation Controller';
    return cut;
  }

  function listGamepads() {
    var out = [];
    var raw = null;
    try {
      if (navigator.getGamepads) raw = navigator.getGamepads();
    } catch (err) {
      raw = null;
    }
    if (!raw) return out;
    var i;
    for (i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i].connected !== false) {
        if (typeof raw[i].index !== 'number') raw[i].index = i;
        out.push(raw[i]);
      }
    }
    return out;
  }

  function syncConnections(pads) {
    var now = {};
    var added = [];
    var i;
    for (i = 0; i < pads.length; i++) {
      var pad = pads[i];
      var key = String(pad.index);
      var id = pad.id || key;
      now[key] = id;
      if (seenPads[key] !== id) added.push(pad);
    }
    var removed = false;
    var old;
    for (old in seenPads) {
      if (Object.prototype.hasOwnProperty.call(seenPads, old) && !now[old]) removed = true;
    }
    seenPads = now;
    if (added.length) {
      var last = added[added.length - 1];
      toast('Controller connected: ' + friendlyName(last));
    } else if (removed && !pads.length && hadAnyPad) {
      toast('Controller disconnected');
      GS.padMonitor.lastDevice = 'keyboard';
      if (GS.onPadLost) GS.onPadLost();
    }
    hadAnyPad = pads.length > 0 || hadAnyPad;
    if (!pads.length) hadAnyPad = false;
  }

  function pickPad(pads) {
    var i;
    for (i = 0; i < pads.length; i++) {
      if (pads[i].index === activeIndex) return pads[i];
    }
    return pads.length ? pads[0] : null;
  }

  function axisOf(pad, index) {
    if (!pad || !pad.axes || index < 0 || index >= pad.axes.length) return 0;
    var value = Number(pad.axes[index]);
    return isFinite(value) ? value : 0;
  }

  function buttonOf(pad, index) {
    if (!pad || !pad.buttons || index < 0 || index >= pad.buttons.length) return 0;
    var button = pad.buttons[index];
    if (typeof button === 'number') return button > 0 ? button : 0;
    if (!button) return 0;
    if (typeof button.value === 'number' && isFinite(button.value)) return clamp(button.value, 0, 1);
    return button.pressed ? 1 : 0;
  }

  function buttonDown(pad, index) {
    if (!pad || !pad.buttons || !pad.buttons[index]) return false;
    var button = pad.buttons[index];
    if (typeof button === 'number') return button > 0.45;
    if (button.pressed) return true;
    return typeof button.value === 'number' && button.value > 0.45;
  }

  function rescale(raw, dead) {
    if (raw <= dead) return 0;
    if (dead >= 0.99) return 1;
    return clamp((raw - dead) / (1 - dead), 0, 1);
  }

  function applyDeadzone(value, dead) {
    var amount = Math.abs(value);
    if (amount <= dead) return 0;
    if (dead >= 0.99) return value < 0 ? -1 : 1;
    return (value < 0 ? -1 : 1) * clamp((amount - dead) / (1 - dead), 0, 1);
  }

  function curveSteer(value) {
    var amount = Math.abs(value);
    if (amount <= 0) return 0;
    var curved = Math.pow(amount, settings.steerCurve);
    return (value < 0 ? -1 : 1) * clamp(curved, 0, 1);
  }

  function amountFrom(pad, binding) {
    if (!pad || !binding) return 0;
    if (binding.kind === 'button') return rescale(buttonOf(pad, binding.index), settings.triggerDeadzone);
    var signed = axisOf(pad, binding.index) * (binding.sign < 0 ? -1 : 1);
    if (signed <= 0) return 0;
    return rescale(signed, settings.triggerDeadzone);
  }

  function steerFrom(pad, binding, direction) {
    if (!pad || !binding) return 0;
    if (binding.kind === 'button') return buttonDown(pad, binding.index) ? direction : 0;
    var shaped = curveSteer(applyDeadzone(axisOf(pad, binding.index), settings.steerDeadzone));
    var along = shaped * (binding.sign < 0 ? -1 : 1);
    if (along <= 0) return 0;
    return direction * along;
  }

  function pickLarger(a, b) {
    return Math.abs(a) >= Math.abs(b) ? a : b;
  }

  function keyHeld(action) {
    var list = settings.keys[action] || [];
    var i;
    for (i = 0; i < list.length; i++) {
      if (down.has(list[i])) return true;
    }
    return false;
  }

  function controlDown(pad, binding) {
    if (!binding) return false;
    if (binding.kind === 'button') return buttonDown(pad, binding.index);
    var signed = axisOf(pad, binding.index) * (binding.sign < 0 ? -1 : 1);
    return signed > 0.62;
  }

  function readLevels(pad) {
    var accel = keyHeld('accelerate') ? 1 : 0;
    var brake = keyHeld('brake') ? 1 : 0;
    var steer = (keyHeld('steerRight') ? 1 : 0) - (keyHeld('steerLeft') ? 1 : 0);
    var hand = keyHeld('handbrake');
    if (pad) {
      accel = Math.max(accel, amountFrom(pad, effectivePad('accelerate')));
      brake = Math.max(brake, amountFrom(pad, effectivePad('brake')));
      var stick = steerFrom(pad, settings.pad.steerLeft, -1) + steerFrom(pad, settings.pad.steerRight, 1);
      if (!padUsesButton(14) && buttonDown(pad, 14)) stick = pickLarger(stick, -1);
      if (!padUsesButton(15) && buttonDown(pad, 15)) stick = pickLarger(stick, 1);
      steer = pickLarger(steer, clamp(stick, -1, 1));
      hand = hand || controlDown(pad, effectivePad('handbrake'));
    }
    var touch = GS.touchState;
    if (touch && touch.enabled) {
      accel = Math.max(accel, touch.accel || 0);
      brake = Math.max(brake, touch.brake || 0);
      if (touch.steerHeld) steer = pickLarger(steer, touch.steer || 0);
      hand = hand || touch.handbrake;
    }
    GS.input.accel = clamp(accel, 0, 1);
    GS.input.brake = clamp(brake, 0, 1);
    GS.input.steer = clamp(steer, -1, 1);
    GS.input.handbrake = !!hand;
    GS.padMonitor.steerOut = GS.input.steer;
  }

  function updateMonitor(pad) {
    if (!pad) {
      GS.padMonitor.connected = false;
      GS.padMonitor.name = '';
      GS.padMonitor.id = '';
      GS.padMonitor.lx = 0;
      GS.padMonitor.ly = 0;
      GS.padMonitor.rx = 0;
      GS.padMonitor.ry = 0;
      GS.padMonitor.lt = 0;
      GS.padMonitor.rt = 0;
      GS.padMonitor.pressed = [];
      return;
    }
    GS.padMonitor.connected = true;
    GS.padMonitor.name = friendlyName(pad);
    GS.padMonitor.id = pad.id || '';
    GS.padMonitor.detected = detectLayout(pad.id || '');
    GS.padMonitor.lx = axisOf(pad, 0);
    GS.padMonitor.ly = axisOf(pad, 1);
    GS.padMonitor.rx = axisOf(pad, 2);
    GS.padMonitor.ry = axisOf(pad, 3);
    GS.padMonitor.lt = buttonOf(pad, 6);
    GS.padMonitor.rt = buttonOf(pad, 7);
    var pressed = [];
    var i;
    var count = pad.buttons ? pad.buttons.length : 0;
    for (i = 0; i < count; i++) {
      if (buttonDown(pad, i)) pressed.push(i);
    }
    GS.padMonitor.pressed = pressed;
  }

  function notePadActivity(pad) {
    if (!pad) return;
    var active = false;
    var i;
    if (Math.abs(axisOf(pad, 0)) > 0.28 || Math.abs(axisOf(pad, 1)) > 0.28) active = true;
    var count = pad.buttons ? pad.buttons.length : 0;
    for (i = 0; i < count; i++) {
      if (buttonDown(pad, i) || buttonOf(pad, i) > 0.28) active = true;
    }
    if (!active) return;
    GS.padMonitor.lastDevice = 'gamepad';
    if (GS.onInteract) GS.onInteract();
  }

  function considerNav(name, held) {
    if (!held) {
      navNext[name] = 0;
      return;
    }
    var now = performance.now();
    if (!navNext[name] || now >= navNext[name]) {
      pushEdge('ui-' + name);
      navNext[name] = now + (navNext[name] ? 150 : 260);
    }
  }

  function menuNav(pad) {
    if (GS.capture) return;
    var arrows = down.has('ArrowUp') || down.has('ArrowDown') || down.has('ArrowLeft') || down.has('ArrowRight');
    var tilt = !!(pad && (Math.abs(axisOf(pad, 0)) > 0.5 || Math.abs(axisOf(pad, 1)) > 0.5));
    var dpad = !!(pad && (buttonDown(pad, 12) || buttonDown(pad, 13) || buttonDown(pad, 14) || buttonDown(pad, 15)));
    // A stick still held from driving must not scroll the menu until it recenters.
    if (!navArmed) {
      if (!arrows && !tilt && !dpad) navArmed = true;
      return;
    }
    var up = down.has('ArrowUp');
    var downKey = down.has('ArrowDown');
    var left = down.has('ArrowLeft');
    var right = down.has('ArrowRight');
    if (pad) {
      up = up || buttonDown(pad, 12) || axisOf(pad, 1) < -0.55;
      downKey = downKey || buttonDown(pad, 13) || axisOf(pad, 1) > 0.55;
      left = left || buttonDown(pad, 14) || axisOf(pad, 0) < -0.55;
      right = right || buttonDown(pad, 15) || axisOf(pad, 0) > 0.55;
    }
    considerNav('up', up);
    considerNav('down', downKey);
    considerNav('left', left);
    considerNav('right', right);
  }

  function emitPadEdges(pad) {
    var i;
    if (!pad) {
      for (i = 0; i < EDGE_ACTIONS.length; i++) prevAction[EDGE_ACTIONS[i]] = false;
      return;
    }
    for (i = 0; i < EDGE_ACTIONS.length; i++) {
      var action = EDGE_ACTIONS[i];
      var held = controlDown(pad, effectivePad(action));
      if (held && !prevAction[action]) {
        if (action === 'upshift') pushEdge('up');
        else if (action === 'downshift') pushEdge('down');
        else pushEdge(action);
      }
      prevAction[action] = held;
    }
    if (buttonDown(pad, 0) && !prevButtons[0]) pushEdge('ui-confirm');
    if (buttonDown(pad, 1) && !prevButtons[1]) pushEdge('ui-back');
  }

  function seedActions(pad) {
    var i;
    prevAction = {};
    for (i = 0; i < EDGE_ACTIONS.length; i++) {
      prevAction[EDGE_ACTIONS[i]] = !!(pad && controlDown(pad, effectivePad(EDGE_ACTIONS[i])));
    }
  }

  function rememberPad(pad) {
    var i;
    prevButtons = [];
    prevAxes = [];
    if (!pad) return;
    var count = pad.buttons ? pad.buttons.length : 0;
    for (i = 0; i < count; i++) prevButtons[i] = buttonDown(pad, i);
    count = pad.axes ? pad.axes.length : 0;
    for (i = 0; i < count; i++) prevAxes[i] = axisOf(pad, i);
  }

  function scanCapture(pad) {
    var capture = GS.capture;
    if (!capture || capture.device !== 'pad') return;
    if (!pad) return;
    var i;
    var count = pad.buttons ? pad.buttons.length : 0;
    var anyHeld = false;
    for (i = 0; i < count; i++) {
      if (buttonDown(pad, i)) anyHeld = true;
      if (buttonDown(pad, i) && !prevButtons[i]) {
        if (i === 1) {
          GS.cancelCapture();
          rememberPad(pad);
          skipNav = true;
          return;
        }
        if (!capture.primed && i === 0) continue;
        finishCapture('pad', { kind: 'button', index: i, sign: 1 });
        rememberPad(pad);
        skipNav = true;
        return;
      }
    }
    count = pad.axes ? pad.axes.length : 0;
    var settled = !anyHeld;
    for (i = 0; i < count; i++) {
      var value = axisOf(pad, i);
      if (Math.abs(value) > 0.4) settled = false;
      var prev = prevAxes[i] || 0;
      if (capture.primed && Math.abs(value) > 0.62 && Math.abs(prev) <= 0.62) {
        finishCapture('pad', { kind: 'axis', index: i, sign: value < 0 ? -1 : 1 });
        rememberPad(pad);
        skipNav = true;
        return;
      }
    }
    if (!capture.primed && settled) capture.primed = true;
  }

  GS.pollInput = function () {
    skipNav = false;
    var pads = listGamepads();
    syncConnections(pads);
    var pad = pickPad(pads);
    if (!pad) activeIndex = -1;
    else if (pad.index !== activeIndex) {
      activeIndex = pad.index;
      rememberPad(pad);
      seedActions(pad);
    }
    updateMonitor(pad);
    if (GS.capture && GS.capture.device === 'pad') scanCapture(pad);
    else emitPadEdges(pad);
    if (!skipNav && GS.controller && GS.controller.wantsNav && GS.controller.wantsNav()) menuNav(pad);
    else {
      navArmed = false;
      navNext.up = 0;
      navNext.down = 0;
      navNext.left = 0;
      navNext.right = 0;
    }
    readLevels(pad);
    notePadActivity(pad);
    rememberPad(pad);
  };

  function readLevelsOnly() {
    var pads = listGamepads();
    readLevels(pickPad(pads));
  }

  GS.rumble = function (kind, amount) {
    if (!settings.rumble) return;
    var pads;
    var pad = null;
    try {
      pads = listGamepads();
      pad = pickPad(pads);
    } catch (err) {
      return;
    }
    if (!pad) return;
    var actuator = null;
    try {
      actuator = pad.vibrationActuator || null;
    } catch (err) {
      return;
    }
    if (!actuator || typeof actuator.playEffect !== 'function') return;
    var strength = clamp(settings.rumbleStrength, 0, 1);
    if (strength <= 0) return;
    var scale = clamp(amount == null ? 1 : amount, 0, 1);
    var duration = 100;
    var strong = 0.45;
    var weak = 0.25;
    if (kind === 'shift') {
      duration = 120;
      strong = 0.55;
      weak = 0.32;
    } else if (kind === 'land') {
      duration = 110;
      strong = 0.35 + 0.55 * scale;
      weak = 0.2 + 0.25 * scale;
    } else if (kind === 'wall') {
      duration = 70;
      strong = 0.5 + 0.45 * scale;
      weak = 0.16;
    } else if (kind === 'flip') {
      duration = 180;
      strong = 0.8;
      weak = 0.5;
    }
    strong = clamp(strong * strength, 0, 1);
    weak = clamp(weak * strength, 0, 1);
    try {
      var pending = actuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: duration,
        weakMagnitude: weak,
        strongMagnitude: strong
      });
      if (pending && typeof pending.then === 'function') pending.then(function () {}, function () {});
    } catch (err) {
      if (!warnedActuator) warnedActuator = true;
    }
  };

  function wantsMenuKey(code) {
    return GS.controller && GS.controller.wantsNav && GS.controller.wantsNav() &&
      (code === 'ArrowUp' || code === 'ArrowDown' || code === 'ArrowLeft' || code === 'ArrowRight' ||
        code === 'Enter' || code === 'Space' || code === 'Escape');
  }

  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'Escape' || e.code === 'F2') {
      e.preventDefault();
    }
    if (GS.capture && GS.capture.device === 'key') {
      e.preventDefault();
      if (e.repeat) return;
      if (e.code === 'Escape' || e.code === 'F2') {
        GS.cancelCapture();
        return;
      }
      finishCapture('key', { code: e.code });
      return;
    }
    if (e.repeat) return;
    down.add(e.code);
    GS.padMonitor.lastDevice = 'keyboard';
    if (e.code === 'F2') pushEdge('ui-settings');
    else if (wantsMenuKey(e.code) && (e.code === 'Enter' || e.code === 'Space')) pushEdge('ui-confirm');
    else if (e.code === 'Escape' && wantsMenuKey(e.code) && GS.controller.isSettingsOpen && GS.controller.isSettingsOpen()) {
      pushEdge('ui-back');
    } else if (e.code === 'Escape' && GS.wantsMenuNav && GS.wantsMenuNav()) {
      pushEdge('ui-back');
    } else if (e.code === 'Escape' || settings.keys.pause.indexOf(e.code) >= 0) pushEdge('pause');
    else if (e.code === 'KeyM') pushEdge('mute');
    else if (e.code === 'Digit1' || e.code === 'Numpad1') pushEdge('track:warmup');
    else if (e.code === 'Digit2' || e.code === 'Numpad2') pushEdge('track:coastal');
    else if (e.code === 'Digit3' || e.code === 'Numpad3') pushEdge('track:skyway');
    else if (settings.keys.restart.indexOf(e.code) >= 0) pushEdge('restart');
    else if (settings.keys.upshift.indexOf(e.code) >= 0) pushEdge(settings.invertPaddles ? 'down' : 'up');
    else if (settings.keys.downshift.indexOf(e.code) >= 0) pushEdge(settings.invertPaddles ? 'up' : 'down');
    readLevelsOnly();
    if (GS.onInteract) GS.onInteract();
  });

  window.addEventListener('keyup', function (e) {
    down.delete(e.code);
    readLevelsOnly();
  });

  window.addEventListener('blur', function () {
    down.clear();
    readLevelsOnly();
  });

  window.addEventListener('pointerdown', function () {
    if (GS.onInteract) GS.onInteract();
  });

  GS.pushEdge = pushEdge;

  loadSettings();
  readLevels(null);
})(window.GS = window.GS || {});
