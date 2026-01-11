// GLOBAL 
let selectedTexturableObject = null;

// IMPORT 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// TEXTURE LIBRARY 
const TEXTURE_LIBRARY = {
  sofa: [
    '/assets/texture/sofa_putih.jpg',
    '/assets/texture/sofa_coklat.jpg',
    '/assets/texture/sofa_abu.jpg'
  ],
  meja: [
    '/assets/texture/meja_kayu.jpg',
    '/assets/texture/meja_putih.jpg',
    '/assets/texture/meja_hitam.jpg'
  ],
  tv: [
    '/assets/texture/tv_hitam.jpg',
    '/assets/texture/tv_silver.jpg',
    '/assets/texture/tv_putih.jpg'
  ],
  karpet: [
    '/assets/texture/karpet_merah.jpg',
    '/assets/texture/karpet_biru.jpg',
    '/assets/texture/karpet_hijau.jpg'
  ]
};

// CONST & LOADER 
const ROTATE_SNAP = THREE.MathUtils.degToRad(15);

const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/assets/texture/floor.jpg');

const gltfLoader = new GLTFLoader();

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedObject = null;
let isDragging = false;
let lastMouseY = 0;

const draggableObjects = [];

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const moveSpeed = 0.15;

const keyState = {
  w: false,
  a: false,
  s: false,
  d: false
};
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key in keyState) keyState[key] = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key in keyState) keyState[key] = false;
});


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
    metalness: 0.1,
    side: THREE.DoubleSide
  })
);

floor.name = 'floor';
floor.receiveShadow = true;
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
gltfLoader.load('/assets/models/sofa.glb', (gltf) => {
  const sofa = gltf.scene;

  sofa.userData.type = 'sofa';
  sofa.userData.canChangeTexture = true;

  const box = new THREE.Box3().setFromObject(sofa);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetWidth = 7;
  sofa.scale.setScalar(targetWidth / size.x);

  sofa.position.set(0, 0, -8);
  sofa.rotation.y = 0;

  scene.add(sofa);
  draggableObjects.push(sofa);
});

// MEJA DEPAN SOFA
gltfLoader.load('/assets/models/meja.glb', (gltf) => {
  const meja = gltf.scene;

  meja.userData.type = 'meja';
  meja.userData.canChangeTexture = true;

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
  draggableObjects.push(meja);
});

// KARPET
gltfLoader.load('/assets/models/karpet.glb', (gltf) => {
  const karpet = gltf.scene;

  karpet.userData.type = 'karpet';
  karpet.userData.canChangeTexture = true;

  karpet.scale.setScalar(0.040);
  karpet.position.set(0.5, 0.02, 1);

  karpet.rotation.y = Math.PI / 2;

  scene.add(karpet);
  draggableObjects.push(karpet);
});

// MEJA + TV
gltfLoader.load('/assets/models/tv.glb', (gltf) => {
  const tvUnit = gltf.scene;

  tvUnit.userData.type = 'tv';
  tvUnit.userData.canChangeTexture = true;

  const box = new THREE.Box3().setFromObject(tvUnit);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetWidth = 5; 
  const scale = targetWidth / size.x;
  tvUnit.scale.setScalar(scale);

  tvUnit.position.set(0, 1.5, 8);
  tvUnit.rotation.y = Math.PI;

  scene.add(tvUnit);
  draggableObjects.push(tvUnit);
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(direction, camera.up).normalize();

  const move = new THREE.Vector3();

  if (keyState.w) move.add(direction.clone().multiplyScalar(moveSpeed));
  if (keyState.s) move.add(direction.clone().multiplyScalar(-moveSpeed));
  if (keyState.a) move.add(right.clone().multiplyScalar(-moveSpeed));
  if (keyState.d) move.add(right.clone().multiplyScalar(moveSpeed));

  camera.position.add(move);
  controls.target.add(move);

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

// INVENTORY TOGGLE
const inventory = document.getElementById('inventory');
const textureMenu = document.getElementById('textureMenu');

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'i') {
    inventory.classList.toggle('hidden');
    controls.enabled = inventory.classList.contains('hidden');
  }
});

const items = {
  sofa: {
    path: '/assets/models/sofa.glb',
    scale: 1,
    y: 0
  },
  meja: {
    path: '/assets/models/meja.glb',
    scale: 1,
    y: 0
  },
  tv: {
    path: '/assets/models/tv.glb',
    scale: 1,
    y: 0
  },
  karpet: {
    path: '/assets/models/karpet.glb',
    scale: 1,
    y: 0
  }
};

// UKURAN ASLI OBJEK
const ITEM_SIZE = {
  sofa: { 
    type: 'width', 
    value: 7 
  },
  meja: { 
    type: 'width', 
    value: 4 
  },
  tv:   { 
    type: 'width', 
    value: 5 
  },
  karpet: { 
    type: 'scale', 
    value: 0.040 
  }
};

document.querySelectorAll('#inventory button').forEach(btn => {
  btn.addEventListener('click', () => {
    spawnItem(btn.dataset.item);
  });
});

