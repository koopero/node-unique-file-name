const format = require('../src/format')
    , ass = require('chai').assert
    , eq = ass.equal

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
      ass( !hasNonASCII( format('%f', 'Frenchy McFucknuts.ext' ) ) )
      ass( !hasNonASCII( format('%f', 'ᓱᓴᓐ ᐊᒡᓗᒃᑲᖅ.ext' ) ) )
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

//  ----------------------
//  Test Utility Functions
//  ----------------------

function hasNonASCII ( str ) {
  var buf = new Buffer( str, 'utf8' )
  var result = false
  for ( var i = 0; i < buf.length; i ++ ) {
    result = result || buf.readUInt8(i) >= 128
  }

  return result
}
