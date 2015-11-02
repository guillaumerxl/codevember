import { Utils } from './utils';

let glslify = require('glslify');
let utils = new Utils();

class Three {

  constructor( scene, renderer ) {
    
    this.scene = scene;
    this.renderer = renderer;

    this.active = false;
    this.radius = 15;
    this.widthSegments = 32;
    this.heightSegments = 32;
    this.perturbation = 0.0001;

    this.addListeners();

    this.vertexShader = glslify('../../vertex-shaders/three.vert');

    this.fragmentShader = glslify('../../fragment-shaders/three.frag');

    new THREE.TextureLoader().load('images/me.png', ( texture ) => {

        this.texture = texture;

        this.params = {
            lineWidthMin: 0.0,
            lineWidthMax: 0.3,
            brightness: 1.2,
            voronoise: 7.0
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: { 
                picture: {type: 't', value: this.texture},
                time: {type: 'f', value: 0},
                lineWidthMin: {type: 'f', value: this.params.lineWidthMin},
                lineWidthMax: {type: 'f', value: this.params.lineWidthMax},
                brightness: {type: 'f', value: this.params.brightness},
                voronoise: {type: 'f', value: this.params.voronoise},
            },
            side: THREE.DoubleSide,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });

        let geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height);

        this.geometry = geometry;

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.z = 2500;
        this.mesh.position.y = 710;

        this.mesh.rotation.x = -0.3;

        this.clock = Date.now();

        this.scene.add( this.mesh );

        this.gui = new dat.GUI({
            height : 5 * 32 - 1
        });

        this.gui.add(this.params, 'lineWidthMin').min(0.0).max(0.3).step(0.05);
        this.gui.add(this.params, 'lineWidthMax').min(0.3).max(0.8).step(0.05);
        this.gui.add(this.params, 'brightness').min(0.5).max(3.0).step(0.05);
        this.gui.add(this.params, 'voronoise').min(1.0).max(500.0).step(1.0);

        this.active = true;

    })

    
  }
 

  update( ts ) {

    if ( !this.active ) return; 

    this.material.uniforms["time"].value = ( Date.now() - this.clock ) * 0.0008;

    this.material.uniforms["lineWidthMin"].value = this.params.lineWidthMin;
    this.material.uniforms["lineWidthMax"].value = this.params.lineWidthMax;
    this.material.uniforms["brightness"].value = this.params.brightness;
    this.material.uniforms["voronoise"].value = this.params.voronoise;
  }

  getMesh() {

    return this.mesh;

  }

  upload() {

    let upload = document.getElementById("upload");

    let file = upload.files[ 0 ];

    let image = document.createElement( 'img' );

    let oFReader = new FileReader();

    oFReader.onload = (evt) => {
        console.log(evt.target.result );

        image.src = evt.target.result;
        this.texture = new THREE.Texture( image );

        console.log( this.texture );
        this.texture.needsUpdate = true;
        this.material.uniforms["picture"].value = this.texture;

        this.scene.remove( this.mesh );
        let geometry = new THREE.PlaneGeometry(this.texture.image.width, this.texture.image.height);

        this.geometry = geometry;

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.z = 2500;
        this.mesh.position.y = 710;

        this.mesh.rotation.x = -0.3;
        this.scene.add( this.mesh );
       
    };

    oFReader.readAsDataURL( file );

  }

  addListeners() {

    document.getElementById("upload").addEventListener("change", this.upload.bind( this ), false);

  }

}

export { Three };