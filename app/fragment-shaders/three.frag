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


uniform sampler2D picture;
uniform float time;
uniform float lineWidthMin;
uniform float lineWidthMax;
uniform float brightness;
uniform float voronoise;

varying vec2 vUv;

vec2 resolution = vec2( 1920.0, 1080.0 );
vec2 center = vec2( .0, .0 );

void main( void )
{

	// voronoi 
	vec2 p = gl_FragCoord.xy / resolution.xx;

    vec3 c = voronoi( voronoise * p );

    vec3 col = c.x * (1.2) * vec3( 1.0 );
    col = mix( vec3(1.0, 1.0, 1.0), col, smoothstep( lineWidthMin, lineWidthMax, c.x ) );

	gl_FragColor = texture2D(picture, vUv) * vec4(col,1.0) * brightness;

}