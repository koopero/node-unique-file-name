const
  async   = require('async'),
  errors  = require('./errors'),
  format  = require('./format'),
  options = require('./options')

module.exports = uniqueFileName

function uniqueFileName( opt, filename, cb ) {
  opt = options( opt )

  var reserve = {};

  if ( arguments.length == 1 )
    return unique;
  else
    return unique( filename, cb );

  function unique( filename, cb ) {
    if ( 'function' == typeof filename ) {
      cb = filename;
      filename = '';
    }

    var
      iteration = 0,
      time
    ;

    var
      uniqname,
      fullname,
      success = {}
    ;

    async.whilst(
      function () { return iteration < opt.iterations; },
      iterate,
      complete
    );

    function iterate( cb )  {
      uniqname = format( opt.format, filename, iteration++, time, opt );
      fullname = opt.path.resolve( opt.dir, uniqname );

      if ( opt.fs && opt.fs.exists ) {
        if ( reserve[fullname] ) {
          onExists( null, true )
        } else {
          reserve[fullname] = true;
          opt.fs.exists( fullname, onExists )          
        }
      } else {
        onExists( null, false )
      }

      function onExists( err, exists ) {
        if ( err ) {
          cb( err );
          return;
        }

        if ( !exists ) {
          cb( success );
        } else {
          cb();
        }
      }      
    }

    function complete( result ) {
      delete reserve[fullname];

      if ( result === success ) {
        touch();
      } else if ( result ) {
        finish( result );
      } else {
        var error = new errors.UniquenessError( iteration );
        finish( error );
      }
    }

    function touch() {
      if ( opt.fs ) {
        opt.fs.ensureFile( fullname, finish )
      } else {
        finish()
      }
    }

    function finish( err ) {
      if ( err ) {
        cb( err )
      } else {
        cb( null, fullname )
      }
    }

  }
}