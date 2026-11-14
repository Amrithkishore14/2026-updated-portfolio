/* ================================================================
   NEXUS X1 — THREE.JS PROCEDURAL CAR + SCENE UTILITIES
   All geometry is hand-crafted from Three.js primitives
   ================================================================ */

/* ── MATERIALS ────────────────────────────────────── */
function createBodyMaterial(color = 0x0d0d0d) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.92,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 1,
    envMapIntensity: 1.8,
  });
}

function createGlassMaterial(opacity = 0.55) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x050a14,
    metalness: 0.05,
    roughness: 0.0,
    transmission: 0.6,
    transparent: true,
    opacity,
    envMapIntensity: 2.5,
    side: THREE.DoubleSide,
  });
}

function createChromeMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x999999,
    metalness: 1.0,
    roughness: 0.05,
    envMapIntensity: 2,
  });
}

function createEmissiveMaterial(color = 0x00e5ff, intensity = 3) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.3,
    metalness: 0,
  });
}

function createTireMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x080808,
    roughness: 0.95,
    metalness: 0.05,
  });
}

/* ── WHEEL ────────────────────────────────────────── */
function createWheel(chromeMat, tireMat, accentMat, style = 'aero') {
  const group = new THREE.Group();
  const R = 0.38;   // rim radius
  const TW = 0.18;  // tyre thickness

  // Tyre
  const tyre = new THREE.Mesh(
    new THREE.TorusGeometry(R, TW, 24, 60),
    tireMat
  );
  tyre.rotation.y = Math.PI / 2;
  group.add(tyre);

  // Rim disc
  const rimDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(R - 0.01, R - 0.01, 0.06, 40, 1, true),
    chromeMat
  );
  rimDisc.rotation.z = Math.PI / 2;
  group.add(rimDisc);

  // Spokes
  const spokeCount = style === 'track' ? 10 : style === 'performance' ? 7 : 5;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    if (style === 'aero') {
      // Flat aero blade spokes
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, R * 0.85, 0.035),
        chromeMat
      );
      spoke.position.set(0.015, 0, 0);
      const pivot = new THREE.Group();
      pivot.rotation.x = angle;
      pivot.add(spoke);
      group.add(pivot);
    } else {
      // Round spokes
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, R * 0.82, 8),
        chromeMat
      );
      const pivot = new THREE.Group();
      pivot.rotation.x = angle;
      const spoke2 = spoke.clone();
      spoke2.position.set(0.01, R * 0.41, 0);
      pivot.add(spoke2);
      group.add(pivot);
    }
  }

  // Center hub
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.18, 20),
    chromeMat
  );
  hub.rotation.z = Math.PI / 2;
  group.add(hub);

  // Center cap with glow
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12),
    accentMat
  );
  cap.rotation.z = Math.PI / 2;
  cap.position.x = 0.06;
  group.add(cap);

  // Brake disc (visible behind spoke gaps)
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.03, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.8 })
  );
  disc.rotation.z = Math.PI / 2;
  disc.position.x = -0.05;
  group.add(disc);

  // Brake caliper
  const caliper = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.1, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x1144cc, roughness: 0.3, metalness: 0.8 })
  );
  caliper.position.set(-0.04, -0.24, 0.04);
  group.add(caliper);

  return group;
}

