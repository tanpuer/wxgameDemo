import * as THREE from './libs/three.js';

export default class ObjectsDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    this.addCircle();
    this.renderer.render(this.scene, this.camera);

  }

  addCircle() {
    let circleGeometry = new THREE.CircleGeometry(1, 12, 0, Math.PI);
    // let circleTexture = new THREE.MeshBasicMaterial({color:"#000000"});
    // this.circle = new THREE.Mesh(circleGeometry,circleTexture);
    // this.scene.add(this.circle);

    let circle = this.createMesh(circleGeometry);
    this.scene.add(circle);
  }

  createMesh(geometry) {
    let meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    let wireframeMaterial = new THREE.MeshBasicMaterial();
    wireframeMaterial.wireframe = true;
    return new this.createMultiMaterialObject(geometry, [meshMaterial, wireframeMaterial]);
  }

  createMultiMaterialObject(geometry, materials) {
    var group = new THREE.Group();
    for (var i = 0, l = materials.length; i < l; i++) {
      group.add(new THREE.Mesh(geometry, materials[i]));
    }
    return group;
  }

}