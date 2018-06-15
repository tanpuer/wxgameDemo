import * as THREE from './libs/three.js';
import { createBox} from './GameUtil.js';
import './libs/OBJLoader.js';
import './libs/MTLLoader.js';

let originX;
let originY;

export default class OBJModelDemo {

  constructor() {
    this.scene = new THREE.Scene();
    // this.camera = new THREE.OrthographicCamera(-4,4,4,-4,0.1,1000);
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;
    this.draw();
    this.loadOBJ();

    this.renderer.render(this.scene, this.camera);

    wx.onTouchStart(function (data) {
      originX = data["touches"][0]["screenX"];
      originY = data["touches"][0]["screenY"];
    });

    wx.onTouchEnd(function (data) {
      console.log(data);
      // originX = data["touches"][0]["screenX"];
      // originY = data["touches"][0]["screenY"];
    });

  }

  draw(){
    this.box = createBox();
    this.scene.add(this.box);
    requestAnimationFrame(()=>this.loop());
  }

  loop(){
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }

  loadOBJ(){
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);
    loader.load('http://localhost:8082/tree', function (object) {

      object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {

          child.material.map = texture;

        }

      });

      object.position.y = -1;
      scene.add(object);

    }, null, null);;
  }

}