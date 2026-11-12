/* A faint, slowly turning network of nodes behind the page (a nod to neural nets).
   It drifts with the pointer and rotates a little as you scroll. If WebGL is
   unavailable or three.js fails to load, the page simply shows its plain background. */

import * as THREE from "three";

const PALETTE = {
  light: { node: 0x2b3ce8, line: 0x2b3ce8, nodeAlpha: 0.55, lineAlpha: 0.16 },
  dark: { node: 0x8f9bff, line: 0x8f9bff, nodeAlpha: 0.7, lineAlpha: 0.2 }
};

export function startScene(canvas) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 700;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (err) {
    return false;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 14;

  /* Deterministic layout so the shape is the same on every visit. */
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const count = small ? 70 : 130;
  const spread = { x: 15, y: 10, z: 7 };
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 2 * spread.x;
    positions[i * 3 + 1] = (rand() - 0.5) * 2 * spread.y;
    positions[i * 3 + 2] = (rand() - 0.5) * 2 * spread.z;
  }

  /* Connect each node to close neighbours (computed once, since the group moves as one). */
  const maxDist = small ? 5.2 : 4.4;
  const maxLinks = 3;
  const linkPositions = [];
  const linkCount = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count && linkCount[i] < maxLinks; j++) {
      if (linkCount[j] >= maxLinks) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
        linkPositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        linkCount[i]++;
        linkCount[j]++;
      }
    }
  }

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const nodeMaterial = new THREE.PointsMaterial({ size: 0.16, sizeAttenuation: true, transparent: true, depthWrite: false });

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linkPositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });

  const group = new THREE.Group();
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial), new THREE.Points(nodeGeometry, nodeMaterial));
  scene.add(group);

  const applyTheme = () => {
    const p = PALETTE[document.documentElement.dataset.theme === "dark" ? "dark" : "light"];
    nodeMaterial.color.setHex(p.node);
    nodeMaterial.opacity = p.nodeAlpha;
    lineMaterial.color.setHex(p.line);
    lineMaterial.opacity = p.lineAlpha;
  };
  applyTheme();
  addEventListener("themechange", () => {
    applyTheme();
    if (reduce) renderer.render(scene, camera);
  });

  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reduce) renderer.render(scene, camera);
  };
  resize();
  addEventListener("resize", resize);

  if (reduce) {
    group.rotation.set(0.1, 0.4, 0);
    renderer.render(scene, camera);
    return true;
  }

  /* Pointer and scroll only set targets; the loop eases toward them. */
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0, scroll: 0 };
  addEventListener(
    "pointermove",
    (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 2;
      target.y = (e.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  const clock = new THREE.Clock();
  let running = true;
  let raf = 0;

  const frame = () => {
    if (!running) return;
    const t = clock.getElapsedTime();
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const scrollT = scrollY / max;

    eased.x += (target.x - eased.x) * 0.04;
    eased.y += (target.y - eased.y) * 0.04;
    eased.scroll += (scrollT - eased.scroll) * 0.05;

    group.rotation.y = t * 0.035 + eased.x * 0.18 + eased.scroll * 1.1;
    group.rotation.x = 0.08 + eased.y * 0.1 + Math.sin(t * 0.12) * 0.03;
    camera.position.y = -eased.scroll * 3;
    camera.lookAt(0, -eased.scroll * 3, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  });

  return true;
}
