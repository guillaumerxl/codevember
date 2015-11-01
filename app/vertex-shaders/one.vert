uniform float time;

varying vec3 vPosition;

void main() {

    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1. );

}