// IMPORT THREE
import * as THREE from 'three';

// IMPORT ORBIT CONTROLS
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/assets/texture/floor.jpg');

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 7);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// CAHAYA
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// LANTAI
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(3, 3);

floorTexture.center.set(0.5, 0.5);
floorTexture.rotation = Math.PI / 2;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    color: 0xc9a46b,
    roughness: 0.7,
    metalness: 0.1
  })
);

floor.rotation.x = -Math.PI /2;
scene.add(floor);

// DINDING
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xb0b5c0
});

// DINDING BELAKANG
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 5),
  wallMaterial
);

backWall.position.set(0, 2, -10);
scene.add(backWall);

// DINDING KIRI
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 5),
  wallMaterial
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 2, 0);
scene.add(leftWall);

// DINDING KANAN
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 5),
  wallMaterial
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(10, 2, 0);
scene.add(rightWall);

// SOFA
const gltfLoader = new GLTFLoader();

gltfLoader.load('/assets/models/sofa.glb', (gltf) => {
  const sofa = gltf.scene;

  const box = new THREE.Box3().setFromObject(sofa);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetWidth = 7;
  const scaleFactor = targetWidth / size.x;
  sofa.scale.setScalar(scaleFactor);

  sofa.position.set(0, 0, -8);
  sofa.rotation.y = 0;

  scene.add(sofa);
});

// MEJA DEPAN SOFA
gltfLoader.load('/assets/models/meja.glb', (gltf) => {
  const meja = gltf.scene;

  const box = new THREE.Box3().setFromObject(meja);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetSize = 4;
  const scaleFactor = targetSize / size.x;
  meja.scale.setScalar(scaleFactor);

  meja.position.x = -0.1;
  meja.position.y = 1.4;
  meja.position.z = -5; 

  scene.add(meja);
});

// KARPET
gltfLoader.load('/assets/models/karpet.glb', (gltf) => {
  const karpet = gltf.scene;

  karpet.scale.setScalar(0.040);
  karpet.position.set(0.5, 0.02, 1);

  // PUTER BIAR SEJAJAR SOFA ↔ TV
  karpet.rotation.y = Math.PI / 2;

  scene.add(karpet);
});

// MEJA + TV
gltfLoader.load('/assets/models/tv.glb', (gltf) => {
  const tvUnit = gltf.scene;

  const box = new THREE.Box3().setFromObject(tvUnit);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetWidth = 5; 
  const scale = targetWidth / size.x;
  tvUnit.scale.setScalar(scale);

  tvUnit.position.set(0, 1.5, 8);
  tvUnit.rotation.y = Math.PI;

  scene.add(tvUnit);
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
