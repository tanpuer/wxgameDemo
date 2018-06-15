import * as THREE from './libs/three.js';

export function createBox() {
  let texture = new THREE.TextureLoader().load("res/stake.png");
  let material = new THREE.MeshBasicMaterial({ color: "#ffffff", map: texture });
  let geometry = new THREE.CubeGeometry(1, 0.5, 1);
  let mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x += 0.4;
  mesh.rotation.y += 1;
  mesh.rotation.z += 0.2;
  return mesh;
}