/* ── CAR BODY ─────────────────────────────────────── */
function buildCarBody(bodyMat) {
  const group = new THREE.Group();

  // ─ Lower body shell ─
  // We use ExtrudeGeometry from a 2D side-profile path
  const profile = new THREE.Shape();
  profile.moveTo(-2.2, 0.3);
  profile.lineTo(-2.25, 0.5);
  profile.bezierCurveTo(-2.2, 0.72, -2.0, 0.78, -1.7, 0.8);
  profile.bezierCurveTo(-1.4, 0.82, -1.0, 0.9, -0.5, 0.96);
  profile.bezierCurveTo( 0.1, 1.04, 0.6, 1.06, 1.1, 0.99);
  profile.bezierCurveTo( 1.5, 0.93, 1.8, 0.82, 2.05, 0.68);
  profile.bezierCurveTo( 2.2, 0.58, 2.25, 0.48, 2.22, 0.32);
  profile.lineTo(2.0,  0.26);
  profile.lineTo(-2.0, 0.26);
  profile.lineTo(-2.2, 0.3);

  const extOpts = {
    steps: 1,
    depth: 1.86,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4
  };

  const bodyGeom = new THREE.ExtrudeGeometry(profile, extOpts);
  bodyGeom.center();
  const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // ─ Hood / bonnet flat section ─
  const hoodGeom = new THREE.BoxGeometry(0.95, 0.04, 1.7);
  const hood = new THREE.Mesh(hoodGeom, bodyMat);
  hood.position.set(1.75, 0.68, 0);
  hood.rotation.z = 0.08;
  group.add(hood);

  // ─ Trunk section ─
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.04, 1.7),
    bodyMat
  );
  trunk.position.set(-1.85, 0.82, 0);
  trunk.rotation.z = -0.06;
  group.add(trunk);

  // ─ Side sills ─
  [-0.96, 0.96].forEach(z => {
    const sill = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.06, 0.1),
      new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.7, roughness: 0.4 })
    );
    sill.position.set(0, 0.28, z);
    group.add(sill);
  });

  // ─ Front splitter ─
  const splitter = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.04, 1.85),
    new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.6, metalness: 0.5 })
  );
  splitter.position.set(2.26, 0.28, 0);
  group.add(splitter);

  // ─ Front chin detail ─
  const chin = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.12, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x030303, roughness: 0.8 })
  );
  chin.position.set(2.32, 0.35, 0);
  group.add(chin);

  // ─ Rear diffuser ─
  const diffuser = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.14, 1.88),
    new THREE.MeshStandardMaterial({ color: 0x040404, roughness: 0.8, metalness: 0.2 })
  );
  diffuser.position.set(-2.28, 0.3, 0);
  group.add(diffuser);

  // Diffuser fins
  for (let i = -3; i <= 3; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.1, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
    );
    fin.position.set(-2.28, 0.3, i * 0.22);
    group.add(fin);
  }

  // ─ Underfloor ─
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(4.3, 0.07, 1.86),
    new THREE.MeshStandardMaterial({ color: 0x040404, roughness: 0.9 })
  );
  floor.position.y = 0.26;
  group.add(floor);

  return group;
}

/* ── CABIN / GLASS ────────────────────────────────── */
function buildCabin(glassMat) {
  const group = new THREE.Group();

  // Windshield
  const windshieldPts = [
    new THREE.Vector3( 1.15, 0.98, -0.82),
    new THREE.Vector3( 0.55, 1.04, -0.78),
    new THREE.Vector3( 0.55, 1.04,  0.78),
    new THREE.Vector3( 1.15, 0.98,  0.82),
    new THREE.Vector3( 1.48, 0.74,  0.85),
    new THREE.Vector3( 1.48, 0.74, -0.85),
  ];
  const windGeom = new THREE.ConvexGeometry ? undefined : null; // fallback
  const windshield = new THREE.Mesh(
    new THREE.BufferGeometry().setFromPoints(windshieldPts),
    glassMat
  );

  // Simpler: use BoxGeometry + rotation for windscreen
  const ws = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.04, 1.6),
    glassMat
  );
  ws.position.set(1.33, 0.85, 0);
  ws.rotation.z = 0.72;
  group.add(ws);

  // Roof glass
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.04, 1.55),
    glassMat
  );
  roof.position.set(-0.05, 1.07, 0);
  group.add(roof);

  // Rear window
  const rw = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.04, 1.55),
    glassMat
  );
  rw.position.set(-1.52, 0.9, 0);
  rw.rotation.z = -0.65;
  group.add(rw);

  // Side windows (left & right)
  [-0.94, 0.94].forEach(z => {
    const sw = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.04, 0.28),
      glassMat
    );
    sw.position.set(-0.22, 0.98, z);
    sw.rotation.x = Math.PI / 2;
    group.add(sw);

    // B-pillar
    const bpillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.28, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.7 })
    );
    bpillar.position.set(0.4, 0.88, z);
    group.add(bpillar);
  });

  return group;
}

