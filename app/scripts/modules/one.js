import { Utils } from './utils';

let glslify = require('glslify');
let utils = new Utils();

class One {

  constructor( scene ) {
    
    this.scene = scene;

    this.particlesCount = 10000;

    this.radius = 15;
    this.widthSegments = 32;
    this.heightSegments = 32;
    this.perturbation = 0.0001;

    this.vertexShader = glslify('../../vertex-shaders/one.vert');

    this.fragmentShader = glslify('../../fragment-shaders/one.frag');

    this.material = new THREE.ShaderMaterial({
        uniforms: { 
            time: { type: "f", value: 0 },
            perturbation: { type: "f", value: 0 }
        },
        side: THREE.DoubleSide,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        shading: THREE.SmoothShading,
        wireframe: false
    });

    let geometry = new THREE.SphereGeometry( this.radius, this.widthSegments, this.heightSegments );

    this.geometry = geometry;

    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.clock = Date.now();

    this.scene.add( this.mesh );

  }

  update( ts ) {

    if ( this.material.uniforms["perturbation"].value > 1.0 || this.material.uniforms["perturbation"].value < 0.0 )
        this.perturbation = -this.perturbation;

    this.material.uniforms["time"].value = ( Date.now() - this.clock ) * 0.0008;
    this.material.uniforms["perturbation"].value += this.perturbation;

    // this.material.uniforms["perturbation"].value = 0.009;

  }

}

export { One };