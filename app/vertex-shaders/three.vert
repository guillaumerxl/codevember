
float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return fract(sin(p)*43758.5453);
}

vec3 voronoi( in vec2 x )
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	vec2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2(float(i),float(j));
		vec2 o = hash( n + g );
        vec2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = hash( n + g );
        vec2 r = g + o - f;

        if( dot(mr-r,mr-r)>0.1 )
		{
            // distance to line		
            float d = dot( 3.0*(mr+r), normalize(r-mr) );
            md = min( md, d );
		}
    }

    return vec3( md, mr );
}

varying vec2 vUv;
varying vec3 vertPos;
varying vec3 vNormal, vTangent, vBinormal;

uniform float time;

void main() {

	vUv = uv;

	// gl_Position  = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vec3 v = voronoi( 1000000.0 * uv );
    vec3 edges = mix( vec3( -15.0), vec3(5.0), smoothstep( 0.0, 1.0, v.x ) );

	// tangent space vectors for normal mapping
	vNormal = normalize( normalMatrix * normal );
	vTangent = normalize( normalMatrix * position );
	vBinormal = normalize( cross( normal, vTangent ) );

	// deform mesh by the distance from the edge
	gl_Position = projectionMatrix * modelViewMatrix * vec4( edges * normal + position, 1.0);

	vertPos = ( modelViewMatrix * vec4( normal + position, 1.0) ).xyz;

}