/* ── WING ─────────────────────────────────────────── */
function buildWing(bodyMat) {
  const group = new THREE.Group();

  // End plates
  [-1.0, 1.0].forEach(z => {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.35, 0.04),
      bodyMat
    );
    plate.position.set(-2.1, 0.98, z);
    group.add(plate);
  });

  // Main blade
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.05, 2.08),
    bodyMat
  );
  blade.position.set(-2.1, 1.05, 0);
  blade.rotation.z = -0.12;
  group.add(blade);

  // Secondary blade
  const blade2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.04, 2.04),
    bodyMat
  );
  blade2.position.set(-2.2, 0.9, 0);
  blade2.rotation.z = 0.05;
  group.add(blade2);

  return group;
}

/* ── LIGHTS ───────────────────────────────────────── */
function buildLights(emissiveMat) {
  const group = new THREE.Group();

  // Headlights — signature X pattern strips
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: new THREE.Color(0x00e5ff),
    emissiveIntensity: 4,
  });
  const dimHeadMat = new THREE.MeshStandardMaterial({
    color: 0x004466,
    emissive: new THREE.Color(0x00e5ff),
    emissiveIntensity: 0.5,
  });

  // Right headlight cluster
  const headLens = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.055, 0.72),
    headMat
  );
  headLens.position.set(2.2, 0.54, 0.6);
  group.add(headLens);

  const headLens2 = headLens.clone();
  headLens2.position.set(2.2, 0.54, -0.6);
  group.add(headLens2);

  // DRL strip
  const drl = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.025, 1.72),
    headMat
  );
  drl.position.set(2.22, 0.58, 0);
  group.add(drl);

  // Taillights — full width bar
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff1a2e,
    emissive: new THREE.Color(0xff1a2e),
    emissiveIntensity: 2.5,
  });
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.04, 1.86),
    tailMat
  );
  tail.position.set(-2.24, 0.72, 0);
  group.add(tail);

  // Tail lower accent
  const tailAccent = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.025, 1.2),
    tailMat
  );
  tailAccent.position.set(-2.24, 0.62, 0);
  group.add(tailAccent);

  return group;
}

/* ── FULL NEXUS X1 ────────────────────────────────── */
function createNexusX1(options = {}) {
  const {
    bodyColor = 0x0d0d0d,
    wheelStyle = 'aero',
    showWing = true,
  } = options;

  const car = new THREE.Group();

  const bodyMat   = createBodyMaterial(bodyColor);
  const glassMat  = createGlassMaterial();
  const chromeMat = createChromeMaterial();
  const tireMat   = createTireMaterial();
  const accentMat = createEmissiveMaterial(0x00e5ff, 3);
  const emissive  = createEmissiveMaterial(0x00e5ff, 2);

  const bodyGroup   = buildCarBody(bodyMat);
  const cabinGroup  = buildCabin(glassMat);
  const lightsGroup = buildLights(emissive);

  car.add(bodyGroup);
  car.add(cabinGroup);
  car.add(lightsGroup);

  if (showWing) car.add(buildWing(bodyMat));

  // Wheel positions: [x, y, z, rotY]
  const wheelPositions = [
    [ 1.42, 0.26, -1.05,  0],       // front-left
    [ 1.42, 0.26,  1.05,  Math.PI], // front-right
    [-1.42, 0.26, -1.05,  0],       // rear-left
    [-1.42, 0.26,  1.05,  Math.PI], // rear-right
  ];

  const wheels = [];
  wheelPositions.forEach(([x, y, z, ry]) => {
    const w = createWheel(chromeMat, tireMat, accentMat, wheelStyle);
    w.position.set(x, y, z);
    w.rotation.y = ry;
    car.add(w);
    wheels.push(w);
  });

  // Arch cutouts (dark covers)
  const archPositions = [[1.42, 0.36, -1.02], [1.42, 0.36, 1.02], [-1.42, 0.36, -1.02], [-1.42, 0.36, 1.02]];
  archPositions.forEach(([x, y, z]) => {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.06, 8, 20, Math.PI),
      bodyMat
    );
    arch.position.set(x, y, z);
    arch.rotation.x = Math.PI / 2;
    car.add(arch);
  });

  car.userData = { wheels, bodyMat, glassMat, bodyGroup, cabinGroup };
  car.position.y = 0; // ride height adjustment
  car.rotation.y = Math.PI * 0.04; // very slight angle for drama

  return car;
}

