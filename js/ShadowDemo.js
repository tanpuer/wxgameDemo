import * as THREE from './libs/three.js';
import './libs/OrbitControls.js';

let scene;
let camera;
let renderer;
let shadowLight;
let plane;


export default class ShadowDemo {

  constructor() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialias: true });
    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas,clearAlpha:1});
    renderer.setClearColor("#ffffff");
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMapEnabled = true;

    camera.position.x = 0;
    camera.position.y = -7;
    camera.position.z = 5;

    this.createLight();
    this.createPlane();
    this.createSphere();


    new THREE.OrbitControls(camera);
    requestAnimationFrame(() => this.loop());
  }

  createLight() {
    shadowLight = new THREE.SpotLight("#ffffff", 1);
    // let spotLightHelper = new THREE.SpotLightHelper(shadowLight, "#aaaaaa");
    // scene.add(spotLightHelper);
    shadowLight.castShadow = true;
    shadowLight.position.set(0, 0, 10);
    shadowLight.shadow.left = -100;
    shadowLight.shadow.right = 100;
    shadowLight.shadow.top = 100;
    shadowLight.shadow.bottom = -100;
    // shadowLight.shadow.near = 0.1;
    // shadowLight.shadow.far = 1000;
    shadowLight.shadow.camera.near = 0.1;
    shadowLight.shadow.camera.fa = 100;
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;


    scene.add(shadowLight);
  }

  createPlane() {
    let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
    let planeMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff"
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.castShadow = false;
    scene.add(plane);
  }

  createSphere() {
    let sphereGeometry = new THREE.SphereGeometry(1, 20);
    let sphereMaterial = new THREE.MeshPhongMaterial({ color: "#00008B" });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.translateZ(3);
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    scene.add(sphere);
  }

  loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(() => this.loop());
  }

}