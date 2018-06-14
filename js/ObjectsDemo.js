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
    this.addCube();
    this.addSphere();
    this.addCyliner();
    this.addTorus();
    this.addTorusKnot();
    this.renderer.render(this.scene, this.camera);

  }

  addCircle() {
    let circleGeometry = new THREE.CircleGeometry(1, 12, 0, Math.PI);
    // let circleTexture = new THREE.MeshBasicMaterial({color:"#000000"});
    // this.circle = new THREE.Mesh(circleGeometry,circleTexture);
    // this.scene.add(this.circle);

    let circle = this.createMesh(circleGeometry);
    circle.translateX(-1);
    circle.translateY(2);
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

  addCube() {
    let cubeGeometry = new THREE.CubeGeometry(1, 1, 1, 4, 4, 4);
    let cube = this.createMesh(cubeGeometry);
    cube.rotation.x = 0.5;
    cube.rotation.z = 0.5;
    cube.translateX(-1);
    cube.translateY(0.8);
    this.scene.add(cube);
  }

  addCyliner() {
    let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12, 12, true, 0, Math.PI * 2);
    let cylinder = this.createMesh(cylinderGeometry);
    cylinder.translateY(-1.5);
    cylinder.translateX(-1);
    cylinder.rotation.x += 0.1
    this.scene.add(cylinder);
  }

  addSphere() {
    let sphereGeometry = new THREE.SphereGeometry(1, 20, 20, 0, Math.PI * 2, 0, Math.PI * 2);
    this.sphere = this.createMesh(sphereGeometry);
    this.sphere.translateX(1);
    this.sphere.translateY(2);
    this.scene.add(this.sphere);
    this.sphereLoop();
  }

  sphereLoop() {
    this.renderer.render(this.scene, this.camera);
    this.sphere.rotation.y += 0.01;
    this.sphere.rotation.z += 0.01;
    requestAnimationFrame(() => this.sphereLoop());
  }

  addTorus() {
    let torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 12, 0, Math.PI);
    let torus = this.createMesh(torusGeometry);
    this.scene.add(torus);
  }

  addTorusKnot() {
    let torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.05, 20, 6, 4, 3, 1);
    let torusKnot = this.createMesh(torusKnotGeometry);
    torusKnot.translateY(-1);
    torusKnot.translateX(1);
    this.scene.add(torusKnot);
  }

}