/* ── SCENE SETUP ──────────────────────────────────── */
function createNexusScene(canvas, opts = {}) {
  const {
    fog = true,
    ground = true,
    particles = true,
    bgColor = 0x000000,
    alpha = false,
  } = opts;

  if (!canvas) return null;

  const w = canvas.clientWidth || canvas.width || 800;
  const h = canvas.clientHeight || canvas.height || 600;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.75;

  // Scene
  const scene = new THREE.Scene();
  if (!alpha) scene.background = new THREE.Color(bgColor);
  if (fog) scene.fog = new THREE.FogExp2(bgColor, 0.045);

  // Camera
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 1.6, 7.5);
  camera.lookAt(0, 0.5, 0);

  // ─ LIGHTING ─
  // Ambient
  const ambient = new THREE.AmbientLight(0xffffff, 0.08);
  scene.add(ambient);

  // Key light (slightly warm top-front)
  const key = new THREE.DirectionalLight(0xfff8f0, 2.5);
  key.position.set(6, 10, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.001;
  scene.add(key);

  // Fill light (cyan, from left)
  const fill = new THREE.PointLight(0x00e5ff, 2.5, 18);
  fill.position.set(-5, 3, -2);
  scene.add(fill);

  // Rim light (back-top)
  const rim = new THREE.DirectionalLight(0x6688ff, 2.0);
  rim.position.set(-4, 5, -3);
  scene.add(rim);

  // Under glow
  const under = new THREE.PointLight(0x001133, 0.8, 6);
  under.position.set(0, -1.2, 0);
  scene.add(under);

  // Accent spots
  const spot1 = new THREE.SpotLight(0x00e5ff, 1.5, 20, Math.PI / 8, 0.3);
  spot1.position.set(0, 8, 0);
  spot1.target.position.set(0, 0, 0);
  scene.add(spot1);
  scene.add(spot1.target);

  // ─ GROUND ─
  let groundMesh = null;
  if (ground) {
    const gMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.2,
      metalness: 0.8,
    });
    groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 1, 1), gMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.01;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Reflection glow lines on ground
    for (let i = -4; i <= 4; i += 2) {
      const lineMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: new THREE.Color(0x00e5ff),
        emissiveIntensity: 0.4,
      });
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 20), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(i, 0.001, 0);
      scene.add(line);
    }
  }

  // ─ PARTICLES ─
  let particleSystem = null;
  if (particles && !window.NexusCore?.reducedMotion()) {
    const count = window.innerWidth < 768 ? 300 : 800;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i]   = (Math.random() - 0.5) * 20;
      pos[i+1] = Math.random() * 8;
      pos[i+2] = (Math.random() - 0.5) * 20;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.025,
      transparent: true,
      opacity: 0.35,
    });
    particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);
  }

  // Resize
  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return {
    renderer, scene, camera, lights: { ambient, key, fill, rim, under },
    groundMesh, particleSystem,
    dispose: () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  };
}

