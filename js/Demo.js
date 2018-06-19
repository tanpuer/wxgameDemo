import * as THREE from './libs/three.js';
import './libs/OrbitControls.js';

var originX = 0;
var originY = 0;
export default class Demo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    var ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
    this.renderer.setClearColor("#616161");
    this.camera.position.z = 5;
    console.log(this.camera);


    this.drawEarth();
    this.drawMoon();
    this.addLight();

    this.controls = new THREE.OrbitControls(this.camera);

    wx.onTouchStart(function (data) {
      originX = data["touches"][0]["screenX"];
      originY = data["touches"][0]["screenY"];
    });
    wx.onTouchMove(function (data) {
      var currentX = data["touches"][0]["screenX"];
      var currentY = data["touches"][0]["screenY"];
      console.log(originX - currentX);
      console.log(originY - currentY);
      this.camera.rotation.x += (originX - currentX);
      this.camera.rotation.y += (originY - currentY);

    });
  }

  addLight() {
    let spotLight = new THREE.SpotLight("#ffffff");
    spotLight.position.set(20, 0, 0);
    this.scene.add(spotLight);
  }

  drawCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var texture = new THREE.TextureLoader().load('res/box_top.png');
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    //todo
    // var cubeTexture = new THREE.CubeTextureLoader().setPath("res/").load([
    //   "box_top.png",
    //   "white_face.png",
    //   "stool.png",
    //   "stake.png",
    //   "disk.png",
    //   "white_face.png"
    //   ]
    // );

    // cubeTexture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial({ map: texture });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    requestAnimationFrame(() => this.loop());
  }

  drawEarth() {
    let geometry = new THREE.SphereGeometry(0.6, 32, 32);
    let texture = new THREE.TextureLoader().load("res/earthmap.bmp");
    let material = new THREE.MeshPhongMaterial({ map: texture });
    this.earthMash = new THREE.Mesh(geometry, material);
    this.earthMash.receiveShadow = true;
    this.scene.add(this.earthMash);
    requestAnimationFrame(() => this.earthLoop());
  }

  drawMoon() {
    let geometry = new THREE.SphereGeometry(0.3, 32, 32);
    let texture = new THREE.TextureLoader().load("res/moonmap.bmp");
    console.log(texture);
    let material = new THREE.MeshLambertMaterial({ map: texture });
    this.moonMash = new THREE.Mesh(geometry, material);
    this.moonMash.receiveShadow = false;
    this.moonMash.castShadow = true;
    this.scene.add(this.moonMash);
    let matrix = new THREE.Matrix4().makeRotationY(3.14 / 180 * 180);
    console.log(matrix);
    // this.moonMash.applyMatrix4(matrix);
    this.moonMash.translateX(1.5);
  }

  loop() {
    this.renderer.render(this.scene, this.camera);
    this.cube.rotation.x += 0.02;
    this.cube.rotation.y += 0.02;
    this.cube.rotation.z += 0.02;
    requestAnimationFrame(() => this.loop());
  }

  earthLoop() {
    this.renderer.render(this.scene, this.camera);
    this.earthMash.rotation.y += 0.02;
    this.moonMash.rotation.y += 0.05;
    requestAnimationFrame(() => this.earthLoop());
  }


}