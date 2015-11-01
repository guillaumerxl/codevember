varying vec2 vUv;

uniform sampler2D video;

void main() {

	gl_FragColor = texture2D(video, vUv);
	
}