/* ── STANDALONE WHEEL SCENE ───────────────────────── */
function createWheelScene(canvas) {
  const scene = createNexusScene(canvas, { fog: false, ground: false, particles: false });
  if (!scene) return null;

  const { camera } = scene;
  camera.position.set(0, 0, 2.2);
  camera.lookAt(0, 0, 0);

  const chromeMat = createChromeMaterial();
  const tireMat   = createTireMaterial();
  const accentMat = createEmissiveMaterial(0x00e5ff, 3);

  const wheel = createWheel(chromeMat, tireMat, accentMat, 'track');
  scene.scene.add(wheel);

  return { ...scene, wheel };
}

/* ── ELECTRIC MOTOR SCENE ─────────────────────────── */
function createMotorGeometry() {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.15 });
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.3, metalness: 0.8 });
  const wndMat  = new THREE.MeshStandardMaterial({ color: 0x334422, roughness: 0.6 });
  const acMat   = createEmissiveMaterial(0x00e5ff, 2);

  // Housing
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 32), bodyMat);
  housing.rotation.z = Math.PI / 2;
  g.add(housing);

  // End caps
  [-0.82, 0.82].forEach(x => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.68, 0.12, 32), bodyMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = x;
    g.add(cap);

    // Cooling fins
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.3), bodyMat);
      fin.position.set(x, Math.cos(angle) * 0.78, Math.sin(angle) * 0.78);
      fin.rotation.x = angle;
      g.add(fin);
    }
  });

  // Shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16), createChromeMaterial());
  shaft.rotation.z = Math.PI / 2;
  g.add(shaft);

  // Stator windings (visible from front)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const winding = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.04, 8, 20, Math.PI / 3), wndMat);
    winding.rotation.z = Math.PI / 2;
    winding.rotation.x = angle;
    winding.position.x = -0.5;
    g.add(winding);
  }

  // Energy glow rings
  [0.3, 0, -0.3].forEach((x, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.012, 8, 40),
      createEmissiveMaterial(0x00e5ff, 1.5 - i * 0.3)
    );
    ring.rotation.z = Math.PI / 2;
    ring.position.x = x;
    g.add(ring);
  });

  // Cooling ports
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), bodyMat);
    port.position.set(0, Math.cos(angle) * 0.62, Math.sin(angle) * 0.62);
    port.rotation.x = angle;
    g.add(port);
  }

  return g;
}

/* ── BATTERY PACK ─────────────────────────────────── */
function createBatteryGeometry() {
  const g = new THREE.Group();

  const caseMat  = new THREE.MeshPhysicalMaterial({ color: 0x0a0a14, metalness: 0.85, roughness: 0.2 });
  const cellMat  = new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.4, metalness: 0.6 });
  const accentM  = createEmissiveMaterial(0x00e5ff, 1);
  const connMat  = createChromeMaterial();

  // Main case
  const mainCase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 1.6), caseMat);
  g.add(mainCase);

  // Module rows
  const cols = 8, rows = 4;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cell = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.18, 0.32),
        cellMat
      );
      cell.position.set(
        (c - (cols-1)/2) * 0.44,
        0.0,
        (r - (rows-1)/2) * 0.37
      );
      g.add(cell);

      // Energy glow on some cells
      if (Math.random() > 0.5) {
        const glow = new THREE.Mesh(
          new THREE.BoxGeometry(0.36, 0.02, 0.3),
          createEmissiveMaterial(0x00e5ff, 0.5 + Math.random() * 1.5)
        );
        glow.position.copy(cell.position);
        glow.position.y += 0.1;
        g.add(glow);
      }
    }
  }

  // Structural ribs
  for (let i = -1.5; i <= 1.5; i += 0.5) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(3.82, 0.03, 0.04), caseMat);
    rib.position.set(0, 0.1, i);
    g.add(rib);
  }

  // HV connectors
  [[-1.95, 0, 0.3], [1.95, 0, 0.3], [-1.95, 0, -0.3], [1.95, 0, -0.3]].forEach(([x,y,z]) => {
    const conn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 12), connMat);
    conn.position.set(x, 0.1, z);
    g.add(conn);
  });

  // Top cover with logo recess
  const cover = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 1.6), caseMat);
  cover.position.y = 0.12;
  g.add(cover);

  // "NEXUS 800V" label glow strip
  const label = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.01, 0.06), accentM);
  label.position.set(0, 0.145, 0);
  g.add(label);

  return g;
}