// SPAWN ITEM
function spawnItem(name) {
  const item = items[name];

  gltfLoader.load(item.path, (gltf) => {
    const obj = gltf.scene;
  
  obj.userData.type = name;
  obj.userData.canChangeTexture = true;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    obj.position.copy(camera.position).add(dir.multiplyScalar(3));

    const sizeConfig = ITEM_SIZE[name];

    if (sizeConfig.type === 'width') {
      scaleToTargetWidth(obj, sizeConfig.value);
      snapToFloor(obj);
    }

    if (sizeConfig.type === 'scale') {
      obj.scale.setScalar(sizeConfig.value);
      obj.rotation.y = Math.PI / 2;
      obj.position.y = 0.02; 
    }

    // untuk drag mesh anak
    obj.traverse(child => {
      if (child.isMesh) {
        child.userData.parent = obj;
        child.userData.canChangeTexture = true;
        child.userData.type = obj.userData.type;
      }
    });

    scene.add(obj);
    draggableObjects.push(obj);
  });
}

// MOUSE DOWN
window.addEventListener('mousedown', (e) => {
  if (e.target.closest('#textureMenu')) return;

  if (inventory && !inventory.classList.contains('hidden')) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(draggableObjects, true);

  if (intersects.length > 0) {
    selectedObject = getRootObject(intersects[0].object);
    isDragging = true;
    controls.enabled = false;
    highlight(selectedObject, true);
    lastMouseY = e.clientY;

    if (selectedObject.userData?.canChangeTexture && selectedObject.userData?.type) {
      selectedTexturableObject = selectedObject;
      showTextureMenu(selectedObject.userData.type);
    } else {
      textureMenu.classList.add('hidden');
      selectedTexturableObject = null;
    }

  } else {
    textureMenu.classList.add('hidden');
    selectedTexturableObject = null;
  }
});

// MOUSE MOVE
window.addEventListener('mousemove', (e) => {
  if (!isDragging || !selectedObject) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // DRAG VERTIKAL
  if (e.shiftKey) {
    const deltaY = lastMouseY - e.clientY;
    selectedObject.position.y += deltaY * 0.01;
    lastMouseY = e.clientY;

    const box = new THREE.Box3().setFromObject(selectedObject);
    if (box.min.y < 0) {
      selectedObject.position.y -= box.min.y;
    }
    return;
  }

  // DRAG NORMAL
  const intersects = raycaster.intersectObject(floor);
  if (intersects.length > 0) {
    selectedObject.position.x = intersects[0].point.x;
    selectedObject.position.z = intersects[0].point.z;
  }
});

// MOUSE UP
window.addEventListener('mouseup', () => {
  if (selectedObject) highlight(selectedObject, false);

  isDragging = false;

  if (textureMenu.classList.contains('hidden')) {
    selectedObject = null;
  }

  controls.enabled = true;
});

// ROTATE
window.addEventListener('keydown', (e) => {
  if (!selectedObject) return;

  if (inventory && !inventory.classList.contains('hidden')) return;

  if (e.key.toLowerCase() === 'q') {
    selectedObject.rotation.y += ROTATE_SNAP;
  }

  if (e.key.toLowerCase() === 'e') {
    selectedObject.rotation.y -= ROTATE_SNAP;
  }
});

// DELETE ITEM
window.addEventListener('keydown', (e) => {
  if (!selectedObject) return;

  if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteSelectedObject();
  }
});

// HIGHLIGHT
function highlight(obj, state) {
  obj.traverse(child => {
    if (child.isMesh) {
      child.material.emissive?.set(state ? 0x333333 : 0x000000);
    }
  });
}

// SNAPTOFLOOR
function snapToFloor(object) {
  const box = new THREE.Box3().setFromObject(object);
  const minY = box.min.y;
  object.position.y -= minY;
}

// SCALE ITEM
function scaleToTargetWidth(object, targetWidth) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const scale = targetWidth / size.x;
  object.scale.setScalar(scale);
}

// HELPER
function getRootObject(object) {
  let current = object;
  while (current.parent && !draggableObjects.includes(current)) {
    current = current.parent;
  }
  return current;
}

// DELETE SELECTED OBJECT
function deleteSelectedObject() {
  scene.remove(selectedObject);

  const index = draggableObjects.indexOf(selectedObject);
  if (index !== -1) {
    draggableObjects.splice(index, 1);
  }

  if (selectedObject === selectedTexturableObject) {
    textureMenu.classList.add('hidden');
    selectedTexturableObject = null;
  }

  selectedObject = null;
  isDragging = false;
  controls.enabled = true;
}

function gantiTexture(path) {
  if (!selectedTexturableObject) return;

  const tex = textureLoader.load(path);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;

  console.log('APPLY TEXTURE:', path);

  selectedTexturableObject.traverse(child => {
    if (child.isMesh && child.material) {

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach(mat => {
        mat.map = tex;
        mat.color.set(0xffffff); 
        mat.emissive?.set(0x000000);
        mat.normalMap = null;
        mat.roughnessMap = null;
        mat.metalnessMap = null;
        mat.aoMap = null;

        mat.needsUpdate = true;
      });
    }
  });
}

function showTextureMenu(type) {
  textureMenu.innerHTML = '';

  const textures = TEXTURE_LIBRARY[type];
  if (!textures) return;

  textures.forEach(path => {
    const div = document.createElement('div');
    div.className = 'texture';
    div.style.backgroundImage = `url(${path})`;
    div.onclick = () => gantiTexture(path);
    textureMenu.appendChild(div);
  });

  textureMenu.classList.remove('hidden');
}

window.gantiTexture = gantiTexture;

