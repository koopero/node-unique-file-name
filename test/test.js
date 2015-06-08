const
  ass = require('chai').assert,
  eq = ass.equal,
  mod = require('../'),
  path = require('path'),
  fs = require('fs'),
  resolve = path.resolve,
  scratch = resolve.bind( this, __dirname, 'scratch' ),
  rimraf = require('rimraf'),
  sync = mod.sync,
  touch = mod.touch,
  touchSync = mod.touchSync,
  format = mod.format,
  existsSync = fs.existsSync
;

describe('#format', function() {
  it('will format dates', function () {
    var date = new Date('April 12, 1961, 06:07');
    eq( format('%4Y', '', 0, date ), '1961' );
    eq( format('%Y', '', 0, date ), '61' );
    eq( format('%Y%M%D - %h%m%s', '', 0, date ), '610412 - 060700' );
  });

  it('will format seconds from Date', function () {
    var date = new Date(2.06673340006673*1000); // 2 seconds + 2 NTSC frames
    eq( format('%s', '', 0, date ), '02' );
    eq( format('%.s', '', 0, date ), '2.066' );
  });

  it('will format seconds from Date', function () {
    var date = new Date(2.06673340006673*1000); // 2 seconds + 2 NTSC frames
    eq( format('%s', '', 0, date ), '02' );
    eq( format('%.s', '', 0, date ), '2.066' );
  });

  it('will format seconds from Date', function () {
    var date = new Date(2.06673340006673*1000); // 2 seconds + 2 NTSC frames
    eq( format('%s', '', 0, date ), '02' );
    eq( format('%.s', '', 0, date ), '2.066' );
  });

  it('will format Date as time', function () {
    var time = new Date('14 April 1981, 18:20:57 UTC');
    eq( format('%t', '', 0, time ), '356120457000' );
    eq( format('%06t', '', 0, time ), '457000' );
    eq( format('%3t', '', 0, time ), '356120457000' );
    eq( format('%04.2t', '', 0, time ), '7000.00' );
  });

  it('will format Number as time', function () {
    var num = 12345.6789;
    eq( format('%01.5t', '', 0, num ), '5.67890' );
    eq( format('%6.2t', '', 0, num ), '012345.68' );

  });


  it('will format ascii filenames', function () {
    var fileWithDir = 'dirname/basename.extension';
    var file = 'basename.extension';

    eq( format('%b', file ), 'basename' );
    eq( format('%4b', file ), 'base' );
    eq( format('%f', file ), 'basename.extension' );
    eq( format('%e', file ), '.extension' );
    eq( format('%4e', file ), '.ext' );
  })

  it('will format decimal indexes', function () {
    eq( format('%i', '', 1000 ), '1000' );
    eq( format('%4i', '', 3 ), '0003' );
    eq( format('%4i', '', 11111 ), '11111' );
    eq( format('%i', '', 0 ), '' );
    eq( format('%0i', '', 0 ), '0' );
    eq( format('%5i', '', 0 ), '00000' );
  });

  it('will format decimal indexes in other radixes', function () {
    eq( format('%z', '', 255 ), 'ff' );
  });


  it('will remove special characters from filenames', function () {
    // Period is only removed at start of the line.
    eq( format('%f', '.file.1.ext' ), 'file.1.ext' );
    eq( format('%f', 'i hate spaces in file names' ), 'i_hate_spaces_in_file_names' );
  })

  it('will remove non-ascii characters from filenames', function () {
    // Period is only removed at start of the line.
    ass( !hasNonASCII( format('%f', 'Frenchy McFucknuts.ext' ) ) );
    ass( !hasNonASCII( format('%f', 'ᓱᓴᓐ ᐊᒡᓗᒃᑲᖅ.ext' ) ) );
    console.log( format('%f', '.ᓱᓴᓐ ᐊᒡᓗᒃᑲᖅ.ext' ) );
  })

  it('will remove potentially dangerous characters', function () {
    eq( format('%b', "it's a file!" ), 'its_a_file' );
  })

  it('will format randoms', function () {
    // Run random a hundred times
    for ( var i = 1000; i; i--) {
      //console.log(format('%r'));

    }
  });
});

describe('touch', function () {
  it('should touch a file', function ( cb ) {
    var file = scratch('touch/async');
    touch( file, function ( err ) {
      ass( !err );
      ass( existsSync( file ) );
      cb();
    } );
  })
});

describe('touchSync', function () {
  it('should touch a file', function () {
    var file = scratch('foo/bar');
    ass( touchSync( file ), 'did not return true');

    var stat = fs.statSync( file );
    eq( stat.size, 0 );
  });

  it("should return false when it can't", function () {
    var file = scratch('foo/bar/foo');
    ass( !touchSync( file ) );
  });

  after( wipeScratch );
});

describe('sync', function ( cb ) {
  before( wipeScratch );

  it('will make curry', function () {
    ass.isFunction ( sync( { } ) );
  });


  it('will actually do something', function () {
    var func = sync( {
      dir: scratch(),
      format: 'dir/%b%i'
    } );

    eq( func('a'), scratch('dir/a') );
    ass( existsSync( scratch('dir/a' ) ), 'file not touched' );
    eq( func('a'), scratch('dir/a1') );
    ass( existsSync( scratch('dir/a1' ) ), 'file not touched' );
    eq( func('b'), scratch('dir/b') );
    ass( existsSync( scratch('dir/b' ) ), 'file not touched' );

  });

  after( wipeScratch );
});



describe('uniqueFileName', function ( cb ) {

});


function wipeScratch() {
  rimraf.sync( scratch() );
}

function hasNonASCII ( str ) {
  var buf = new Buffer( str, 'utf8' );
  var result = false;
  for ( var i = 0; i < buf.length; i ++ ) {
    //console.log( i, str[i],buf.readUInt8(i))
    result = result || buf.readUInt8(i) >= 128;
  }

  return result;
}