/* ── BRAKE ASSEMBLY ───────────────────────────────── */
function createBrakeGeometry() {
  const g = new THREE.Group();

  const discMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.9 });
  const caliperMat = new THREE.MeshStandardMaterial({ color: 0x0033cc, roughness: 0.2, metalness: 0.8 });

  // Disc
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.06, 40), discMat);
  disc.rotation.z = Math.PI / 2;
  g.add(disc);

  // Disc vane slots
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.07, 0.008), discMat);
    slot.position.set(0, Math.cos(angle) * 0.48, Math.sin(angle) * 0.48);
    slot.rotation.x = angle + Math.PI / 2;
    slot.rotation.z = Math.PI / 2;
    g.add(slot);
  }

  // Disc hat
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 20), createChromeMaterial());
  hat.rotation.z = Math.PI / 2;
  hat.position.x = 0.06;
  g.add(hat);

  // Caliper body
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.42, 0.55), caliperMat);
  caliper.position.set(0, -0.52, 0.1);
  g.add(caliper);

  // Caliper bridge
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.55), caliperMat);
  bridge.position.set(0.14, -0.52, 0.1);
  g.add(bridge);

  // Piston visible
  for (let i = 0; i < 4; i++) {
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12), createChromeMaterial());
    piston.rotation.z = Math.PI / 2;
    piston.position.set(0.18, -0.52 + (i % 2 - 0.5) * 0.22, 0.1 + Math.floor(i/2) * 0.22 - 0.11);
    g.add(piston);
  }

  // NEXUS caliper text (glow)
  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(0.33, 0.015, 0.4),
    createEmissiveMaterial(0x00e5ff, 0.8)
  );
  glow.position.set(0, -0.52, 0.1);
  glow.rotation.y = Math.PI / 2;
  g.add(glow);

  return g;
}

/* ── SUSPENSION ───────────────────────────────────── */
function createSuspensionGeometry() {
  const g = new THREE.Group();

  const armMat    = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.9 });
  const springMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.2, metalness: 0.8 });
  const accMat    = createEmissiveMaterial(0x00e5ff, 0.8);

  // Upper control arm
  const uca = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.06), armMat);
  uca.position.set(0, 0.3, 0);
  uca.rotation.z = 0.15;
  g.add(uca);

  // Lower control arm
  const lca = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.06, 0.08), armMat);
  lca.position.set(0, -0.15, 0);
  lca.rotation.z = -0.1;
  g.add(lca);

  // Uprights
  const upright = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), armMat);
  upright.position.set(0.55, 0.07, 0);
  g.add(upright);

  // Coilover spring (helical)
  const springGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 20, Math.PI * 2);
  for (let i = 0; i < 8; i++) {
    const coil = new THREE.Mesh(springGeo, springMat);
    coil.position.set(0.0, 0.05 + i * 0.065, 0.18);
    coil.rotation.z = Math.PI / 2;
    coil.scale.y = 0.2;
    g.add(coil);
  }

  // Damper rod
  const damper = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.72, 12), armMat);
  damper.position.set(0, 0.26, 0.18);
  g.add(damper);

  // Damper piston rod
  const pRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), createChromeMaterial());
  pRod.position.set(0, -0.04, 0.18);
  g.add(pRod);

  // ARB link
  const arb = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), armMat);
  arb.position.set(-0.28, -0.12, 0);
  arb.rotation.z = Math.PI / 2;
  g.add(arb);

  // Tie rod
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 8), armMat);
  tr.rotation.z = Math.PI / 2;
  tr.position.set(0.05, -0.22, 0.14);
  g.add(tr);

  // Bushings glow
  [[-0.52, 0.3, 0], [0.52, 0.3, 0], [-0.52, -0.15, 0], [0.52, -0.15, 0]].forEach(([x,y,z]) => {
    const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), accMat);
    bush.position.set(x, y, z);
    g.add(bush);
  });

  return g;
}

