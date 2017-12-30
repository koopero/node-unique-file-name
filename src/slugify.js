const
  transliteration = require('transliteration').transliterate

const
  // /\s/, '.', '\\' and '/' are handled in their own way and not included.
  SYSTEM_CHARS = /[\s\?\*\#\$\<\>\{\}\!\%\&\'\(\)\+\,\;\=\@\[\]\^\`\~\:\|\"]/g,
  TRAILING_SLASHES = /[\\\/]*$/,
  PATH_SEPS = /[\\\/]/g

module.exports = slugify

function slugify (type,str) {
  // Remove leading .
  while ( type != 'ext' && str[0] == '.' )
    str = str.substr( 1 )

  // Replace whitespace with _
  str = str.replace(/\s+/g, '_' )

  // Remove non-ascii words as eloquently as possible.
  str = transliteration( str )

  if ( type == 'dir' ) {
    str = str.replace( TRAILING_SLASHES, '')
  } else {
    str = str.replace( PATH_SEPS, '')
  }

  // Remove characters that with special meaning
  // to the system.
  str = str.replace( SYSTEM_CHARS, '' )

  return str
}
