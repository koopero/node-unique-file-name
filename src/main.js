const
  async   = require('async'),
  errors  = require('./errors'),
  format  = require('./format'),
  options = require('./options')

module.exports = uniqueFileName

function uniqueFileName( opt, filename, iteration, time, callback ) {
  opt = options( opt )

  var reserve = {}

  // Curry
  if ( arguments.length == 1 )
    return unique
  else
    return unique.apply( null, _.slice( arguments, 1 ) )

  function unique( filename, iteration, time, callback ) {
    const argLen = arguments.length
    if ( argLen < 4 && 'function' == typeof arguments[argLen-1] ) {
      callback = arguments[argLen-1]
      arguments[argLen-1] = null
    }

    return new Promise( function ( resolve, reject ) { 
      // Parse arguments to ensure that callback is a function
      // regardless of argument length

      iteration = parseInt( iteration ) || 0

      var
        uniqname,
        fullname,
        success = {}


      async.whilst(
        function () { return iteration < opt.iterations },
        iterate,
        complete
      )

      function iterate( callback )  {
        uniqname = format( opt.format, filename, iteration++, time, opt )
        fullname = opt.path.resolve( opt.dir, uniqname )

        if ( opt.fs && opt.fs.exists ) {
          if ( reserve[fullname] ) {
            onExists( true )
          } else {
            reserve[fullname] = true
            opt.fs.exists( fullname, onExists )
          }
        } else {
          onExists( false )
        }

        function onExists( exists ) {
          if ( !exists ) {
            callback( success )
          } else {
            callback()
          }
        }
      }

      function complete( result ) {
        delete reserve[fullname]

        if ( result === success ) {
          touch()
        } else if ( result ) {
          finish( result )
        } else {
          var error = new errors.UniquenessError( iteration )
          finish( error )
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
          if ( callback )
            callback( err )

          reject( err )
        } else {
          if ( callback )
            callback( null, fullname )

          resolve( fullname )
        }
      }
    })
  }
}
