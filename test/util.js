const _ = require('lodash')
    , fs = require('fs-extra')
    , path = require('path')
    , resolve = path.resolve
    , scratch = resolve.bind( this, __dirname, 'scratch' )
    , existsSync = fs.existsSync


exports.scratch = scratch
exports.exists = fs.existsSync

exports.wipeScratch = function () {
  fs.removeSync( scratch() )
}

/**
 * Create a simple mock filesystem which implements
 * touch, touchSync, exists and existsSync
 */
exports.mockFS = function mockFS() {
  var
    alwaysExists = false,
    files = {}


  return {
    alwaysExists: setAlwaysExists,
    exists: exists,
    existsSync: existsSync,
    ensureFile: touch,
    ensureFileSync: touchSync,
    count: count,
  }

  function setAlwaysExists() {
    alwaysExists = true
  }

  function exists( filename, cb ) {
    delay( function() {
      cb( existsSync( filename ) )
    })
  }

  function touch( filename, cb ) {
    delay( function () {
      files[filename] = true
      delay( cb )
    })
  }

  function existsSync( filename ) {
    return alwaysExists || !!files[filename]
  }

  function touchSync( filename ) {
    files[filename] = true
    return true
  }

  function count() {
    return _.values( files ).length
  }

  function delay( cb ) {
    // A short, random delay emulates the worst-case
    // for async filesystem calls
    setTimeout( cb, Math.random() * 3 + 1 )
  }
}
