import * as THREE from './libs/three.js';

export default class AdvancedObjectsDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    this.generatePoints();
    this.renderer.render(this.scene, this.camera);
  }

  generatePoints() {
    let points = [];
    for (let i = 0; i < 20; i++) {
      let randomX = -0.5 + Math.random();
      let randomY = -0.5 + Math.random();
      let randomZ = -0.5 + Math.random();
      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
    let spGroup = new THREE.Object3D();
    let material = new THREE.MeshBasicMaterial({ color: '#ff0000', transparent: false });
    points.forEach((point) => {
      let spGeo = new THREE.SphereGeometry(0.02);
      let spMesh = new THREE.Mesh(spGeo, material);
      spMesh.position.set(point);
      spGroup.add(spMesh)
    });
    this.scene.add(spGroup);
  }

}