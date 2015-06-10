const
  inherits = require('util').inherits

function UniquenessError ( iterations ) {
  Error.captureStackTrace(this, this.constructor)

  this.name     = 'UniquenessError'
  this.message  = 'Could not find unique name.'
  this.iterations = iterations 
}

inherits( UniquenessError, Error)
exports.UniquenessError = UniquenessError