/* ── STEERING WHEEL ───────────────────────────────── */
function createSteeringWheelGeometry() {
  const g = new THREE.Group();

  const rimMat    = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.05, metalness: 0.1, clearcoat: 1 });
  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.2, metalness: 0.4 });
  const accentM   = createEmissiveMaterial(0x00e5ff, 2);
  const btnMat    = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.6 });

  // Main rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.065, 16, 60, Math.PI * 1.5),
    rimMat
  );
  rim.rotation.y = Math.PI * 0.75;
  g.add(rim);

  // Rim flat sections (D-cut top)
  const topRim = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.065, 0.065),
    rimMat
  );
  topRim.position.y = 0.85;
  g.add(topRim);

  // Spokes
  [[0, 0, -0.65, 0], [0.4, -0.4, 0, 0.4]].forEach(([x1,y1,x2,y2]) => {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(Math.sqrt((x2-x1)**2+(y2-y1)**2) || 0.65, 0.035, 0.12),
      carbonMat
    );
    spoke.position.set((x1+x2)/2, (y1+y2)/2 - 0.05, 0);
    g.add(spoke);
  });
  // Spokes proper
  [[-0.55, -0.3], [0.55, -0.3], [0, -0.72]].forEach(([x,y]) => {
    const dist = Math.sqrt(x*x + y*y);
    const angle = Math.atan2(y, x);
    const sp = new THREE.Mesh(
      new THREE.BoxGeometry(dist * 0.9, 0.04, 0.14),
      carbonMat
    );
    sp.position.set(x * 0.5, y * 0.5, 0);
    sp.rotation.z = angle;
    g.add(sp);
  });

  // Center hub
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20),
    new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, clearcoat: 1 })
  );
  hub.rotation.x = Math.PI / 2;
  g.add(hub);

  // Nexus logo glow
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), accentM);
  logo.position.z = 0.065;
  g.add(logo);

  // Display pad (center bottom)
  const display = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.22, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.1 })
  );
  display.position.set(0, -0.3, 0.04);
  g.add(display);

  // Display screen glow
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.41, 0.18, 0.01),
    createEmissiveMaterial(0x001a33, 0.5)
  );
  screen.position.set(0, -0.3, 0.07);
  g.add(screen);

  // Thumb buttons
  [[-0.5, -0.2], [0.5, -0.2]].forEach(([x,y]) => {
    for (let b = 0; b < 3; b++) {
      const btn = new THREE.Mesh(
        new THREE.BoxGeometry(0.085, 0.035, 0.04),
        b === 0 ? accentM : btnMat
      );
      btn.position.set(x, y + b * 0.06, 0.08);
      g.add(btn);
    }
  });

  // Paddle shifters
  [[-0.98, 0, -0.15], [0.98, 0, -0.15]].forEach(([x,y,z]) => {
    const paddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.28, 0.03),
      carbonMat
    );
    paddle.position.set(x, y, z);
    g.add(paddle);
  });

  return g;
}

/* ── EXPORT ───────────────────────────────────────── */
window.NexusThree = {
  createNexusX1,
  createNexusScene,
  createWheelScene,
  createWheel,
  createMotorGeometry,
  createBatteryGeometry,
  createBrakeGeometry,
  createSuspensionGeometry,
  createSteeringWheelGeometry,
  createBodyMaterial,
  createGlassMaterial,
  createChromeMaterial,
  createEmissiveMaterial,
  createTireMaterial,
  CAR_COLORS: {
    OBSIDIAN:  0x070707,
    TITANIUM:  0x5a5a5a,
    ARCTIC:    0xefefef,
    GRAPHITE:  0x1c1c1c,
    MIDNIGHT:  0x06060f,
  }
};
