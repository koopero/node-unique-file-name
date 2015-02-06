const
  _ = require('underscore'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  resolve = path.resolve,
  transliteration = require('transliteration')
;

const
  DISALLOW_CHARS = /[\?\*\#\s\$\<\>\{\}\!\%\&\'\(\)\+\,\;\=\@\[\]\^\`\~\:\\\|\"]/
;

const defaultOptions = {
  iterations: 100,
};

module.exports = uniqueFileName;
uniqueFileName.sync = uniqueFileNameSync;
uniqueFileName.format = format;
uniqueFileName.slugify = slugify;
uniqueFileName.random = random;
uniqueFileName.touch = touch;
uniqueFileName.touchSync = touchSync;


function uniqueFileName( opt, filename, cb ) {
  _.default( opt, {
    exists: fs.exists
  })



  if ( arguments.length == 1 )
    return unique;
  else
    return unique( filename, cb );

  function unique( filename, cb ) {
    if ( 'function' == typeof filename ) {
      cb = filename;
      filename = '';
    }


  }
}

function uniqueFileNameSync( opt, filename ) {
  if ( 'string' == typeof opt ) {
    opt = {
      format: opt
    }
  }


  _.defaults( opt, {
    exists: fs.existsSync,
    dir: process.cwd(),
    touch: touchSync
  })

  _.defaults( opt, defaultOptions );



  if ( arguments.length == 1 )
    return uniqueSync;
  else
    return uniqueSync( filename );

  function uniqueSync( filename ) {

    var
      iteration = 0,
      uniqname,
      fullname
    ;

    while (
      iteration < opt.iterations
    ) {

      uniqname = format( opt.format, filename, iteration++ );
      fullname = resolve( opt.dir, uniqname );

      if ( opt.exists && opt.exists( fullname ) )
        continue;

      break;
    }

    if ( !uniqname ) {
      throw new Error("Couldn't find unique name");
    }

    if ( opt.touch ) {
      opt.touch( fullname );
    }

    return fullname;

  }
}

function format( template, filename, iteration, date ) {
  var
    extname  = path.extname( filename ),
    basename = path.basename( filename, extname ),
    dirname  = path.dirname( filename )
  ;

  date = date === undefined ? new Date() : new Date( date );

  iteration = parseInt( iteration ) || 0;

  if ( dirname == '.' )
    dirname = '';

  // Ensure trailing slash on dirname, if it exists
  if ( dirname && dirname.substr( -1 ) != '/' )
    dirname = dirname + '/';


  return template.replace(
    /\%([0\.])?(\d*?)(\.\d+)?([irBbFfEeYMDhmsztT])/g,
    function ( tag, flags, width, precision, specifier ) {
      var radix;

      width = parseInt( width );

      switch ( specifier ) {
        case 'f':
          return trim( slugify( basename ) + slugify( extname, true )  );

        case 'b':
          return trim( slugify( basename ) );

        case 'e':
          return trim( slugify( extname, true ) );

        case 'i':
          radix = radix || 10;
          // falls through
        case 'z':
          radix = radix || 16;
          // falls through
        case 't':
          radix = radix || 36
          if ( width )
            return pad( iteration.toString( radix ) );

          if ( !iteration )
            if ( flags == '0' )
              return '0'
            else
              return '';

          return iteration.toString( radix );

        case 'r':
          return random( width );
      }

      width = width || 2;

      switch ( specifier ) {
        case 'T': return date.toJSON();
        case 'Y': return padTrim( date.getFullYear() );
        case 'M': return padTrim( date.getMonth() + 1 );
        case 'D': return padTrim( date.getDate() );
        case 'h': return padTrim( date.getHours() );
        case 'm': return padTrim( date.getMinutes() );
        case 's': return padTrim( date.getSeconds() );
      }

      function trim ( str ) {
        str = String(str);
        return width ? str.substr( 0, width ) : str;
      }

      function pad ( num ) {
        num = String( num );
        while ( num.length < width ) {
          num = '0'+num;
        }
        return num;
      }

      function padTrim ( num ) {
        num = pad( num );
        if ( num.length > width )
          num = num.substr( num.length - width );

        return num;
      }

    }
  );
}

function slugify( str, allowLeadingDot ) {
  // Remove leading .
  while ( str[0] == '.' && !allowLeadingDot )
    str = str.substr( 1 );

  // Replace whitespace with _
  str = str.replace(/\s+/g, '_' );

  return str;
}

function random( width ) {
  width = width || 4;

  var
    //set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    // Less entropy, but prettier.
    set = 'BCDGJOPQRSUabcdefgjnopqrstuy0235689',
    i = 0,
    r = ''
  ;

  for ( ; i < width; i ++ )
    r += set[ Math.floor( Math.random() * set.length ) ];

  return r;
}

function touch( file, cb ) {

}

function touchSync( file ) {
  var dirname = path.dirname( file );
  mkdirp.sync( dirname );
  fs.writeFileSync( file, '' );
}
