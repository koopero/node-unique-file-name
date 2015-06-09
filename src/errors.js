function UniquenessError ( iterations ) {
  this.name     = 'UniquenessError'
  this.message  = 'Could not find unique name.'
  this.iterations = iterations 
}

UniquenessError.prototype = Object.create(Error.prototype)
UniquenessError.prototype.constructor = UniquenessError

exports.UniquenessError = UniquenessError