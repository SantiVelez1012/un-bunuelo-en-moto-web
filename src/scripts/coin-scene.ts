import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector<HTMLCanvasElement>('[data-coin-canvas]');
const section = document.querySelector<HTMLElement>('[data-coin-scene]');

if (canvas && section) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.1, 5.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const group = new THREE.Group();
  group.rotation.set(-0.18, -0.65, 0.08);
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xf4efe6, 1.4));

  const keyLight = new THREE.DirectionalLight(0xd9ff5a, 3.2);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xff6b00, 18, 8);
  rimLight.position.set(3, -1, 4);
  scene.add(rimLight);

  const texture = new THREE.TextureLoader().load('/images/un-bunuelo-en-moto.png', (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.center.set(0.5, 0.5);
  texture.rotation = Math.PI;

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8f3b18,
    metalness: 0.85,
    roughness: 0.25,
  });
  const faceMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.48, 1.48, 0.22, 96),
    [edgeMaterial, faceMaterial, faceMaterial],
  );
  coin.rotation.x = Math.PI / 2;
  coin.rotation.z = -0.12;
  group.add(coin);

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(1.62, 1.68, 96),
    new THREE.MeshBasicMaterial({ color: 0xd9ff5a, transparent: true, opacity: 0.28, side: THREE.DoubleSide }),
  );
  halo.position.z = -0.20;
  group.add(halo);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let targetTilt = 0;
  let targetTravel = 0;
  let currentTilt = 0;
  let currentTravel = 0;

  const scrollTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      targetTilt = (self.progress - 0.5) * 0.55;
      targetTravel = (self.progress - 0.5) * Math.min(2.35, Math.max(1.35, canvas.clientWidth / 380));
    },
  });

  const render = () => {
    currentTilt += (targetTilt - currentTilt) * 0.06;
    currentTravel += (targetTravel - currentTravel) * 0.06;
    group.rotation.x = -0.18 + currentTilt;
    group.position.x = currentTravel;
    if (!reduceMotion) {
      group.rotation.y += 0.0045;
      halo.rotation.z -= 0.0015;
    }
    renderer.render(scene, camera);
  };

  gsap.ticker.add(render);

  window.addEventListener('beforeunload', () => {
    gsap.ticker.remove(render);
    scrollTrigger.kill();
    observer.disconnect();
    coin.geometry.dispose();
    edgeMaterial.dispose();
    faceMaterial.dispose();
    texture.dispose();
    halo.geometry.dispose();
    halo.material.dispose();
    renderer.dispose();
  }, { once: true });
}
