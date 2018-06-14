import * as THREE from './libs/three.js';

export default class AdvancedObjectsDemo {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 1000);
    const ctx = canvas.getContext('webgl', { antialias: true });
    this.renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas });
    this.renderer.setClearColor("#ffffff");
    this.camera.position.z = 5;

    this.createText();


    this.renderer.render(this.scene, this.camera);
  }

  //生成模型
  createMesh(geom) {

    //设置当前的模型矩阵沿xy轴偏移，让图片处于显示中心
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-250, -100, 0));

    // 创建法向量纹理
    var meshMaterial = new THREE.MeshNormalMaterial({
      flatShading: THREE.FlatShading,
      transparent: true,
      opacity: 0.9
    });

    //  创建一个线框纹理
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // 创建模型
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
  }


  //todo  文字有问题
  createText() {
    let options = {
      size:1,
      height:1
    };
    let textGeometry = new THREE.TextGeometry("Learning Three.js", options);
    let text = this.createMesh(textGeometry);
    this.scene.add(text);
  }

}