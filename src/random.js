const
  // RANDOM_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  // Less entropy, but prettier.
  RANDOM_SET = 'BCDGJOPQRSUabcdefghjnopqrstuy0235689'

module.exports = random

/**
 *  Produces a string of random character of a certain width.
 *  Uses the character set RANDOM_SET.
 */
function random( width, set ) {
  width = parseInt( width ) || 4
  set   = set || RANDOM_SET

  if ( 'string' != typeof set )
    throw new Error('Random character set must be string' )

  var
    i = 0,
    r = ''

  for ( ; i < width; i ++ )
    r += RANDOM_SET[ Math.floor( Math.random() * RANDOM_SET.length ) ]

  return r
}