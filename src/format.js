const slug    = require('./slugify')
const random  = require('./random')

const
  PRECISION = 3

module.exports = format

function format( template, filename, iteration, time, opt ) {
  opt = opt || {}

  var
    path     = opt.path || require('path'),
    extname  = path.extname( filename ),
    basename = path.basename( filename, extname ),
    dirname  = path.dirname( filename )


  iteration = parseInt( iteration ) || 0

  if ( dirname == '.' )
    dirname = ''

  // Ensure trailing slash on dirname, if it exists
  if ( dirname && dirname.substr( -1 ) != '/' )
    dirname = dirname + '/'

  return template.replace(
    /\%([0-])?(\d*?)(\.\d*)?([irBbFfEeYMDhmsztTPp])/g,
    function ( tag, flags, width, precision, specifier ) {
      var radix

      if ( precision )
        precision = parseInt( precision.substr(1) ) || PRECISION

      width = parseInt( width )

      switch ( specifier ) {
        case 'F':
          return trim( basename + extname )

        case 'f':
          return trim( slug( 'base', basename ) + slug( 'ext', extname )  )

        case 'B':
          return trim( basename )

        case 'b':
          return trim( slug( 'base', basename ) )

        case 'E':
          return trim( extname )

        case 'e':
          return trim( slug( 'ext', extname ) )

        case 'P':
          if ( dirname && dirname != '.' ) {
            return trim( slug( 'dir', dirname ) ) + path.sep
          } else {
            return ''
          }

        case 'p':
          if ( dirname && dirname != '.' ) {
            return trim( slug( 'dir', dirname ) ) + path.sep
          } else {
            return ''
          }

        case 'i':
          radix = radix || 10
          // falls through
        case 'z':
          radix = radix || 16

          if ( width )
            return pad( iteration.toString( radix ) )

          if ( !iteration )
            if ( flags == '0' )
              return '0'
            else
              return ''

          return iteration.toString( radix )

        case 'r':
          return random( width )

        case 't':
          return trimFloat(
            time instanceof Date ?
              time.getTime()
            :
              parseFloat( time ) || 0
          )
      }

      //
      // Resolve `time` to be a Date object.
      //
      if ( time === undefined ) {
        // Default is now.
        time = new Date()
      } else if ( 'number' == typeof time ) {
        // Convert from a Number to a Date.
        // A few liberties are taken here to allow the library to process
        // timecode style input. By default, Date will take UTC
        // milliseconds the epoch numbers as input. If output is in local
        // time zone ( default ), this will produce unexpected output for
        // small numbers. Instead, we treat Number conversion as being in
        // the output time zone so that 'zero' for Number conversion
        // always starts at midnight.

        if ( !opt.UTC )
          time += new Date( time ).getTimezoneOffset() * 60 * 1000

        time = new Date( time )
      } else if ( !(time instanceof Date ) ) {
        time = new Date( time )
      }

      if ( !precision && !width )
        width = 2

      switch ( specifier ) {
        case 's':
          if ( opt.UTC )
            return trimFloat( time.getUTCSeconds() + time.getUTCMilliseconds() / 1000 )
          else
            return trimFloat( time.getSeconds() + time.getMilliseconds() / 1000 )

        case 'T':
          return time.toJSON()
      }

      width = width || 2

      if ( opt.UTC ) {
        switch ( specifier ) {
          case 'Y': return padTrim( time.getUTCFullYear() )
          case 'M': return padTrim( time.getUTCMonth() + 1 )
          case 'D': return padTrim( time.getUTCDate() )
          case 'h': return padTrim( time.getUTCHours() )
          case 'm': return padTrim( time.getUTCMinutes() )
        }
      } else {
        switch ( specifier ) {
          case 'Y': return padTrim( time.getFullYear() )
          case 'M': return padTrim( time.getMonth() + 1 )
          case 'D': return padTrim( time.getDate() )
          case 'h': return padTrim( time.getHours() )
          case 'm': return padTrim( time.getMinutes() )
        }
      }

      function trim ( str ) {
        str = String(str)
        return width ? str.substr( 0, width ) : str
      }

      function trimFloat( num ) {
        var
          str = num.toFixed( precision ),
          split = str.split('.'),
          integer = split[0],
          decimal = split[1]


        str = width ?
            flags && flags[0] == '-' ?
                trimLower( integer )
              :
            flags == '0' ?
                padTrim( integer )
              :
                pad( integer )
          :
            integer


        if ( decimal )
          str += '.'+decimal

        return str
      }

      function pad ( num ) {
        num = String( num )
        while ( width && num.length < width ) {
          num = '0'+num
        }
        return num
      }

      function padTrim ( num ) {
        num = pad( num )

        if ( width && num.length > width )
          num = num.substr( num.length - width )

        return num
      }

      function trimLower ( num ) {
        num = pad( num )

        if ( width && num.length > width )
          num = num.substr( 0, width )

        return num
      }
    }
  )
}
