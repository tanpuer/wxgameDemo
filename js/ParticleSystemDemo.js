import * as THREE from './libs/three.js';
import './libs/CanvasRenderer.js'

export default class ParticleSystemDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const ctx = canvas.getContext('webgl', { antialis: true });
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: ctx });
    // this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    this.createParticles();

    this.renderer.render(this.scene, this.camera);
  }

  createParticles() {
    let material = new THREE.PointsMaterial();
    for (let x = -1; x < 2; x++) {
      for (let y = -2; y < 3; y++) {
        let particle = new THREE.Sprite(material);
        particle.color = "#ff0000";
        particle.position.set(x, y, 0);
        this.scene.add(particle);
      }
    }
  }

}