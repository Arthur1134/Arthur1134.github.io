/* Saves merge into localStorage key gearshift_v1. This file never replaces
   the whole record, so controller settings and the tutorial flag stay put.
   Medal times are seconds from driven laps. Bronze is a committed first
   finish in gears 1–2. Silver is quicker than that. Gold is a clean gears
   1–3 run. Dad is the Flip line, and a non-Flip run does not reach it.
   Stage 8 finish (11/20): box test bots drove Warm-Up 50.2 s on the plain
   road and 40.7 s on the new Flip line; Skyway 85.0 s plain, 78.0 s Flip.
   Dad sits about 10% / 6% over a perfect bot Flip run and below every plain
   run, so it stays a real chase for a human. Bronze/Silver/Gold unchanged. */
(function (GS) {
  'use strict';

  var KEY = 'gearshift_v1';
  GS.VERSION = '1.0.1';
  GS.SAVE_KEY = KEY;

  GS.MEDAL_TIMES = {
    warmup: { bronze: 78, silver: 64, gold: 58, author: 45 },
    coastal: { bronze: 100, silver: 84, gold: 74, author: 54 },
    skyway: { bronze: 128, silver: 108, gold: 94, author: 83 }
  };

  var POINTS = [9, 6, 4, 3, 2];
  var RANK = { '': 0, bronze: 1, silver: 2, gold: 3 };

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
      return data;
    } catch (err) {
      return {};
    }
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }

  GS.updateSave = function (mutator) {
    var data = read();
    mutator(data);
    return write(data);
  };

  function bag(data, key) {
    if (!data[key] || typeof data[key] !== 'object' || Array.isArray(data[key])) data[key] = {};
    return data[key];
  }

  function medalName(time, id) {
    var row = GS.MEDAL_TIMES[id];
    if (!row || !(time > 0) || !isFinite(time)) return '';
    if (time <= row.gold) return 'gold';
    if (time <= row.silver) return 'silver';
    if (time <= row.bronze) return 'bronze';
    return '';
  }

  function derive(data) {
    var finished = data.finished && typeof data.finished === 'object' ? data.finished : {};
    var medals = data.medals && typeof data.medals === 'object' ? data.medals : {};
    var cup = data.cup && typeof data.cup === 'object' ? data.cup : {};
    return {
      coastal: !!(finished.warmup || medals.warmup),
      skyway: !!(finished.coastal || cup.heat2)
    };
  }

  function storeUnlocks(data) {
    var u = derive(data);
    var box = bag(data, 'unlocks');
    box.coastal = u.coastal;
    box.skyway = u.skyway;
    return u;
  }

  function validGhost(g) {
    if (!g || typeof g !== 'object' || !Array.isArray(g.samples) || g.samples.length < 2) return null;
    if (!(Number(g.time) > 0)) return null;
    return g;
  }

  GS.packGhostRow = function (t, x, y, z, yaw, up, gear, laps, along, length) {
    var span = length > 1 ? length : 1;
    var prog = (laps | 0) * 10000 + Math.round((along / span) * 10000);
    return [
      Math.round(t * 100),
      Math.round(x * 50),
      Math.round(y * 50),
      Math.round(z * 50),
      Math.round(yaw * 100),
      Math.round((up || 0) * 100),
      gear | 0,
      prog
    ];
  };

  function unpack(row) {
    return {
      t: row[0] / 100,
      x: row[1] / 50,
      y: row[2] / 50,
      z: row[3] / 50,
      yaw: row[4] / 100,
      up: row[5] / 100,
      gear: row[6] | 0,
      prog: row[7] | 0
    };
  }

  function lerpAngle(a, b, u) {
    var d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * u;
  }

  GS.ghostPose = function (pack, time) {
    if (!validGhost(pack)) return null;
    var samples = pack.samples;
    var first = unpack(samples[0]);
    if (!(time > first.t)) return first;
    var last = unpack(samples[samples.length - 1]);
    if (time >= last.t) return last;
    var lo = 0;
    var hi = samples.length - 1;
    while (lo + 1 < hi) {
      var mid = (lo + hi) >> 1;
      if (samples[mid][0] / 100 < time) lo = mid;
      else hi = mid;
    }
    var a = unpack(samples[lo]);
    var b = unpack(samples[hi]);
    var u = (time - a.t) / ((b.t - a.t) || 1);
    if (u < 0) u = 0;
    if (u > 1) u = 1;
    return {
      t: time,
      x: a.x + (b.x - a.x) * u,
      y: a.y + (b.y - a.y) * u,
      z: a.z + (b.z - a.z) * u,
      yaw: lerpAngle(a.yaw, b.yaw, u),
      up: a.up + (b.up - a.up) * u,
      gear: u < 0.5 ? a.gear : b.gear,
      prog: a.prog
    };
  };

  GS.ghostDelta = function (pack, playerTime, laps, along, length) {
    if (!validGhost(pack)) return null;
    var span = length > 1 ? length : 1;
    var target = (laps | 0) * 10000 + Math.round((along / span) * 10000);
    var samples = pack.samples;
    var i;
    var ghostTime = samples[samples.length - 1][0] / 100;
    for (i = 0; i < samples.length; i++) {
      if ((samples[i][7] | 0) >= target) {
        ghostTime = samples[i][0] / 100;
        break;
      }
    }
    return playerTime - ghostTime;
  };

  GS.save = {
    read: read,
    medalFor: medalName,
    isOpen: function (id) {
      if (id === 'warmup' || !id) return true;
      var u = derive(read());
      if (id === 'coastal') return u.coastal;
      if (id === 'skyway') return u.skyway;
      return false;
    },
    lockReason: function (id) {
      if (id === 'coastal') return 'Finish Warm-Up Yard, or earn a medal there, to open the coast.';
      if (id === 'skyway') return 'Finish Coastal Switchback, or cup heat 2, to open the skyway.';
      return '';
    },
    unlocks: function () {
      return derive(read());
    },
    best: function (id) {
      var row = read().bests && read().bests[id];
      if (!row || !(Number(row.time) > 0)) return null;
      return { time: Number(row.time), medal: row.medal || '' };
    },
    ghost: function (id) {
      var data = read();
      return validGhost(data.ghosts && data.ghosts[id]);
    },
    lastCup: function () {
      var cup = read().cup;
      if (!cup || typeof cup !== 'object' || !cup.last) return null;
      return cup.last;
    },
    pointsFor: function (place, field) {
      var table = POINTS.slice(0, field > 0 ? field : POINTS.length);
      return table[place - 1] || 0;
    },
    nextGap: function (time, id) {
      var row = GS.MEDAL_TIMES[id];
      var got = medalName(time, id);
      if (!row) return null;
      if (got === 'gold') {
        if (row.author && time > row.author) return { name: 'DAD', need: time - row.author, beat: false };
        return { name: 'DAD', need: row.author ? row.author - time : 0, beat: true };
      }
      var targetName = got === 'silver' ? 'GOLD' : (got === 'bronze' ? 'SILVER' : 'BRONZE');
      var target = got === 'silver' ? row.gold : (got === 'bronze' ? row.silver : row.bronze);
      return { name: targetName, need: Math.max(0, time - target), beat: false };
    },
    recordTrial: function (id, time, samples) {
      var awarded = medalName(time, id);
      var improved = false;
      GS.updateSave(function (data) {
        var bests = bag(data, 'bests');
        var medals = bag(data, 'medals');
        var finished = bag(data, 'finished');
        var ghosts = bag(data, 'ghosts');
        finished[id] = true;
        var prevMedal = medals[id] || '';
        if (awarded && (RANK[awarded] || 0) > (RANK[prevMedal] || 0)) medals[id] = awarded;
        var prev = bests[id];
        if (!prev || !(Number(prev.time) > 0) || time < Number(prev.time)) {
          improved = true;
          bests[id] = { time: time, medal: awarded || (prev && prev.medal) || '' };
          if (samples && samples.length > 8) ghosts[id] = { time: time, samples: samples };
        }
        storeUnlocks(data);
      });
      return {
        medal: awarded,
        improved: improved,
        best: GS.save.best(id),
        unlocks: derive(read())
      };
    },
    noteFinish: function (id) {
      GS.updateSave(function (data) {
        bag(data, 'finished')[id] = true;
        storeUnlocks(data);
      });
      return derive(read());
    },
    noteHeat: function (heatIndex) {
      GS.updateSave(function (data) {
        var finished = bag(data, 'finished');
        var cup = bag(data, 'cup');
        if (heatIndex === 1) finished.warmup = true;
        if (heatIndex === 2) {
          finished.coastal = true;
          cup.heat2 = true;
        }
        if (heatIndex === 3) finished.skyway = true;
        storeUnlocks(data);
      });
      return derive(read());
    },
    recordCup: function (payload) {
      GS.updateSave(function (data) {
        var cup = bag(data, 'cup');
        cup.last = payload;
        cup.heat2 = true;
        var finished = bag(data, 'finished');
        finished.warmup = true;
        finished.coastal = true;
        finished.skyway = true;
        storeUnlocks(data);
      });
      return derive(read());
    }
  };
})(window.GS = window.GS || {});
