const
  _     = require('lodash')

const defaultOptions = {
  iterations: 100,
  path: require('path'),
  fs:   require('fs-extra'),
}

module.exports = parseOptions

function parseOptions( opt, isSync ) {
  if ( 'string' == typeof opt ) {
    opt = {
      format: opt
    }
  }

  _.defaults(
    opt,
    {
      dir: process.cwd(),
    },
    defaultOptions
  )

  opt = _.clone(opt)

  return opt
}

function resolvePathlib( pathlib ) {
  if ( !pathlib )
    pathlib = require('path')

  if ( 'string' == typeof pathlib ) {
    pathlib = {
      'win32': require('path').win32,
      'posix': require('path').posix
    }[pathlib]
  }

  var needFunction = ['parse','format','resolve']

  isFunction( pathlib.parse )
  isFunction( pathlib.format )
  isFunction( pathlib.resolve )

  function isFunction( check ) {
    if ( 'function' != typeof check )
      throw new Error('Expected method to be function.')
  }
}
