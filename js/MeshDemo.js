import * as THREE from './libs/three.js';

export default class MeshDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialias: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    this.addLight();
    this.drawSphere();
    this.addMeshFacialMaterial();
    this.renderer.render(this.scene, this.camera);
  }

  drawSphere() {
    let geometry = new THREE.SphereGeometry(0.6, 32, 32);
    let texture = new THREE.TextureLoader().load("res/moonmap.bmp");
    let material = new THREE.MeshBasicMaterial({ map: texture, color: "#ffffff" });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
    this.addArrowOnSphere();
  }

  addArrowOnSphere() {
    const facesLength = this.sphere.geometry.faces.length;
    for (let i = 0; i < facesLength; i += 10) {
      let face = this.sphere.geometry.faces[i];
      let arrow = new THREE.ArrowHelper(face.normal, new THREE.Vector3(0, 0, 0), 1.2, "#ff0000");
      this.sphere.add(arrow);
    }
  }

  addLight() {
    let ambientLight = new THREE.AmbientLight("#ffffff");
    this.scene.add(ambientLight);
  }

  loop() {
    this.renderer.render(this.scene, this.camera);
    this.sphere.rotation.y += 0.02;
    this.group.rotation.y += 0.02;
    requestAnimationFrame(() => this.loop());
  }

  addMeshFacialMaterial() {
    let group = new THREE.Mesh();
    this.group = group;
    const size = 0.29;
    let facialMaterial = [
      new THREE.MeshBasicMaterial({ color: 0x009e60 }),
      new THREE.MeshBasicMaterial({ color: 0x0051ba }),
      new THREE.MeshBasicMaterial({ color: 0xffd500 }),
      new THREE.MeshBasicMaterial({ color: 0xC41E3A }),
      new THREE.MeshBasicMaterial({ color: 0xff5800 }),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    ];
    for (let x = -3; x < 3; x++) {
      for (let y = -1.5; y < 3; y++) {
        for (let z = -1.5; z < 3; z++) {
          let cubeGeometry = new THREE.CubeGeometry(size, size, size);
          let cube = new THREE.Mesh(cubeGeometry, facialMaterial);
          group.add(cube);
          cube.position.set(x, y, z)
        }
      }
    }
    this.scene.add(group);
  }
  
}