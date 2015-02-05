const
  ass = require('assert'),
  eq = ass.equal,
  mod = require('../'),
  format = mod.format
;
describe('#format', function() {
  it('will format dates', function () {
    var date = new Date('April 12, 1961, 06:07');
    eq( format('%4Y', '', 0, date ), '1961' );
    eq( format('%Y', '', 0, date ), '61' );
    eq( format('%Y%M%D - %h%m%s', '', 0, date ), '610412 - 060700' );
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

  it('will format decimal numbers', function () {
    eq( format('%i', '', 1000 ), '1000' );
    eq( format('%4i', '', 3 ), '0003' );
    eq( format('%4i', '', 11111 ), '11111' );
    eq( format('%i', '', 0 ), '' );
    eq( format('%0i', '', 0 ), '0' );
    eq( format('%5i', '', 0 ), '00000' );
  });

  it('will format other radixes', function () {
    eq( format('%z', '', 255 ), 'ff' );
    eq( format('%3t', '', 1000 ), '0rs' );
  });

  it('will format decimal numbers', function () {
    eq( format('%i', '', 1000 ), '1000' );
    eq( format('%4i', '', 3 ), '0003' );
    eq( format('%4i', '', 11111 ), '11111' );
    eq( format('%i', '', 0 ), '' );
    eq( format('%0i', '', 0 ), '0' );
    eq( format('%5i', '', 0 ), '00000' );
  });


  it('will slugify filenames', function () {
    eq( format('%b', '.file' ), 'file' );
    eq( format('%b', 'i hate spaces in file names' ), 'i_hate_spaces_in_file_names' );
  })

  it('will format randoms', function () {
    // Run random a hundred times
    for ( var i = 1000; i; i--) {
      //console.log(format('%r'));

    }
  });
});
