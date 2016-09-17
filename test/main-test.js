const main = require('../src/main')
    , util = require('./util')
    , _ = require('lodash')
    , ass = require('chai').assert
    , eq = ass.equal
    , async = require('async')

describe('uniqueFileName', function ( cb ) {
  it('will work in series on a mock filesystem', function ( cb ) {
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


    async.whilst(
      function () { return count < total },
      function ( cb ) {
        func( 'foo', function( err, filename ) {
          eq( filename, '/dir/foo'+count )

          count ++
          cb()
        })
      },
      cb
    )
  })

  it('will work in series on a real filesystem', function ( cb ) {
    var
      fs = require('fs'),
      opt = {
        dir: util.scratch(),
        format: '%b%0i'
      },
      func = main( opt ),
      count = 0,
      total = 10


    async.whilst(
      function () { return count < total },
      function ( cb ) {
        func( 'foo', function( err, filename ) {
          eq( filename, util.scratch( 'foo'+count ) )
          ass( util.exists( filename ) )
          count ++
          cb()
        })
      },
      cb
    )
  })

  it('will work in parallel on a mock filesystem', function ( cb ) {
    var
      fs = util.mockFS(),
      opt = {
        dir: '/dir/',
        fs: fs,
        format: '%b%0i'
      },
      func = main( opt ),
      total = 10,
      collect = _.after( total, finish )


    for ( var i = 0; i < total; i ++ ) {
      each( i )
    }

    function each( i ) {
      func( 'foo', function ( err, filename ) {
        eq( filename, '/dir/foo'+i )
        collect()
      })
    }

    function finish() {
      eq( fs.count(), total, 'incorrect total')
      cb()
    }
  })

  it('will callback with an error on uniqueness failure', function( cb ) {
    const
      fs = util.mockFS(),
      opt = {
        fs: fs,
        format: '%b%0i'
      },
      func = main( opt )

    fs.alwaysExists()
    func( 'foo', function( err, filename ) {
      ass( err )
      cb()
    })

  })
})
