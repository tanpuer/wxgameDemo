import * as THREE from './libs/three.js';
import './libs/OrbitControls.js';
// import './libs/Tween.js';

let scene;
let camera;
let renderer;
let plane;
let shadowLight;
let jumper;
let timeInterval;
let cube;
let cubeShader;

export default class JumpDemo {

  constructor() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialias: true });
    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
    renderer.setClearColor("#ffffff");
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;

    camera.position.x = 0;
    camera.position.y = -7;
    camera.position.z = 5;

    this.createPlane();
    this.createBox();
    this.createJumper();
    this.createLights();

    this.addListeners();

    new THREE.OrbitControls(camera);
    requestAnimationFrame(() => this.loop());
  }

  createLights() {
    shadowLight = new THREE.DirectionalLight("#ffffff", 1);
    // let spotLightHelper = new THREE.SpotLightHelper(shadowLight, "#aaaaaa");
    // scene.add(spotLightHelper);
    shadowLight.castShadow = true;
    shadowLight.position.set(200, 0, 200);
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

    let ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
    scene.add(ambientLight);

    // let helper = new THREE.CameraHelper(shadowLight.shadow.camera);
    // scene.add(helper);
  }

  createPlane() {
    let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
    let planeMaterial = new THREE.MeshLambertMaterial({
      color: "#ffffff"
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);
  }

  createBox() {


    let boxGeometry = new THREE.BoxGeometry(2, 2, 0.5, 4, 4, 2);
    // let texture = new THREE.TextureLoader().load("res/record.png");
    let boxMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      flatShading: THREE.FlatShading,
      // map: texture
    });
    cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.translateZ(0.25);
    cube.rotation.z = -40;
    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);
  }

  createJumper() {
    //圆-圆-圆柱体
    jumper = new THREE.Object3D();

    let cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.2, 0.5);
    let cylinderMaterial = new THREE.MeshPhongMaterial({ color: "#00008B" });
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, 0, 0.75);
    cylinder.rotation.x = Math.PI / 2;
    cylinder.castShadow = true;
    jumper.add(cylinder);

    let topSphereGeometry = new THREE.SphereGeometry(0.15);
    let topSphereMaterial = new THREE.MeshPhongMaterial({ color: "#00008B" });
    let topSphere = new THREE.Mesh(topSphereGeometry, topSphereMaterial);
    topSphere.position.set(0, 0, 1.45);
    topSphere.castShadow = true;
    jumper.add(topSphere);

    let middleSphereGeometry = new THREE.SphereGeometry(0.15);
    let middleSphereMaterial = new THREE.MeshPhongMaterial({ color: "#00008B" });
    let middleSphere = new THREE.Mesh(middleSphereGeometry, middleSphereMaterial);
    middleSphere.position.set(0, 0, 1.1);
    middleSphere.castShadow = true;
    jumper.add(middleSphere);
    jumper.castShadow = true;

    scene.add(jumper);
  }

  loop() {
    renderer.render(scene, camera);
    // TWEEN.update();
    requestAnimationFrame(() => this.loop());
  }

  addListeners() {
    // document.addEventListener('touchstart', this.onTouchStart, false);
    // document.addEventListener('touchend', this.onTouchEnd, false);
  }

  onTouchStart(data) {
    this.initTween();
    // let i = 1.0;
    // timeInterval = setInterval(() => {
    //   if (i >= 0.5) {
    //     cube.scale.set(1, 1, i);
    //     jumper.scale.set(1, 1, i);
    //   }
    //   i -= 0.02;
    // }, 200);
  }

  onTouchEnd(data) {
    clearInterval(timeInterval);
  }

  initTween() {
    // console.log(jumper);
    // let coords = jumper.up;
    // let tween = new TWEEN.Tween(coords)
    //   .to({ x: coords.x, y: coords.y, z: coords.z + 1 }, 1000)
    //   .easing(THREE.Easing.Quadratic.Out)
    //   .start();

  }

}