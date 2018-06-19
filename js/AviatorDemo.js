import * as THREE from './libs/three.js';
import './libs/OrbitControls.js';

const Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0
};

let originX = 0;
let originY = 0;
let airPlane;
let mousePos = null;

export default class AviatorDemo {

  constructor() {
    this.scene = new THREE.Scene();
    const ctx = canvas.getContext('webgl', { antialias: true });
    this.camera = new THREE.PerspectiveCamera(60, innerHeight / innerWidth, 1, 10000);
    this.camera.position.x = 0;
    this.camera.position.y = 100;
    this.camera.position.z = 200;

    this.renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
    this.renderer.setClearColor(Colors.white);
    this.renderer.setSize(innerHeight, innerWidth);
    this.renderer.shadowMap = true;

    this.camera.position.z = 2000;

    this.createLights();
    this.createSea();
    this.createSky();
    this.createPlane();

    this.addListeners();

    // new THREE.OrbitControls(this.camera);
    this.loop();
  }

  createLights() {
    //半球光
    this.hemisphereLight = new THREE.HemisphereLight("#aaaaaa", "#000000", 0.9);
    this.shadowLight = new THREE.DirectionalLight("#ffffff", 0.9);
    this.shadowLight.position.set(150, 350, 350);
    this.shadowLight.castShadow = true;
    //定义可见域的投射阴影
    this.shadowLight.shadow.left = -400;
    this.shadowLight.shadow.right = -400;
    this.shadowLight.shadow.top = 400;
    this.shadowLight.shadow.bott = -400;
    this.shadowLight.shadow.near = 1;
    this.shadowLight.shadow.far = 1000;
    //定义阴影的分辨率
    this.shadowLight.shadow.mapSize.width = 1024;
    this.shadowLight.shadow.mapSize.height = 1024;

    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
  }

  createSea() {
    let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      transparent: false,
      opacity: 0.6,
      flatShading: THREE.FlatShading
    });
    // for (let i=0;i<geom.vertices.length;i++){
    //     let originSize = geom.vertices[i];
    //     geom.vertices[i] = (-0.5 + Math.random())*originSize;
    // }
    this.sea = new THREE.Mesh(geom, mat);
    this.sea.receiveShadow = true;
    this.sea.translateY(-1100);
    this.scene.add(this.sea);
  }

  createCloud() {
    //创建一个空的容器放置不同的云
    let cloudContainer = new THREE.Object3D();
    let geom = new THREE.BoxGeometry(20, 20, 20);
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.white
    });
    let nBlocks = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocks; i++) {
      let m = new THREE.Mesh(geom, mat);
      // 随机设置每个正方体的位置和旋转角度
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;
      //随机设置正方体的大小
      let s = 0.1 + Math.random() * 0.9;
      m.scale.set(s, s, s);
      //允许每个正方体生成投影和接受投影
      m.castShadow = true;
      m.receiveShadow = true;
      cloudContainer.add(m);
    }
    return cloudContainer;
  }

  createSky() {
    this.sky = new THREE.Object3D();
    const cloudCount = 10;
    //均匀分布云
    const stepAngle = Math.PI * 2 / cloudCount;
    for (let i = 0; i < cloudCount; i++) {
      let cloud = this.createCloud();
      let angle = stepAngle * i;
      //轴的中心和云本身之间的距离
      let h = 950 + Math.random() * 600;
      cloud.position.y = Math.sin(angle) * h;
      cloud.position.x = Math.cos(angle) * h;
      cloud.position.z = -400 - Math.random() * 400;
      cloud.rotation.z = angle + Math.PI / 2;
      let s = 2 + Math.random() * 3;
      cloud.scale.set(s, s, s);
      this.sky.add(cloud);
    }
    this.sky.position.y = -600;
    this.scene.add(this.sky);
  }

  AirPlane() {

    this.plane = new THREE.Object3D();

    // 创建机舱
    let geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    let matCockpit = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    geomCockpit.vertices[4].y -= 10;
    geomCockpit.vertices[4].z += 20;
    geomCockpit.vertices[5].y -= 10;
    geomCockpit.vertices[5].z -= 20;
    geomCockpit.vertices[6].y += 30;
    geomCockpit.vertices[6].z += 20;
    geomCockpit.vertices[7].y += 30;
    geomCockpit.vertices[7].z -= 20;

    let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.plane.add(cockpit);

    // 创建引擎
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: THREE.FlatShading
    });
    let engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.plane.add(engine);

    // 创建机尾
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.plane.add(tailPlane);

    // 创建机翼
    let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.plane.add(sideWing);

    // 创建螺旋桨
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    let matPropeller = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: THREE.FlatShading
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // 创建螺旋桨的桨叶
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: THREE.FlatShading
    });

    let blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.plane.add(this.propeller);
    return this.plane;
  };

  createPlane() {
    this.airplane = new this.AirPlane();
    airPlane = this.airplane;
    this.airplane.scale.set(2, 2, 2);
    this.airplane.position.y = 100;
    this.scene.add(this.airplane);
  }

  loop() {
    this.airplane.children[4].rotation.x += 0.3;
    this.sea.rotation.z += 0.005;
    this.sky.rotation.z += 0.01;
    this.updatePlane();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }

  addListeners() {
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchmove', this.onTouchMove, false);
    document.addEventListener('touchend', this.onTouchEnd, false);
    document.addEventListener('touchcancel', this.onTouchEnd, false);
  }

  onTouchStart(data) {
    originX = data["touches"][0]["clientX"];
    originY = data["touches"][0]["clientY"];
  }

  onTouchMove(data) {
    let currentX = data["touches"][0]["clientX"];
    let currentY = data["touches"][0]["clientY"];

    // let diffX = (currentX - originX)/1000;
    // let diffY = (currentY - originY)/1000;
    // airPlane.translateX(diffX);
    // airPlane.translateY(-diffY);

    //把鼠标位置的值转换成归一化值
    let tx = -1 + currentX / innerWidth * 2;
    let ty = 1 - currentY / innerHeight * 2;
    mousePos = { x: tx, y: ty };

  }

  onTouchEnd() {
    originX = 0;
    originY = 0;
    mousePos = null;
  }

  updatePlane() {
    if (mousePos == null) {
      return;
    }
    let targetX = this.normalize(mousePos.x, -1, 1, -500, 500);
    let targetY = this.normalize(mousePos.y, -1, 1, -200, 950);
    this.airplane.position.x = targetX;
    this.airplane.position.y = targetY;
    this.airplane.children[4].rotation.x += 0.3;
  }

  normalize(v, vmin, vmax, tmin, tmax) {
    let nv = Math.max(Math.min(v, vmax), vmin);
    let dv = vmax - vmin;
    let pc = (nv - vmin) / dv;
    let dt = tmax - tmin;
    let tv = tmin + (pc * dt);
    return tv;
  }

}