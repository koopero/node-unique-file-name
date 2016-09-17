# Unique File Name

`unique-file-name` is a node module for creating file names. It can take filenames from untrusted sources such as user uploads and transform them into names which are:

* **Unique** - UNF will check to see if a file already exists, and pick a new name if it does.
* **Safe** - Names will not include special characters, and may be used unescaped as shell command arguments.
* **Recognizable** - File names will look similar to their original form. Extensions can be preserved to allow files to be recognized by the OS.
* **Secure** - With a random component, file names can be made reasonably unguessable.
* **Timestamped** - Files and directories can be marked with numeric timestamps in units like year, month and millisecond.

# Example

```javascript
const unf = require('unique-file-name')
const namer = unf( {
  format: '%4Y-%M-%D/%16b_%6r%8e',
  dir: 'upload_directory'
})

var untrustedFileName = 'dir///~@!\'long\' file name with spaces and special chars!.mp4     '

namer( untrustedFileName )
  .then( function ( betterName ) {
    // betterName will look somethings like this:
    '2015-11-04/long_file_name_wi_a6BC9b.mp4'

    // The file will already exist in upload_directory/2015-11-04 as a zero-length placeholder.

  })
```



# API

## Functions

**main ( options )**

**main ( options, filename, iteration, time, callback )**

**sync ( options, filename, iteration, time )**

**format ( format, filename, iteration, time )**

**random ( length )**

## Format

UNF's filename template format is similar to the standard `printf` format, but with very different keys. Tags with the following format will be replaced:

    %[digits][.precision][tag]

## Tags

### Filename
* `B` - Basename of file
* `b` - Basename of file, slugified.
* `F` - Filename with extension
* `f` - Filename with extension, slugified.
* `E` - Extname of file, including '.'
* `e` - Extname of file, slugified.
* `P` - Dirname of file.
* `p` - Dirname of file, slugified.

### Index
* `i` - integer counter, starting from 0.
* `z` - hex counter

### Date
* `Y` - Year
* `M` - Month [1-12]
* `D` - Day of month [1-31]
* `h` - Hour [0-23]
* `m` - Minute [0-59]
* `s` - Second [0-59]. Use `%.3s` to include fractional component.
* `T` - Full JSON date ('1961-04-12T13:07:00.000Z')
* `t` - Timestamp in milliseconds since the unix epoch

### Misc
* `r` - Random string of characters [A-Za-z0-9]

## Options

Object or string. If string, will resolve to `{ format: string }`

* `dir` - Base directory for output ( default: `CWD` )
* `format` -
* `touch` - Function used to create empty placeholder file, or `false` to not create them. `function ( filename, cb )` Defaults to `fs-extra.ensureFile` or `fs-extra.ensureFileSync`.
* `exists` - function used to check if file already exists, or `false` not to check. `function ( filename, cb )`. ( defaults: `fs.exists` or `fs.existsSync` )
* `UTC` - Format timestamps in UTC rather than local time zone.

# Recipes

`%Y%M%D/%16b%.i%8e`

`Camera_%10T/%h%m%0.4s.png`
