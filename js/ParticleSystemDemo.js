import * as THREE from './libs/three.js';
import './libs/CanvasRenderer.js'

export default class ParticleSystemDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    // this.createParticles(0.1,false,0.5,0.1,"#ff0000");

    // var spriteMap = new THREE.TextureLoader().load("res/i.png");
    // var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
    // var sprite = new THREE.Sprite(spriteMaterial);
    // this.scene.add(sprite);

    this.createSprite();
    this.renderer.render(this.scene, this.camera);

  }

  createParticles(size, transparent, opacity, sizeAttenuation, color) {
    const texture = new THREE.TextureLoader().load("res/i.png");
    this.scene.add(this.createSystem("system1", texture, size, transparent, opacity, sizeAttenuation, color))
  }

  createSystem(name, texture, size, transparent, opacity, sizeAttenuation, color) {
    let mColor = new THREE.Color(color);
    let geom = new THREE.Geometry();
    mColor.setHSL(mColor.getHSL().h, mColor.getHSL().s, (Math.random()) * mColor.getHSL().l);

    let material = new THREE.PointsMaterial({
      size: size,
      color: color
    });

    const range = 2;
    for (let i = 0; i < 50; i++) {
      let particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        Math.random() * range - range / 2
      );
      particle.velocityY = 0.1 + Math.random() / 5;
      particle.velocityX = (Math.random() - 0.5) / 3;
      particle.velocityZ = (Math.random() - 0.5) / 3;
    }
    let system = new THREE.Points(geom, material);
    return system;
  }

  createSprite() {
    let texture = new THREE.TextureLoader().load("res/i.png");
    let spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    let spriteGeometry = new THREE.MeshBasicMaterial();
    let sprite = new THREE.Sprite(spriteGeometry, spriteMaterial);
    this.scene.add(sprite);

   
  }

}