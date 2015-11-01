import { Utils } from './utils';

let glslify = require('glslify');
let utils = new Utils();

class Two {

  constructor( scene, renderer ) {
    
    this.scene = scene;
    this.renderer = renderer;


    this.active = false;
    this.radius = 15;
    this.widthSegments = 32;
    this.heightSegments = 32;
    this.perturbation = 0.0001;

    this.vertexShader = glslify('../../vertex-shaders/simple.vert');

    this.fragmentShader = glslify('../../fragment-shaders/simple.frag');

    this.camera =  new THREE.CubeCamera(1, 1000, 256);
    this.camera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;

    this.scene.add( this.camera );

    // this.webcam =  document.getElementById("camera");
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");

    if (!!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
            navigator.mozGetUserMedia || navigator.msGetUserMedia) ) {

        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia;
        // this.webcam.onchange = this.updateWebcam.bind( this );
        navigator.getUserMedia({
            video: true, 
            audio: false
        }, 
        this.updateWebcam.bind( this ), 
        ( e ) => {
            console.log("error", e);
            document.getElementById("info").innerHTML = "This experiment needs a webcam!<br> This video is just a fallback.";
            this.video.src = "videos/video.webm";
        });

    } else {
        document.getElementById("info").innerHTML = "This experiment needs a webcam!<br> This video is just a fallback.";
        this.video.src = "videos/video.webm";
    }

    this.video.addEventListener("play",() => {
        
        this.start();

    }, false);

  }
 

  update( ts ) {

    if ( !this.active ) return; 

    this.computeFrame();

    this.mesh.visible = false;
    this.camera.updateCubeMap( this.renderer, this.scene);
    this.mesh.visible = true;

  }

  updateWebcam( stream ) {

    this.video.src = window.URL.createObjectURL( stream );

  }

  start() {

    this.width = this.video.videoWidth / 2;
    this.height = this.video.videoHeight / 2;

    this.c1.width = this.width;
    this.c1.height = this.height;

    this.texture = new THREE.Texture( this.c1 );
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.vertexShader = glslify('../../vertex-shaders/two.vert');

    this.fragmentShader = glslify('../../fragment-shaders/two.frag');
    
    // this.floorMaterial = new THREE.MeshBasicMaterial({ 
    //     map: this.texture, 
    //     side:THREE.DoubleSide 
    // });

    this.floorMaterial = new THREE.ShaderMaterial({
        uniforms: { 
            video: {type: 't', value: this.texture},
            time: {type: 'f', value: 0}
        },
        side: THREE.DoubleSide,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
    });

    this.floorGeometry = new THREE.PlaneGeometry(this.video.videoWidth, this.video.videoHeight, 10, 10);
    this.floor = new THREE.Mesh( this.floorGeometry, this.floorMaterial );
    this.floor.position.z = -100;

    // floor.rotation.x = Math.PI / 2;
    this.scene.add(this.floor);

    this.material = new THREE.MeshBasicMaterial({
        envMap: this.camera.renderTarget,
        color: 0xff0000
    });

    let geometry = new THREE.SphereGeometry(30, 32, 32);

    this.geometry = geometry;

    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.clock = Date.now();

    this.scene.add( this.mesh );


    this.active = true;
  }

  computeFrame() {

    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);

    this.texture.needsUpdate = true;

    this.floorMaterial.uniforms["time"].value = ( Date.now() - this.clock ) * 0.0008;

  }

  getMesh() {

    return this.mesh;

  }

}

export { Two };