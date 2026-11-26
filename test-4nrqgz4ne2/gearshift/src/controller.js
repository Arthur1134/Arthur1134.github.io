/* Controller Settings. Pause menu, F2, and the gear button open it.
   D-pad and the left stick move. South confirms. East goes back.
   Those menu buttons stay fixed when driving actions are remapped. */
(function (GS) {
  'use strict';

  var TAB_ORDER = ['audio', 'video', 'controls'];
  var TAB_ROWS = {
    audio: [
      { type: 'slider', key: 'master', label: 'Master volume', min: 0, max: 100, step: 5, store: 'audio' },
      { type: 'slider', key: 'music', label: 'Music volume', min: 0, max: 100, step: 5, store: 'audio' },
      { type: 'slider', key: 'sfx', label: 'SFX volume', min: 0, max: 100, step: 5, store: 'audio' },
      { type: 'toggle', key: 'muted', label: 'Mute', store: 'audio' },
      { type: 'back', label: 'Back' }
    ],
    video: [
      { type: 'toggle', key: 'shake', label: 'Camera shake', store: 'audio' },
      { type: 'choice', key: 'quality', label: 'Quality', store: 'audio', options: [
        { id: 'low', label: 'Low' },
        { id: 'mid', label: 'Mid' },
        { id: 'high', label: 'High' }
      ] },
      { type: 'toggle', key: 'autoQuality', label: 'Auto quality', store: 'audio' },
      { type: 'toggle', key: 'targetGhost', label: 'Target ghost', store: 'audio' },
      { type: 'choice', key: 'difficulty', label: 'Rivals', store: 'audio', options: [
        { id: 'easy', label: 'Easy' },
        { id: 'normal', label: 'Normal' }
      ] },
      { type: 'toggle', key: 'reducedFlash', label: 'Reduced flash', store: 'audio' },
      { type: 'credits', label: 'Credits' },
      { type: 'back', label: 'Back' }
    ],
    controls: [
      { type: 'layout', label: 'Layout labels' },
      { type: 'action', action: 'accelerate', label: 'Accelerate' },
      { type: 'action', action: 'brake', label: 'Brake / reverse' },
      { type: 'action', action: 'steerLeft', label: 'Steer left' },
      { type: 'action', action: 'steerRight', label: 'Steer right' },
      { type: 'action', action: 'upshift', label: 'Upshift' },
      { type: 'action', action: 'downshift', label: 'Downshift' },
      { type: 'action', action: 'handbrake', label: 'Handbrake' },
      { type: 'action', action: 'pause', label: 'Pause' },
      { type: 'action', action: 'restart', label: 'Restart' },
      { type: 'slider', key: 'steerDeadzone', label: 'Steering deadzone', min: 0, max: 0.45, step: 0.01 },
      { type: 'slider', key: 'steerCurve', label: 'Steering sensitivity', min: 0.55, max: 2.4, step: 0.05 },
      { type: 'slider', key: 'triggerDeadzone', label: 'Trigger deadzone', min: 0, max: 0.4, step: 0.01 },
      { type: 'toggle', key: 'invertPaddles', label: 'Invert shift paddles' },
      { type: 'toggle', key: 'rumble', label: 'Vibration' },
      { type: 'slider', key: 'rumbleStrength', label: 'Vibration strength', min: 0, max: 1, step: 0.05 },
      { type: 'reset', label: 'Reset controls' },
      { type: 'back', label: 'Back' }
    ]
  };
  var tab = 'controls';
  var tabFocus = false;

  function rowList() {
    return TAB_ROWS[tab] || TAB_ROWS.controls;
  }

  function paintTabs() {
    var buttons = document.querySelectorAll('#setTabs button');
    var i;
    for (i = 0; i < buttons.length; i++) {
      var id = buttons[i].getAttribute('data-tab');
      buttons[i].classList.toggle('on', id === tab);
      buttons[i].classList.toggle('focus', tabFocus && id === tab);
    }
    var title = document.getElementById('settingsTitle');
    if (title) title.textContent = 'SETTINGS';
  }

  function cycleTab(dir) {
    var index = TAB_ORDER.indexOf(tab);
    if (index < 0) index = 0;
    tab = TAB_ORDER[(index + dir + TAB_ORDER.length) % TAB_ORDER.length];
    focus = 0;
    column = 0;
    render();
  }

  var settingsOpen = false;
  var rangeLock = false;
  var focus = 0;
  var column = 0;
  var pauseFocus = 0;
  var wasPaused = false;
  var attached = {};
  var lastSig = '';
  var toastTimer = 0;
  var layer = null;
  var listEl = null;
  var warnEl = null;
  var toastEl = null;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function isPaused() {
    return !!(attached.isPaused && attached.isPaused());
  }

  function faceName(which) {
    var ps = GS.resolvedLayout && GS.resolvedLayout() === 'playstation';
    if (which === 'south') return ps ? 'Cross' : 'A';
    if (which === 'east') return ps ? 'Circle' : 'B';
    if (which === 'start') return ps ? 'Options' : 'Start';
    return '';
  }

  function helpLine() {
    return faceName('start') + ' or P resumes · D-pad moves · ' +
      faceName('south') + ' / Enter confirms · ' + faceName('east') + ' / Esc back · LB / RB pages';
  }

  function audioBag() {
    return (GS.audio && GS.audio.settings) || GS.audioSettings || {};
  }

  function rowValue(row) {
    if (!row) return 0;
    if (row.store === 'audio') return audioBag()[row.key];
    return GS.controllerSettings[row.key];
  }

  function formatSetting(row) {
    var key = typeof row === 'string' ? row : row.key;
    var store = typeof row === 'string' ? '' : row.store;
    var value = Number(store === 'audio' ? audioBag()[key] : GS.controllerSettings[key]);
    if (!isFinite(value)) value = 0;
    if (store === 'audio') return Math.round(value) + '%';
    if (key === 'rumbleStrength') return Math.round(value * 100) + '%';
    if (key === 'steerCurve') {
      var word = value < 0.95 ? 'sharp' : value > 1.35 ? 'fine center' : 'linear';
      return value.toFixed(2) + ' · ' + word;
    }
    return value.toFixed(2);
  }

  function buttonName(index) {
    var names = GS.resolvedLayout && GS.resolvedLayout() === 'playstation'
      ? ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right']
      : ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right'];
    if (names[index]) return names[index];
    return 'Button ' + index;
  }

  GS.toast = function (message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.hidden = true;
      toastTimer = 0;
    }, 2600);
  };

  function paintPause() {
    var buttons = document.querySelectorAll('#pauseActions button');
    var i;
    for (i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('focus', isPaused() && !settingsOpen && i === pauseFocus);
    }
    var help = document.getElementById('pauseHelp');
    if (help) help.textContent = helpLine();
  }

  function setBar(id, value, centered) {
    var el = document.getElementById(id);
    if (!el) return;
    var amount = Number(value);
    if (!isFinite(amount)) amount = 0;
    if (centered) {
      amount = clamp(amount, -1, 1);
      el.style.left = (amount < 0 ? 50 + amount * 50 : 50) + '%';
      el.style.width = Math.abs(amount) * 50 + '%';
    } else {
      amount = clamp(amount, 0, 1);
      el.style.left = '0';
      el.style.width = amount * 100 + '%';
    }
  }

  function updateTest() {
    var mon = GS.padMonitor;
    var lx = document.getElementById('valLX');
    var ly = document.getElementById('valLY');
    var lt = document.getElementById('valLT');
    var rt = document.getElementById('valRT');
    var buttons = document.getElementById('testButtons');
    var steer = document.getElementById('testSteer');
    var title = document.getElementById('padTitle');
    if (lx) lx.textContent = mon.lx.toFixed(2);
    if (ly) ly.textContent = mon.ly.toFixed(2);
    if (lt) lt.textContent = mon.lt.toFixed(2);
    if (rt) rt.textContent = mon.rt.toFixed(2);
    setBar('barLX', mon.lx, true);
    setBar('barLY', mon.ly, true);
    setBar('barLT', mon.lt, false);
    setBar('barRT', mon.rt, false);
    if (buttons) {
      if (!mon.connected) buttons.textContent = 'Buttons: no controller';
      else if (!mon.pressed.length) buttons.textContent = 'Buttons: none';
      else {
        var names = [];
        var i;
        for (i = 0; i < mon.pressed.length; i++) names.push(buttonName(mon.pressed[i]));
        buttons.textContent = 'Buttons: ' + names.join(', ');
      }
    }
    if (steer) steer.textContent = 'Steer out ' + (mon.steerOut || 0).toFixed(2);
    if (title) {
      title.textContent = mon.connected
        ? mon.name + ' · ' + (GS.controllerSettings.layout === 'auto' ? 'Auto ' : '') + (GS.resolvedLayout() === 'playstation' ? 'PlayStation' : 'Xbox') + ' labels'
        : 'No controller · keyboard still works';
    }
    var warn = document.getElementById('bindWarn');
    if (warn && warn.textContent !== (GS.bindingMessage || '')) warn.textContent = GS.bindingMessage || '';
  }

  function chipText(action, device) {
    if (GS.capture && GS.capture.action === action && GS.capture.device === device) return 'Press…';
    if (device === 'pad') return GS.describePad(action);
    return GS.describeKeys(action);
  }

  function render() {
    if (!listEl) return;
    var html = '';
    var i;
    for (i = 0; i < rowList().length; i++) {
      var row = rowList()[i];
      var hot = i === focus ? ' focus' : '';
      if (row.type === 'heading') {
        html += '<div class="setRow heading' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices"></span></div>';
      } else if (row.type === 'layout') {
        var layout = GS.controllerSettings.layout;
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices">' +
          choice('auto', 'Auto', layout) + choice('xbox', 'Xbox', layout) + choice('playstation', 'PlayStation', layout) +
          '</span></div>';
      } else if (row.type === 'choice') {
        var current = String(rowValue(row) || '');
        var chips = '';
        var oi;
        for (oi = 0; oi < row.options.length; oi++) {
          chips += choice(row.options[oi].id, row.options[oi].label, current);
        }
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices">' + chips + '</span></div>';
      } else if (row.type === 'action') {
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices">' +
          '<button type="button" data-chip="0" class="chip' + (i === focus && column === 0 ? ' hot' : '') + '">' + chipText(row.action, 'pad') + '</button>' +
          '<button type="button" data-chip="1" class="chip' + (i === focus && column === 1 ? ' hot' : '') + '">' + chipText(row.action, 'key') + '</button>' +
          '</span></div>';
      } else if (row.type === 'slider') {
        var value = rowValue(row);
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices slide">' +
          '<input type="range" data-key="' + row.key + '" data-store="' + (row.store || '') + '" min="' + row.min + '" max="' + row.max + '" step="' + row.step + '" value="' + value + '">' +
          '<b class="val">' + formatSetting(row) + '</b></span></div>';
      } else if (row.type === 'toggle') {
        var on = !!rowValue(row);
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices">' +
          '<button type="button" class="chip' + (on ? ' on' : '') + '">' + (on ? 'On' : 'Off') + '</button></span></div>';
      } else {
        html += '<div class="setRow' + hot + '" data-row="' + i + '"><span>' + row.label + '</span><span class="choices">' +
          '<button type="button" class="chip">Select</button></span></div>';
      }
    }
    listEl.innerHTML = html;
    var note = document.getElementById('invertNote');
    if (note) {
      note.hidden = !GS.controllerSettings.invertPaddles;
    }
    var focused = listEl.querySelector('.setRow.focus');
    if (focused && focused.scrollIntoView) focused.scrollIntoView({ block: 'nearest' });
    updateTest();
    var settingsHelp = document.getElementById('settingsHelp');
    if (settingsHelp) settingsHelp.textContent = helpLine();
    var test = document.getElementById('padTest');
    if (test) test.hidden = tab !== 'controls';
    paintTabs();
    lastSig = signature();
  }

  function choice(id, label, current) {
    return '<button type="button" data-layout="' + id + '" class="chip' + (current === id ? ' on' : '') + '">' + label + '</button>';
  }

  function signature() {
    var mon = GS.padMonitor;
    return mon.lastDevice + '|' + mon.connected + '|' + mon.name + '|' +
      (GS.resolvedLayout ? GS.resolvedLayout() : '') + '|' + (GS.capture ? GS.capture.action + GS.capture.device : '');
  }

  function move(dir) {
    if (GS.capture) return;
    focus = (focus + dir + rowList().length) % rowList().length;
    column = 0;
    render();
  }

  function cycleLayout(dir) {
    var order = ['auto', 'xbox', 'playstation'];
    var index = order.indexOf(GS.controllerSettings.layout);
    if (index < 0) index = 0;
    var next = order[(index + dir + order.length) % order.length];
    GS.setControllerFlag('layout', next);
  }

  function tickUi() {
    if (GS.audio && GS.audio.play) GS.audio.play('ui');
  }

  function setToggle(row, value) {
    if (row.store === 'audio' && GS.setAudioFlag) GS.setAudioFlag(row.key, value);
    else GS.setControllerFlag(row.key, value);
  }

  function cycleChoice(row, dir) {
    var opts = row.options || [];
    if (!opts.length) return;
    var cur = String(rowValue(row) || opts[0].id);
    var index = 0;
    var i;
    for (i = 0; i < opts.length; i++) if (opts[i].id === cur) index = i;
    var next = opts[(index + dir + opts.length) % opts.length].id;
    if (row.store === 'audio' && GS.setAudioFlag) GS.setAudioFlag(row.key, next);
  }

  function nudgeSlider(dir) {
    var row = rowList()[focus];
    var current = Number(rowValue(row));
    var steps = Math.round((current - row.min) / row.step);
    var next = row.min + (steps + dir) * row.step;
    next = clamp(next, row.min, row.max);
    next = Math.round(next * 1000) / 1000;
    if (row.store === 'audio' && GS.setAudioNumber) GS.setAudioNumber(row.key, next);
    else GS.setControllerNumber(row.key, next);
    render();
  }

  function nudge(dir) {
    var row = rowList()[focus];
    if (!row || GS.capture) return;
    if (row.type === 'layout') cycleLayout(dir);
    else if (row.type === 'choice') {
      cycleChoice(row, dir);
      tickUi();
    } else if (row.type === 'slider') nudgeSlider(dir);
    else if (row.type === 'toggle') {
      setToggle(row, !rowValue(row));
      tickUi();
    } else if (row.type === 'action') {
      column = dir < 0 ? 0 : 1;
      render();
    }
  }

  function activate() {
    var row = rowList()[focus];
    if (!row) return;
    if (row.type === 'heading') return;
    if (row.type === 'layout') cycleLayout(1);
    else if (row.type === 'choice') {
      cycleChoice(row, 1);
      tickUi();
    } else if (row.type === 'action') GS.startCapture(column === 1 ? 'key' : 'pad', row.action);
    else if (row.type === 'slider') nudgeSlider(1);
    else if (row.type === 'toggle') {
      setToggle(row, !rowValue(row));
      tickUi();
    } else if (row.type === 'reset') GS.resetControllerSettings();
    else if (row.type === 'credits') {
      closeSettings();
      if (GS.openCredits) GS.openCredits();
    } else if (row.type === 'back') closeSettings();
  }

  function pauseButtons() {
    return document.querySelectorAll('#pauseActions button');
  }

  function movePause(dir) {
    var n = pauseButtons().length || 1;
    pauseFocus = (pauseFocus + dir + n) % n;
    paintPause();
  }

  function resume() {
    if (attached.setPaused) attached.setPaused(false);
  }

  function activatePause() {
    var buttons = pauseButtons();
    var button = buttons[pauseFocus];
    var action = button ? button.getAttribute('data-pause') : 'resume';
    if (action === 'controller') openSettings('controls');
    else if (action === 'audio' || action === 'settings') openSettings('audio');
    else if (action === 'howto') {
      if (attached.howto) attached.howto();
    } else if (action === 'restart') {
      if (attached.restart) attached.restart();
    } else if (action === 'menu') {
      if (attached.menu) attached.menu();
    } else resume();
  }

  function openSettings(startRow) {
    settingsOpen = true;
    tabFocus = false;
    if (startRow === 'audio' || startRow === 'video' || startRow === 'controls') tab = startRow;
    else if (typeof startRow === 'number' && startRow >= 14) tab = 'audio';
    else if (startRow == null) tab = 'controls';
    focus = 0;
    if (typeof startRow === 'number' && startRow < 14) {
      focus = clamp(startRow | 0, 0, rowList().length - 1);
    }
    column = 0;
    if (GS.capture) GS.cancelCapture();
    if (attached.setPaused) attached.setPaused(true);
    if (layer) layer.classList.add('show');
    render();
    paintPause();
  }

  function closeSettings() {
    settingsOpen = false;
    if (GS.capture) GS.cancelCapture();
    if (layer) layer.classList.remove('show');
    pauseFocus = 0;
    paintPause();
    var canvas = document.getElementById('c');
    if (canvas && canvas.focus) canvas.focus();
  }

  function handleUi(edge) {
    if (edge === 'ui-settings') {
      if (settingsOpen) closeSettings();
      else openSettings();
      return;
    }
    if (settingsOpen) {
      if (edge === 'ui-up') {
        if (!tabFocus && focus === 0) {
          tabFocus = true;
          render();
        } else if (!tabFocus) move(-1);
      } else if (edge === 'ui-down') {
        if (tabFocus) {
          tabFocus = false;
          focus = 0;
          render();
        } else move(1);
      } else if (edge === 'ui-left') {
        if (tabFocus) cycleTab(-1);
        else nudge(-1);
      } else if (edge === 'ui-right') {
        if (tabFocus) cycleTab(1);
        else nudge(1);
      } else if (edge === 'ui-confirm') {
        if (tabFocus) {
          tabFocus = false;
          render();
        } else activate();
      } else if (edge === 'ui-back') {
        if (GS.capture) GS.cancelCapture();
        else closeSettings();
      } else if (edge === 'ui-page-prev') cycleTab(-1);
      else if (edge === 'ui-page-next') cycleTab(1);
      return;
    }
    if (isPaused()) {
      if (edge === 'ui-up' || edge === 'ui-left') movePause(-1);
      else if (edge === 'ui-down' || edge === 'ui-right') movePause(1);
      else if (edge === 'ui-confirm') activatePause();
      else if (edge === 'ui-back' || edge === 'pause') resume();
    }
  }

  function bind() {
    layer = document.getElementById('settingsLayer');
    listEl = document.getElementById('settingsList');
    warnEl = document.getElementById('bindWarn');
    toastEl = document.getElementById('toast');
    if (GS.flushToasts) GS.flushToasts();
    var tabs = document.getElementById('setTabs');
    if (tabs) {
      tabs.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('[data-tab]') : null;
        if (!button) return;
        tab = button.getAttribute('data-tab') || 'audio';
        if (!TAB_ROWS[tab]) tab = 'audio';
        tabFocus = false;
        focus = 0;
        column = 0;
        if (!settingsOpen) openSettings(tab);
        else render();
        if (GS.onInteract) GS.onInteract();
      });
    }
    var gear = document.getElementById('gearBtn');
    if (gear) {
      gear.addEventListener('click', function () {
        if (settingsOpen) closeSettings();
        else openSettings();
        if (GS.onInteract) GS.onInteract();
      });
    }
    var pauseButtons = document.querySelectorAll('#pauseActions button');
    var i;
    for (i = 0; i < pauseButtons.length; i++) {
      pauseButtons[i].addEventListener('click', function (event) {
        var button = event.currentTarget;
        var buttons = document.querySelectorAll('#pauseActions button');
        var n;
        for (n = 0; n < buttons.length; n++) {
          if (buttons[n] === button) pauseFocus = n;
        }
        activatePause();
        if (GS.onInteract) GS.onInteract();
      });
    }
    if (listEl) {
      listEl.addEventListener('click', function (event) {
        var layoutBtn = event.target.closest ? event.target.closest('[data-layout]') : null;
        var rowEl = event.target.closest ? event.target.closest('[data-row]') : null;
        if (!rowEl) return;
        focus = Number(rowEl.getAttribute('data-row'));
        if (layoutBtn) {
          var row = rowList()[focus];
          if (row && row.type === 'choice' && row.store === 'audio' && GS.setAudioFlag) {
            GS.setAudioFlag(row.key, layoutBtn.getAttribute('data-layout'));
            tickUi();
          } else {
            GS.setControllerFlag('layout', layoutBtn.getAttribute('data-layout'));
          }
          return;
        }
        var chip = event.target.closest ? event.target.closest('[data-chip]') : null;
        if (chip) column = Number(chip.getAttribute('data-chip')) || 0;
        if (rowList()[focus] && rowList()[focus].type === 'slider') return;
        activate();
      });
      listEl.addEventListener('input', function (event) {
        var input = event.target;
        if (!input || input.type !== 'range' || rangeLock) return;
        var key = input.getAttribute('data-key');
        var store = input.getAttribute('data-store');
        rangeLock = true;
        try {
          if (store === 'audio' && GS.setAudioNumber) GS.setAudioNumber(key, Number(input.value));
          else GS.setControllerNumber(key, Number(input.value));
          var rows = rowList();
          var row = null;
          var ri;
          for (ri = 0; ri < rows.length; ri++) if (rows[ri].key === key) row = rows[ri];
          var shown = row ? Number(rowValue(row)) : Number(input.value);
          if (isFinite(shown) && Math.abs(Number(input.value) - shown) > 0.001) input.value = String(shown);
          var val = input.parentNode && input.parentNode.querySelector('.val');
          if (val) val.textContent = formatSetting(row || key);
        } finally {
          rangeLock = false;
        }
      });
    }
    GS.onBindingsChanged = function () {
      if (rangeLock) return;
      if (settingsOpen) render();
      else paintPause();
    };
    paintPause();
  }

  GS.controller = {
    wantsNav: function () {
      if (settingsOpen || isPaused()) return true;
      return !!(GS.wantsMenuNav && GS.wantsMenuNav());
    },
    isSettingsOpen: function () {
      return settingsOpen;
    },
    isOpen: function () {
      return settingsOpen;
    },
    tab: function () {
      return tab;
    },
    filterEdges: function (list) {
      var race = [];
      var seen = {};
      var i;
      for (i = 0; i < list.length; i++) {
        var edge = list[i];
        if (edge.indexOf('ui-') === 0) {
          if (seen[edge]) continue;
          seen[edge] = 1;
          handleUi(edge);
          continue;
        }
        if (settingsOpen) {
          if (edge === 'pause') {
            closeSettings();
            continue;
          }
          if (edge === 'up' || edge === 'down' || edge === 'restart' || edge.indexOf('track:') === 0) continue;
        }
        race.push(edge);
      }
      return race;
    },
    attach: function (api) {
      attached = api || {};
      if (settingsOpen && attached.setPaused) attached.setPaused(true);
    },
    tick: function () {
      var paused = isPaused();
      if (paused && !wasPaused && !settingsOpen) pauseFocus = 0;
      wasPaused = paused;
      paintPause();
      if (!settingsOpen) return;
      var sig = signature();
      if (sig !== lastSig) render();
      else updateTest();
    },
    open: openSettings,
    close: closeSettings,
    focusLabel: function () {
      if (settingsOpen) {
        if (tabFocus) {
          if (tab === 'video') return 'Video';
          if (tab === 'controls') return 'Controls';
          return 'Audio';
        }
        var row = rowList()[focus];
        if (!row) return 'settings';
        return row.label || row.action || 'settings';
      }
      if (isPaused()) {
        var buttons = pauseButtons();
        var button = buttons[pauseFocus];
        return button ? (button.textContent || 'pause') : 'pause';
      }
      return '';
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})(window.GS = window.GS || {});
