import * as THREE from './libs/three.js';

export default class Cubes {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    let ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;
    // this.camera.lookAt(new THREE.Vector3(-1, 0, 0));
    this.addPlane();

    for (let i = 0; i < 20; i++) {
      this.addCube();
    }

    this.renderer.render(this.scene, this.camera);
    this.addFog();
  }

  addCube() {
    let cubeSize = Math.random()/2;
    let cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
    let cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -2.5 + Math.round(Math.random() * this.planeGeometry.parameters.width);
    cube.position.y = Math.random() - 0.5;
    cube.position.z = this.planeGeometry.parameters.height - Math.random();
    cube.rotation.z = Math.random() - 0.5;
    cube.rotation.y = Math.random() - 0.5;
    cube.rotation.x = Math.random() - 0.5;
    this.scene.add(cube);
  }

  addPlane() {
    let planeGeometry = new THREE.PlaneGeometry(5, 3, 1, 1);
    this.planeGeometry = planeGeometry;
    let planeMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff" });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.wireframe = true;
    // plane.wireframeLineWidth = 9;
    plane.translateX = 10;
    plane.rotation.z = 0.4;
    plane.rotation.y = -0.4;
    plane.rotation.x = -0.2;
    this.scene.add(plane);
    let ambientLight = new THREE.AmbientLight("#0c0c0c");
    // this.scene.add(ambientLight);
    let spotLight = new THREE.SpotLight("#ffffff");
    spotLight.position.set(0, 0, 100);
    spotLight.castShadow = true;
    spotLight.target = plane;
    this.scene.add(spotLight);

    // let directionalLight = new THREE.DirectionalLight("#ffffff");
    // directionalLight.shadowCameraNear = 2;
    // directionalLight.shadowCameraFar = 200;
    // directionalLight.shadowCameraLeft = -50;
    // directionalLight.shadowCameraRight = 50;
    // directionalLight.shadowCameraTop = 50;
    // directionalLight.shadowCameraBottom = -50
    // this.scene.add(directionalLight);

  }

  addFog() {
    this.scene = new THREE.Fog("#ff0000", 0.015, 100);
  }

}