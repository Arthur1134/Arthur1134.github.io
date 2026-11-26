/* Touch driving for phones. A mouse on a desktop does not see these
   controls. A coarse pointer shows them, and so does the first touch.
   Portrait and landscape each have a thumb layout. Several fingers can
   steer, accelerate, and shift together. The first tap starts audio. */
(function (GS) {
  'use strict';

  var enabled = false;
  var pointers = {};
  var layer = null;
  var steerZone = null;
  var puck = null;
  var hint = null;
  var state = {
    enabled: false,
    accel: 0,
    brake: 0,
    steer: 0,
    steerHeld: false,
    handbrake: false
  };
  var prevShift = { up: false, down: false, pause: false };

  GS.touchState = state;

  function coarseDevice() {
    try {
      return window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches;
    } catch (err) {
      return false;
    }
  }

  function queryTouch() {
    try {
      return new URLSearchParams(window.location.search).get('touch') === '1';
    } catch (err) {
      return false;
    }
  }

  function portraitNow() {
    return window.innerHeight > window.innerWidth * 1.05;
  }

  function raceShowing() {
    if (!GS.touchRace) return false;
    return !!GS.touchRace();
  }

  function zero() {
    pointers = {};
    state.accel = 0;
    state.brake = 0;
    state.steer = 0;
    state.steerHeld = false;
    state.handbrake = false;
    prevShift.up = false;
    prevShift.down = false;
    prevShift.pause = false;
    if (puck) {
      puck.style.left = '50%';
      puck.style.top = '58%';
    }
  }

  function sync() {
    var live = enabled && raceShowing();
    if (layer) {
      layer.classList.toggle('show', live);
      layer.classList.toggle('portrait', portraitNow());
      layer.hidden = !live;
      if (hint) hint.hidden = !portraitNow();
    }
    var frame = document.getElementById('frame');
    if (frame) {
      frame.classList.toggle('touch-on', live);
      frame.classList.toggle('touch-portrait', live && portraitNow());
    }
    state.enabled = !!live;
    if (!live) zero();
  }

  function show() {
    if (enabled) {
      sync();
      return;
    }
    enabled = true;
    document.documentElement.classList.add('touch-ui');
    sync();
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (err) {}
  }

  function controlOf(event) {
    var node = event.target;
    if (!node || !node.closest) return '';
    var hit = node.closest('[data-touch]');
    return hit ? (hit.getAttribute('data-touch') || '') : '';
  }

  function emitShift(name) {
    var edge = name;
    if ((name === 'up' || name === 'down') && GS.controllerSettings && GS.controllerSettings.invertPaddles) {
      edge = name === 'up' ? 'down' : 'up';
    }
    if (GS.pushEdge) GS.pushEdge(edge);
  }

  function recompute() {
    var accel = 0;
    var brake = 0;
    var steer = 0;
    var hand = false;
    var up = false;
    var down = false;
    var pause = false;
    var steerCount = 0;
    var id;
    for (id in pointers) {
      if (!Object.prototype.hasOwnProperty.call(pointers, id)) continue;
      var p = pointers[id];
      if (p.kind === 'accel') accel = 1;
      else if (p.kind === 'brake') brake = 1;
      else if (p.kind === 'hand') hand = true;
      else if (p.kind === 'up') up = true;
      else if (p.kind === 'down') down = true;
      else if (p.kind === 'pause') pause = true;
      else if (p.kind === 'steer') {
        steer += p.steer;
        steerCount += 1;
      }
    }
    if (steerCount) steer /= steerCount;
    if (steer > 1) steer = 1;
    if (steer < -1) steer = -1;
    state.accel = accel;
    state.brake = brake;
    state.steer = steer;
    state.steerHeld = steerCount > 0;
    state.handbrake = hand;
    if (up && !prevShift.up) emitShift('up');
    if (down && !prevShift.down) emitShift('down');
    if (pause && !prevShift.pause) emitShift('pause');
    prevShift.up = up;
    prevShift.down = down;
    prevShift.pause = pause;
    if (puck) {
      puck.style.left = (50 + steer * 36) + '%';
    }
  }

  function steerValue(event) {
    if (!steerZone) return 0;
    var rect = steerZone.getBoundingClientRect();
    if (rect.width < 8) return 0;
    var u = (event.clientX - rect.left) / rect.width;
    var steer = (u - 0.5) * 2.2;
    if (steer > 1) steer = 1;
    if (steer < -1) steer = -1;
    return steer;
  }

  function onDown(event) {
    if (event.pointerType === 'touch' && !enabled) show();
    if (!enabled) return;
    if (GS.onInteract) GS.onInteract();
    if (GS.touchRace && !GS.touchRace()) return;
    var kind = controlOf(event);
    if (!kind) return;
    if (event.cancelable) event.preventDefault();
    try {
      if (event.target && event.target.setPointerCapture) event.target.setPointerCapture(event.pointerId);
    } catch (err) {}
    pointers[event.pointerId] = {
      kind: kind,
      steer: kind === 'steer' ? steerValue(event) : 0
    };
    recompute();
  }

  function onMove(event) {
    var p = pointers[event.pointerId];
    if (!p) return;
    if (event.cancelable) event.preventDefault();
    if (p.kind === 'steer') p.steer = steerValue(event);
    recompute();
  }

  function onUp(event) {
    if (!pointers[event.pointerId]) return;
    delete pointers[event.pointerId];
    recompute();
  }

  function bind() {
    layer = document.getElementById('touchLayer');
    steerZone = document.getElementById('steerZone');
    puck = document.getElementById('steerPuck');
    hint = document.getElementById('landHint');
    if (!layer) return;
    layer.addEventListener('pointerdown', onDown);
    layer.addEventListener('pointermove', onMove);
    layer.addEventListener('pointerup', onUp);
    layer.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', sync);
    window.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'touch') show();
    });
    if (coarseDevice() || queryTouch()) show();
    else sync();
  }

  GS.touch = {
    visible: function () { return enabled; },
    debug: function () {
      var ids = [];
      var id;
      for (id in pointers) {
        if (!Object.prototype.hasOwnProperty.call(pointers, id)) continue;
        ids.push(id + ':' + pointers[id].kind + ':' + pointers[id].steer);
      }
      return {
        enabled: enabled,
        live: state.enabled,
        ids: ids,
        steer: state.steer,
        steerHeld: state.steerHeld,
        accel: state.accel,
        brake: state.brake
      };
    },
    sync: sync,
    portrait: portraitNow,
    force: function (on) {
      if (on) show();
      else {
        enabled = false;
        state.enabled = false;
        document.documentElement.classList.remove('touch-ui');
        sync();
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})(window.GS = window.GS || {});
