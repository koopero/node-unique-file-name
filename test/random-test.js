const random = require('../src/random')
    , ass = require('chai').assert
    , eq = ass.equal

describe('random', function() {

  it('will output the proper length', function () {
    eq( random(5).length, 5 )
    eq( random(50).length, 50 )
  })

  xit('will produce output without duplicates', function () {
    var randoms = []
    for ( var i = 0; i < 100; i ++ )
      randoms.push( random( 6 ) )

    var uniques = _.uniq( randoms )
    eq( uniques.length, randoms.length, "Duplicates from random. This may occur occasionally.")
  })
})
