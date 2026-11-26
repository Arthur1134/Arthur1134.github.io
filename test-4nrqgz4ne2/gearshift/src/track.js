/* Stage 3 circuits. One closed racing line per track, plus a Flip surface.
   Positive arc angle is a left turn. Forward is (tx, tz). Left is (tz, -tx),
   which matches GS.rightFromForwardXZ. Spawn faces +X on every track.
   Road meshes and roadHeight use the same height function. */
(function (GS) {
  'use strict';

  var STEP = 3;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smooth01(t) {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapDist(dist, length) {
    var d = dist % length;
    if (d < 0) d += length;
    return d;
  }

  // Signed distance along the loop, in (-length/2, length/2].
  // Positive means `to` is ahead of `from`.
  function signedAlong(from, to, length) {
    var d = to - from;
    if (d > length * 0.5) d -= length;
    if (d < -length * 0.5) d += length;
    return d;
  }

  function withRight(p) {
    var right = new THREE.Vector3();
    GS.rightFromForwardXZ(p.tx, p.tz, right);
    p.rx = right.x;
    p.rz = right.z;
    return p;
  }

  // Left (+angle) or right (-angle) arc. t is 0..1 along the sweep.
  // Facing +X, a left quarter-turn ends facing -Z.
  function arcPoint(pose, radius, angle, t) {
    var tx = pose.tx;
    var tz = pose.tz;
    var mag = Math.abs(angle);
    var th = mag * t;
    var left = angle >= 0;
    var ix = left ? tz : -tz;
    var iz = left ? -tx : tx;
    var c = Math.cos(th);
    var s = Math.sin(th);
    var cx = pose.x + ix * radius;
    var cz = pose.z + iz * radius;
    var x = cx + (-ix * c + tx * s) * radius;
    var z = cz + (-iz * c + tz * s) * radius;
    var fx = tx * c + ix * s;
    var fz = tz * c + iz * s;
    var len = Math.hypot(fx, fz) || 1;
    return { x: x, z: z, tx: fx / len, tz: fz / len };
  }

  function compilePath(start, segs, step, closed) {
    var pose = { x: start.x, z: start.z, tx: start.tx, tz: start.tz };
    var dist = 0;
    var pieces = [];
    var i;
    for (i = 0; i < segs.length; i++) {
      var seg = segs[i];
      var len = seg.kind === 'straight' ? seg.len : Math.abs(seg.angle) * seg.radius;
      pieces.push({
        kind: seg.kind,
        d0: dist,
        d1: dist + len,
        len: len,
        pose: { x: pose.x, z: pose.z, tx: pose.tx, tz: pose.tz },
        radius: seg.radius || 0,
        angle: seg.angle || 0
      });
      if (seg.kind === 'straight') {
        pose = {
          x: pose.x + pose.tx * seg.len,
          z: pose.z + pose.tz * seg.len,
          tx: pose.tx,
          tz: pose.tz
        };
      } else {
        pose = arcPoint(pose, seg.radius, seg.angle, 1);
      }
      dist += len;
    }
    var length = dist;
    var n = Math.max(8, Math.round(length / step));
    var samples = [];
    var count = closed ? n : n + 1;
    for (i = 0; i < count; i++) {
      var d = closed ? (i * length / n) : (i * length / n);
      samples.push(samplePieces(pieces, d, length, closed));
    }
    return {
      pieces: pieces,
      length: length,
      samples: samples,
      endPose: pose,
      step: closed ? length / n : length / n,
      n: samples.length,
      closed: closed
    };
  }

  function samplePieces(pieces, dist, length, closed) {
    var d = closed ? wrapDist(dist, length) : clamp(dist, 0, length);
    var piece = pieces[pieces.length - 1];
    var i;
    for (i = 0; i < pieces.length; i++) {
      if (d < pieces[i].d1 || i === pieces.length - 1) {
        piece = pieces[i];
        break;
      }
    }
    var u = piece.len > 1e-6 ? (d - piece.d0) / piece.len : 0;
    u = clamp(u, 0, 1);
    var p;
    if (piece.kind === 'straight') {
      p = {
        x: piece.pose.x + piece.pose.tx * piece.len * u,
        z: piece.pose.z + piece.pose.tz * piece.len * u,
        tx: piece.pose.tx,
        tz: piece.pose.tz
      };
    } else {
      p = arcPoint(piece.pose, piece.radius, piece.angle, u);
    }
    p.dist = d;
    return withRight(p);
  }

  function makeHeight(spans, jump, length) {
    return function (dist) {
      var d = wrapDist(dist, length);
      var y = 0;
      var i;
      for (i = 0; i < spans.length; i++) {
        var s = spans[i];
        if (d + 1e-4 >= s.d0 && d <= s.d1 + 1e-4) {
          var t = (d - s.d0) / ((s.d1 - s.d0) || 1);
          y = lerp(s.y0, s.y1, s.smooth ? smooth01(t) : t);
        }
      }
      if (jump && d >= jump.d0 && d <= jump.d1) {
        if (d < jump.lip) y += jump.h * ((d - jump.d0) / (jump.lip - jump.d0));
        else y += jump.h * (1 - (d - jump.lip) / (jump.d1 - jump.lip));
      }
      return y;
    };
  }

  function projectPoly(samples, x, z, length, closed) {
    var n = samples.length;
    var quads = closed ? n : n - 1;
    var bestD = Infinity;
    var best = samples[0];
    var bestDist = 0;
    var bestSide = 0;
    var i;
    for (i = 0; i < quads; i++) {
      var aS = samples[i];
      var bS = samples[closed ? (i + 1) % n : i + 1];
      var abx = bS.x - aS.x;
      var abz = bS.z - aS.z;
      var apx = x - aS.x;
      var apz = z - aS.z;
      var ab2 = abx * abx + abz * abz;
      var t = ab2 > 1e-8 ? (apx * abx + apz * abz) / ab2 : 0;
      t = clamp(t, 0, 1);
      var cx = aS.x + abx * t;
      var cz = aS.z + abz * t;
      var dx = x - cx;
      var dz = z - cz;
      var d2 = dx * dx + dz * dz;
      if (d2 < bestD) {
        bestD = d2;
        best = aS;
        var span;
        if (!closed) span = bS.dist - aS.dist;
        else span = bS.dist >= aS.dist ? (bS.dist - aS.dist) : (length - aS.dist);
        bestDist = aS.dist + span * t;
        if (closed) bestDist = wrapDist(bestDist, length);
        bestSide = dx * aS.rx + dz * aS.rz;
      }
    }
    return {
      dist: bestDist,
      side: bestSide,
      center: Math.sqrt(bestD),
      x: best.x,
      z: best.z,
      tx: best.tx,
      tz: best.tz,
      rx: best.rx,
      rz: best.rz
    };
  }

  function pointSegDist(px, pz, ax, az, bx, bz) {
    var abx = bx - ax;
    var abz = bz - az;
    var ab2 = abx * abx + abz * abz;
    var t = ab2 > 1e-8 ? ((px - ax) * abx + (pz - az) * abz) / ab2 : 0;
    t = clamp(t, 0, 1);
    var cx = ax + abx * t;
    var cz = az + abz * t;
    return Math.hypot(px - cx, pz - cz);
  }

  function clearance(samples, x, z) {
    var best = Infinity;
    var i;
    for (i = 0; i < samples.length; i++) {
      var d = Math.hypot(samples[i].x - x, samples[i].z - z);
      if (d < best) best = d;
    }
    return best;
  }

  function makeMat(color, emit) {
    var mat = new THREE.MeshLambertMaterial({ color: color });
    if (emit) {
      mat.emissive = new THREE.Color(emit);
      mat.emissiveIntensity = 0.35;
      mat.userData.glow = true;
    }
    return mat;
  }

  function createLook() {
    return {
      ground: makeMat(0x6d4c34),
      shoulder: makeMat(0x8d6244),
      asphalt: makeMat(0x4e453c),
      lane: makeMat(0x2c2824),
      curb: makeMat(0xf0c14a, 0xf0c14a),
      curbB: makeMat(0xd46a22, 0xd46a22),
      wall: makeMat(0x8a7564),
      lamp: makeMat(0xffb03a, 0xffb03a),
      chevron: makeMat(0xf0c14a, 0xf0c14a),
      ramp: makeMat(0xffe08a, 0xffb03a),
      apron: makeMat(0x3a4550),
      landing: makeMat(0xd7fff8, 0x7ef0ff),
      ceiling: makeMat(0x1a4a55, 0x143840),
      ceilWarn: makeMat(0xff5a3c, 0xff5a3c),
      gate: makeMat(0x7ef0ff, 0x7ef0ff),
      banner: makeMat(0x9b6bff, 0x9b6bff),
      water: makeMat(0x2f6d86),
      prop: makeMat(0x8d6244),
      propB: makeMat(0x6e5a4c)
    };
  }

  function ribbonGeometry(samples, inner, outer, yAt, closed) {
    var n = samples.length;
    var positions = new Float32Array(n * 2 * 3);
    var normals = new Float32Array(n * 2 * 3);
    var indices = [];
    var i;
    for (i = 0; i < n; i++) {
      var s = samples[i];
      var y = yAt(s);
      var i0 = i * 6;
      positions[i0] = s.x + s.rx * inner;
      positions[i0 + 1] = y;
      positions[i0 + 2] = s.z + s.rz * inner;
      positions[i0 + 3] = s.x + s.rx * outer;
      positions[i0 + 4] = y;
      positions[i0 + 5] = s.z + s.rz * outer;
      normals[i0 + 1] = 1;
      normals[i0 + 4] = 1;
    }
    var quads = closed ? n : n - 1;
    for (var k = 0; k < quads; k++) {
      var k2 = closed ? (k + 1) % n : k + 1;
      var a = k * 2;
      var b = a + 1;
      var c = k2 * 2 + 1;
      var d = k2 * 2;
      indices.push(a, b, c, a, c, d);
    }
    if (indices.length) {
      var ia = indices[0];
      var ib = indices[1];
      var ic = indices[2];
      var abx = positions[ib * 3] - positions[ia * 3];
      var abz = positions[ib * 3 + 2] - positions[ia * 3 + 2];
      var acx = positions[ic * 3] - positions[ia * 3];
      var acz = positions[ic * 3 + 2] - positions[ia * 3 + 2];
      var ny = abz * acx - abx * acz;
      if (ny < 0) {
        for (var t = 0; t < indices.length; t += 3) {
          var swap = indices[t + 1];
          indices[t + 1] = indices[t + 2];
          indices[t + 2] = swap;
        }
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setIndex(indices);
    geo.computeBoundingSphere();
    return geo;
  }

  function addRibbon(root, samples, inner, outer, yAt, material, closed) {
    if (samples.length < 2) return null;
    var mesh = new THREE.Mesh(ribbonGeometry(samples, inner, outer, yAt, closed), material);
    mesh.frustumCulled = false;
    root.add(mesh);
    return mesh;
  }

  function rangeOf(samples, d0, d1) {
    var out = [];
    var i;
    for (i = 0; i < samples.length; i++) {
      if (samples[i].dist + 1e-3 >= d0 && samples[i].dist <= d1 + 1e-3) out.push(samples[i]);
    }
    return out;
  }

  function addWalls(root, samples, offset, thick, tall, material, segments, inwardSign, heightAt, closed, skip) {
    var n = samples.length;
    var quads = closed ? n : n - 1;
    var kept = [];
    var i;
    for (i = 0; i < quads; i++) {
      var a = samples[i];
      var b = samples[closed ? (i + 1) % n : i + 1];
      if (skip && skip(a, b, offset)) continue;
      kept.push([a, b]);
    }
    if (!kept.length) return;
    var geo = new THREE.BoxGeometry(thick, 1, 1);
    var mesh = new THREE.InstancedMesh(geo, material, kept.length);
    mesh.frustumCulled = false;
    var dummy = new THREE.Object3D();
    var face = offset - Math.sign(offset || 1) * (thick / 2);
    for (i = 0; i < kept.length; i++) {
      var ka = kept[i][0];
      var kb = kept[i][1];
      var ax = ka.x + ka.rx * offset;
      var az = ka.z + ka.rz * offset;
      var bx = kb.x + kb.rx * offset;
      var bz = kb.z + kb.rz * offset;
      var dx = bx - ax;
      var dz = bz - az;
      var len = Math.hypot(dx, dz) || 1;
      var tx = dx / len;
      var tz = dz / len;
      var y0 = heightAt(ka);
      var y1 = heightAt(kb);
      var base = (y0 + y1) * 0.5;
      dummy.position.set((ax + bx) / 2, base + tall / 2, (az + bz) / 2);
      dummy.rotation.set(0, GS.yawFromForwardXZ(tx, tz), 0);
      dummy.scale.set(1, tall, len * 1.08);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (segments) {
        var fax = ka.x + ka.rx * face;
        var faz = ka.z + ka.rz * face;
        var fbx = kb.x + kb.rx * face;
        var fbz = kb.z + kb.rz * face;
        var rx = -tz;
        var rz = tx;
        segments.push({
          ax: fax, az: faz, bx: fbx, bz: fbz,
          nx: inwardSign * rx,
          nz: inwardSign * rz
        });
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    root.add(mesh);
  }

  function addDeck(root, samples, side0, side1, yBottom, thick, material, warnMaterial, warnFrom, closed) {
    var n = samples.length;
    var quads = closed ? n : Math.max(0, n - 1);
    var main = [];
    var warn = [];
    var i;
    for (i = 0; i < quads; i++) {
      var a = samples[i];
      var b = samples[closed ? (i + 1) % n : i + 1];
      if (a.dist >= warnFrom) warn.push([a, b]);
      else main.push([a, b]);
    }
    function emit(list, mat) {
      if (!list.length || !mat) return;
      var geo = new THREE.BoxGeometry(1, 1, 1);
      var mesh = new THREE.InstancedMesh(geo, mat, list.length);
      mesh.frustumCulled = false;
      var dummy = new THREE.Object3D();
      var mid = (side0 + side1) * 0.5;
      var width = Math.abs(side1 - side0);
      for (var k = 0; k < list.length; k++) {
        var aS = list[k][0];
        var bS = list[k][1];
        var clen = Math.max(0.4, Math.hypot(bS.x - aS.x, bS.z - aS.z));
        var y = yBottom(aS);
        dummy.position.set(aS.x + aS.rx * mid, y + thick / 2, aS.z + aS.rz * mid);
        dummy.rotation.set(0, GS.yawFromForwardXZ(aS.tx, aS.tz), 0);
        dummy.scale.set(width, thick, clen * 1.08);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      // v1.0.2: decks are overpasses; game.js fades them when they block the view.
      mesh.userData.overpass = true;
      root.add(mesh);
    }
    emit(main, material);
    emit(warn, warnMaterial);
  }

  // v1.0.4: approach signs for a Flip entry. Built from the entry distance
  // already on the flip, about two seconds out at a typical cruise. Gear-4
  // cyan, not a palette slot, so they stay readable in every gear. They are
  // not overpass decks and they are not collision.
  function addFlipSigns(root, sampleAt, heightAt, entryDist, length, half, mats) {
    var glow = new THREE.MeshLambertMaterial({
      color: 0x083038,
      emissive: new THREE.Color(0x7ef0ff),
      emissiveIntensity: 1.25
    });
    var plate = new THREE.MeshLambertMaterial({
      color: 0x07141c,
      emissive: new THREE.Color(0x145868),
      emissiveIntensity: 0.4
    });
    mats.push(glow);
    var group = new THREE.Group();
    group.name = 'flip-signs';
    group.userData.flipSign = true;
    var boardGeo = new THREE.BoxGeometry(1.55, 1.15, 0.1);
    // Bars sit on the face the chase camera sees (local +Z points back up
    // the road). The V reads as a chevron. The ground arrow carries the heading.
    var armGeo = new THREE.BoxGeometry(0.92, 0.2, 0.12);
    var i;
    for (i = 0; i < 4; i++) {
      var back = 50 - i * 10;
      var d = entryDist - back;
      d = d % length;
      if (d < 0) d += length;
      var s = sampleAt(d);
      var y = heightAt(s.dist);
      var side = (i % 2 === 0 ? 1 : -1) * (half + 2.15);
      var board = new THREE.Group();
      board.name = 'flip-chevron';
      board.position.set(s.x + s.rx * side, y + 2.15, s.z + s.rz * side);
      board.rotation.y = GS.yawFromForwardXZ(s.tx, s.tz);
      var backplate = new THREE.Mesh(boardGeo, plate);
      var armU = new THREE.Mesh(armGeo, glow);
      armU.position.set(-0.22, 0.16, 0.12);
      armU.rotation.z = 0.62;
      var armD = new THREE.Mesh(armGeo, glow);
      armD.position.set(0.22, 0.16, 0.12);
      armD.rotation.z = -0.62;
      board.add(backplate);
      board.add(armU);
      board.add(armD);
      group.add(board);
    }
    var ad = entryDist - 14;
    ad = ad % length;
    if (ad < 0) ad += length;
    var asamp = sampleAt(ad);
    var arrow = new THREE.Group();
    arrow.name = 'flip-arrow';
    arrow.position.set(asamp.x, heightAt(asamp.dist) + 0.14, asamp.z);
    arrow.rotation.y = GS.yawFromForwardXZ(asamp.tx, asamp.tz);
    var shaft = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 2.6), glow);
    shaft.position.z = -0.15;
    var headL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 1.25), glow);
    headL.position.set(-0.38, 0, -1.55);
    headL.rotation.y = 0.55;
    var headR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 1.25), glow);
    headR.position.set(0.38, 0, -1.55);
    headR.rotation.y = -0.55;
    arrow.add(shaft);
    arrow.add(headL);
    arrow.add(headR);
    group.add(arrow);
    root.add(group);
    return 1;
  }

  function addChevron(root, sample, material, y, scale) {
    var holder = new THREE.Group();
    holder.position.set(sample.x, y, sample.z);
    holder.rotation.y = GS.yawFromForwardXZ(sample.tx, sample.tz);
    var lay = new THREE.Group();
    lay.rotation.x = -Math.PI / 2;
    var s = scale || 1;
    var cone = new THREE.Mesh(new THREE.ConeGeometry(0.95 * s, 2.1 * s, 3), material);
    cone.scale.set(1, 1, 0.14);
    lay.add(cone);
    holder.add(lay);
    root.add(holder);
  }

  function addGate(root, sample, baseY, side0, side1, barY, look) {
    var group = new THREE.Group();
    group.name = 'flip-gate';
    group.position.set(sample.x, baseY, sample.z);
    group.rotation.y = GS.yawFromForwardXZ(sample.tx, sample.tz);
    var span = Math.abs(side1 - side0);
    var mid = (side0 + side1) * 0.5;
    var postH = Math.max(2.4, barY + 0.35);
    var postL = new THREE.Mesh(new THREE.BoxGeometry(0.7, postH, 0.7), look.gate);
    postL.position.set(side0, postH / 2, 0);
    var postR = postL.clone();
    postR.position.x = side1;
    var bar = new THREE.Mesh(new THREE.BoxGeometry(span + 1.2, 0.55, 0.7), look.gate);
    bar.position.set(mid, barY, 0);
    var board = new THREE.Mesh(new THREE.BoxGeometry(Math.min(span, 8.5), 1.15, 0.22), look.ceilWarn);
    board.position.set(mid, Math.max(1.3, barY * 0.42), 0);
    var lamp = new THREE.Mesh(new THREE.BoxGeometry(span * 0.55, 0.28, 0.28), look.lamp);
    lamp.position.set(mid, Math.max(1.6, barY - 0.55), 0.45);
    group.add(postL);
    group.add(postR);
    group.add(bar);
    group.add(board);
    group.add(lamp);
    root.add(group);
  }

  function addStart(root, sample, half, y, look) {
    var line = new THREE.Mesh(new THREE.BoxGeometry(half * 2 - 1.4, 0.06, 1.15), look.lamp);
    line.position.set(sample.x, y + 0.1, sample.z);
    line.rotation.y = GS.yawFromForwardXZ(sample.tx, sample.tz);
    line.name = 'start-line';
    root.add(line);
    var gantry = new THREE.Group();
    gantry.position.set(sample.x, y, sample.z);
    gantry.rotation.y = GS.yawFromForwardXZ(sample.tx, sample.tz);
    var postH = 5.2;
    var span = half * 2 + 2.4;
    var left = new THREE.Mesh(new THREE.BoxGeometry(0.55, postH, 0.55), look.wall);
    left.position.set(-span / 2, postH / 2, 0);
    var right = left.clone();
    right.position.x = span / 2;
    var beam = new THREE.Mesh(new THREE.BoxGeometry(span + 0.6, 0.42, 0.55), look.propB);
    beam.position.set(0, postH - 0.2, 0);
    gantry.add(left);
    gantry.add(right);
    gantry.add(beam);
    var li;
    for (li = 0; li < 3; li++) {
      var bulb = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.4), look.lamp);
      bulb.position.set((li - 1) * 1.35, postH - 0.85, 0.35);
      bulb.name = 'start-light';
      gantry.add(bulb);
    }
    root.add(gantry);
  }

  function addGrid(root, sampleAt, half, heightAt, look, spawnDist) {
    var slots = [spawnDist - 16, spawnDist - 11, spawnDist - 6, spawnDist - 1];
    var i;
    for (i = 0; i < slots.length; i++) {
      if (slots[i] <= 2) continue;
      var s = sampleAt(slots[i]);
      var stripe = new THREE.Mesh(new THREE.BoxGeometry(half * 1.35, 0.045, 0.45), i % 2 ? look.lane : look.apron);
      stripe.position.set(s.x, heightAt(s.dist) + 0.1, s.z);
      stripe.rotation.y = GS.yawFromForwardXZ(s.tx, s.tz);
      root.add(stripe);
    }
  }

  function addPosts(root, samples, closed, heightAt, side, look, every) {
    var n = samples.length;
    var quads = closed ? n : n - 1;
    var acc = 0;
    var i;
    for (i = 0; i < quads; i += 1) {
      var a = samples[i];
      var b = samples[closed ? (i + 1) % n : i + 1];
      acc += Math.hypot(b.x - a.x, b.z - a.z);
      if (acc < every) continue;
      acc = 0;
      var post = new THREE.Group();
      var pole = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.4, 0.38), look.wall);
      pole.position.y = 1.2;
      var head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.7), look.lamp);
      head.position.y = 2.5;
      post.add(pole);
      post.add(head);
      post.position.set(a.x + a.rx * side, heightAt(a.dist), a.z + a.rz * side);
      root.add(post);
    }
  }

  function addBox(root, w, h, d, mat, x, y, z) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    root.add(mesh);
    return mesh;
  }

  function checkContinuity(samples, closed, errors, label) {
    var n = samples.length;
    var quads = closed ? n : n - 1;
    var i;
    for (i = 0; i < quads; i++) {
      var a = samples[i];
      var b = samples[closed ? (i + 1) % n : i + 1];
      var seg = Math.hypot(b.x - a.x, b.z - a.z);
      if (seg > STEP * 2.4) errors.push(label + ' gap at ' + i);
      var dot = a.tx * b.tx + a.tz * b.tz;
      if (dot < 0.96) errors.push(label + ' kink at ' + i);
    }
  }

  function minRadius(pieces) {
    var r = Infinity;
    var i;
    for (i = 0; i < pieces.length; i++) {
      if (pieces[i].kind !== 'straight') r = Math.min(r, pieces[i].radius);
    }
    return r;
  }

  function buildCourse(def) {
    var errors = [];
    var compiled = compilePath(def.start, def.segs, STEP, true);
    var length = compiled.length;
    var samples = compiled.samples;
    var end = compiled.endPose;
    if (Math.hypot(end.x - def.start.x, end.z - def.start.z) > 0.08) {
      errors.push(def.id + ' loop does not close');
    }
    var tdot = end.tx * def.start.tx + end.tz * def.start.tz;
    if (tdot < 0.999) errors.push(def.id + ' heading does not close');
    checkContinuity(samples, true, errors, def.id);

    var jump = def.jump ? def.jump(compiled.pieces, length) : null;
    var spans = def.spans(compiled.pieces, length);
    var heightAt = makeHeight(spans, jump, length);
    var half = def.half;
    var wall = def.wall;

    function sampleAt(dist) {
      return samplePieces(compiled.pieces, dist, length, true);
    }

    var flip = def.makeFlip(compiled, sampleAt, heightAt, errors);
    var flipSignMats = [];
    var flipSignCount = 0;
    var segments = [];
    var look = createLook();
    var root = new THREE.Group();
    root.name = 'track-' + def.id;

    var ground = new THREE.Mesh(new THREE.PlaneGeometry(def.ground || 1500, def.ground || 1500), look.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.22;
    root.add(ground);

    if (def.water) {
      var water = new THREE.Mesh(new THREE.PlaneGeometry(def.water.w, def.water.d), look.water);
      water.rotation.x = -Math.PI / 2;
      water.position.set(def.water.x, def.water.y, def.water.z);
      root.add(water);
    }

    function yRoad(sample) { return heightAt(sample.dist) + 0.05; }
    addRibbon(root, samples, -(wall + 1.6), wall + 1.6, function (s) {
      return heightAt(s.dist) + 0.02;
    }, look.shoulder, true);
    addRibbon(root, samples, -half, half, yRoad, look.asphalt, true);
    addRibbon(root, samples, -0.18, 0.18, function (s) {
      return heightAt(s.dist) + 0.08;
    }, look.lane, true);
    addRibbon(root, samples, half - 0.85, half - 0.12, function (s) {
      return heightAt(s.dist) + 0.09;
    }, look.curb, true);
    addRibbon(root, samples, -half + 0.12, -half + 0.85, function (s) {
      return heightAt(s.dist) + 0.09;
    }, look.curbB, true);

    if (jump) {
      var rampSamples = rangeOf(samples, jump.d0 - 2, jump.d1 + 2);
      if (rampSamples.length > 2) {
        addRibbon(root, rampSamples, -half + 0.4, half - 0.4, function (s) {
          return heightAt(s.dist) + 0.1;
        }, look.ramp, false);
      }
    }

    var skipMain = null;
    if (flip && flip.kind === 'shortcut') {
      // Open the rail where the shortcut deck meets the wall face.
      // Testing the road center left a slit the car still hit.
      skipMain = function (a, b, offset) {
        var faceOff = offset - Math.sign(offset || 1) * 0.35;
        var rx = (a.rx + b.rx) * 0.5;
        var rz = (a.rz + b.rz) * 0.5;
        var mx = (a.x + b.x) * 0.5 + rx * faceOff;
        var mz = (a.z + b.z) * 0.5 + rz * faceOff;
        var hit = projectPoly(flip.samples, mx, mz, flip.length, false);
        return hit.center < flip.half + 2.6;
      };
    }

    var wallH = def.wallH || 1.7;
    addWalls(root, samples, wall, 0.7, wallH, look.wall, segments, -1, heightAt, true, skipMain);
    addWalls(root, samples, -wall, 0.7, wallH, look.wall, segments, 1, heightAt, true, skipMain);

    var lineS = sampleAt(0.4);
    addStart(root, lineS, half, heightAt(0.4), look);
    addGrid(root, sampleAt, half, heightAt, look, def.spawn);
    addPosts(root, samples, true, heightAt, wall - 0.15, look, 34);

    var pi;
    for (pi = 0; pi < compiled.pieces.length; pi++) {
      var piece = compiled.pieces[pi];
      if (piece.kind === 'straight') continue;
      var marks = [piece.d0 - 26, piece.d0 - 16, piece.d0 - 7];
      var mi;
      for (mi = 0; mi < marks.length; mi++) {
        var md = wrapDist(marks[mi], length);
        var ms = sampleAt(md);
        addChevron(root, ms, look.chevron, heightAt(md) + 0.2, 1.15);
      }
    }

    if (jump) {
      var ji;
      for (ji = 0; ji < 3; ji++) {
        var jd = jump.d0 - 22 + ji * 6;
        var js = sampleAt(jd);
        addChevron(root, js, look.banner, heightAt(jd) + 0.22, 1.25);
      }
    }

    if (flip && flip.kind === 'shelf') {
      var shelfSamples = rangeOf(samples, flip.d0, flip.d1);
      addDeck(root, shelfSamples, flip.s0, flip.s1, function (s) {
        return flip.yAt(s.dist);
      }, 0.46, look.ceiling, look.ceilWarn, flip.land0, false);
      var gateS = sampleAt(flip.d0 + 1);
      addGate(root, gateS, heightAt(gateS.dist), flip.s0, flip.s1, flip.yAt(gateS.dist) - heightAt(gateS.dist), look);
      var apron = rangeOf(samples, flip.d0 - 16, flip.d1 + 10);
      if (apron.length > 2) {
        addRibbon(root, apron, flip.s0, flip.s1, function (s) {
          return heightAt(s.dist) + 0.11;
        }, look.apron, false);
      }
      var land = rangeOf(samples, flip.land0, flip.d1 + 8);
      if (land.length > 2) {
        addRibbon(root, land, -half + 0.6, half - 0.6, function (s) {
          return heightAt(s.dist) + 0.12;
        }, look.landing, false);
      }
      var ci;
      for (ci = 0; ci < 5; ci++) {
        var cd = flip.d0 - 34 + ci * 6;
        if (cd < 2) continue;
        var cs = sampleAt(cd);
        addChevron(root, cs, look.gate, heightAt(cd) + 0.22, 1.45);
      }
    }

    if (flip && flip.kind === 'shortcut') {
      checkContinuity(flip.samples, false, errors, def.id + ' shortcut');
      addDeck(root, flip.samples, -flip.half, flip.half, function (s) {
        return flip.yAt(s.dist);
      }, 0.48, look.ceiling, look.ceilWarn, flip.airEnd - 8, false);
      addWalls(root, flip.samples, flip.half + 1.35, 0.55, 1.35, look.wall, segments, -1, function (s) {
        return flip.yAt(s.dist) - 1.35;
      }, false, function (a) {
        var near = projectPoly(samples, a.x, a.z, length, true);
        // Open the edge while the deck is still over a road. A far cove keeps its wall.
        return near.center < wall + 8;
      });
      addWalls(root, flip.samples, -(flip.half + 1.35), 0.55, 1.35, look.wall, segments, 1, function (s) {
        return flip.yAt(s.dist) - 1.35;
      }, false, function (a) {
        var near = projectPoly(samples, a.x, a.z, length, true);
        // Open the edge while the deck is still over a road. A far cove keeps its wall.
        return near.center < wall + 8;
      });
      var entry = flip.samples[0];
      addGate(root, entry, heightAt(flip.main0), -half + 0.4, half - 0.4, flip.yAt(0) - heightAt(flip.main0), look);
      var landMain = rangeOf(
        samples,
        Math.min(flip.arrival, flip.main1) - 6,
        Math.max(flip.arrival, flip.main1) + 8
      );
      if (landMain.length > 2) {
        addRibbon(root, landMain, -half + 0.5, half - 0.5, function (s) {
          return heightAt(s.dist) + 0.12;
        }, look.landing, false);
      }
      var aheadLap = flip.arrival - flip.main0;
      if (aheadLap < 0) aheadLap += length;
      if (aheadLap < 40 || aheadLap > length - 30) errors.push(def.id + ' shortcut does not advance the lap');
      var lead;
      for (lead = 0; lead < 5; lead++) {
        var ld = flip.main0 - 38 + lead * 6;
        var ls = sampleAt(ld);
        addChevron(root, ls, look.gate, heightAt(ld) + 0.22, 1.45);
      }
      var si;
      for (si = 0; si < flip.samples.length; si += 4) {
        var fs = flip.samples[si];
        if (fs.dist < 8) continue;
        addChevron(root, fs, look.gate, flip.yAt(fs.dist) - 0.15, 1.05);
      }
      var landS = [];
      for (si = 0; si < flip.samples.length; si++) {
        if (flip.samples[si].dist >= flip.airEnd) landS.push(flip.samples[si]);
      }
      if (landS.length > 2) {
        addRibbon(root, landS, -flip.half + 0.4, flip.half - 0.4, function (s) {
          return flip.yAt(s.dist) - 0.02;
        }, look.landing, false);
      }
      var endP = flip.samples[flip.samples.length - 1];
      var endHit = projectPoly(samples, endP.x, endP.z, length, true);
      if (Math.abs(endHit.side) > half - 1) errors.push(def.id + ' shortcut misses the landing');
      var probe;
      for (probe = 0; probe < flip.samples.length; probe += 2) {
        var ps = flip.samples[probe];
        var laterals = [0, flip.half * 0.55, -flip.half * 0.55];
        var li2;
        for (li2 = 0; li2 < laterals.length; li2++) {
          var px = ps.x + ps.rx * laterals[li2];
          var pz = ps.z + ps.rz * laterals[li2];
          var wi;
          for (wi = 0; wi < segments.length; wi++) {
            var seg = segments[wi];
            var gap = pointSegDist(px, pz, seg.ax, seg.az, seg.bx, seg.bz);
            if (gap < 1.15) {
              errors.push(def.id + ' shortcut clips a wall near ' + Math.round(ps.dist));
              probe = flip.samples.length;
              break;
            }
          }
        }
      }
    }

    if (flip && (flip.kind === 'shortcut' || flip.kind === 'shelf')) {
      var signEntry = flip.kind === 'shelf' ? flip.d0 : flip.main0;
      flipSignCount = addFlipSigns(root, sampleAt, heightAt, signEntry, length, half, flipSignMats);
    }

    if (def.dress) {
      def.dress({
        root: root,
        look: look,
        samples: samples,
        sampleAt: sampleAt,
        heightAt: heightAt,
        half: half,
        wall: wall,
        length: length,
        pieces: compiled.pieces,
        flip: flip,
        errors: errors,
        addBox: function (w, h, d, mat, x, y, z) {
          return addBox(root, w, h, d, mat, x, y, z);
        },
        clear: function (x, z, extra) {
          var c = clearance(samples, x, z);
          if (flip && flip.samples && clearance(flip.samples, x, z) < (extra || wall)) return 0;
          return c;
        }
      });
    }

    var checkpoints = [0];
    var cd = 110;
    while (cd < length - 40) {
      checkpoints.push(Math.round(cd));
      cd += 110;
    }

    var spawn = sampleAt(def.spawn);
    if (spawn.tx < 0.98) errors.push(def.id + ' spawn is not facing +X');

    function driveHalf(dist, side) {
      if (def.widen && side > 0 && dist >= def.widen.d0 && dist <= def.widen.d1) return def.widen.outer;
      return half;
    }

    function query(x, z, latched) {
      var main = projectPoly(samples, x, z, length, true);
      var roadY = heightAt(main.dist);
      var limit = driveHalf(main.dist, main.side);
      var flipHit = null;
      var pad = latched ? 1.8 : 0;
      if (flip && flip.kind === 'shelf') {
        var d = main.dist;
        var inD = d >= flip.d0 && d <= flip.d1;
        var inS = main.side >= flip.s0 - pad && main.side <= flip.s1 + pad;
        if (inD && inS) {
          flipHit = {
            y: flip.yAt(d),
            lat: main.side,
            half: Math.max(Math.abs(flip.s1), Math.abs(flip.s0)),
            progress: d,
            down: d >= flip.land0,
            tx: main.tx,
            tz: main.tz
          };
        }
      } else if (flip && flip.kind === 'shortcut') {
        var fp = projectPoly(flip.samples, x, z, flip.length, false);
        var limitF = flip.half + (latched ? 0.85 : 0.35);
        var onPath = fp.center <= limitF && fp.dist >= -1 && fp.dist <= flip.length + 0.5;
        var entry = fp.dist <= flip.entry + 8;
        if (onPath && (latched || entry)) {
          // A cut that crosses the finish is behind main0 on the number line
          // and still ahead on the lap. Progress has to wrap or the lap is lost.
          var aheadLap = flip.arrival - flip.main0;
          if (aheadLap < 0) aheadLap += length;
          var progress = fp.dist >= flip.airEnd
            ? main.dist
            : wrapDist(flip.main0 + aheadLap * clamp(fp.dist / (flip.airEnd || 1), 0, 1), length);
          flipHit = {
            y: flip.yAt(fp.dist),
            lat: fp.side,
            half: flip.half,
            progress: progress,
            down: fp.dist >= flip.airEnd - 4,
            sDist: fp.dist,
            tx: fp.tx,
            tz: fp.tz
          };
        }
      }
      var progress = latched && flipHit ? flipHit.progress : main.dist;
      var hints = hintsAt(main.dist, flipHit, latched);
      return {
        dist: main.dist,
        progress: progress,
        // On a Flip surface this is the offset from that surface, not the
        // bay-road centerline. The cove shortcut leaves the main road on purpose.
        side: flipHit ? flipHit.lat : main.side,
        mainSide: main.side,
        roadY: roadY,
        half: limit,
        flip: flipHit,
        hints: hints,
        tx: main.tx,
        tz: main.tz,
        rx: main.rx,
        rz: main.rz,
        x: main.x,
        z: main.z
      };
    }

    function hintsAt(dist, flipHit, latched) {
      var flipPrompt = false;
      var down = false;
      var up = false;
      // Leads are long enough for a shift at race speed, then the prompt
      // ends at the gate so it does not ride along after the choice.
      if (flip && flip.kind === 'shelf') {
        var toGate = signedAlong(dist, flip.d0, length);
        // A short lead. The old 108 m window lit FLIP on the Warm-Up grid.
        flipPrompt = toGate > 4 && toGate < 34;
        if (latched) {
          var toLand = signedAlong(dist, flip.land0, length);
          var landSpan = Math.max(12, flip.d1 - flip.land0);
          down = toLand < 26 && toLand > -(landSpan + 8);
        }
      } else if (flip && flip.kind === 'shortcut') {
        var toEntry = signedAlong(dist, flip.main0, length);
        // Short window around the gate. The old 34 m lead reached back into
        // the yard jump, and shifting to 4 in that air is a stall.
        flipPrompt = toEntry > -14 && toEntry < 16;
        if (jump && dist < jump.d1) flipPrompt = false;
        if (latched && flipHit && flipHit.sDist != null) {
          var remain = flip.airEnd - flipHit.sDist;
          var landing = Math.max(12, flip.length - flip.airEnd);
          // Only once the deck is returning to asphalt. A cue in the middle
          // of the cove makes the downshift a stall.
          down = remain < 22 && remain > -(landing + 6);
        }
      }
      if (jump) {
        var toRamp = signedAlong(dist, jump.d0, length);
        up = toRamp > 2 && toRamp < 96;
      }
      return { flip: flipPrompt, down: down, up: up };
    }

    function guide(mode, x, z, latched) {
      var q = query(x, z, latched);
      var lookAhead = 18;
      if (flip && flip.kind === 'shortcut') {
        var near = q.dist >= flip.main0 - 55 && q.dist <= flip.main0 + 30;
        // Latched cars are already on the shortcut. Follow that deck even if
        // the caller asked for the main-road centerline.
        if (latched || (mode === 'flip' && near)) {
          var fp = projectPoly(flip.samples, x, z, flip.length, false);
          var sd = clamp((latched ? fp.dist : 0) + lookAhead, 0, flip.length - 0.2);
          if (!latched) sd = Math.min(flip.entry * 0.65, flip.length - 1);
          var sp = samplePieces(flip.pieces, sd, flip.length, false);
          return { x: sp.x, z: sp.z, tx: sp.tx, tz: sp.tz, y: flip.yAt(sd) };
        }
      }
      if (mode === 'flip' && flip && flip.kind === 'shelf') {
        var inShelf = q.progress >= flip.d0 - 50 && q.progress <= flip.d1;
        if (latched || inShelf) {
          var pd = wrapDist(q.progress + lookAhead, length);
          var sp2 = sampleAt(pd);
          return { x: sp2.x, z: sp2.z, tx: sp2.tx, tz: sp2.tz, y: latched ? flip.yAt(pd) : heightAt(pd) };
        }
      }
      var pd2 = wrapDist(q.progress + lookAhead, length);
      var sp3 = sampleAt(pd2);
      return { x: sp3.x, z: sp3.z, tx: sp3.tx, tz: sp3.tz, y: heightAt(pd2) };
    }

    function poseOnRail(along, lane, spec) {
      spec = spec || { kind: 'road' };
      var laneUse = lane || 0;
      if (spec.kind === 'shortcut' && flip && flip.kind === 'shortcut') {
        var sd = spec.sDist || 0;
        if (sd < 0) sd = 0;
        if (sd > flip.length) sd = flip.length;
        var sp = samplePieces(flip.pieces, sd, flip.length, false);
        var side = clamp(laneUse * 0.45, -flip.half + 1.6, flip.half - 1.6);
        var y = flip.yAt(sd);
        var roadEntry = heightAt(flip.main0);
        var roadLand = heightAt(flip.main1);
        if (sd < 12) y = lerp(roadEntry, y, smooth01(sd / 12));
        if (sd > flip.length - 16) {
          y = lerp(y, roadLand, smooth01((sd - (flip.length - 16)) / 16));
        }
        // Wheels stay down while the car leaves the road, then the roll
        // flicks over about 4 m. A linear 90° pose reads as stood on end.
        var up = 1;
        if (sd < 5.5) up = 0;
        else if (sd < 9.5) up = smooth01(smooth01((sd - 5.5) / 4));
        if (sd > flip.airEnd - 7) {
          var exitU = 1 - smooth01(smooth01((sd - (flip.airEnd - 7)) / 5));
          if (exitU < up) up = exitU;
        }
        if (up < 0) up = 0;
        if (up > 1) up = 1;
        if (y < roadLand - 0.4 && sd > flip.length - 16) y = roadLand;
        return { x: sp.x + sp.rx * side, y: y, z: sp.z + sp.rz * side, tx: sp.tx, tz: sp.tz, up: up };
      }
      var d = wrapDist(along, length);
      var sp2 = sampleAt(d);
      var roadY = heightAt(d);
      var y2 = roadY;
      var up2 = 0;
      var side2 = clamp(laneUse, -half + 1.5, half - 1.5);
      if (spec.kind === 'shelf' && flip && flip.kind === 'shelf' && d >= flip.d0 && d <= flip.d1) {
        var ceilY = flip.yAt(d);
        var entryT = clamp((d - flip.d0) / 12, 0, 1);
        var exitT = 1;
        if (d >= flip.land0) exitT = 1 - clamp((d - flip.land0) / Math.max(8, flip.d1 - flip.land0), 0, 1);
        var gate = entryT < exitT ? entryT : exitT;
        y2 = lerp(roadY, ceilY, smooth01(Math.min(1, gate / 0.55)));
        var rollT = gate <= 0.5 ? 0 : clamp((gate - 0.5) / 0.22, 0, 1);
        up2 = smooth01(smooth01(rollT));
        side2 = clamp(laneUse, flip.s0 + 1.4, flip.s1 - 1.4);
      }
      if (y2 < roadY - 0.2) y2 = roadY;
      return { x: sp2.x + sp2.rx * side2, y: y2, z: sp2.z + sp2.rz * side2, tx: sp2.tx, tz: sp2.tz, up: up2 };
    }

    var lineInfo = { kind: 'none' };
    if (flip && flip.kind === 'shelf') {
      lineInfo = { kind: 'shelf', d0: flip.d0, d1: flip.d1, land0: flip.land0 };
    } else if (flip && flip.kind === 'shortcut') {
      lineInfo = {
        kind: 'shortcut',
        main0: flip.main0,
        main1: flip.main1,
        length: flip.length,
        airEnd: flip.airEnd
      };
    }

    var zones = {
      kind: flip ? flip.kind : 'none',
      flip0: flip && flip.kind === 'shelf' ? flip.d0 : (flip ? flip.main0 : 0),
      flip1: flip && flip.kind === 'shelf' ? flip.d1 : (flip ? flip.main1 : 0),
      land0: flip && flip.kind === 'shelf' ? flip.land0 : (flip ? flip.arrival : 0),
      jump0: jump ? jump.d0 : -1,
      jumpLip: jump ? jump.lip : -1,
      jump1: jump ? jump.d1 : -1,
      ceilY: 4
    };

    return {
      id: def.id,
      name: def.name,
      laps: def.laps,
      root: root,
      look: look,
      length: length,
      half: half,
      asphaltHalf: half,
      wall: wall,
      spawnDist: def.spawn,
      samples: samples,
      segments: segments,
      sample: sampleAt,
      project: function (x, z) {
        return projectPoly(samples, x, z, length, true);
      },
      query: query,
      guide: guide,
      roadHeight: heightAt,
      driveHalf: driveHalf,
      inFlipVolume: function (dist, side) {
        var s = sampleAt(dist);
        var q = query(s.x + s.rx * side, s.z + s.rz * side, false);
        return !!q.flip;
      },
      errors: errors,
      checkpoints: checkpoints,
      zones: zones,
      minRadius: minRadius(compiled.pieces),
      flipKind: flip ? flip.kind : 'none',
      flipSignCount: flipSignCount,
      flipSignMats: flipSignMats,
      line: lineInfo,
      poseOnRail: poseOnRail
    };
  }

  function shelfFlip(d0, d1, land0, s0, s1, clear, landClear, heightAt) {
    return {
      kind: 'shelf',
      d0: d0,
      d1: d1,
      land0: land0,
      s0: s0,
      s1: s1,
      clear: clear,
      yAt: function (dist) {
        var extra = clear;
        if (dist >= land0) {
          var t = clamp((dist - land0) / ((d1 - land0) || 1), 0, 1);
          extra = lerp(clear, landClear, smooth01(t));
        }
        return heightAt(dist) + extra;
      }
    };
  }

  function shortcutFlip(main, sampleAt, entryDist, segs, yStart, yLand, half, mainLength) {
    var pose = sampleAt(entryDist);
    var open = compilePath({ x: pose.x, z: pose.z, tx: pose.tx, tz: pose.tz }, segs, STEP, false);
    var airEnd = 0;
    var i;
    for (i = 0; i < segs.length; i++) {
      if (segs[i].landing) break;
      airEnd += open.pieces[i].len;
    }
    if (airEnd <= 0) airEnd = open.length * 0.7;
    var arrivalSample = samplePieces(open.pieces, airEnd, open.length, false);
    var arrivalHit = projectPoly(main.samples, arrivalSample.x, arrivalSample.z, mainLength, true);
    var end = open.samples[open.samples.length - 1];
    var endHit = projectPoly(main.samples, end.x, end.z, mainLength, true);
    return {
      kind: 'shortcut',
      samples: open.samples,
      pieces: open.pieces,
      length: open.length,
      half: half,
      entry: open.pieces[0].len,
      airEnd: airEnd,
      main0: entryDist,
      arrival: arrivalHit.dist,
      main1: endHit.dist,
      yAt: function (sDist) {
        var glide = Math.min(airEnd, open.length * 0.82);
        if (sDist <= glide) return lerp(yStart, yLand + 0.7, smooth01(sDist / glide));
        var t = clamp((sDist - glide) / ((open.length - glide) || 1), 0, 1);
        return lerp(yLand + 0.7, yLand, smooth01(t));
      }
    };
  }

  function placeIfClear(ctx, x, z, need, w, h, d, mat, y) {
    if (ctx.clear(x, z) < need) return false;
    ctx.addBox(w, h, d, mat, x, y === undefined ? h / 2 : y, z);
    return true;
  }

  var COURSES = {
    warmup: function () {
      var R = 42;
      var dock = 176;
      var side = 78;
      var start = { x: -dock / 2, z: R, tx: 1, tz: 0 };
      return buildCourse({
        id: 'warmup',
        name: 'WARM-UP YARD',
        laps: 3,
        start: start,
        half: 9,
        wall: 13.2,
        wallH: 1.85,
        spawn: 22,
        segs: [
          { kind: 'straight', len: dock },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: side },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: dock },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: side },
          { kind: 'arc', radius: R, angle: Math.PI / 2 }
        ],
        spans: function () { return [{ d0: 0, d1: 1e9, y0: 0, y1: 0 }]; },
        jump: function (pieces) {
          var base = pieces[4].d0;
          return { d0: base + 44, lip: base + 66, d1: base + 86, h: 1.62 };
        },
        makeFlip: function (compiled, sampleAt, heightAt) {
          // Underside tunnel after the yard jump. Two left quarters and a
          // northbound straight cross the yard and rejoin the finish straight,
          // skipping both west corners. The gate stays after the jump.
          var entry = 496;
          var run = 8;
          var radius = 36;
          var pose = sampleAt(entry);
          var northZ = sampleAt(48).z;
          var sz = pose.z + pose.tz * run;
          var straight = northZ - sz - 2 * radius;
          if (straight < 48) straight = 48;
          return shortcutFlip(compiled, sampleAt, entry, [
            { kind: 'straight', len: run },
            { kind: 'arc', radius: radius, angle: Math.PI / 2 },
            { kind: 'straight', len: straight },
            { kind: 'arc', radius: radius, angle: Math.PI / 2 },
            { kind: 'straight', len: 30, landing: true }
          ], 4.45, 1.15, 11.2, compiled.length);
        },
        dress: function (ctx) {
          placeIfClear(ctx, 0, -30, ctx.wall + 6, 28, 9, 18, ctx.look.prop, 4.5);
          placeIfClear(ctx, -36, -18, ctx.wall + 4, 16, 6.5, 12, ctx.look.propB, 3.25);
          placeIfClear(ctx, 34, -46, ctx.wall + 4, 14, 5, 14, ctx.look.prop, 2.5);
          placeIfClear(ctx, 8, -8, ctx.wall + 4, 10, 3.2, 7, ctx.look.wall, 1.6);
          var k;
          for (k = 0; k < 4; k++) {
            placeIfClear(ctx, -70 + k * 18, 62, ctx.wall + 3, 12, 3.4, 4.2, ctx.look.propB, 1.7);
          }
          placeIfClear(ctx, 0, 78, ctx.wall + 8, 70, 0.4, 26, ctx.look.water, 0.15);
        }
      });
    },
    coastal: function () {
      var R = 56;
      var straight = 206;
      var start = { x: -straight / 2, z: R, tx: 1, tz: 0 };
      var bridgeY = 7.2;
      return buildCourse({
        id: 'coastal',
        name: 'COASTAL SWITCHBACK',
        laps: 4,
        start: start,
        half: 9.2,
        wall: 13.6,
        wallH: 2.05,
        spawn: 24,
        ground: 1700,
        water: { x: 0, z: 0, y: -0.65, w: 1600, d: 1600 },
        segs: [
          { kind: 'straight', len: straight },
          { kind: 'arc', radius: R, angle: Math.PI },
          { kind: 'straight', len: straight },
          { kind: 'arc', radius: R, angle: Math.PI }
        ],
        spans: function (pieces, length) {
          return [
            { d0: pieces[0].d0, d1: pieces[0].d1, y0: bridgeY, y1: bridgeY },
            { d0: pieces[1].d0, d1: pieces[1].d1, y0: bridgeY, y1: 0, smooth: true },
            { d0: pieces[2].d0, d1: pieces[2].d1, y0: 0, y1: 0 },
            { d0: pieces[3].d0, d1: pieces[3].d1, y0: 0, y1: bridgeY, smooth: true },
            { d0: length - 0.01, d1: length + 5, y0: bridgeY, y1: bridgeY }
          ];
        },
        makeFlip: function (compiled, sampleAt, heightAt) {
          // Arc apex stays west of the east hairpin's inner rail.
          var entry = 78;
          var pose = sampleAt(entry);
          var sc = shortcutFlip(compiled, sampleAt, entry, [
            { kind: 'straight', len: 14 },
            { kind: 'arc', radius: R, angle: Math.PI },
            { kind: 'straight', len: 78, landing: true }
          ], bridgeY + 4.35, 1.35, 8.4, compiled.length);
          if (Math.abs(pose.tz) > 0.02) compiled.errors = compiled.errors;
          return sc;
        },
        dress: function (ctx) {
          var s;
          for (s = 30; s < 180; s += 26) {
            var p = ctx.sampleAt(s);
            var ox = p.x + p.rx * (ctx.wall + 10);
            var oz = p.z + p.rz * (ctx.wall + 10);
            placeIfClear(ctx, ox, oz, ctx.wall + 4, 16, 18, 12, ctx.look.prop, 9);
            placeIfClear(ctx, ox + p.rx * 14, oz + p.rz * 14, ctx.wall + 8, 12, 11, 10, ctx.look.propB, 5.5);
          }
          // Bridge piers under the cliff road, clear of the cove shortcut.
          for (s = 36; s < 78; s += 18) {
            var pier = ctx.sampleAt(s);
            var px = pier.x + pier.rx * (ctx.wall + 2.4);
            var pz = pier.z + pier.rz * (ctx.wall + 2.4);
            if (ctx.clear(px, pz) > ctx.wall + 1) {
              ctx.addBox(1.6, 7.4, 1.6, ctx.look.propB, px, 3.3, pz);
            }
          }
          placeIfClear(ctx, 150, 0, ctx.wall + 8, 22, 20, 22, ctx.look.prop, 10);
          placeIfClear(ctx, -150, 0, ctx.wall + 8, 18, 14, 18, ctx.look.propB, 7);
        }
      });
    },
    skyway: function () {
      var R = 52;
      var long = 236;
      var cross = 92;
      var high = 12;
      var start = { x: -long / 2, z: R, tx: 1, tz: 0 };
      return buildCourse({
        id: 'skyway',
        name: 'SKYWAY SPLIT',
        laps: 4,
        start: start,
        half: 9.2,
        wall: 13.5,
        wallH: 1.65,
        spawn: 26,
        ground: 1700,
        segs: [
          { kind: 'straight', len: long },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: cross },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: long },
          { kind: 'arc', radius: R, angle: Math.PI / 2 },
          { kind: 'straight', len: cross },
          { kind: 'arc', radius: R, angle: Math.PI / 2 }
        ],
        spans: function (pieces) {
          return [
            { d0: pieces[0].d0, d1: pieces[0].d1, y0: high, y1: high },
            { d0: pieces[1].d0, d1: pieces[1].d1, y0: high, y1: high },
            { d0: pieces[2].d0, d1: pieces[2].d1, y0: high, y1: 0, smooth: true },
            { d0: pieces[3].d0, d1: pieces[3].d1, y0: 0, y1: 0 },
            { d0: pieces[4].d0, d1: pieces[4].d1, y0: 0, y1: 0 },
            { d0: pieces[5].d0, d1: pieces[5].d1, y0: 0, y1: 0 },
            { d0: pieces[6].d0, d1: pieces[6].d1, y0: 0, y1: high, smooth: true },
            { d0: pieces[7].d0, d1: pieces[7].d1 + 5, y0: high, y1: high }
          ];
        },
        makeFlip: function (compiled, sampleAt, heightAt) {
          // Ceiling over the low city straight, then a corner cut onto the
          // west ramp. Wider than the old shelf, and open at the edges so a
          // committed steer can still leave. A brief full-lock is assisted.
          var base = compiled.pieces[4].d0;
          var entry = base + 36;
          var pose = sampleAt(entry);
          var west = sampleAt(compiled.pieces[6].d0 + 18);
          // Start the cut near the corner so the quarter-circle meets the west ramp.
          var arcStartX = west.x + 102;
          var run = pose.tx < -0.5 ? (pose.x - arcStartX) : 80;
          if (run < 28) run = 28;
          var sx = pose.x + pose.tx * run;
          var radius = Math.abs(west.x - sx);
          if (radius < 78) radius = 78;
          if (radius > 124) radius = 124;
          var sc = shortcutFlip(compiled, sampleAt, entry, [
            { kind: 'straight', len: run },
            { kind: 'arc', radius: radius, angle: Math.PI / 2 },
            { kind: 'straight', len: 22, landing: true }
          ], heightAt(entry) + 4.65, 2.2, 10.2, compiled.length);
          return sc;
        },
        dress: function (ctx) {
          placeIfClear(ctx, 10, -20, ctx.wall + 8, 22, 10, 18, ctx.look.prop, 5);
          placeIfClear(ctx, -28, -36, ctx.wall + 8, 16, 14, 16, ctx.look.propB, 7);
          placeIfClear(ctx, 36, 8, ctx.wall + 8, 14, 8, 14, ctx.look.prop, 4);
          placeIfClear(ctx, -8, 6, ctx.wall + 10, 12, 18, 12, ctx.look.wall, 9);
          var s;
          for (s = 48; s < 220; s += 24) {
            var p = ctx.sampleAt(s);
            var ox = p.x + p.rx * (ctx.wall + 3.2);
            var oz = p.z + p.rz * (ctx.wall + 3.2);
            if (ctx.clear(ox, oz) > ctx.wall + 1) {
              ctx.addBox(1.6, highSafe(ctx.heightAt(s)), 1.6, ctx.look.propB, ox, ctx.heightAt(s) / 2, oz);
            }
            var ix = p.x - p.rx * (ctx.wall + 3.2);
            var iz = p.z - p.rz * (ctx.wall + 3.2);
            if (ctx.clear(ix, iz) > ctx.wall + 1) {
              ctx.addBox(1.6, highSafe(ctx.heightAt(s)), 1.6, ctx.look.prop, ix, ctx.heightAt(s) / 2, iz);
            }
          }
        }
      });
    }
  };

  function highSafe(y) {
    return Math.max(2.2, y);
  }

  function normalizeId(id) {
    var key = String(id || '').toLowerCase();
    if (key === '2' || key === 'coastal' || key === 'coast' || key === 'switchback') return 'coastal';
    if (key === '3' || key === 'skyway' || key === 'sky' || key === 'split') return 'skyway';
    return 'warmup';
  }

  GS.TRACK_IDS = ['warmup', 'coastal', 'skyway'];
  GS.TRACK_INFO = {
    warmup: { name: 'WARM-UP YARD', laps: 3 },
    coastal: { name: 'COASTAL SWITCHBACK', laps: 4 },
    skyway: { name: 'SKYWAY SPLIT', laps: 4 }
  };
  GS.normalizeTrackId = normalizeId;

  GS.buildTrack = function (id) {
    var key = normalizeId(id);
    var track = COURSES[key]();
    track.id = key;
    return track;
  };
})(window.GS = window.GS || {});
