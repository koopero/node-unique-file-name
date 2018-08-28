const main = require('../src/main')
    , util = require('./util')
    , _ = require('lodash')
    , ass = require('chai').assert
    , eq = ass.equal
    , async = require('async')

describe('promise', function ( cb ) {
  it('will work as promised', function () {
    var
      fs = util.mockFS(),
      opt = {
        dir: '/dir/',
        fs: fs,
        format: '%b%0i'
      },
      func = main( opt ),
      count = 0,
      total = 10


    let result = func('foo')

    ass( result.then, 'Result must be Promise.')

    return result
      .then( function ( filename ) {
        eq( filename, '/dir/foo'+count )
      } )

  })

  it('will reject on uniqueness failure', function( cb ) {
    const
      fs = util.mockFS(),
      opt = {
        fs: fs,
        format: '%b%0i'
      },
      func = main( opt )

    fs.alwaysExists()

    func( 'foo')
    .then( function() {
      assert.fail()
    })
    .catch( function( err ) {
      ass( err )
      cb()
    })
  })

  after( util.wipeScratch )
})
