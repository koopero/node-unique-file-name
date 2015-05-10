const
  _ = require('underscore'),
  ass = require('chai').assert,
  async = require('async'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  resolve = path.resolve,
  transliteration = require('transliteration')
;

const
  // RANDOM_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  // Less entropy, but prettier.
  RANDOM_SET = 'BCDGJOPQRSUabcdefghjnopqrstuy0235689',

  // /\s/, '.', '\' and '/' are handled in their own way and not included.
  SYSTEM_CHARS = /[\s\?\*\#\$\<\>\{\}\!\%\&\'\(\)\+\,\;\=\@\[\]\^\`\~\:\|\"]/g,
  TRAILING_SLASHES = /[\\\/]*$/,
  PATH_SEPS = /[\\\/]/g,

  PRECISION = 3
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

  if ( opt.touch )
    ass.isFunction( opt.touch, 'opt.touch must be function or falsy' );

  if ( opt.exists )
    ass.isFunction( opt.exists, 'opt.exists must be function or falsy' );

  opt = _.clone(opt);


  uniqueSync.reset = reset;

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

  function reset() {

  }

}

function format( template, filename, iteration, time ) {
  var
    extname  = path.extname( filename ),
    basename = path.basename( filename, extname ),
    dirname  = path.dirname( filename )
  ;

  iteration = parseInt( iteration ) || 0;

  if ( dirname == '.' )
    dirname = '';

  // Ensure trailing slash on dirname, if it exists
  if ( dirname && dirname.substr( -1 ) != '/' )
    dirname = dirname + '/';

  var slug = slugify;

  return template.replace(
    /\%([0])?(\d*?)(\.\d*)?([irBbFfEeYMDhmsztT])/g,
    function ( tag, flags, width, precision,  specifier ) {
      var radix;

      if ( precision )
        precision = parseInt( precision.substr(1) ) || PRECISION;

      width = parseInt( width );

      switch ( specifier ) {
        case 'F':
          return trim( basename + extname );

        case 'f':
          return trim( slug( 'base', basename ) + slug( 'ext', extname )  );

        case 'B':
          return trim( basename );

        case 'b':
          return trim( slug( 'base', basename ) );

        case 'E':
          return trim( extname );

        case 'e':
          return trim( slug( 'ext', extname ) );

        case 'P':
          if ( dirname && dirname != '.' ) {
            return trim( slug( 'dir', dirname ) ) + path.sep;
          } else {
            return '';
          }

        case 'p':
          if ( dirname && dirname != '.' ) {
            return trim( slug( 'dir', dirname ) ) + path.sep;
          } else {
            return '';
          }

        case 'i':
          radix = radix || 10;
          // falls through
        case 'z':
          radix = radix || 16;

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

        case 't':
          return trimFloat(
            time instanceof Date ?
              time.getTime()
            :
              parseFloat( time ) || 0
          );
      }

      time = time === undefined ? new Date() : new Date( time );
      if ( !precision && !width )
        width = 2;

      switch ( specifier ) {
        case 's':
          return trimFloat( time.getSeconds() + time.getMilliseconds() / 1000 );
      }

      width = width || 2;

      switch ( specifier ) {
        case 'T': return time.toJSON();
        case 'Y': return padTrim( time.getFullYear() );
        case 'M': return padTrim( time.getMonth() + 1 );
        case 'D': return padTrim( time.getDate() );
        case 'h': return padTrim( time.getHours() );
        case 'm': return padTrim( time.getMinutes() );
      }

      function trim ( str ) {
        str = String(str);
        return width ? str.substr( 0, width ) : str;
      }

      function trimFloat( num ) {
        var
          str = num.toFixed( precision ),
          split = str.split('.'),
          integer = split[0],
          decimal = split[1]
        ;

        console.log(tag, str, parseInt( precision ), split, integer, decimal );

        str = width ?
            flags == '0' ?
                padTrim( integer )
              :
                pad( integer )
          :
            integer
        ;

        if ( decimal )
          str += '.'+decimal;

        return str;
      }

      function pad ( num ) {
        num = String( num );
        while ( width && num.length < width ) {
          num = '0'+num;
        }
        return num;
      }

      function padTrim ( num ) {
        num = pad( num );

        if ( width && num.length > width )
          num = num.substr( num.length - width );

        return num;
      }
    }
  );
}

function slugify( type, str ) {
  // Remove leading .
  while ( type != 'ext' && str[0] == '.' )
    str = str.substr( 1 );

  // Replace whitespace with _
  str = str.replace(/\s+/g, '_' );

  // Remove non-ascii words as eloquently as possible.
  str = transliteration( str );

  if ( type == 'dir' ) {
    str = str.replace( TRAILING_SLASHES, '');
  } else {
    str = str.replace( PATH_SEPS, '');
  }

  // Remove characters that with special meaning
  // to the system.
  str = str.replace( SYSTEM_CHARS, '' );

  return str;
}

function random( width ) {
  width = width || 4;

  var
    i = 0,
    r = ''
  ;

  for ( ; i < width; i ++ )
    r += RANDOM_SET[ Math.floor( Math.random() * RANDOM_SET.length ) ];

  return r;
}

function touch( file, cb ) {
  var dirname = path.dirname( file );
  async.series([
    function mkdir( cb ) {
      mkdirp( dirname, cb );
    },
    function writeFile( cb ) {
      fs.writeFile( file, '', cb );
    }
  ], cb );
}

function touchSync( file ) {
  try {
    var dirname = path.dirname( file );
    mkdirp.sync( dirname );
    fs.writeFileSync( file, '' );
    return true;
  } catch ( e ) {
    return false;
  }
}
