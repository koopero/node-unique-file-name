const sync = require('../src/mainSync')
    , util = require('./util')
    , ass = require('chai').assert
    , eq = ass.equal
    , scratch = util.scratch
    , exists = util.exists

describe('sync', function ( cb ) {
  it('will make curry', function () {
    ass.isFunction ( sync( { } ) )
  })

  it('will throw exception on uniqueness error', function () {
    var func = sync( {
      dir: scratch(),
      format: 'dir/%b'
    } )

    eq( func('a'), scratch('dir/a') )
    ass( exists( scratch('dir/a' ) ), 'first file not touched' )

    var threw

    // func('a')

    try {
      func('a')
    } catch( err ) {
      threw = err
      ass.isNumber( err.iterations, "Error didn't include .iterations")
      ass( err.iterations < 3, "Too many iterations for trivial problem")
    }

    ass( threw, "Did not throw error")
  })

  it('will write to a real filesystem', function () {
    util.wipeScratch()
    var func = sync( {
      dir: scratch(),
      format: 'dir/%b%i'
    } )

    eq( func('a'), scratch('dir/a') )
    ass( exists( scratch('dir/a' ) ), 'file not touched' )
    eq( func('a'), scratch('dir/a1') )
    ass( exists( scratch('dir/a1' ) ), 'file not touched' )
    eq( func('b'), scratch('dir/b') )
    ass( exists( scratch('dir/b' ) ), 'file not touched' )
  })

  after( util.wipeScratch )
})
