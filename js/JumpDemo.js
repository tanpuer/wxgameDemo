import * as THREE from './libs/three.js';
import './libs/OrbitControls.js';
import * as TWEEN from './libs/Tween.js';
// import './libs/RequestAnimationFrame.js';

let scene;
let camera;
let renderer;
let plane;
let shadowLight;
let jumper;
let cube;
let secondCube;
let id = 0;
let _this;
let isJumping;
let diffX;
let diffY;
let cubeContainer = [];

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
    _this = this;
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

    shadowLight.target = jumper;

    let ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
    scene.add(ambientLight);

    let helper = new THREE.CameraHelper(shadowLight.shadow.camera);
    scene.add(helper);
  }

  createPlane() {
    let planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
    let planeMaterial = new THREE.MeshLambertMaterial({
      color: "#ffffff"
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);
  }

  createBox() {

    //暂时就放2个cube
    //1
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
    cubeContainer.push(cube);
    scene.add(cube);
    id++;

    //2
    secondCube = cube.clone();
    secondCube.castShadow = true;
    secondCube.receiveShadow = true;
    secondCube.translateX(-3);
    secondCube.translateY(0);
    scene.add(secondCube);
    cubeContainer.push(secondCube);
    id++;


    //计算2个cube之间的距离
    let firstCubePos = cube.position;
    let secondCubePos = secondCube.position;
    diffX = secondCubePos.x - firstCubePos.x;
    diffY = secondCubePos.y - firstCubePos.y;
  }

  CalculateJumpDiff() {
    //计算2个cube之间的距离
    let currentCubePos = cubeContainer[id - 2].position;
    let nextCubePos = cubeContainer[id - 1].position;
    diffX = nextCubePos.x - currentCubePos.x;
    diffY = nextCubePos.y - currentCubePos.y;
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
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => this.loop());
  }

  addListeners() {
    canvas.addEventListener('touchstart', this.onTouchStart, false);
    canvas.addEventListener('touchend', this.onTouchEnd, false);
  }

  onTouchStart(data) {

  }

  onTouchEnd(data) {

    _this.CalculateJumpDiff();
    if (isJumping) {
      return;
    }
    //Tween.js 动画
    let startCoords = { x: jumper.position.x, y: jumper.position.y, z: 0 };
    let finishCoords = { x: startCoords.x + diffX, y: startCoords.y + diffY, z: 2 };
    let tween = new TWEEN.Tween(startCoords)
      .to(finishCoords, 2000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        let z;
        if (startCoords.z <= 1) {
          z = startCoords.z;
        } else {
          z = 2 - startCoords.z;
        }
        // jumper.rotation.y = startCoords.z * Math.PI;
        jumper.position.set(startCoords.x, startCoords.y, z * 2);
      })
      .onComplete(() => {
        _this.addNewMesh();
        _this.moveCamera();
      });
    isJumping = true;
    tween.start();
  }

  addNewMesh() {
    let newCube = cubeContainer[id - 1].clone();
    newCube.castShadow = true;
    newCube.receiveShadow = true;
    if (Math.random() > 0.5) {
      newCube.translateY(3);
      //向左
    } else {
      //向前
      newCube.translateX(-3);
    }
    scene.add(newCube);
    cubeContainer.push(newCube);
    id++;
  }

  moveCamera() {
    this.CalculateJumpDiff();
    let cameraStartCoords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    let cameraFinishCoords = { x: cameraStartCoords.x + diffX, y: cameraStartCoords.y + diffY, z: camera.position.z };
    let tween = new TWEEN.Tween(cameraStartCoords)
      .to(cameraFinishCoords, 1000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        camera.position.set(cameraStartCoords.x, cameraStartCoords.y, cameraStartCoords.z);
      })
      .onComplete(() => {
        isJumping = false;
      });
    tween.start();
  }

}