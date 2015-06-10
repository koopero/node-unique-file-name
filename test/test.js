const
  _ = require('lodash'),
  ass = require('chai').assert,
  eq = ass.equal,
  async = require('async'),
  mod = require('../'),
  path = require('path'),
  fs = require('fs-extra'),
  resolve = path.resolve,
  scratch = resolve.bind( this, __dirname, 'scratch' ),
  sync = mod.sync,
  touch = mod.touch,
  touchSync = mod.touchSync,
  format = mod.format,
  existsSync = fs.existsSync


describe('random', function() {
  const random = mod.random
  it('will output the proper length', function () {
    eq( random(5).length, 5 )
    eq( random(50).length, 50 )
  })

  it('will produce output without duplicates', function () {
    var randoms = []
    for ( var i = 0; i < 100; i ++ )
      randoms.push( random( 6 ) )

    var uniques = _.uniq( randoms )
    eq( uniques.length, randoms.length, "Duplicates from random. This may occur occasionally.")
  })
})

describe('format', function() {

  describe('string', function () {
    it('will format ascii filenames', function () {
      var fileWithDir = 'dirname/basename.extension'
      var file = 'basename.extension'

      eq( format('%b', file ), 'basename' )
      eq( format('%4b', file ), 'base' )
      eq( format('%f', file ), 'basename.extension' )
      eq( format('%e', file ), '.extension' )
      eq( format('%4e', file ), '.ext' )
    })

    it('will remove special characters from filenames', function () {
      // Period is only removed at start of the line.
      eq( format('%f', '.file.1.ext' ), 'file.1.ext' )
      eq( format('%f', 'i hate spaces in file names' ), 'i_hate_spaces_in_file_names' )
    })

    it('will remove non-ascii characters from filenames', function () {
      // Period is only removed at start of the line.
      ass( !hasNonASCII( format('%f', 'Frenchy McFucknuts.ext' ) ) )
      ass( !hasNonASCII( format('%f', 'ᓱᓴᓐ ᐊᒡᓗᒃᑲᖅ.ext' ) ) )
      // console.log( format('%f', '.ᓱᓴᓐ ᐊᒡᓗᒃᑲᖅ.ext' ) )
    })

    it('will remove potentially dangerous characters', function () {
      eq( format('%b', "it's a file!" ), 'its_a_file' )
    })

    it('will format randoms', function () {
      // Run random a hundred times
      for ( var i = 1000; i; i--) {
        //console.log(format('%r'));

      }
    })
  })

  describe('time / date', function () {
    it('will format dates', function () {
      var date = new Date('April 12, 1961, 06:07')
      eq( format('%4Y', '', 0, date ), '1961' )
      eq( format('%Y', '', 0, date ), '61' )
      eq( format('%Y%M%D - %h%m%s', '', 0, date ), '610412 - 060700' )
    })

    it('will format seconds from Date', function () {
      var date = new Date(2.06673340006673*1000) // 2 seconds + 2 NTSC frames
      eq( format('%s', '', 0, date ), '02' )
      eq( format('%.s', '', 0, date ), '2.066' )
    })

    it('will format minutes and hours from Number', function () {
      var ms = 1000 * 60 * 60 * 4  // 4 hours
      ms    += 1000 * 60 * 20      // 20 minute
      ms    += 1000 * 11           // 11 seconds
      eq( format('%h', '', 0, ms ), '04' )
      eq( format('%m', '', 0, ms ), '20' )
      eq( format('%s', '', 0, ms ), '11' )
    })

    it('will format Date as time', function () {
      var time = new Date('14 April 1981, 18:20:57 UTC')
      eq( format('%t', '', 0, time ), '356120457000' )
      eq( format('%06t', '', 0, time ), '457000' )
      eq( format('%3t', '', 0, time ), '356120457000' )
      eq( format('%04.2t', '', 0, time ), '7000.00' )
    })

    it('will format Number as time', function () {
      var num = 12345.6789
      eq( format('%01.5t', '', 0, num ), '5.67890' )
      eq( format('%6.2t', '', 0, num ), '012345.68' )

    })
  })

  describe('index', function () {
    it('will format decimal indexes', function () {
      eq( format('%i', '', 1000 ), '1000' )
      eq( format('%4i', '', 3 ), '0003' )
      eq( format('%4i', '', 11111 ), '11111' )
      eq( format('%i', '', 0 ), '' )
      eq( format('%0i', '', 0 ), '0' )
      eq( format('%5i', '', 0 ), '00000' )
    })

    it('will format decimal indexes in other radixes', function () {
      eq( format('%z', '', 255 ), 'ff' )
    })    
  })
})

describe('sync', function ( cb ) {
  it('will make curry', function () {
    ass.isFunction ( sync( { } ) )
  })

  it('will throw exception on uniqueness error', function () {
    wipeScratch()
    var func = sync( {
      dir: scratch(),
      format: 'dir/%b'
    } )

    eq( func('a'), scratch('dir/a') )
    ass( existsSync( scratch('dir/a' ) ), 'first file not touched' )

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
    wipeScratch()
    var func = sync( {
      dir: scratch(),
      format: 'dir/%b%i'
    } )

    eq( func('a'), scratch('dir/a') )
    ass( existsSync( scratch('dir/a' ) ), 'file not touched' )
    eq( func('a'), scratch('dir/a1') )
    ass( existsSync( scratch('dir/a1' ) ), 'file not touched' )
    eq( func('b'), scratch('dir/b') )
    ass( existsSync( scratch('dir/b' ) ), 'file not touched' )
  })

  after( wipeScratch )
})



describe('uniqueFileName', function ( cb ) {
  it('will work in series on a mock filesystem', function ( cb ) {
    var 
      fs = mockFS(),
      opt = {
        dir: '/dir/',
        fs: fs,
        format: '%b%0i'
      },
      func = mod( opt ),
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

  it('will work in parallel on a mock filesystem', function ( cb ) {
    var 
      fs = mockFS(),
      opt = {
        dir: '/dir/',
        fs: fs,
        format: '%b%0i'
      },
      func = mod( opt ),
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
      fs = mockFS(),
      opt = {
        fs: fs,
        format: '%b%0i'
      },
      func = mod( opt )

    fs.alwaysExists()
    func( 'foo', function( err, filename ) {
      ass( err )
      cb()
    })
    
  })
})

//  ----------------------
//  Test Utility Functions
//  ----------------------

function wipeScratch() {
  fs.removeSync( scratch() )
}

function hasNonASCII ( str ) {
  var buf = new Buffer( str, 'utf8' )
  var result = false
  for ( var i = 0; i < buf.length; i ++ ) {
    result = result || buf.readUInt8(i) >= 128
  }

  return result
}

/**
 * Create a simple mock filesystem which implements
 * touch, touchSync, exists and existsSync
 */
function mockFS() {
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
      cb( null, existsSync( filename ) )
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
