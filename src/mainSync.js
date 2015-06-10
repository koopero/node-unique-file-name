const
  errors  = require('./errors'),
  format  = require('./format'),
  options = require('./options')

module.exports = uniqueFileNameSync

function uniqueFileNameSync( opt, filename ) {
  opt = options( opt )

  uniqueSync.reset = reset

  if ( arguments.length == 1 )
    return uniqueSync
  else
    return uniqueSync.apply( null, _.slice( arguments, 1 ) )

  function uniqueSync( filename, iteration, time ) {
    iteration = parseInt( iteration ) || 0

    var
      uniqname,
      lastname

    while (
      iteration < opt.iterations
    ) {

      uniqname = format( opt.format, filename, iteration++, time, opt )

      if ( opt.path && opt.dir )
        uniqname = opt.path.resolve( opt.dir, uniqname )

      if ( opt.fs && opt.fs.existsSync( uniqname ) ) {
        if ( uniqname == lastname ) {
          uniqname = null
          break
        }

        lastname = uniqname
        uniqname = null
        continue
      }

      break
    }

    if ( !uniqname ) {
      var error = new errors.UniquenessError( iteration )
      throw error
    }

    if ( opt.fs ) {
      opt.fs.ensureFileSync( uniqname )
    }

    return uniqname
  }

  function reset() {

  }

}

