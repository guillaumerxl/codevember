import { One } from './one';
import { Two } from './two';
import { Three } from './three';

let Controls = require('orbit-controls');

class Scene {

    constructor( options = {} ) {

    	this.scene = null;
    	this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.container = options.container || document.body;
        this.controls = null;
        this.keyboard = null;

    	this.params = {
    		active: options.active || true,
	        height: options.height || window.innerHeight,
	        width: options.width || window.innerWidth
    	};

    	this.mouse = {
	        x: null,
	        y: null
	    };

        this.objects = [];

	    this.clock = null;

    }

    init() {

        this.addListeners();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, this.params.width / this.params.height, 1, 10000 );


        this.target = new THREE.Vector3();
        this.camera.lookAt(this.target);


        this.renderer = new THREE.WebGLRenderer({
	        antialias: true
	    });

        this.renderer.setClearColor( 0x000000, 1 );
        this.renderer.setSize( this.params.width, this.params.height );
        
        this.day();

        this.container.appendChild( this.renderer.domElement );

        this.controls = new Controls({
            distance: 80
        });

        const position = [ -1.6, -19.33, -67.25 ];
        const direction = [0.023, 0.27, 0.96];
        this.camera.position.fromArray(position);
        this.camera.lookAt(this.target.fromArray(direction));
        this.controls.update(position, direction);

    	this.clock = Date.now();

        this.animate();

        console.log(this.camera);

    }

    day() {

        this.day = new Three( this.scene, this.renderer );

        this.objects.push( this.day );

    }

    animate( ts ) {

        
        window.requestAnimationFrame( this.animate.bind(this) );

        if (this.params.active) {

            let objectsLength = this.objects.length;
            for (let i = 0; i < objectsLength; i++) {
                this.objects[ i ].update( ts );
            };

        }

        this.render( ts );
    }

    render() {

        // if ( this.camera.position.x >= 100 ) {
        //     this.camera.position.x = 100;
        // } 

        // if (this.camera.position.x <= -100) {
        //     this.camera.position.x = -100;
        // }

        // if ( this.camera.position.y != -22 ) {
        //     this.camera.position.y = -22;
        // } 
        
        // if ( this.camera.position.z != -76 ) {
        //     this.camera.position.z = -76;
        // } 
        
        const position = this.camera.position.toArray();
        const direction = this.target.toArray();

        this.controls.update(position, direction);
        this.camera.position.fromArray(position);
        this.camera.lookAt(this.target.fromArray(direction));

        this.renderer.render( this.scene, this.camera );    
    }

    addListeners() { 

    	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );

    }

    zoomOut() {

        if ( this.zooming || this.controls.distance == 80 ) return;

        this.zooming = true;

        TweenMax.to( this.controls, 2, {
            distance: 80,
            onComplete: () => {
                this.zooming = false;
            }
        });

    }

    zoomIn() {

        if ( this.zooming || this.controls.distance == 70 ) return;

        this.zooming = true;

        TweenMax.to( this.controls, 2, {
            distance: 70,
            onComplete: () => {
                this.zooming = false;
            }
        });

    }

    onWindowResize() {

    	this.params.width = window.innerWidth;
	    this.params.height = window.innerHeight;

	    this.camera.aspect = this.params.width / this.params.height;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize( this.params.width, this.params.height );

    }

}

export { Scene };