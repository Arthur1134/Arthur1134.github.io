/* One spatial frame for Gear Shift.
   Object3D local forward is -Z. rotation.y > 0 turns counter-clockwise
   seen from above. right = forward × up. Pinned checks live in checkFrame
   and run at boot: forward (0,0,-1) => right (1,0,0); yawFromForwardXZ(1,0)
   is -PI/2 and that Object3D's -Z lands on +X. */
(function (GS) {
  'use strict';

  GS.UP = { x: 0, y: 1, z: 0 };

  // yaw that points an object's local -Z along a horizontal direction (tx, tz).
  // (0,-1) -> 0. (1,0) -> -PI/2.
  GS.yawFromForwardXZ = function (tx, tz) {
    return Math.atan2(-tx, -tz);
  };

  // Player, rivals, and the ghost share this mount. Yaw points local -Z along
  // the tangent. upBlend 1 rolls 180° around that local Z so the wheels meet
  // a ceiling. Do not lookAt a car: Object3D.lookAt aims +Z, which is the tail.
  GS.orientYawRoll = function (obj, yaw, upBlend) {
    var qYaw = new THREE.Quaternion();
    var qRoll = new THREE.Quaternion();
    qYaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    qRoll.setFromAxisAngle(new THREE.Vector3(0, 0, 1), (upBlend || 0) * Math.PI);
    obj.quaternion.copy(qYaw).multiply(qRoll);
  };

  // right = forward × up, horizontal. Writes into `out` (a THREE.Vector3).
  // Do not pass a shared scratch vector in and then reuse it as forward.
  GS.rightFromForwardXZ = function (tx, tz, out) {
    out.set(-tz, 0, tx);
    var len = Math.hypot(out.x, out.z);
    if (len < 1e-8) out.set(1, 0, 0);
    else out.multiplyScalar(1 / len);
    return out;
  };

  GS.checkFrame = function () {
    var errors = [];
    var right = new THREE.Vector3();
    GS.rightFromForwardXZ(0, -1, right);
    if (Math.abs(right.x - 1) > 1e-4 || Math.abs(right.z) > 1e-4) {
      errors.push('right of -Z should be +X, got ' + right.x.toFixed(3) + ',' + right.z.toFixed(3));
    }

    var yawBack = GS.yawFromForwardXZ(0, -1);
    if (Math.abs(yawBack) > 1e-4) errors.push('yaw facing -Z should be 0');

    var yawEast = GS.yawFromForwardXZ(1, 0);
    if (Math.abs(yawEast + Math.PI / 2) > 1e-4) {
      errors.push('yaw facing +X should be -PI/2, got ' + yawEast.toFixed(4));
    }

    var probe = new THREE.Object3D();
    probe.rotation.y = yawEast;
    probe.updateMatrixWorld(true);
    var fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(probe.quaternion);
    if (fwd.x < 0.99 || Math.abs(fwd.z) > 0.02) {
      errors.push('quaternion -Z at yaw -PI/2 should be +X, got ' + fwd.x.toFixed(3) + ',' + fwd.z.toFixed(3));
    }

    // A left turn (positive yaw) from facing +X swings toward -Z.
    probe.rotation.y = yawEast + 0.25;
    probe.updateMatrixWorld(true);
    var swung = new THREE.Vector3(0, 0, -1).applyQuaternion(probe.quaternion);
    if (!(swung.z < -0.1 && swung.x > 0.8)) {
      errors.push('left turn from +X should move toward -Z, got ' + swung.x.toFixed(3) + ',' + swung.z.toFixed(3));
    }

    // 180° roll around local Z keeps -Z and sends local +Y to world -Y.
    var rolled = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    var rolledUp = new THREE.Vector3(0, 1, 0).applyQuaternion(rolled);
    var rolledFwd = new THREE.Vector3(0, 0, -1).applyQuaternion(rolled);
    if (rolledUp.y > -0.99 || Math.abs(rolledUp.x) > 0.02) {
      errors.push('flip roll should point up at -Y, got ' + rolledUp.x.toFixed(3) + ',' + rolledUp.y.toFixed(3));
    }
    if (rolledFwd.z > -0.99 || Math.abs(rolledFwd.x) > 0.02) {
      errors.push('flip roll should keep forward on -Z');
    }

    // Camera up rolls around forward. Facing -Z, a quarter roll lands on +X.
    var camUp = new THREE.Vector3();
    GS.upRolledAroundForward(0, -1, Math.PI / 2, camUp);
    if (camUp.x < 0.99 || Math.abs(camUp.y) > 0.02) {
      errors.push('quarter roll of camera up should be +X, got ' + camUp.x.toFixed(3) + ',' + camUp.y.toFixed(3));
    }
    GS.upRolledAroundForward(0, -1, Math.PI, camUp);
    if (camUp.y > -0.99) errors.push('half roll of camera up should be -Y');
    return errors;
  };

  // Roll world +Y around the horizontal forward (tx, tz).
  // angle 0 -> +Y, angle PI -> -Y.
  // Facing -Z (0,-1), angle PI/2 -> +X. That is right = (-tz, 0, tx).
  GS.upRolledAroundForward = function (tx, tz, angle, out) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    out.set(-tz * s, c, tx * s);
    return out;
  };
})(window.GS = window.GS || {});
