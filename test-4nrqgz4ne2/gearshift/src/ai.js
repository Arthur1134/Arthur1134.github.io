/* Arcade rivals. They ride a scripted rail on the same car body, so a loop
   cannot drop them through the world. Flip Fritz takes the marked Flip line.
   The others stay in gears 1–3. A clean player Flip is faster than Fritz's cap. */
(function (GS) {
  'use strict';

  var PROFILES = [
    { id: 'pete', name: 'PIXEL PETE', color: 0x3d8bff, pace: 0.96, flip: false, maxGear: 2, lane: -3.05, ahead: 15.6 },
    { id: 'nan', name: 'NEON NAN', color: 0xff4ad8, pace: 0.78, flip: false, maxGear: 3, lane: 3.05, ahead: 15.6 },
    { id: 'cal', name: 'CARTRIDGE CAL', color: 0xf0c14a, pace: 0.84, flip: false, maxGear: 3, lane: -3.05, ahead: 8.2 },
    { id: 'fritz', name: 'FLIP FRITZ', color: 0x3dffe0, pace: 0.78, flip: true, maxGear: 4, lane: 3.05, ahead: 8.2 }
  ];

  GS.RIVALS = PROFILES;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function cssColor(hex) {
    var s = (hex >>> 0).toString(16);
    while (s.length < 6) s = '0' + s;
    return '#' + s.slice(-6);
  }

  GS.ordinal = function (n) {
    var v = n % 100;
    if (v >= 11 && v <= 13) return n + 'TH';
    var d = n % 10;
    if (d === 1) return n + 'ST';
    if (d === 2) return n + 'ND';
    if (d === 3) return n + 'RD';
    return n + 'TH';
  };

  GS.makePlate = function (text, css) {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 96;
    var ctx = canvas.getContext('2d');
    var tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true });
    var sprite = new THREE.Sprite(mat);
    mat.depthWrite = false;
    sprite.scale.set(1.15, 0.22, 1);
    sprite.visible = false;
    sprite.userData.canvas = canvas;
    sprite.userData.ctx = ctx;
    sprite.userData.tex = tex;
    sprite.userData.label = '';
    GS.paintPlate(sprite, text, css);
    return sprite;
  };

  GS.paintPlate = function (sprite, text, css) {
    if (!sprite || sprite.userData.label === text) return;
    var canvas = sprite.userData.canvas;
    var ctx = sprite.userData.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(12, 10, 8, 0.78)';
    ctx.fillRect(16, 18, 480, 60);
    ctx.fillStyle = css || '#f6f1e7';
    ctx.font = '700 36px Trebuchet MS, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 48);
    sprite.userData.label = text;
    sprite.userData.tex.needsUpdate = true;
  };

  var _plateView = new THREE.Vector3();

  // World size grows with distance so the chip stays a small screen label,
  // then stops at a cap so a far car does not grow a billboard. Very close
  // chips, and anything behind the camera, fade out instead of covering the road.
  GS.presentPlate = function (sprite, camera, opts) {
    if (!sprite || !camera || !sprite.material) return;
    opts = opts || {};
    var mat = sprite.material;
    if (opts.hide) {
      sprite.visible = false;
      mat.opacity = 0;
      sprite.userData.dist = 0;
      sprite.userData.screenH = 0;
      return;
    }
    var dx = sprite.position.x - camera.position.x;
    var dy = sprite.position.y - camera.position.y;
    var dz = sprite.position.z - camera.position.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    camera.getWorldDirection(_plateView);
    var ahead = dx * _plateView.x + dy * _plateView.y + dz * _plateView.z;
    sprite.userData.dist = dist;
    if (ahead < 0.8 || dist < 7) {
      sprite.visible = false;
      mat.opacity = 0;
      sprite.userData.screenH = 0;
      return;
    }
    var fov = (camera.fov || 57) * Math.PI / 180;
    var screenH = 2 * dist * Math.tan(fov * 0.5);
    var height = screenH * 0.03;
    if (height > 0.55) height = 0.55;
    if (height < 0.16) height = 0.16;
    var fade = 1;
    if (dist < 12) fade = (dist - 7) / 5;
    if (opts.ghost) fade *= 0.8;
    sprite.visible = fade > 0.04;
    mat.opacity = fade;
    sprite.scale.set(height * (512 / 96), height, 1);
    sprite.userData.screenH = screenH > 0 ? height / screenH : 0;
  };

  function disposeObject(obj) {
    if (!obj) return;
    obj.traverse(function (node) {
      if (node.geometry) node.geometry.dispose();
      var material = node.material;
      if (!material) return;
      if (Object.prototype.toString.call(material) === '[object Array]') {
        var m;
        for (m = 0; m < material.length; m++) {
          if (material[m].map) material[m].map.dispose();
          material[m].dispose();
        }
      } else {
        if (material.map) material.map.dispose();
        material.dispose();
      }
    });
  }

  function cornerDot(track, dist) {
    var a = track.sample(dist);
    var b = track.sample(dist + 22);
    var dot = a.tx * b.tx + a.tz * b.tz;
    return clamp(dot, -1, 1);
  }

  function gridGap(track, along) {
    var len = track.length || 1;
    var d = along - track.spawnDist;
    if (d > len * 0.5) d -= len;
    if (d < -len * 0.5) d += len;
    return d;
  }

  function nearGrid(track, along) {
    var gap = gridGap(track, along);
    return gap > -8 && gap < 26;
  }

  function chooseGear(rival, track) {
    var line = track.line || { kind: 'none' };
    var maxGear = rival.profile.maxGear;
    if (rival.mode === 'shortcut') return 4;
    // Never start a Flip beside the grid. A mid-roll there looks like a glitch.
    if (!nearGrid(track, rival.along)) {
      if (rival.profile.flip && line.kind === 'shelf') {
        if (rival.along >= line.d0 + 4 && rival.along <= line.d1 - 4) return 4;
      }
      if (rival.profile.flip && line.kind === 'shortcut' && !rival.flipTaken) {
        if (rival.along >= line.main0 - 8 && rival.along <= line.main0 + 14) return 4;
      }
    }
    var zones = track.zones || {};
    // Gear 4 is only the marked Flip line. On the road Fritz uses the same
    // 1–3 band as the other quick rivals, or he would outrun a clean lap.
    var roadMax = maxGear;
    if (rival.profile.flip && roadMax > 3) roadMax = 3;
    if (zones.jump0 >= 0 && roadMax >= 3 && rival.along >= zones.jump0 - 20 && rival.along <= zones.jump1 + 12) {
      return 3;
    }
    var dot = cornerDot(track, rival.along);
    if (dot < 0.78) return 1;
    if (dot < 0.9) return roadMax > 1 ? 2 : 1;
    return roadMax;
  }

  function targetSpeed(rival, track) {
    var gear = rival.gear;
    if (!GS.GEARS[gear]) gear = 1;
    var top = GS.GEARS[gear].top * rival.profile.pace;
    if (rival.mode === 'shortcut' || (rival.profile.flip && gear === 4)) {
      top = 42 + 4 * rival.profile.pace;
      if (top > 46) top = 46;
    }
    var dot = rival.mode === 'shortcut' ? 0.9 : cornerDot(track, rival.along);
    var slow = 0.66 + 0.34 * Math.max(0, dot);
    if (dot < 0.78) slow *= 0.9;
    var speed = top * slow;
    if (speed < 9) speed = 9;
    return speed;
  }

  function progressOf(lapsDone, along, length, finished, finishRank) {
    if (finished) return 1000 - (finishRank || 1) * 0.001;
    return lapsDone + along / (length || 1);
  }

  GS.spawnRivals = function (track, scene) {
    var list = [];
    var serial = 0;
    var minSep = 99;
    var i;

    function worldUpY(root) {
      root.updateMatrixWorld(true);
      return root.matrixWorld.elements[5];
    }

    function tameTangent(pose, along) {
      var len = Math.hypot(pose.tx || 0, pose.tz || 0);
      if (len > 0.25 && isFinite(pose.tx) && isFinite(pose.tz)) return pose;
      var alt = track.sample(along + 2);
      if (alt && Math.hypot(alt.tx || 0, alt.tz || 0) > 0.25) {
        pose.tx = alt.tx;
        pose.tz = alt.tz;
      } else {
        pose.tx = 1;
        pose.tz = 0;
      }
      return pose;
    }

    function place(rival) {
      var spec = { kind: 'road' };
      if (rival.mode === 'shortcut') spec = { kind: 'shortcut', sDist: rival.sDist };
      else if (rival.profile.flip && rival.gear === 4 && track.line && track.line.kind === 'shelf') {
        var line = track.line;
        if (rival.along >= line.d0 && rival.along <= line.d1) spec = { kind: 'shelf' };
      }
      if (rival.mode !== 'shortcut' && nearGrid(track, rival.along)) spec = { kind: 'road' };
      var pose = track.poseOnRail(rival.along, rival.lane + (rival.bumpLane || 0), spec);
      if (!isFinite(pose.y) || pose.y < -0.4) {
        pose.y = track.roadHeight(rival.along);
        pose.up = 0;
        rival.mode = 'road';
      }
      tameTangent(pose, rival.along);
      if (pose.y < rival.minY) rival.minY = pose.y;
      rival.root.position.set(pose.x, pose.y, pose.z);
      var blend = pose.up || 0;
      if (!isFinite(blend)) blend = 0;
      if (nearGrid(track, rival.along) && rival.mode !== 'shortcut') blend = 0;
      var yaw = GS.yawFromForwardXZ(pose.tx, pose.tz);
      if (!isFinite(yaw)) yaw = 0;
      GS.orientYawRoll(rival.root, yaw, blend);
      var upY = worldUpY(rival.root);
      var expect = Math.cos(blend * Math.PI);
      if (!isFinite(upY) || Math.abs(upY - expect) > 0.45) {
        blend = blend > 0.65 ? 1 : 0;
        GS.orientYawRoll(rival.root, yaw, blend);
        upY = worldUpY(rival.root);
        rival.settles = (rival.settles || 0) + 1;
        if (!isFinite(upY) || (blend < 0.5 && upY < 0.72) || (blend > 0.5 && upY > -0.72)) {
          rival.mode = 'road';
          rival.along = track.spawnDist + 8.2 + (rival.settles % 4) * 3.6;
          rival.lane = (rival.profile.lane || 0) >= 0 ? 3.05 : -3.05;
          pose = track.poseOnRail(rival.along, rival.lane, { kind: 'road' });
          tameTangent(pose, rival.along);
          if (!isFinite(pose.y)) pose.y = track.roadHeight(rival.along);
          rival.root.position.set(pose.x, pose.y, pose.z);
          yaw = GS.yawFromForwardXZ(pose.tx || 1, pose.tz || 0);
          if (!isFinite(yaw)) yaw = 0;
          blend = 0;
          GS.orientYawRoll(rival.root, yaw, 0);
          upY = worldUpY(rival.root);
          pose.up = 0;
        }
      }
      rival.upY = upY;
      rival.up = blend;
      rival.yaw = yaw;
      var lift = pose.up > 0.5 ? -1.65 : 1.7;
      rival.plate.position.set(pose.x, pose.y + lift, pose.z);
      GS.paintPlate(rival.plate, rival.profile.name + '  ' + rival.gear, cssColor(rival.profile.color));
      if (rival.wheels) {
        var spinDir = pose.up > 0.5 ? -1 : 1;
        var w;
        for (w = 0; w < rival.wheels.length; w++) {
          rival.wheels[w].spinner.rotation.y = rival.spin * spinDir;
          rival.wheels[w].mount.rotation.y = 0;
        }
      }
    }

    for (i = 0; i < PROFILES.length; i++) {
      var profile = PROFILES[i];
      var built = GS.buildCar({ color: profile.color });
      var root = built.root;
      root.name = 'rival-' + profile.id;
      root.userData.wheels = built.wheels;
      scene.add(root);
      var plate = GS.makePlate(profile.name, cssColor(profile.color));
      scene.add(plate);
      var along = track.spawnDist + (profile.ahead || 8);
      if (along > track.length - 8) along = track.spawnDist + 6;
      if (along < 4) along = 4;
      var rival = {
        profile: profile,
        root: root,
        plate: plate,
        wheels: built.wheels,
        along: along,
        lapsDone: 0,
        finished: false,
        finishRank: 0,
        speed: 0,
        gear: 1,
        mode: 'road',
        sDist: 0,
        flipTaken: false,
        wrapped: false,
        up: 0,
        spin: 0,
        minY: 999,
        lane: profile.lane,
        yaw: 0,
        upY: 1,
        settles: 0,
        shortcuts: 0,
        shortcutMin: 999,
        bumpLane: 0,
        overlapT: 0,
        passT: 0
      };
      place(rival);
      list.push(rival);
    }

    var spreadGuard = 0;
    while (spreadGuard < 6) {
      var moved = false;
      var a;
      var b;
      for (a = 0; a < list.length; a++) {
        for (b = a + 1; b < list.length; b++) {
          var dx = list[a].root.position.x - list[b].root.position.x;
          var dy = list[a].root.position.y - list[b].root.position.y;
          var dz = list[a].root.position.z - list[b].root.position.z;
          var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 3.35) {
            if (list[a].along <= list[b].along) list[b].along += 3.6;
            else list[a].along += 3.6;
            moved = true;
          }
        }
      }
      if (!moved) break;
      for (a = 0; a < list.length; a++) place(list[a]);
      spreadGuard += 1;
    }

    function separation(rival) {
      var scale = 1;
      var n;
      for (n = 0; n < list.length; n++) {
        var other = list[n];
        if (other === rival || other.finished || other.mode !== rival.mode) continue;
        var delta = other.along - rival.along;
        if (delta < 0.4 || delta > 6) continue;
        if (Math.abs(other.lane - rival.lane) > 1.7) continue;
        scale = Math.min(scale, 0.84);
      }
      return scale;
    }

    function maybeShortcut(rival) {
      var line = track.line;
      if (!rival.profile.flip || !line || line.kind !== 'shortcut') return;
      if (rival.flipTaken || rival.mode === 'shortcut') return;
      var span = line.main1 - line.main0;
      if (span < 0) span += track.length;
      if (span < 30) return;
      if (rival.along >= line.main0 && rival.along < line.main0 + 12) {
        rival.mode = 'shortcut';
        rival.sDist = 0;
        rival.gear = 4;
      }
    }

    function noteSep() {
      var a;
      var b;
      for (a = 0; a < list.length; a++) {
        for (b = a + 1; b < list.length; b++) {
          var dx = list[a].root.position.x - list[b].root.position.x;
          var dy = list[a].root.position.y - list[b].root.position.y;
          var dz = list[a].root.position.z - list[b].root.position.z;
          var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < minSep) minSep = dist;
        }
      }
    }

    return {
      list: list,
      minSep: function () { return minSep; },
      claimRank: function () {
        serial += 1;
        return serial;
      },
      update: function (dt, player) {
        var length = track.length;
        var n;
        for (n = 0; n < list.length; n++) {
          var rival = list[n];
          if (rival.bumpLane) {
            rival.bumpLane *= Math.exp(-0.9 * dt);
            if (Math.abs(rival.bumpLane) < 0.01) rival.bumpLane = 0;
          }
          if (!rival.finished) {
            rival.gear = chooseGear(rival, track);
            var want = targetSpeed(rival, track);
            var gap = progressOf(rival.lapsDone, rival.along, length, false, 0) - (player.lapsDone + player.along / length);
            if (gap > 0.2) {
              var t = Math.min(1, (gap - 0.2) / 1);
              want *= 1 - 0.22 * t;
            }
            want *= separation(rival);
            if (rival.speed < want) rival.speed = Math.min(want, rival.speed + 16 * dt);
            else rival.speed = Math.max(want, rival.speed - 20 * dt);
            rival.spin -= rival.speed * dt / 0.36;
            if (rival.mode === 'shortcut') {
              var line = track.line;
              // The deck leaves the main centerline on purpose. Speed stays on
              // the shortcut cap from targetSpeed and is not bled for that offset.
              if (rival.speed < rival.shortcutMin) rival.shortcutMin = rival.speed;
              rival.sDist += rival.speed * dt;
              var u = line.length > 0 ? rival.sDist / line.length : 1;
              if (u < 0) u = 0;
              if (u > 1) u = 1;
              var span = line.main1 - line.main0;
              if (span < 0) span += length;
              var along = line.main0 + span * u;
              if (along >= length) {
                along -= length;
                if (!rival.wrapped) {
                  rival.wrapped = true;
                  rival.lapsDone += 1;
                  rival.flipTaken = false;
                  if (rival.lapsDone >= track.laps) {
                    rival.finished = true;
                    rival.finishRank = serial + 1;
                    serial += 1;
                    rival.speed = 0;
                    rival.mode = 'road';
                    rival.sDist = 0;
                    along = 2.2 + n * 2.1;
                  }
                }
              }
              rival.along = along;
              if (!rival.finished && rival.sDist >= line.length - 0.05) {
                rival.mode = 'road';
                rival.along = line.main1;
                if (rival.along >= length) rival.along -= length;
                if (!rival.wrapped) rival.flipTaken = true;
                rival.wrapped = false;
                rival.shortcuts += 1;
                rival.sDist = 0;
              }
            } else {
              var next = rival.along + rival.speed * dt;
              if (next >= length) {
                var over = next - length;
                rival.lapsDone += 1;
                rival.flipTaken = false;
                rival.mode = 'road';
                if (rival.lapsDone >= track.laps) {
                  rival.finished = true;
                  rival.finishRank = serial + 1;
                  serial += 1;
                  rival.speed = 0;
                  rival.along = 2.2 + n * 2.1;
                } else {
                  rival.along = over;
                }
              } else {
                rival.along = next;
                maybeShortcut(rival);
              }
            }
          }
          place(rival);
        }
        noteSep();
      },
      standings: function (player) {
        var rows = [{
          name: 'YOU',
          you: true,
          lapsDone: player.lapsDone,
          along: player.along,
          finished: player.finished,
          finishRank: player.finishRank || 0,
          gear: player.gear || 1
        }];
        var n;
        for (n = 0; n < list.length; n++) {
          var rival = list[n];
          rows.push({
            name: rival.profile.name,
            you: false,
            lapsDone: rival.lapsDone,
            along: rival.along,
            finished: rival.finished,
            finishRank: rival.finishRank || 0,
            gear: rival.gear,
            mode: rival.mode,
            y: rival.root.position.y,
            minY: rival.minY,
            speed: rival.speed,
            sDist: rival.sDist,
            flipTaken: rival.flipTaken,
            shortcuts: rival.shortcuts,
            shortcutMin: rival.shortcutMin
          });
        }
        rows.sort(function (a, b) {
          var ka = progressOf(a.lapsDone, a.along, track.length, a.finished, a.finishRank);
          var kb = progressOf(b.lapsDone, b.along, track.length, b.finished, b.finishRank);
          return kb - ka;
        });
        var p;
        for (p = 0; p < rows.length; p++) {
          rows[p].place = p + 1;
          rows[p].points = GS.save.pointsFor(p + 1, rows.length);
        }
        return rows;
      },
      dispose: function () {
        var n;
        for (n = 0; n < list.length; n++) {
          scene.remove(list[n].root);
          scene.remove(list[n].plate);
          disposeObject(list[n].root);
          if (list[n].plate.material) {
            if (list[n].plate.material.map) list[n].plate.material.map.dispose();
            list[n].plate.material.dispose();
          }
        }
        list.length = 0;
      }
    };
  };
})(window.GS = window.GS || {});
