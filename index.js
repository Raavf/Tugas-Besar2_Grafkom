// IMPORT THREE
import * as THREE from 'three';

// IMPORT ORBIT CONTROLS
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/assets/texture/floor.jpg');

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
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ map: floorTexture  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// KOTAK
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00aaff })
);
box.position.y = 0.5;
scene.add(box);

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
