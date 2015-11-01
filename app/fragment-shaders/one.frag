#pragma glslify: curlNoise = require(glsl-curl-noise)

const vec3 diffuseColor = vec3( 0.0, 0.3, 0.6);
const vec3 purpleColor = vec3( 226.0 / 255.0, 92.0  / 255.0, 254.0 / 255.0);

uniform float time;
uniform float perturbation;

varying vec3 vPosition;

void main( void )
{ 
    float alpha = 1.0;

    vec3 curl = curlNoise_1_9( vPosition.xyz * perturbation ) * diffuseColor;

    if ( curl.r < 0.3 && curl.g < 0.3 && curl.b < 0.3 ) {
      discard;
    }

    gl_FragColor = vec4( curl, alpha);

}