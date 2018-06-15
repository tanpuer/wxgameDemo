import * as THREE from './libs/three.js';
import { createBox} from './GameUtil.js';

let originX;
let originY;

export default class Game {

  constructor() {
    this.scene = new THREE.Scene();
    // this.camera = new THREE.OrthographicCamera(-4,4,4,-4,0.1,1000);
    console.log(innerWidth)
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;
    this.draw();

    this.renderer.render(this.scene, this.camera);

    wx.onTouchStart(function (data) {
      originX = data["touches"][0]["screenX"];
      originY = data["touches"][0]["screenY"];
    });

    wx.onTouchEnd(function (data) {
      originX = data["touches"][0]["screenX"];
      originY = data["touches"][0]["screenY"];
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

}