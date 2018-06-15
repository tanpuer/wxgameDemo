import * as THREE from './libs/three.js';
import { createBox} from './GameUtil.js';
import './libs/OBJLoader.js';
import './libs/MTLLoader.js';

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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;
    this.draw();
    // this.loadOBJ();
    this.loadJSON();

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
    loader.load('models/obj/male02/male02.obj', function (object) {

      object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {

          child.material.map = texture;

        }

      });

      object.position.y = -1;
      scene.add(object);

    }, null, null);;
  }

  loadJSON(){
    var loader = new THREE.JSONLoader();
    loader.load('models/animated/monster/monster.js', function (geometry, materials) {

      // adjust color a bit

      var material = materials[0];
      material.morphTargets = true;
      material.color.setHex(0xffaaaa);

      for (var i = 0; i < 729; i++) {

        var mesh = new THREE.Mesh(geometry, materials);

        // random placement in a grid

        var x = ((i % 27) - 13.5) * 2 + THREE.Math.randFloatSpread(1);
        var z = (Math.floor(i / 27) - 13.5) * 2 + THREE.Math.randFloatSpread(1);

        mesh.position.set(x, 0, z);

        var s = THREE.Math.randFloat(0.00075, 0.001);
        mesh.scale.set(s, s, s);

        mesh.rotation.y = THREE.Math.randFloat(-0.25, 0.25);

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add(mesh);

        mixer.clipAction(geometry.animations[0], mesh)
          .setDuration(1)			// one second
          .startAt(- Math.random())	// random phase (already running)
          .play();					// let's go

      }

    });
  }

}