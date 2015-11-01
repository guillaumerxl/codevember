class Utils {


  constructor() {

  }

  randomRange( min, max ) {

      return Math.floor( min + Math.random() * ( max - min ) );

  }

  clone( object ){

    return JSON.parse( JSON.stringify( object ) );

  }

}

export { Utils };