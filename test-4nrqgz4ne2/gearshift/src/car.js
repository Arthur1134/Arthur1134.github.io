/* Chunky original hatch. Authored with local -Z as the nose (headlamps).
   The parent yaw is the only heading. Wheels: a steer group, then a fixed
   Z-rotation that lays the cylinder on the X axle, then a spin group. */
(function (GS) {
  'use strict';

  function lambert(color, emissive, intensity, ghost) {
    var mat = new THREE.MeshLambertMaterial({ color: color });
    if (emissive !== undefined) {
      mat.emissive = new THREE.Color(emissive);
      mat.emissiveIntensity = intensity === undefined ? 1 : intensity;
    }
    if (ghost) {
      mat.transparent = true;
      mat.opacity = 0.38;
      mat.depthWrite = false;
    }
    return mat;
  }

  function addBox(parent, w, h, d, mat, x, y, z, name) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    if (name) mesh.name = name;
    parent.add(mesh);
    return mesh;
  }

  GS.buildCar = function (opts) {
    opts = opts || {};
    var ghost = !!opts.ghost;
    var paint = opts.color == null ? 0xe15b22 : opts.color;
    var root = new THREE.Group();
    root.name = ghost ? 'ghost-car' : 'car';

    var body = lambert(paint, ghost ? 0xb7fff6 : paint, ghost ? 0.45 : 0.22, ghost);
    var dark = lambert(0x1b2126, undefined, undefined, ghost);
    var glass = lambert(ghost ? 0xd8fffb : 0x8fd0cc, ghost ? 0xb7fff6 : 0x143330, ghost ? 0.35 : 0.45, ghost);
    var cream = lambert(ghost ? 0xe8fffb : 0xf3e6cf, undefined, undefined, ghost);
    var tireMat = lambert(0x22262b, undefined, undefined, ghost);
    var hubMat = lambert(0xc5ccd1, undefined, undefined, ghost);
    var headMat = lambert(0xfff6d8, 0xffe7a8, 0.95, ghost);
    var tailMat = lambert(0xff3a3a, 0xff1c1c, 0.8, ghost);

    addBox(root, 1.62, 0.46, 3.55, body, 0, 0.66, 0.05);
    addBox(root, 1.7, 0.14, 3.62, dark, 0, 0.4, 0.05);
    var hood = addBox(root, 1.5, 0.16, 1.22, body, 0, 0.9, -0.98, 'hood');
    var cabin = addBox(root, 1.42, 0.4, 1.42, dark, 0, 1.08, 0.5, 'cabin');
    addBox(root, 1.28, 0.26, 1.16, glass, 0, 1.12, 0.44);
    addBox(root, 1.56, 0.18, 0.62, body, 0, 0.92, 1.42);
    addBox(root, 1.66, 0.07, 0.22, dark, 0, 1.2, 1.64);
    addBox(root, 0.08, 0.22, 0.12, dark, -0.62, 1.05, 1.6);
    addBox(root, 0.08, 0.22, 0.12, dark, 0.62, 1.05, 1.6);
    addBox(root, 1.74, 0.18, 0.2, dark, 0, 0.46, -1.76);
    addBox(root, 1.74, 0.18, 0.18, dark, 0, 0.46, 1.8);
    addBox(root, 0.12, 0.06, 0.9, cream, 0, 0.94, -0.95);

    var headlamps = [
      addBox(root, 0.32, 0.1, 0.06, headMat, -0.52, 0.66, -1.88, 'headlamp'),
      addBox(root, 0.32, 0.1, 0.06, headMat, 0.52, 0.66, -1.88, 'headlamp')
    ];
    var taillamps = [
      addBox(root, 0.3, 0.12, 0.06, tailMat, -0.54, 0.72, 1.9, 'taillamp'),
      addBox(root, 0.3, 0.12, 0.06, tailMat, 0.54, 0.72, 1.9, 'taillamp')
    ];

    var nose = new THREE.Object3D();
    nose.name = 'nose';
    nose.position.set(0, 0.7, -2.05);
    root.add(nose);

    var wheels = [];
    var layout = [
      { x: -0.98, z: -1.22, steer: true },
      { x: 0.98, z: -1.22, steer: true },
      { x: -0.98, z: 1.18, steer: false },
      { x: 0.98, z: 1.18, steer: false }
    ];
    for (var i = 0; i < layout.length; i++) {
      var spec = layout[i];
      var mount = new THREE.Group();
      mount.position.set(spec.x, 0.41, spec.z);
      root.add(mount);
      var orient = new THREE.Group();
      // Cylinder Y becomes the car's X axle. Spin stays on the child.
      orient.rotation.z = Math.PI / 2;
      mount.add(orient);
      var spinner = new THREE.Group();
      orient.add(spinner);
      var tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 12), tireMat);
      spinner.add(tire);
      var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 8), hubMat);
      spinner.add(hub);
      var mark = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.1), cream);
      mark.position.set(0.34, 0, 0);
      spinner.add(mark);
      wheels.push({ mount: mount, spinner: spinner, steer: spec.steer });
    }

    return {
      root: root,
      wheels: wheels,
      nose: nose,
      hood: hood,
      cabin: cabin,
      headlamps: headlamps,
      taillamps: taillamps,
      bodyMat: body,
      darkMat: dark
    };
  };
})(window.GS = window.GS || {});
